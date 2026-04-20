import { useState } from 'react';

function formatXml(xml, indent = '  ') {
  let formatted = '';
  let pad = 0;
  const lines = xml.replace(/(>)(<)(\/*)/g, '$1\n$2$3').split('\n');
  for (let line of lines) {
    line = line.trim();
    if (!line) continue;
    if (line.match(/^<\/\w/)) pad--;
    formatted += indent.repeat(Math.max(0, pad)) + line + '\n';
    if (line.match(/^<\w[^>]*[^/]>.*$/) && !line.match(/^<\w[^>]*>.*<\/\w/)) pad++;
  }
  return formatted.trim();
}

function minifyXml(xml) {
  return xml.replace(/>\s+</g, '><').replace(/\s+/g, ' ').replace(/>\s+/g, '>').replace(/\s+</g, '<').trim();
}

function validateXml(xml) {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xml, 'text/xml');
    const err = doc.querySelector('parsererror');
    if (err) return err.textContent;
    return null;
  } catch (e) {
    return e.message;
  }
}

export default function XmlFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const beautify = () => {
    setError('');
    const err = validateXml(input);
    if (err) { setError(err); setOutput(''); return; }
    setOutput(formatXml(input));
  };

  const minify = () => {
    setError('');
    const err = validateXml(input);
    if (err) { setError(err); setOutput(''); return; }
    setOutput(minifyXml(input));
  };

  const validate = () => {
    setError('');
    const err = validateXml(input);
    if (err) { setError(err); setOutput(''); }
    else { setOutput('Valid XML!'); }
  };

  const sample = () => {
    setInput(`<?xml version="1.0" encoding="UTF-8"?>
<project>
  <name>DevTools</name>
  <dependencies>
    <dependency>
      <groupId>com.example</groupId>
      <artifactId>core</artifactId>
      <version>1.0.0</version>
    </dependency>
  </dependencies>
</project>`);
  };

  return (
    <div className="tool-card-container">
      <div className="tool-row">
        <label>Input XML</label>
        <textarea
          className="tool-textarea"
          rows={10}
          placeholder="Paste your XML here..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      </div>
      <div className="tool-btn-row" style={{ marginBottom: 16 }}>
        <button className="tool-btn" onClick={beautify}>Beautify</button>
        <button className="tool-btn" onClick={minify}>Minify</button>
        <button className="tool-btn tool-btn-secondary" onClick={validate}>Validate</button>
        <button className="tool-btn tool-btn-secondary" onClick={sample}>Load Sample</button>
      </div>
      {error && <div className="tool-error" style={{ marginBottom: 12 }}>{error}</div>}
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
