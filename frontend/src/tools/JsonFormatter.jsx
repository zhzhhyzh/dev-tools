import { useState } from 'react';

export default function JsonFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [indent, setIndent] = useState(2);

  const beautify = () => {
    setError('');
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, indent));
    } catch (e) {
      setError(`Invalid JSON: ${e.message}`);
      setOutput('');
    }
  };

  const minify = () => {
    setError('');
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
    } catch (e) {
      setError(`Invalid JSON: ${e.message}`);
      setOutput('');
    }
  };

  const validate = () => {
    setError('');
    try {
      JSON.parse(input);
      setError('');
      setOutput('Valid JSON!');
    } catch (e) {
      setError(`Invalid JSON: ${e.message}`);
      setOutput('');
    }
  };

  const sample = () => {
    setInput(JSON.stringify({ name: "John", age: 30, languages: ["Java", "Python", "JavaScript"], address: { city: "New York", zip: "10001" }}, null, 2));
  };

  return (
    <div className="tool-card-container">
      <div className="tool-row">
        <label>Input JSON</label>
        <textarea
          className="tool-textarea"
          rows={10}
          placeholder='Paste your JSON here...'
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
        <button className="tool-btn" onClick={beautify}>Beautify</button>
        <button className="tool-btn" onClick={minify}>Minify</button>
        <button className="tool-btn tool-btn-secondary" onClick={validate}>Validate</button>
        <button className="tool-btn tool-btn-secondary" onClick={sample}>Load Sample</button>
        <select className="tool-select" style={{ width: 'auto' }} value={indent} onChange={(e) => setIndent(Number(e.target.value))}>
          <option value={2}>2 spaces</option>
          <option value={4}>4 spaces</option>
          <option value={1}>1 tab</option>
        </select>
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
