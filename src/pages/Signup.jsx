import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { pageVariants, pageTransition } from "../constants/motionVariants";
import { useAuth } from "../hooks/useAuth";
import { TextField, Button, Card, Typography, InputAdornment, IconButton, Alert, CircularProgress, Box } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";

function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "", role: "USER" });
  const [error, setError] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { register } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name.trim() || !form.email.trim() || !form.password.trim()) {
      setError("Please fill in all required fields.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await register(form.name, form.email, form.password, form.role);
      setIsRegistered(true);
    } catch (err) {
      const message = err.response?.data?.message || err.response?.data?.error || "Registration failed. Please try again.";
      setError(message);
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
      <div className="w-full max-w-lg">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <Card elevation={0} sx={{ borderRadius: 6, p: { xs: 4, sm: 5 }, boxShadow: '0 20px 40px rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.05)' }}>
            
            <div className="text-center mb-8">
              {!isRegistered && (
                <>
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <PersonOutlinedIcon color="primary" fontSize="large" />
                  </div>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: 'text.primary', mb: 1 }}>
                    Create Account
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Join our community and make a difference
                  </Typography>
                </>
              )}
            </div>

            {isRegistered ? (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-6">
                <CheckCircleOutlinedIcon color="success" sx={{ fontSize: 80, mb: 3 }} />
                <Typography variant="h5" sx={{ fontWeight: 800, mb: 2 }}>Verification Email Sent!</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 4, maxWidth: 300, mx: 'auto', lineHeight: 1.6 }}>
                  We've sent a verification link to <span className="font-semibold text-gray-700">{form.email}</span>. Please check your inbox and click the link to activate your account.
                </Typography>
                <Button component={Link} to="/login" variant="contained" color="primary" sx={{ borderRadius: 4, px: 4, py: 1.5, textTransform: 'none', fontWeight: 600 }}>
                  Go to Login
                </Button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mb-4">
                    <Alert severity="error" sx={{ borderRadius: 2 }}>{error}</Alert>
                  </motion.div>
                )}

                <TextField
                  fullWidth label="Full Name" variant="outlined" type="text" name="name"
                  value={form.name} onChange={handleChange} disabled={loading}
                  InputProps={{ startAdornment: <InputAdornment position="start"><PersonOutlinedIcon color="action" /></InputAdornment>, sx: { borderRadius: 3 } }}
                />

                <TextField
                  fullWidth label="Email Address" variant="outlined" type="email" name="email"
                  value={form.email} onChange={handleChange} disabled={loading}
                  InputProps={{ startAdornment: <InputAdornment position="start"><AlternateEmailIcon color="action" /></InputAdornment>, sx: { borderRadius: 3 } }}
                />

                <TextField
                  fullWidth label="Password" variant="outlined" type={showPassword ? "text" : "password"} name="password"
                  value={form.password} onChange={handleChange} disabled={loading} placeholder="Min. 6 characters"
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><LockOutlinedIcon color="action" /></InputAdornment>,
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
                  fullWidth label="Confirm Password" variant="outlined" type="password" name="confirmPassword"
                  value={form.confirmPassword} onChange={handleChange} disabled={loading}
                  InputProps={{ startAdornment: <InputAdornment position="start"><LockOutlinedIcon color="action" /></InputAdornment>, sx: { borderRadius: 3 } }}
                />

                <Box sx={{ mt: 3, mb: 4 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 1.5, color: 'text.secondary' }}>I want to join as:</Typography>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: "USER", label: "User", icon: "👤", desc: "Donate" },
                      { value: "VOLUNTEER", label: "Volunteer", icon: "🤝", desc: "Join events" },
                      { value: "ADMIN", label: "Admin", icon: "🛡️", desc: "Manage" },
                    ].map((opt) => (
                      <button
                        key={opt.value} type="button" onClick={() => setForm((prev) => ({ ...prev, role: opt.value }))}
                        className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all duration-200 text-center ${
                          form.role === opt.value ? "border-primary bg-primary/5 shadow-inner" : "border-gray-100 hover:border-gray-300 bg-white"
                        }`}
                      >
                        <span className="text-xl mb-1">{opt.icon}</span>
                        <Typography variant="caption" sx={{ fontWeight: 700, color: form.role === opt.value ? "primary.main" : "text.secondary" }}>{opt.label}</Typography>
                        <Typography variant="caption" sx={{ fontSize: '0.65rem', color: 'text.disabled', lineHeight: 1 }}>{opt.desc}</Typography>
                      </button>
                    ))}
                  </div>
                </Box>

                <Button
                  fullWidth variant="contained" color="primary" size="large" type="submit" disabled={loading}
                  sx={{ py: 1.5, borderRadius: 3, fontWeight: 700, textTransform: 'none', fontSize: '1rem', mt: 2, boxShadow: '0 8px 16px rgba(0,0,0,0.1)' }}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : "Create Account"}
                </Button>
              </form>
            )}

            {!isRegistered && (
              <Typography variant="body2" align="center" color="text.secondary" sx={{ mt: 5 }}>
                Already have an account?{" "}
                <Link to="/login" className="text-primary font-semibold hover:underline">
                  Sign in
                </Link>
              </Typography>
            )}
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default Signup;
