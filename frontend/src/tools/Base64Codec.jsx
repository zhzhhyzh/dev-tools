import { useState } from 'react';

export default function Base64Codec() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const encode = () => {
    setError('');
    try {
      setOutput(btoa(unescape(encodeURIComponent(input))));
    } catch (e) {
      setError('Failed to encode: ' + e.message);
    }
  };

  const decode = () => {
    setError('');
    try {
      setOutput(decodeURIComponent(escape(atob(input))));
    } catch (e) {
      setError('Invalid Base64 string: ' + e.message);
    }
  };

  return (
    <div className="tool-card-container">
      <div className="tool-row">
        <label>Input</label>
        <textarea
          className="tool-textarea"
          rows={6}
          placeholder="Enter text to encode or Base64 to decode..."
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
