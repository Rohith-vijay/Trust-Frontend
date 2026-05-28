// generic utility helpers used across the application

export const formatDate = (date) => {
  if (!date) return "";
  const d = new Date(date);
  return d.toLocaleDateString();
};

export const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

export const getBackendUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  const hostname = typeof window !== "undefined" && window.location ? window.location.hostname : "localhost";
  return `http://${hostname}:8080/api`;
};

export const getWebSocketUrl = () => {
  const backendUrl = getBackendUrl();
  // Strip trailing '/api' from base URL if present to construct the correct WebSocket handshake path
  const base = backendUrl.endsWith("/api") ? backendUrl.slice(0, -4) : backendUrl;
  return `${base}/ws`;
};
