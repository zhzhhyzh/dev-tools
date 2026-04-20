import { useState, useCallback } from 'react';

function hexToRgb(hex) {
  const h = hex.replace('#', '');
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return { r, g, b };
}

function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map((c) => Math.max(0, Math.min(255, c)).toString(16).padStart(2, '0')).join('');
}

function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;
  if (max === min) { h = s = 0; }
  else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function hslToRgb(h, s, l) {
  h /= 360; s /= 100; l /= 100;
  let r, g, b;
  if (s === 0) { r = g = b = l; }
  else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1; if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }
  return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
}

export default function ColorPicker() {
  const [hex, setHex] = useState('#6c63ff');
  const [rgb, setRgb] = useState({ r: 108, g: 99, b: 255 });
  const [hsl, setHsl] = useState({ h: 243, s: 100, l: 69 });

  const updateFromHex = useCallback((h) => {
    setHex(h);
    if (/^#[0-9a-fA-F]{6}$/.test(h)) {
      const c = hexToRgb(h);
      setRgb(c);
      setHsl(rgbToHsl(c.r, c.g, c.b));
    }
  }, []);

  const updateFromRgb = useCallback((r, g, b) => {
    setRgb({ r, g, b });
    setHex(rgbToHex(r, g, b));
    setHsl(rgbToHsl(r, g, b));
  }, []);

  const updateFromHsl = useCallback((h, s, l) => {
    setHsl({ h, s, l });
    const c = hslToRgb(h, s, l);
    setRgb(c);
    setHex(rgbToHex(c.r, c.g, c.b));
  }, []);

  const handleColorPicker = (e) => {
    updateFromHex(e.target.value);
  };

  const formats = [
    { label: 'HEX', value: hex },
    { label: 'RGB', value: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` },
    { label: 'HSL', value: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` },
    { label: 'CSS RGB', value: `rgb(${rgb.r} ${rgb.g} ${rgb.b})` },
    { label: 'Java', value: `new Color(${rgb.r}, ${rgb.g}, ${rgb.b})` },
    { label: 'Python', value: `(${rgb.r}, ${rgb.g}, ${rgb.b})` },
  ];

  return (
    <div className="tool-card-container">
      <div style={{ display: 'flex', gap: 20, marginBottom: 20, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          <input
            type="color"
            value={hex}
            onChange={handleColorPicker}
            style={{ width: 120, height: 120, border: 'none', cursor: 'pointer', borderRadius: 'var(--radius-sm)', background: 'none' }}
          />
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Click to pick</span>
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10, minWidth: 240 }}>
          <div className="tool-row" style={{ marginBottom: 0 }}>
            <label>HEX</label>
            <input className="tool-input" value={hex} onChange={(e) => updateFromHex(e.target.value)} style={{ fontFamily: 'monospace' }} />
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <div className="tool-row" style={{ flex: 1, marginBottom: 0 }}>
              <label>R</label>
              <input className="tool-input" type="number" min={0} max={255} value={rgb.r} onChange={(e) => updateFromRgb(Number(e.target.value), rgb.g, rgb.b)} />
            </div>
            <div className="tool-row" style={{ flex: 1, marginBottom: 0 }}>
              <label>G</label>
              <input className="tool-input" type="number" min={0} max={255} value={rgb.g} onChange={(e) => updateFromRgb(rgb.r, Number(e.target.value), rgb.b)} />
            </div>
            <div className="tool-row" style={{ flex: 1, marginBottom: 0 }}>
              <label>B</label>
              <input className="tool-input" type="number" min={0} max={255} value={rgb.b} onChange={(e) => updateFromRgb(rgb.r, rgb.g, Number(e.target.value))} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <div className="tool-row" style={{ flex: 1, marginBottom: 0 }}>
              <label>H</label>
              <input className="tool-input" type="number" min={0} max={360} value={hsl.h} onChange={(e) => updateFromHsl(Number(e.target.value), hsl.s, hsl.l)} />
            </div>
            <div className="tool-row" style={{ flex: 1, marginBottom: 0 }}>
              <label>S%</label>
              <input className="tool-input" type="number" min={0} max={100} value={hsl.s} onChange={(e) => updateFromHsl(hsl.h, Number(e.target.value), hsl.l)} />
            </div>
            <div className="tool-row" style={{ flex: 1, marginBottom: 0 }}>
              <label>L%</label>
              <input className="tool-input" type="number" min={0} max={100} value={hsl.l} onChange={(e) => updateFromHsl(hsl.h, hsl.s, Number(e.target.value))} />
            </div>
          </div>
        </div>
      </div>

      <div style={{ width: '100%', height: 60, borderRadius: 'var(--radius-sm)', background: hex, border: '1px solid var(--border-color)', marginBottom: 16 }} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {formats.map((f) => (
          <div key={f.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: 13, minWidth: 80 }}>{f.label}</span>
            <code style={{ fontSize: 13, fontFamily: 'monospace' }}>{f.value}</code>
            <button className="tool-copy-btn" onClick={() => navigator.clipboard.writeText(f.value)}>Copy</button>
          </div>
        ))}
      </div>
    </div>
  );
}
