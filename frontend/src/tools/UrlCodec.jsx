import { useState } from 'react';

export default function UrlCodec() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState('component');
  const [error, setError] = useState('');

  const encode = () => {
    setError('');
    try {
      setOutput(mode === 'component' ? encodeURIComponent(input) : encodeURI(input));
    } catch (e) {
      setError('Encode error: ' + e.message);
    }
  };

  const decode = () => {
    setError('');
    try {
      setOutput(mode === 'component' ? decodeURIComponent(input) : decodeURI(input));
    } catch (e) {
      setError('Decode error: ' + e.message);
    }
  };

  return (
    <div className="tool-card-container">
      <div className="tool-row">
        <label>Mode</label>
        <div className="tool-btn-row">
          <button className={`tool-btn ${mode === 'component' ? '' : 'tool-btn-secondary'}`} onClick={() => setMode('component')}>Component</button>
          <button className={`tool-btn ${mode === 'full' ? '' : 'tool-btn-secondary'}`} onClick={() => setMode('full')}>Full URI</button>
        </div>
      </div>
      <div className="tool-row">
        <label>Input</label>
        <textarea
          className="tool-textarea"
          rows={4}
          placeholder="Enter URL or text to encode/decode..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      </div>
      <div className="tool-btn-row" style={{ marginBottom: 16 }}>
        <button className="tool-btn" onClick={encode}>Encode</button>
        <button className="tool-btn" onClick={decode}>Decode</button>
        <button className="tool-btn tool-btn-secondary" onClick={() => { setInput(output); setOutput(''); }}>Swap</button>
      </div>
      {error && <div className="tool-error">{error}</div>}
      {output && (
        <div className="tool-row">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label>Output</label>
            <button className="tool-copy-btn" onClick={() => navigator.clipboard.writeText(output)}>Copy</button>
          </div>
          <div className="tool-output">{output}</div>
        </div>
      )}
    </div>
  );
}
