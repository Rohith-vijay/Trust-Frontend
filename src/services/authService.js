import api from "./api";

const authService = {
  // 1. Register a new user on the server
  register: async (name, email, password, role = "USER") => {
    const response = await api.post("/auth/register", { fullName: name, email, password, role });
    const data = response.data;
    if (data.token) {
      localStorage.setItem('trustcore_access_token', data.token);
    }
    if (data.refreshToken) {
      localStorage.setItem('trustcore_refresh_token', data.refreshToken);
    }
    if (data.user) {
      localStorage.setItem('trustcore_user', JSON.stringify(data.user));
    }
    return data;
  },

  // 2. Login and store the refresh token and user metadata from Spring Boot
  login: async (email, password) => {
    const response = await api.post("/auth/login", { email, password });
    const data = response.data;
    if (data.token) {
      localStorage.setItem('trustcore_access_token', data.token);
    }
    if (data.refreshToken) {
      localStorage.setItem('trustcore_refresh_token', data.refreshToken);
    }
    if (data.user) {
      localStorage.setItem('trustcore_user', JSON.stringify(data.user));
    }
    return data;
  },

  logout: async () => {
    const refreshToken = localStorage.getItem('trustcore_refresh_token');
    try {
      if (refreshToken) {
        await api.post("/auth/logout", { refreshToken });
      }
    } catch (e) {
      // Ignore network errors on logout to ensure local cleanup
    }
    localStorage.removeItem('trustcore_access_token');
    localStorage.removeItem('trustcore_refresh_token');
    localStorage.removeItem('trustcore_user');
  },

  getToken: () => {
    return localStorage.getItem('trustcore_access_token');
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('trustcore_user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  isAuthenticated: () => authService.getCurrentUser() !== null,
};

export default authService;