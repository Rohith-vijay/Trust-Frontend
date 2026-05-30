// generic utility helpers used across the application

export const formatDate = (date) => {
  if (!date) return "";
  const d = new Date(date);
  return d.toLocaleDateString();
};

export const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

export const getBackendUrl = () => {
  let url = "";
  if (import.meta.env.VITE_API_URL) {
    url = import.meta.env.VITE_API_URL;
  } else if (import.meta.env.VITE_API_BASE_URL) {
    url = import.meta.env.VITE_API_BASE_URL;
  } else {
    const hostname = typeof window !== "undefined" && window.location ? window.location.hostname : "localhost";
    url = `http://${hostname}:8080/api`;
  }

  if (url) {
    // Remove any trailing slashes
    url = url.replace(/\/+$/, "");
    // Ensure it ends with /api
    if (!url.endsWith("/api")) {
      url = `${url}/api`;
    }
  }
  return url;
};

export const getWebSocketUrl = () => {
  const backendUrl = getBackendUrl();
  // Strip trailing '/api' from base URL if present to construct the correct WebSocket handshake path
  const base = backendUrl.endsWith("/api") ? backendUrl.slice(0, -4) : backendUrl;
  return `${base}/ws`;
};
