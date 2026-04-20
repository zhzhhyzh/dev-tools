import { useState } from 'react';

export default function Calculator() {
  const [expression, setExpression] = useState('');
  const [history, setHistory] = useState([]);
  const [error, setError] = useState('');

  const safeEval = (expr) => {
    // Only allow numbers, operators, parentheses, whitespace, decimal points, and common math functions
    const sanitized = expr
      .replace(/Math\./g, '')
      .replace(/\bPI\b/g, String(Math.PI))
      .replace(/\bE\b/g, String(Math.E))
      .replace(/\bsqrt\b/g, 'Math.sqrt')
      .replace(/\babs\b/g, 'Math.abs')
      .replace(/\bsin\b/g, 'Math.sin')
      .replace(/\bcos\b/g, 'Math.cos')
      .replace(/\btan\b/g, 'Math.tan')
      .replace(/\blog\b/g, 'Math.log10')
      .replace(/\bln\b/g, 'Math.log')
      .replace(/\bpow\b/g, 'Math.pow')
      .replace(/\bfloor\b/g, 'Math.floor')
      .replace(/\bceil\b/g, 'Math.ceil')
      .replace(/\bround\b/g, 'Math.round')
      .replace(/\bmin\b/g, 'Math.min')
      .replace(/\bmax\b/g, 'Math.max');

    if (/[^0-9+\-*/%().eE,\s\w]/.test(sanitized.replace(/Math\.\w+/g, ''))) {
      throw new Error('Invalid characters in expression');
    }
    const fn = new Function(`"use strict"; return (${sanitized})`);
    return fn();
  };

  const calculate = () => {
    setError('');
    if (!expression.trim()) return;
    try {
      const result = safeEval(expression);
      if (result === undefined || result === null || isNaN(result)) {
        setError('Invalid expression');
        return;
      }
      setHistory((prev) => [{ expr: expression, result: String(result) }, ...prev.slice(0, 19)]);
      setExpression(String(result));
    } catch (e) {
      setError('Error: ' + e.message);
    }
  };

  const insertBtn = (val) => setExpression((p) => p + val);

  const buttons = [
    ['(', ')', '%', 'C'],
    ['7', '8', '9', '/'],
    ['4', '5', '6', '*'],
    ['1', '2', '3', '-'],
    ['0', '.', '=', '+'],
  ];

  const handleBtn = (val) => {
    if (val === 'C') { setExpression(''); setError(''); }
    else if (val === '=') calculate();
    else insertBtn(val);
  };

  return (
    <div className="tool-card-container">
      <div className="tool-row">
        <label>Expression</label>
        <input
          className="tool-input"
          style={{ fontSize: 18, fontFamily: 'monospace', textAlign: 'right' }}
          type="text"
          placeholder="e.g. 2 * (3 + 4) or sqrt(144)"
          value={expression}
          onChange={(e) => setExpression(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && calculate()}
        />
      </div>
      {error && <div className="tool-error" style={{ marginBottom: 12 }}>{error}</div>}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 16 }}>
        {buttons.flat().map((b) => (
          <button
            key={b}
            className="tool-btn"
            style={{
              justifyContent: 'center',
              background: b === '=' ? 'var(--accent)' : b === 'C' ? 'var(--error)' : /[+\-*/%()]/.test(b) ? 'var(--bg-card)' : 'var(--bg-input)',
              border: '1px solid var(--border-color)',
              fontSize: 16,
              padding: '14px 0',
            }}
            onClick={() => handleBtn(b)}
          >
            {b}
          </button>
        ))}
      </div>
      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12 }}>
        Functions: sqrt(), abs(), sin(), cos(), tan(), log(), ln(), pow(), floor(), ceil(), round(), min(), max(), PI, E
      </div>
      {history.length > 0 && (
        <div className="tool-row">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label>History</label>
            <button className="tool-copy-btn" onClick={() => setHistory([])}>Clear</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {history.map((h, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 12px', background: 'var(--bg-input)', borderRadius: 'var(--radius-sm)', fontSize: 13, fontFamily: 'monospace' }}>
                <span style={{ color: 'var(--text-secondary)' }}>{h.expr}</span>
                <span style={{ color: 'var(--accent)' }}>= {h.result}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
