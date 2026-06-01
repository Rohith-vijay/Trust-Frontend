import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { pageVariants, pageTransition } from "../constants/motionVariants";
import { TextField, Button, Card, Typography, InputAdornment, IconButton, Alert, CircularProgress } from "@mui/material";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import KeyIcon from "@mui/icons-material/Key";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import api from "../services/api";

function ForgotPassword() {
  const [step, setStep] = useState(1); // 1: Email, 2: Instructions, 3: New Password, 4: Success
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Extract reset token from search params on mount (from click-to-email reset link)
  useEffect(() => {
    const tokenParam = searchParams.get("token");
    if (tokenParam) {
      setToken(tokenParam);
      setStep(3);
    }
  }, [searchParams]);

  const handleSendCode = async (e) => {
    e.preventDefault();
    setError("");
    if (!email.trim() || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      // POST to Spring Boot forgot password route
      await api.post("/auth/forgot-password", { email }, { skipGlobalToast: true });
      setStep(2);
    } catch (err) {
      const serverMsg = err.response?.data?.message || err.response?.data?.error || "Failed to request password reset. Make sure the email is registered.";
      setError(serverMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      // POST to Spring Boot reset password route
      await api.post("/auth/reset-password", { token, newPassword: password }, { skipGlobalToast: true });
      setStep(4);
    } catch (err) {
      const serverMsg = err.response?.data?.message || err.response?.data?.error || "Failed to reset password. The link might be expired or invalid.";
      setError(serverMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={pageTransition}
      className="min-h-[85vh] flex items-center justify-center py-12 px-4 bg-gray-50/50"
    >
      <div className="w-full max-w-md">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <Card elevation={0} sx={{ borderRadius: 6, p: { xs: 4, sm: 5 }, boxShadow: '0 20px 40px rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.05)' }}>
            
            {step === 1 && (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <KeyIcon color="primary" fontSize="large" />
                  </div>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: 'text.primary', mb: 1 }}>
                    Forgot Password
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Enter your registered email address to receive a secure password reset link
                  </Typography>
                </div>

                {error && <Alert severity="error" sx={{ borderRadius: 2 }}>{error}</Alert>}

                <form onSubmit={handleSendCode} className="space-y-5">
                  <TextField
                    fullWidth
                    label="Email Address"
                    variant="outlined"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <AlternateEmailIcon color="action" />
                        </InputAdornment>
                      ),
                      sx: { borderRadius: 3 }
                    }}
                  />

                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    size="large"
                    type="submit"
                    disabled={loading}
                    sx={{
                      py: 1.5,
                      borderRadius: 3,
                      fontWeight: 700,
                      textTransform: 'none',
                      fontSize: '1rem',
                      boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
                    }}
                  >
                    {loading ? <CircularProgress size={24} color="inherit" /> : "Send Reset Link"}
                  </Button>
                </form>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlternateEmailIcon sx={{ color: "indigo.500" }} fontSize="large" />
                  </div>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: 'text.primary', mb: 1 }}>
                    Reset Link Sent!
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    We have successfully sent a secure password reset link to <span className="font-semibold">{email}</span>.
                  </Typography>
                </div>

                <div className="bg-amber-50/50 border border-amber-100 rounded-2xl p-5 text-center mt-6">
                  <span className="text-[10px] font-black uppercase text-amber-800 tracking-wider">Local Sandbox Sandbox</span>
                  <p className="text-xs text-amber-700 mt-2">
                    Since you are testing locally, the reset link has also been printed clearly in your <strong>Spring Boot backend console logs</strong>!
                  </p>
                  <p className="text-[10px] text-gray-500 mt-2 leading-relaxed">
                    Copy the generated URL from the logs (which starts with <code className="bg-gray-100 px-1 py-0.5 rounded font-mono">http://localhost:5173/forgot-password?token=...</code>) and open it in a new tab to complete your password reset.
                  </p>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <LockOutlinedIcon sx={{ color: "emerald.500" }} fontSize="large" />
                  </div>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: 'text.primary', mb: 1 }}>
                    Choose New Password
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Set a strong new password to regain access to your account
                  </Typography>
                </div>

                {error && <Alert severity="error" sx={{ borderRadius: 2 }}>{error}</Alert>}

                <form onSubmit={handleResetPassword} className="space-y-5">
                  <TextField
                    fullWidth
                    label="New Password"
                    variant="outlined"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockOutlinedIcon color="action" />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" disabled={loading}>
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                      sx: { borderRadius: 3 }
                    }}
                  />

                  <TextField
                    fullWidth
                    label="Confirm New Password"
                    variant="outlined"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={loading}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockOutlinedIcon color="action" />
                        </InputAdornment>
                      ),
                      sx: { borderRadius: 3 }
                    }}
                  />

                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    size="large"
                    type="submit"
                    disabled={loading}
                    sx={{
                      py: 1.5,
                      borderRadius: 3,
                      fontWeight: 700,
                      textTransform: 'none',
                      fontSize: '1rem',
                      boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
                    }}
                  >
                    {loading ? <CircularProgress size={24} color="inherit" /> : "Save New Password"}
                  </Button>
                </form>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-6 text-center select-none">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl font-black">
                  ✓
                </div>
                <Typography variant="h4" sx={{ fontWeight: 800, color: 'text.primary', mb: 1 }}>
                  Password Reset!
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Your new credentials have been updated successfully in the system database. You can now use them to log in.
                </Typography>

                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  size="large"
                  onClick={() => navigate("/login")}
                  sx={{
                    py: 1.5,
                    borderRadius: 3,
                    fontWeight: 700,
                    textTransform: 'none',
                    fontSize: '1rem',
                    boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                    mt: 4
                  }}
                >
                  Return to Login
                </Button>
              </div>
            )}

            <div className="mt-6 flex items-center justify-center">
              <Link to="/login" className="text-xs text-gray-500 hover:text-primary font-bold flex items-center gap-1">
                <ArrowBackIcon sx={{ fontSize: 13 }} /> Back to Sign In
              </Link>
            </div>

          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default ForgotPassword;
