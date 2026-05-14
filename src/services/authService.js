import api from "./api";

const TOKEN_KEY = "token";

const authService = {
  // 1. Register a new user on the server
  register: async (name, email, password, role = "USER") => {
    const response = await api.post("/auth/register", { fullName: name, email, password, role });
    return response.data;
  },

  // 2. Login and store the REAL JWT from Spring Boot
  login: async (email, password) => {
    const response = await api.post("/auth/login", { email, password });
    if (response.data.token) {
      localStorage.setItem(TOKEN_KEY, response.data.token);
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
  },

  getToken: () => localStorage.getItem(TOKEN_KEY),

  getCurrentUser: () => {
    const token = authService.getToken();
    if (!token) return null;

    // Simple decode for UI display (name/role)
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      // Check expiry
      if (payload.exp * 1000 < Date.now()) {
        authService.logout();
        return null;
      }
      return { email: payload.sub, name: payload.name, role: payload.role };
    } catch {
      return null;
    }
  },

  isAuthenticated: () => authService.getCurrentUser() !== null,
};

export default authService;