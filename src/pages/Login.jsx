import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { pageVariants, pageTransition } from "../constants/motionVariants";
import { useAuth } from "../hooks/useAuth";
import { TextField, Button, Card, Typography, InputAdornment, IconButton, Alert, CircularProgress, Box } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import { getBackendUrl } from "../utils";
import authService from "../services/authService";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [oauthHydrating, setOauthHydrating] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login, oauthLogin } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const verified = searchParams.get("verified");
    const errType = searchParams.get("error");
    const oauthSuccess = searchParams.get("oauth_success");

    // Hydrate session if redirected from successful Google OAuth
    if (oauthSuccess === "true") {
      setOauthHydrating(true);

      const token = searchParams.get("token");
      const oauthName = searchParams.get("name");
      const oauthEmail = searchParams.get("email");
      const oauthRole = searchParams.get("role");

      if (token && oauthEmail) {
        // Token was passed directly in the URL (cross-origin / Vercel deployment)
        const userObj = {
          name: oauthName || "",
          email: oauthEmail,
          role: oauthRole || "USER",
        };
        // Store the JWT token so future API requests include Authorization header
        localStorage.setItem("trustcore_access_token", token);
        oauthLogin(token, null, userObj);

        // Clean the URL before navigating
        if (oauthRole === "ADMIN") {
          navigate("/admin", { replace: true });
        } else if (oauthRole === "VOLUNTEER") {
          navigate("/dashboard/volunteer", { replace: true });
        } else if (oauthRole === "APPLICANT") {
          navigate("/dashboard/applicant", { replace: true });
        } else {
          navigate("/dashboard", { replace: true });
        }
        return;
      }

      // Fallback: same-origin / localhost — cookies are available, fetch user via /auth/me
      authService.getMe()
        .then((userObj) => {
          oauthLogin(null, null, userObj);
          
          // Dynamic dashboard routing depending on roles
          if (userObj.role === "ADMIN") {
            navigate("/admin");
          } else if (userObj.role === "VOLUNTEER") {
            navigate("/dashboard/volunteer");
          } else if (userObj.role === "APPLICANT") {
            navigate("/dashboard/applicant");
          } else {
            navigate("/dashboard");
          }
        })
        .catch((err) => {
          console.error("Failed to complete Google sign-in session hydration:", err);
          setError("Failed to complete Google sign-in. Please try again.");
          setOauthHydrating(false);
        });
      return;
    }

    if (verified === "true") {
      setSuccess("Your email address has been successfully verified! You can now sign in.");
    } else if (errType === "invalid") {
      setError("The verification link is invalid or expired. Please check your inbox or request a new link.");
    } else if (errType === "oauth_failed") {
      setError("Google OAuth login failed. Please try again.");
    }
  }, [searchParams, oauthLogin, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

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
      } else if (user.role === "APPLICANT") {
        navigate("/dashboard/applicant");
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

  if (oauthHydrating) {
    return (
      <div className="min-h-[85vh] flex flex-col items-center justify-center bg-gray-50/50 gap-4">
        <CircularProgress size={48} color="primary" />
        <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 600 }}>
          Completing sign-in with Google...
        </Typography>
      </div>
    );
  }

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

            {success && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mb-6">
                <Alert severity="success" sx={{ borderRadius: 2 }}>{success}</Alert>
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
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <AlternateEmailIcon color="action" />
                      </InputAdornment>
                    ),
                    sx: { borderRadius: 3 }
                  }
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
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockOutlinedIcon color="action" />
                      </InputAdornment>
                    ),
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
                  }
                }}
              />

              <div className="flex justify-end text-xs mt-1">
                <Link to="/forgot-password" className="text-primary font-bold hover:underline">
                  Forgot Password?
                </Link>
              </div>

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
