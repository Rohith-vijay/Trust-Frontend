import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { pageVariants, pageTransition } from "../constants/motionVariants";
import { useAuth } from "../hooks/useAuth";
import { TextField, Button, Card, Typography, InputAdornment, IconButton, Alert, CircularProgress } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      const user = await login(email, password);
      if (user.role === "ADMIN") {
        navigate("/admin");
      } else if (user.role === "VOLUNTEER") {
        navigate("/dashboard/volunteer");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      const status = err.response?.status;
      const serverMsg = err.response?.data?.message || err.response?.data?.error || "";

      if (status === 401 && /not (active|verified)/i.test(serverMsg)) {
        setError("Please verify your email before logging in. Check your inbox for the verification link.");
      } else {
        setError(serverMsg || "Invalid email or password. Please try again.");
      }
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
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <LockOutlinedIcon color="primary" fontSize="large" />
              </div>
              <Typography variant="h4" sx={{ fontWeight: 800, color: 'text.primary', mb: 1 }}>
                Welcome Back
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Sign in to continue your impact
              </Typography>
            </div>

            {error && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mb-6">
                <Alert severity="error" sx={{ borderRadius: 2 }}>{error}</Alert>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <TextField
                fullWidth
                label="Email Address"
                variant="outlined"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
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

              <TextField
                fullWidth
                label="Password"
                variant="outlined"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
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
                  mt: 2,
                  boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
                }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : "Sign In"}
              </Button>
            </form>

            <Typography variant="body2" align="center" color="text.secondary" sx={{ mt: 5 }}>
              Don't have an account?{" "}
              <Link to="/signup" className="text-primary font-semibold hover:underline">
                Sign up
              </Link>
            </Typography>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default Login;
