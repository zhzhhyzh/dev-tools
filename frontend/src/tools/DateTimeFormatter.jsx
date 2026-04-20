import { useState } from 'react';

const FORMATS = [
  { label: 'ISO 8601', fn: (d) => d.toISOString() },
  { label: 'UTC String', fn: (d) => d.toUTCString() },
  { label: 'Locale String', fn: (d) => d.toLocaleString() },
  { label: 'Date Only (YYYY-MM-DD)', fn: (d) => d.toISOString().split('T')[0] },
  { label: 'Time Only (HH:MM:SS)', fn: (d) => d.toTimeString().split(' ')[0] },
  { label: 'Unix Timestamp (s)', fn: (d) => Math.floor(d.getTime() / 1000).toString() },
  { label: 'Unix Timestamp (ms)', fn: (d) => d.getTime().toString() },
  { label: 'RFC 2822', fn: (d) => d.toUTCString() },
  { label: 'YYYY/MM/DD HH:mm:ss', fn: (d) => {
    const pad = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}/${pad(d.getMonth()+1)}/${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  }},
  { label: 'DD-MM-YYYY', fn: (d) => {
    const pad = (n) => String(n).padStart(2, '0');
    return `${pad(d.getDate())}-${pad(d.getMonth()+1)}-${d.getFullYear()}`;
  }},
];

export default function DateTimeFormatter() {
  const [input, setInput] = useState(new Date().toISOString().slice(0, 19));
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  const convert = () => {
    setError('');
    const d = new Date(input);
    if (isNaN(d.getTime())) {
      setError('Invalid date. Try ISO 8601 or common date formats.');
      setResults(null);
      return;
    }
    setResults(FORMATS.map((f) => ({ label: f.label, value: f.fn(d) })));
  };

  const useNow = () => {
    setInput(new Date().toISOString().slice(0, 19));
  };

  return (
    <div className="tool-card-container">
      <div className="tool-row">
        <label>Input Date/Time</label>
        <input
          className="tool-input"
          type="text"
          placeholder="e.g. 2024-01-15T12:30:00 or Jan 15 2024"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      </div>
      <div className="tool-btn-row" style={{ marginBottom: 16 }}>
        <button className="tool-btn" onClick={convert}>Format</button>
        <button className="tool-btn tool-btn-secondary" onClick={useNow}>Use Now</button>
      </div>
      {error && <div className="tool-error">{error}</div>}
      {results && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {results.map((r) => (
            <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)' }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: 13, minWidth: 180 }}>{r.label}</span>
              <code style={{ color: 'var(--text-primary)', fontSize: 13, fontFamily: 'monospace' }}>{r.value}</code>
              <button className="tool-copy-btn" onClick={() => navigator.clipboard.writeText(r.value)}>Copy</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
