import { useState, useEffect } from 'react';

const fieldStyle = { flex: 1, minWidth: 60 };
const labelStyle = { fontSize: 11, color: 'var(--text-muted)', marginBottom: 4, display: 'block', textAlign: 'center' };

export default function UnixTimestamp() {
  const [timestamp, setTimestamp] = useState('');
  const [currentTs, setCurrentTs] = useState(Math.floor(Date.now() / 1000));
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  // Individual date fields
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [day, setDay] = useState(now.getDate());
  const [hour, setHour] = useState(now.getHours());
  const [minute, setMinute] = useState(now.getMinutes());
  const [second, setSecond] = useState(now.getSeconds());
  const [ms, setMs] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTs(Math.floor(Date.now() / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const tsToDate = () => {
    setError('');
    const ts = Number(timestamp);
    if (isNaN(ts) || timestamp.trim() === '') {
      setError('Please enter a valid Unix timestamp');
      return;
    }
    const msVal = ts > 1e12 ? ts : ts * 1000;
    const d = new Date(msVal);
    setResult(
      `UTC:   ${d.toUTCString()}\nLocal: ${d.toLocaleString()}\nISO:   ${d.toISOString()}`
    );
    // Also populate the date fields
    setYear(d.getFullYear());
    setMonth(d.getMonth() + 1);
    setDay(d.getDate());
    setHour(d.getHours());
    setMinute(d.getMinutes());
    setSecond(d.getSeconds());
    setMs(d.getMilliseconds());
  };

  const dateToTs = () => {
    setError('');
    const y = Number(year);
    const mo = Number(month);
    const dy = Number(day);
    const h = Number(hour);
    const mi = Number(minute);
    const s = Number(second);
    const msVal = Number(ms);

    if ([y, mo, dy, h, mi, s, msVal].some((v) => isNaN(v))) {
      setError('Please fill in all date fields with valid numbers');
      return;
    }
    if (mo < 1 || mo > 12) { setError('Month must be 1-12'); return; }
    if (dy < 1 || dy > 31) { setError('Day must be 1-31'); return; }
    if (h < 0 || h > 23) { setError('Hour must be 0-23'); return; }
    if (mi < 0 || mi > 59) { setError('Minute must be 0-59'); return; }
    if (s < 0 || s > 59) { setError('Second must be 0-59'); return; }
    if (msVal < 0 || msVal > 999) { setError('Millisecond must be 0-999'); return; }

    const d = new Date(y, mo - 1, dy, h, mi, s, msVal);
    if (isNaN(d.getTime())) {
      setError('Invalid date combination');
      return;
    }
    const sec = Math.floor(d.getTime() / 1000);
    setResult(
      `Timestamp (seconds):      ${sec}\nTimestamp (milliseconds):  ${d.getTime()}\nISO:   ${d.toISOString()}\nUTC:   ${d.toUTCString()}\nLocal: ${d.toLocaleString()}`
    );
  };

  const useNow = () => {
    const n = new Date();
    setTimestamp(Math.floor(n.getTime() / 1000).toString());
    setYear(n.getFullYear());
    setMonth(n.getMonth() + 1);
    setDay(n.getDate());
    setHour(n.getHours());
    setMinute(n.getMinutes());
    setSecond(n.getSeconds());
    setMs(n.getMilliseconds());
    setResult('');
    setError('');
  };

  return (
    <div className="tool-card-container">
      <div style={{ textAlign: 'center', marginBottom: 20, padding: '12px', background: 'var(--bg-input)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
        <span style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Current Unix Timestamp: </span>
        <span style={{ fontSize: 20, fontWeight: 700, fontFamily: 'monospace', color: 'var(--accent)' }}>{currentTs}</span>
      </div>

      {/* Timestamp to Date */}
      <div className="tool-row">
        <label>Unix Timestamp to Date</label>
        <div style={{ display: 'flex', gap: 10 }}>
          <input
            className="tool-input"
            type="text"
            placeholder="e.g. 1700000000"
            value={timestamp}
            onChange={(e) => setTimestamp(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && tsToDate()}
          />
          <button className="tool-btn" onClick={tsToDate}>Convert</button>
        </div>
      </div>

      {/* Date to Timestamp - individual fields */}
      <div className="tool-row">
        <label>Date to Unix Timestamp</label>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          <div style={fieldStyle}>
            <span style={labelStyle}>Year</span>
            <input className="tool-input" type="number" placeholder="YYYY" value={year} onChange={(e) => setYear(e.target.value)} style={{ textAlign: 'center' }} />
          </div>
          <div style={fieldStyle}>
            <span style={labelStyle}>Month</span>
            <input className="tool-input" type="number" min={1} max={12} placeholder="MM" value={month} onChange={(e) => setMonth(e.target.value)} style={{ textAlign: 'center' }} />
          </div>
          <div style={fieldStyle}>
            <span style={labelStyle}>Day</span>
            <input className="tool-input" type="number" min={1} max={31} placeholder="DD" value={day} onChange={(e) => setDay(e.target.value)} style={{ textAlign: 'center' }} />
          </div>
          <div style={fieldStyle}>
            <span style={labelStyle}>Hour</span>
            <input className="tool-input" type="number" min={0} max={23} placeholder="HH" value={hour} onChange={(e) => setHour(e.target.value)} style={{ textAlign: 'center' }} />
          </div>
          <div style={fieldStyle}>
            <span style={labelStyle}>Min</span>
            <input className="tool-input" type="number" min={0} max={59} placeholder="mm" value={minute} onChange={(e) => setMinute(e.target.value)} style={{ textAlign: 'center' }} />
          </div>
          <div style={fieldStyle}>
            <span style={labelStyle}>Sec</span>
            <input className="tool-input" type="number" min={0} max={59} placeholder="ss" value={second} onChange={(e) => setSecond(e.target.value)} style={{ textAlign: 'center' }} />
          </div>
          <div style={fieldStyle}>
            <span style={labelStyle}>Ms</span>
            <input className="tool-input" type="number" min={0} max={999} placeholder="ms" value={ms} onChange={(e) => setMs(e.target.value)} style={{ textAlign: 'center' }} />
          </div>
        </div>
        <div style={{ marginTop: 10 }}>
          <button className="tool-btn" onClick={dateToTs}>Convert to Timestamp</button>
        </div>
      </div>

      <div className="tool-btn-row" style={{ marginBottom: 16 }}>
        <button className="tool-btn tool-btn-secondary" onClick={useNow}>Use Current Time</button>
      </div>

      {error && <div className="tool-error">{error}</div>}
      {result && <div className="tool-output">{result}</div>}
    </div>
  );
}
