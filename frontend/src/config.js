// In development, Vite proxy handles /api and /ws -> localhost:3001
// In production, VITE_API_URL points to the Render backend
export const API_BASE = import.meta.env.VITE_API_URL || '';

export function getWsUrl(path) {
  if (import.meta.env.VITE_API_URL) {
    // Production: derive ws:// from the API URL
    const url = new URL(import.meta.env.VITE_API_URL);
    const protocol = url.protocol === 'https:' ? 'wss:' : 'ws:';
    return `${protocol}//${url.host}${path}`;
  }
  // Development: connect via same host (Vite proxy)
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  return `${protocol}//${window.location.host}${path}`;
}
