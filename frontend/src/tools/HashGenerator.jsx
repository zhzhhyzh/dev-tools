import { useState } from 'react';
import { API_BASE } from '../config';

export default function HashGenerator() {
  const [input, setInput] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generate = async () => {
    setError('');
    if (!input) { setError('Please enter text to hash'); return; }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/hash/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: input }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResults(data.results);
    } catch (e) {
      setError('Failed to generate hashes: ' + e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tool-card-container">
      <div className="tool-row">
        <label>Input Text</label>
        <textarea
          className="tool-textarea"
          rows={4}
          placeholder="Enter text to hash..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      </div>
      <div className="tool-btn-row" style={{ marginBottom: 16 }}>
        <button className="tool-btn" onClick={generate} disabled={loading}>
          {loading ? 'Generating...' : 'Generate Hashes'}
        </button>
      </div>
      {error && <div className="tool-error">{error}</div>}
      {results && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {Object.entries(results).map(([algo, hash]) => (
            <div key={algo} style={{ padding: '10px 14px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <span style={{ color: 'var(--accent)', fontSize: 12, fontWeight: 700, textTransform: 'uppercase' }}>{algo}</span>
                <button className="tool-copy-btn" onClick={() => navigator.clipboard.writeText(hash)}>Copy</button>
              </div>
              <code style={{ fontSize: 12, fontFamily: 'monospace', color: 'var(--text-primary)', wordBreak: 'break-all' }}>{hash}</code>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
