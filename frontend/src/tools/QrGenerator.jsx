import { useState } from 'react';
import { API_BASE } from '../config';

export default function QrGenerator() {
  const [text, setText] = useState('');
  const [size, setSize] = useState(300);
  const [qrUrl, setQrUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generate = async () => {
    setError('');
    if (!text.trim()) { setError('Please enter text or URL'); return; }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/qrcode/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, width: size }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setQrUrl(data.dataUrl);
    } catch (e) {
      setError('Failed to generate QR code: ' + e.message);
    } finally {
      setLoading(false);
    }
  };

  const download = () => {
    if (!qrUrl) return;
    const a = document.createElement('a');
    a.href = qrUrl;
    a.download = 'qrcode.png';
    a.click();
  };

  return (
    <div className="tool-card-container">
      <div className="tool-row">
        <label>Text or URL</label>
        <textarea
          className="tool-textarea"
          rows={3}
          placeholder="Enter text or URL to encode as QR code..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </div>
      <div className="tool-row">
        <label>Size: {size}px</label>
        <input
          type="range"
          min={100}
          max={600}
          step={50}
          value={size}
          onChange={(e) => setSize(Number(e.target.value))}
          style={{ width: '100%' }}
        />
      </div>
      <div className="tool-btn-row" style={{ marginBottom: 16 }}>
        <button className="tool-btn" onClick={generate} disabled={loading}>
          {loading ? 'Generating...' : 'Generate QR Code'}
        </button>
        {qrUrl && <button className="tool-btn tool-btn-secondary" onClick={download}>Download PNG</button>}
      </div>
      {error && <div className="tool-error">{error}</div>}
      {qrUrl && (
        <div style={{ textAlign: 'center', padding: 20, background: '#fff', borderRadius: 'var(--radius-sm)' }}>
          <img src={qrUrl} alt="QR Code" style={{ maxWidth: '100%' }} />
        </div>
      )}
    </div>
  );
}
