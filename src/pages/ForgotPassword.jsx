import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { pageVariants, pageTransition } from "../constants/motionVariants";
import { TextField, Button, Card, Typography, InputAdornment, IconButton, Alert, CircularProgress } from "@mui/material";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import KeyIcon from "@mui/icons-material/Key";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

function ForgotPassword() {
  const [step, setStep] = useState(1); // 1: Email, 2: Code, 3: New Password, 4: Success
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [simulatedCode, setSimulatedCode] = useState("");
  const navigate = useNavigate();

  const handleSendCode = (e) => {
    e.preventDefault();
    setError("");
    if (!email.trim() || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    // Simulate API delay
    setTimeout(() => {
      setLoading(false);
      // Generate a dynamic mock code for sandbox testing
      const generatedCode = String(Math.floor(1000 + Math.random() * 9000));
      setSimulatedCode(generatedCode);
      setStep(2);
    }, 1000);
  };

  const handleVerifyCode = (e) => {
    e.preventDefault();
    setError("");
    if (code !== simulatedCode && code !== "8888") {
      setError("Invalid verification code. For testing, you can use the code shown below.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(3);
    }, 800);
  };

  const handleResetPassword = (e) => {
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
    setTimeout(() => {
      setLoading(false);
      setStep(4);
    }, 1200);
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
                    Enter your email below to receive an access code
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
                    {loading ? <CircularProgress size={24} color="inherit" /> : "Send Verification Code"}
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
                    Enter Verification Code
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    We sent a simulated reset code to <span className="font-semibold">{email}</span>
                  </Typography>
                </div>

                {error && <Alert severity="error" sx={{ borderRadius: 2 }}>{error}</Alert>}

                <form onSubmit={handleVerifyCode} className="space-y-5">
                  <TextField
                    fullWidth
                    label="Verification Code"
                    variant="outlined"
                    placeholder="e.g. 8888"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    disabled={loading}
                    InputProps={{
                      sx: { borderRadius: 3, textAlign: 'center', tracking: '0.5em', fontClass: 'font-mono' }
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
                    {loading ? <CircularProgress size={24} color="inherit" /> : "Verify Code"}
                  </Button>
                </form>

                {/* Sandbox Developer helper display */}
                <div className="bg-amber-50/50 border border-amber-100 rounded-2xl p-4 text-center mt-6">
                  <span className="text-[9px] font-black uppercase text-amber-800 tracking-wider">Operational Testing Sandbox</span>
                  <p className="text-xs text-amber-700 mt-1">Mock Code generated: <strong className="font-mono text-base">{simulatedCode}</strong></p>
                  <p className="text-[10px] text-gray-400 mt-0.5">(For validation testing, typing either <strong className="font-mono">{simulatedCode}</strong> or <strong className="font-mono">8888</strong> is fully accepted.)</p>
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
                    Reset Password
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Set a strong new password for your account
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
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                  ✓
                </div>
                <Typography variant="h4" sx={{ fontWeight: 800, color: 'text.primary', mb: 1 }}>
                  Password Reset!
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Your new credentials have been updated and cached successfully in the mock auth registry.
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
