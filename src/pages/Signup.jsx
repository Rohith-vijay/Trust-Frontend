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
import { getBackendUrl } from "../utils";

function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "", role: "USER" });
  const [error, setError] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register } = useAuth();

  // Real-time password strength computation
  const getPasswordStrength = (pwd) => {
    if (!pwd) return { score: 0, text: "Too Short", color: "#EF4444", checklist: {} };
    const hasUpper = /[A-Z]/.test(pwd);
    const hasLower = /[a-z]/.test(pwd);
    const hasNumber = /\d/.test(pwd);
    const hasSpecial = /[@$!%*?&]/.test(pwd);
    const isMinLength = pwd.length >= 8;

    const checklist = {
      minLength: isMinLength,
      upper: hasUpper,
      lower: hasLower,
      number: hasNumber,
      special: hasSpecial
    };

    let score = 0;
    if (isMinLength) score += 1;
    if (hasLower) score += 1;
    if (hasUpper) score += 1;
    if (hasNumber) score += 1;
    if (hasSpecial) score += 1;

    let text = "Weak";
    let color = "#EF4444";
    if (score === 5) {
      text = "Strong (Perfect!)";
      color = "#10B981";
    } else if (score >= 3) {
      text = "Medium";
      color = "#F59E0B";
    }

    return { score, text, color, checklist };
  };

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

    // Front-end strict validation against password regex
    const { score } = getPasswordStrength(form.password);
    if (score < 5) {
      setError("Please satisfy all password strength requirements before registering.");
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

  const strength = getPasswordStrength(form.password);

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
                  slotProps={{
                    input: {
                      startAdornment: <InputAdornment position="start"><PersonOutlinedIcon color="action" /></InputAdornment>,
                      sx: { borderRadius: 3 }
                    }
                  }}
                />

                <TextField
                  fullWidth label="Email Address" variant="outlined" type="email" name="email"
                  value={form.email} onChange={handleChange} disabled={loading}
                  InputProps={{ startAdornment: <InputAdornment position="start"><AlternateEmailIcon color="action" /></InputAdornment>, sx: { borderRadius: 3 } }}
                  slotProps={{
                    input: {
                      startAdornment: <InputAdornment position="start"><AlternateEmailIcon color="action" /></InputAdornment>,
                      sx: { borderRadius: 3 }
                    }
                  }}
                />

                <TextField
                  fullWidth label="Password" variant="outlined" type={showPassword ? "text" : "password"} name="password"
                  value={form.password} onChange={handleChange} disabled={loading} placeholder="Min. 8 characters"
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><LockOutlinedIcon color="action" /></InputAdornment>,
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton 
                          onClick={(e) => {
                            // Preserves input cursor position upon toggle
                            const input = e.currentTarget.closest('.MuiInputBase-root')?.querySelector('input');
                            const start = input?.selectionStart;
                            const end = input?.selectionEnd;
                            setShowPassword(!showPassword);
                            setTimeout(() => {
                              if (input && start !== null && end !== null) {
                                input.focus();
                                input.setSelectionRange(start, end);
                              }
                            }, 0);
                          }} 
                          edge="end" 
                          disabled={loading}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                    sx: { borderRadius: 3 }
                  }}
                  slotProps={{
                    input: {
                      startAdornment: <InputAdornment position="start"><LockOutlinedIcon color="action" /></InputAdornment>,
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton 
                            onClick={(e) => {
                              const input = e.currentTarget.closest('.MuiInputBase-root')?.querySelector('input');
                              const start = input?.selectionStart;
                              const end = input?.selectionEnd;
                              setShowPassword(!showPassword);
                              setTimeout(() => {
                                if (input && start !== null && end !== null) {
                                  input.focus();
                                  input.setSelectionRange(start, end);
                                }
                              }, 0);
                            }} 
                            edge="end" 
                            disabled={loading}
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                      sx: { borderRadius: 3 }
                    }
                  }}
                />

                {/* Password Strength Meter UI */}
                {form.password && (
                  <Box sx={{ mt: 1, mb: 1, px: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                      <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                        Password Strength: <Box component="span" sx={{ color: strength.color }}>{strength.text}</Box>
                      </Typography>
                    </Box>
                    <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full transition-all duration-300 rounded-full"
                        style={{ 
                          width: `${(strength.score / 5) * 100}%`, 
                          backgroundColor: strength.color 
                        }}
                      />
                    </div>
                    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0.5, mt: 1 }}>
                      <Typography variant="caption" sx={{ color: strength.checklist.minLength ? "success.main" : "text.disabled", display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        {strength.checklist.minLength ? "✓" : "○"} Min. 8 characters
                      </Typography>
                      <Typography variant="caption" sx={{ color: strength.checklist.upper ? "success.main" : "text.disabled", display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        {strength.checklist.upper ? "✓" : "○"} 1 uppercase letter
                      </Typography>
                      <Typography variant="caption" sx={{ color: strength.checklist.lower ? "success.main" : "text.disabled", display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        {strength.checklist.lower ? "✓" : "○"} 1 lowercase letter
                      </Typography>
                      <Typography variant="caption" sx={{ color: strength.checklist.number ? "success.main" : "text.disabled", display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        {strength.checklist.number ? "✓" : "○"} 1 number
                      </Typography>
                      <Typography variant="caption" sx={{ color: strength.checklist.special ? "success.main" : "text.disabled", display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        {strength.checklist.special ? "✓" : "○"} 1 special char (@$!%*?&)
                      </Typography>
                    </Box>
                  </Box>
                )}

                <TextField
                  fullWidth label="Confirm Password" variant="outlined" type={showConfirmPassword ? "text" : "password"} name="confirmPassword"
                  value={form.confirmPassword} onChange={handleChange} disabled={loading}
                  InputProps={{ 
                    startAdornment: <InputAdornment position="start"><LockOutlinedIcon color="action" /></InputAdornment>,
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton 
                          onClick={(e) => {
                            // Preserves input cursor position upon toggle
                            const input = e.currentTarget.closest('.MuiInputBase-root')?.querySelector('input');
                            const start = input?.selectionStart;
                            const end = input?.selectionEnd;
                            setShowConfirmPassword(!showConfirmPassword);
                            setTimeout(() => {
                              if (input && start !== null && end !== null) {
                                input.focus();
                                input.setSelectionRange(start, end);
                              }
                            }, 0);
                          }} 
                          edge="end" 
                          disabled={loading}
                        >
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                    sx: { borderRadius: 3 } 
                  }}
                  slotProps={{
                    input: {
                      startAdornment: <InputAdornment position="start"><LockOutlinedIcon color="action" /></InputAdornment>,
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton 
                            onClick={(e) => {
                              const input = e.currentTarget.closest('.MuiInputBase-root')?.querySelector('input');
                              const start = input?.selectionStart;
                              const end = input?.selectionEnd;
                              setShowConfirmPassword(!showConfirmPassword);
                              setTimeout(() => {
                                if (input && start !== null && end !== null) {
                                  input.focus();
                                  input.setSelectionRange(start, end);
                                }
                              }, 0);
                            }} 
                            edge="end" 
                            disabled={loading}
                          >
                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                      sx: { borderRadius: 3 }
                    }
                  }}
                />

                <Box sx={{ mt: 3, mb: 4 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 1.5, color: 'text.secondary' }}>I want to join as:</Typography>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { value: "USER", label: "Donor", icon: "💝", desc: "Donate" },
                      { value: "VOLUNTEER", label: "Volunteer", icon: "🤝", desc: "Join" },
                      { value: "APPLICANT", label: "Applicant", icon: "🏥", desc: "Assistance" },
                    ].map((opt) => (
                      <button
                        key={opt.value} type="button" onClick={() => setForm((prev) => ({ ...prev, role: opt.value }))}
                        className={`flex flex-col items-center justify-center p-2.5 rounded-2xl border-2 transition-all duration-200 text-center ${
                          form.role === opt.value ? "border-primary bg-primary/5 shadow-inner" : "border-gray-100 hover:border-gray-300 bg-white"
                        }`}
                      >
                        <span className="text-lg mb-1">{opt.icon}</span>
                        <Typography variant="caption" sx={{ fontWeight: 700, fontSize: '0.7rem', color: form.role === opt.value ? "primary.main" : "text.secondary" }}>{opt.label}</Typography>
                        <Typography variant="caption" sx={{ fontSize: '0.6rem', color: 'text.disabled', lineHeight: 1 }}>{opt.desc}</Typography>
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

                {/* google oauth division */}
                <div className="flex items-center gap-3 my-4">
                  <div className="h-px flex-1 bg-gray-200" />
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>OR</Typography>
                  <div className="h-px flex-1 bg-gray-200" />
                </div>

                <Button
                  fullWidth
                  variant="outlined"
                  size="large"
                  href={`${getBackendUrl().replace(/\/api$/, '')}/oauth2/authorization/google`}
                  sx={{
                    py: 1.2,
                    borderRadius: 3,
                    borderColor: '#dadce0',
                    color: '#3c4043',
                    fontWeight: 600,
                    textTransform: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 1.5,
                    boxShadow: 'none',
                    backgroundColor: '#fff',
                    '&:hover': {
                      borderColor: '#dadce0',
                      backgroundColor: 'rgba(60,64,67,0.04)'
                    }
                  }}
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                  </svg>
                  Continue with Google
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
