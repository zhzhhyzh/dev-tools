import { useState, useEffect, useRef, useCallback } from 'react';

function generateId() {
  return Math.random().toString(36).substring(2, 10);
}

export default function OnlineNotepad() {
  const [padId, setPadId] = useState('default');
  const [padIdInput, setPadIdInput] = useState('default');
  const [content, setContent] = useState('');
  const [connected, setConnected] = useState(false);
  const [clients, setClients] = useState(0);
  const [lastSaved, setLastSaved] = useState(null);
  const [padList, setPadList] = useState([]);
  const [showPadList, setShowPadList] = useState(false);
  const wsRef = useRef(null);
  const userIdRef = useRef(generateId());
  const isRemoteUpdate = useRef(false);
  const reconnectTimer = useRef(null);

  const connectWs = useCallback((targetPadId) => {
    // Close existing connection
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws/notepad`;
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      setConnected(true);
      ws.send(JSON.stringify({ type: 'join', padId: targetPadId }));
    };

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);

      if (msg.type === 'init') {
        isRemoteUpdate.current = true;
        setContent(msg.content);
        setClients(msg.clients);
        isRemoteUpdate.current = false;
      }

      if (msg.type === 'update') {
        isRemoteUpdate.current = true;
        setContent(msg.content);
        setLastSaved(msg.lastModified);
        isRemoteUpdate.current = false;
      }

      if (msg.type === 'clients') {
        setClients(msg.clients);
      }
    };

    ws.onclose = () => {
      setConnected(false);
      // Auto-reconnect after 2s
      reconnectTimer.current = setTimeout(() => {
        if (wsRef.current === ws) {
          connectWs(targetPadId);
        }
      }, 2000);
    };

    ws.onerror = () => {
      ws.close();
    };
  }, []);

  useEffect(() => {
    connectWs(padId);
    return () => {
      clearTimeout(reconnectTimer.current);
      if (wsRef.current) wsRef.current.close();
    };
  }, [padId, connectWs]);

  const handleChange = (e) => {
    const newContent = e.target.value;
    setContent(newContent);

    if (!isRemoteUpdate.current && wsRef.current && wsRef.current.readyState === 1) {
      wsRef.current.send(JSON.stringify({
        type: 'update',
        content: newContent,
      }));
    }
  };

  const joinPad = () => {
    const id = padIdInput.trim() || 'default';
    setPadId(id);
  };

  const createNewPad = () => {
    const newId = generateId();
    setPadIdInput(newId);
    setPadId(newId);
  };

  const loadPadList = async () => {
    try {
      const res = await fetch('/api/notepad-list');
      const data = await res.json();
      setPadList(data);
      setShowPadList(true);
    } catch {
      setPadList([]);
    }
  };

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const charCount = content.length;
  const lineCount = content ? content.split('\n').length : 0;

  return (
    <div className="tool-card-container">
      {/* Connection & Pad Controls */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap', alignItems: 'flex-end' }}>
        <div className="tool-row" style={{ flex: 1, minWidth: 180, marginBottom: 0 }}>
          <label>Pad ID</label>
          <input
            className="tool-input"
            value={padIdInput}
            onChange={(e) => setPadIdInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && joinPad()}
            placeholder="Enter pad ID to join..."
          />
        </div>
        <button className="tool-btn" onClick={joinPad} style={{ height: 40 }}>Join</button>
        <button className="tool-btn tool-btn-secondary" onClick={createNewPad} style={{ height: 40 }}>New Pad</button>
        <button className="tool-btn tool-btn-secondary" onClick={loadPadList} style={{ height: 40 }}>Browse</button>
      </div>

      {/* Pad List Modal */}
      {showPadList && (
        <div style={{ marginBottom: 16, background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', padding: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <label style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-secondary)' }}>Saved Pads</label>
            <button className="tool-copy-btn" onClick={() => setShowPadList(false)}>Close</button>
          </div>
          {padList.length === 0 ? (
            <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>No saved pads yet.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, maxHeight: 200, overflowY: 'auto' }}>
              {padList.map((p) => (
                <div
                  key={p.id}
                  onClick={() => { setPadIdInput(p.id); setPadId(p.id); setShowPadList(false); }}
                  style={{
                    padding: '8px 12px', background: p.id === padId ? 'var(--accent-glow)' : 'var(--bg-secondary)',
                    border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', cursor: 'pointer',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13,
                  }}
                >
                  <span style={{ fontFamily: 'monospace', color: 'var(--accent)' }}>{p.id}</span>
                  <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>
                    {p.preview ? p.preview.slice(0, 40) + (p.preview.length > 40 ? '...' : '') : '(empty)'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Status Bar */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12,
        padding: '8px 14px', background: 'var(--bg-input)', borderRadius: 'var(--radius-sm)',
        border: '1px solid var(--border-color)', fontSize: 13, flexWrap: 'wrap', gap: 8,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{
            width: 8, height: 8, borderRadius: '50%',
            background: connected ? 'var(--success)' : 'var(--error)',
            display: 'inline-block',
          }} />
          <span style={{ color: connected ? 'var(--success)' : 'var(--error)' }}>
            {connected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
        <span style={{ color: 'var(--text-muted)' }}>
          Pad: <span style={{ color: 'var(--accent)', fontFamily: 'monospace' }}>{padId}</span>
        </span>
        <span style={{ color: 'var(--text-muted)' }}>
          {clients} {clients === 1 ? 'user' : 'users'} online
        </span>
        {lastSaved && (
          <span style={{ color: 'var(--text-muted)' }}>
            Saved: {new Date(lastSaved).toLocaleTimeString()}
          </span>
        )}
      </div>

      {/* Editor */}
      <textarea
        className="tool-textarea"
        value={content}
        onChange={handleChange}
        placeholder="Start typing... Changes sync in real-time across all connected clients."
        style={{
          minHeight: 350,
          fontSize: 14,
          lineHeight: 1.7,
          resize: 'vertical',
        }}
      />

      {/* Footer Stats */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12,
        fontSize: 12, color: 'var(--text-muted)', flexWrap: 'wrap', gap: 8,
      }}>
        <div style={{ display: 'flex', gap: 16 }}>
          <span>{charCount} characters</span>
          <span>{wordCount} words</span>
          <span>{lineCount} lines</span>
        </div>
        <div className="tool-btn-row">
          <button className="tool-copy-btn" onClick={() => navigator.clipboard.writeText(content)}>Copy All</button>
          <button className="tool-copy-btn" onClick={() => {
            const blob = new Blob([content], { type: 'text/plain' });
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = `notepad-${padId}.txt`;
            a.click();
          }}>Download</button>
          <button className="tool-copy-btn" onClick={() => { setContent(''); if (wsRef.current && wsRef.current.readyState === 1) wsRef.current.send(JSON.stringify({ type: 'update', content: '' })); }}>Clear</button>
        </div>
      </div>
    </div>
  );
}
