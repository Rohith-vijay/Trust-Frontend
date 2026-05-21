import React, { createContext, useState, useEffect, useCallback } from "react";
import authService from "../services/authService";
import { Snackbar, Alert } from "@mui/material";

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
  showToast: (message, severity) => { },
});

export const AppProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [globalLoading, setGlobalLoading] = useState(false);
  const [user, setUser] = useState(() => authService.getCurrentUser());
  const [isAuthenticated, setIsAuthenticated] = useState(() => authService.getCurrentUser() !== null);

  // Toast state
  const [toast, setToast] = useState({ open: false, message: "", severity: "info" });

  const showToast = useCallback((message, severity = "info") => {
    setToast({ open: true, message, severity });
  }, []);

  const handleCloseToast = (event, reason) => {
    if (reason === "clickaway") return;
    setToast((prev) => ({ ...prev, open: false }));
  };

  useEffect(() => {
    const handleToastEvent = (e) => {
      if (e.detail && e.detail.message) {
        setToast({
          open: true,
          message: e.detail.message,
          severity: e.detail.severity || "info",
        });
      }
    };

    window.addEventListener("app-toast", handleToastEvent);
    return () => window.removeEventListener("app-toast", handleToastEvent);
  }, []);

  const login = useCallback(async (email, password) => {
    const result = await authService.login(email, password);
    setUser(result.user);
    setIsAuthenticated(true);
    showToast("Logged in successfully!", "success");
    return result.user;
  }, [showToast]);

  const register = useCallback(async (name, email, password, role) => {
    const result = await authService.register(name, email, password, role);
    showToast("Registration successful!", "success");
    return result;
  }, [showToast]);

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
    showToast("Logged out successfully.", "info");
  }, [showToast]);

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
    showToast,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
      <Snackbar
        open={toast.open}
        autoHideDuration={5000}
        onClose={handleCloseToast}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseToast}
          severity={toast.severity}
          variant="filled"
          sx={{
            width: "100%",
            borderRadius: 2,
            boxShadow: "0 10px 30px -5px rgba(0, 0, 0, 0.15)",
            whiteSpace: "pre-line",
            fontFamily: '"Inter", sans-serif',
            backgroundColor:
              toast.severity === "success"
                ? "#10B981"
                : toast.severity === "error"
                ? "#EF4444"
                : toast.severity === "warning"
                ? "#F59E0B"
                : "#2563EB",
          }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </AppContext.Provider>
  );
};
