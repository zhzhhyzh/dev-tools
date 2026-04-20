const express = require('express');
const cors = require('cors');
const http = require('http');
const { WebSocketServer } = require('ws');
const qrcodeRoute = require('./routes/qrcode');
const hashRoute = require('./routes/hash');

const app = express();
const PORT = process.env.PORT || 3001;

// CORS: allow frontend origin in production, everything in dev
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map((s) => s.trim())
  : ['http://localhost:5173', 'http://localhost:5174'];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) callback(null, true);
    else callback(null, true); // permissive for now; tighten in production if needed
  },
}));
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/api/qrcode', qrcodeRoute);
app.use('/api/hash', hashRoute);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// --- Notepad REST endpoints (persistence in-memory) ---
const notepads = new Map(); // padId -> { content, lastModified }

app.get('/api/notepad/:id', (req, res) => {
  const pad = notepads.get(req.params.id);
  if (pad) {
    res.json({ content: pad.content, lastModified: pad.lastModified });
  } else {
    res.json({ content: '', lastModified: null });
  }
});

app.get('/api/notepad-list', (req, res) => {
  const list = [];
  for (const [id, pad] of notepads) {
    list.push({ id, lastModified: pad.lastModified, preview: pad.content.slice(0, 80) });
  }
  list.sort((a, b) => new Date(b.lastModified) - new Date(a.lastModified));
  res.json(list);
});

// --- HTTP + WebSocket server ---
const server = http.createServer(app);
const wss = new WebSocketServer({ server, path: '/ws/notepad' });

// Track clients by padId
const padClients = new Map(); // padId -> Set<ws>

wss.on('connection', (ws, req) => {
  let currentPadId = null;

  ws.on('message', (raw) => {
    let msg;
    try { msg = JSON.parse(raw); } catch { return; }

    // Join a pad room
    if (msg.type === 'join') {
      const padId = msg.padId || 'default';
      currentPadId = padId;
      if (!padClients.has(padId)) padClients.set(padId, new Set());
      padClients.get(padId).add(ws);

      // Send current content
      const pad = notepads.get(padId);
      ws.send(JSON.stringify({
        type: 'init',
        content: pad ? pad.content : '',
        clients: padClients.get(padId).size,
      }));

      // Notify others of new client count
      broadcast(padId, { type: 'clients', clients: padClients.get(padId).size }, ws);
    }

    // Content update
    if (msg.type === 'update' && currentPadId) {
      const now = new Date().toISOString();
      notepads.set(currentPadId, { content: msg.content, lastModified: now });

      // Broadcast to other clients on same pad
      broadcast(currentPadId, {
        type: 'update',
        content: msg.content,
        lastModified: now,
      }, ws);
    }

    // Cursor position sharing
    if (msg.type === 'cursor' && currentPadId) {
      broadcast(currentPadId, {
        type: 'cursor',
        userId: msg.userId,
        position: msg.position,
        name: msg.name,
      }, ws);
    }
  });

  ws.on('close', () => {
    if (currentPadId && padClients.has(currentPadId)) {
      padClients.get(currentPadId).delete(ws);
      const remaining = padClients.get(currentPadId).size;
      if (remaining === 0) padClients.delete(currentPadId);
      else broadcast(currentPadId, { type: 'clients', clients: remaining });
    }
  });
});

function broadcast(padId, data, excludeWs) {
  const clients = padClients.get(padId);
  if (!clients) return;
  const payload = JSON.stringify(data);
  for (const client of clients) {
    if (client !== excludeWs && client.readyState === 1) {
      client.send(payload);
    }
  }
}

server.listen(PORT, () => {
  console.log(`Dev Tools API server running on http://localhost:${PORT}`);
  console.log(`WebSocket notepad available at ws://localhost:${PORT}/ws/notepad`);
});
