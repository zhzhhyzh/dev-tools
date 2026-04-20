import { useState, useMemo } from 'react';

export default function RegexTester() {
  const [pattern, setPattern] = useState('');
  const [flags, setFlags] = useState('g');
  const [testStr, setTestStr] = useState('');
  const [error, setError] = useState('');

  const results = useMemo(() => {
    setError('');
    if (!pattern || !testStr) return null;
    try {
      const regex = new RegExp(pattern, flags);
      const matches = [];
      let match;

      if (flags.includes('g')) {
        while ((match = regex.exec(testStr)) !== null) {
          matches.push({
            value: match[0],
            index: match.index,
            groups: match.slice(1),
          });
          if (!match[0]) break; // prevent infinite loop on empty match
        }
      } else {
        match = regex.exec(testStr);
        if (match) {
          matches.push({
            value: match[0],
            index: match.index,
            groups: match.slice(1),
          });
        }
      }
      return matches;
    } catch (e) {
      setError('Invalid regex: ' + e.message);
      return null;
    }
  }, [pattern, flags, testStr]);

  const highlightText = () => {
    if (!results || results.length === 0 || !pattern) return testStr;
    try {
      const regex = new RegExp(pattern, flags.includes('g') ? flags : flags + 'g');
      const parts = [];
      let lastIndex = 0;
      let m;
      while ((m = regex.exec(testStr)) !== null) {
        if (m.index > lastIndex) parts.push({ text: testStr.slice(lastIndex, m.index), match: false });
        parts.push({ text: m[0], match: true });
        lastIndex = m.index + m[0].length;
        if (!m[0]) break;
      }
      if (lastIndex < testStr.length) parts.push({ text: testStr.slice(lastIndex), match: false });
      return parts;
    } catch {
      return testStr;
    }
  };

  const highlighted = highlightText();

  return (
    <div className="tool-card-container">
      <div className="tool-row">
        <label>Regular Expression</label>
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            className="tool-input"
            style={{ fontFamily: 'monospace' }}
            placeholder="e.g. \\d{3}-\\d{4}"
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
          />
          <input
            className="tool-input"
            style={{ width: 80, textAlign: 'center', fontFamily: 'monospace' }}
            placeholder="flags"
            value={flags}
            onChange={(e) => setFlags(e.target.value)}
          />
        </div>
      </div>
      <div className="tool-row">
        <label>Test String</label>
        <textarea
          className="tool-textarea"
          rows={5}
          placeholder="Enter text to test against the regex..."
          value={testStr}
          onChange={(e) => setTestStr(e.target.value)}
        />
      </div>
      {error && <div className="tool-error" style={{ marginBottom: 12 }}>{error}</div>}
      {results !== null && (
        <>
          <div className="tool-row">
            <label>Highlighted Matches ({results.length} found)</label>
            <div className="tool-output" style={{ lineHeight: 1.8 }}>
              {Array.isArray(highlighted)
                ? highlighted.map((p, i) =>
                    p.match ? (
                      <span key={i} style={{ background: 'rgba(108, 99, 255, 0.3)', borderRadius: 3, padding: '1px 2px' }}>{p.text}</span>
                    ) : (
                      <span key={i}>{p.text}</span>
                    )
                  )
                : highlighted}
            </div>
          </div>
          {results.length > 0 && (
            <div className="tool-row">
              <label>Match Details</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {results.map((m, i) => (
                  <div key={i} style={{ padding: '8px 12px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', fontSize: 13, fontFamily: 'monospace' }}>
                    <span style={{ color: 'var(--accent)' }}>Match {i + 1}:</span>{' '}
                    <span>"{m.value}"</span>{' '}
                    <span style={{ color: 'var(--text-muted)' }}>at index {m.index}</span>
                    {m.groups.length > 0 && (
                      <div style={{ marginTop: 4, color: 'var(--text-secondary)' }}>
                        Groups: {m.groups.map((g, gi) => `$${gi + 1}="${g}"`).join(', ')}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
