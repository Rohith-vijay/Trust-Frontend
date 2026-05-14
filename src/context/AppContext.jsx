import React, { createContext, useState, useEffect, useCallback } from "react";
import authService from "../services/authService";

export const AppContext = createContext({
  // UI state
  loading: false,
  globalLoading: false,
  setLoading: () => { },
  setGlobalLoading: () => { },

  // Auth state
  user: null,
  isAuthenticated: false,
  login: async () => { },
  register: async () => { },
  logout: () => { },
});

export const AppProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [globalLoading, setGlobalLoading] = useState(false);
  const [user, setUser] = useState(() => authService.getCurrentUser());
  const [isAuthenticated, setIsAuthenticated] = useState(() => authService.getCurrentUser() !== null);

  const login = useCallback(async (email, password) => {
    const result = await authService.login(email, password);
    setUser(result.user);
    setIsAuthenticated(true);
    return result.user;
  }, []);

  const register = useCallback(async (name, email, password, role) => {
    const result = await authService.register(name, email, password, role);
    return result;
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  const contextValue = {
    // UI state
    loading,
    setLoading,
    globalLoading,
    setGlobalLoading,

    // Auth state
    user,
    isAuthenticated,
    login,
    register,
    logout,
  };

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
};
