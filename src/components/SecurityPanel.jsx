import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import api from "../services/api";
import { Card, Typography, Button, Alert, CircularProgress, Divider, Box } from "@mui/material";
import KeyIcon from "@mui/icons-material/Key";
import ShieldIcon from "@mui/icons-material/Shield";
import LockResetIcon from "@mui/icons-material/LockReset";

const SecurityPanel = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleTriggerReset = async () => {
    setLoading(true);
    setSuccess("");
    setError("");

    try {
      await api.post("/auth/forgot-password", { email: user?.email }, { skipGlobalToast: true });
      setSuccess(`A secure password reset link has been dispatched to ${user?.email}. Please check your inbox (and spam folder) and follow the instructions to set your new credentials.`);
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || "Failed to trigger password reset link. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card elevation={0} sx={{ p: 4, borderRadius: 5, border: "1px solid #eef2f6", boxShadow: "0 4px 20px rgba(0,0,0,0.02)" }}>
        <div className="flex items-start gap-4 mb-6">
          <div className="p-3 bg-amber-50 text-amber-700 rounded-2xl">
            <ShieldIcon fontSize="medium" />
          </div>
          <div>
            <Typography variant="h6" sx={{ fontWeight: 800, color: "text.primary" }}>Account Security</Typography>
            <Typography variant="body2" color="text.secondary">
              Review and manage your security settings and authentication details.
            </Typography>
          </div>
        </div>

        <Divider className="my-4" />

        <div className="space-y-4 my-6">
          <div className="flex justify-between items-center text-sm py-2">
            <span className="text-slate-500 font-medium">Authentication Provider</span>
            <span className="font-bold text-slate-800 capitalize bg-slate-100 px-3 py-1 rounded-full text-xs">
              {user?.provider || "Local Password"}
            </span>
          </div>
          <div className="flex justify-between items-center text-sm py-2">
            <span className="text-slate-500 font-medium">Registered Email Address</span>
            <span className="font-bold text-slate-800">{user?.email}</span>
          </div>
          <div className="flex justify-between items-center text-sm py-2">
            <span className="text-slate-500 font-medium">Session Token Validity</span>
            <span className="font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full text-xs">
              Active (15 Min Expiry)
            </span>
          </div>
        </div>
      </Card>

      <Card elevation={0} sx={{ p: 4, borderRadius: 5, border: "1px solid #eef2f6", boxShadow: "0 4px 20px rgba(0,0,0,0.02)" }}>
        <div className="flex items-start gap-4 mb-6">
          <div className="p-3 bg-amber-50 text-amber-700 rounded-2xl">
            <KeyIcon fontSize="medium" />
          </div>
          <div>
            <Typography variant="h6" sx={{ fontWeight: 800, color: "text.primary" }}>Update Password</Typography>
            <Typography variant="body2" color="text.secondary">
              Request a secure verification token to change your account password.
            </Typography>
          </div>
        </div>

        {success && <Alert severity="success" sx={{ borderRadius: 3, mb: 3 }}>{success}</Alert>}
        {error && <Alert severity="error" sx={{ borderRadius: 3, mb: 3 }}>{error}</Alert>}

        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            For security, KVGS Sai Charitable Trust requires email verification to change passwords. Clicking the button below will dispatch a one-time secure link to your inbox.
          </Typography>

          <Button
            variant="contained"
            color="primary"
            onClick={handleTriggerReset}
            disabled={loading}
            startIcon={<LockResetIcon />}
            sx={{
              py: 1.25,
              px: 4,
              borderRadius: 3,
              fontWeight: 700,
              textTransform: "none",
              fontSize: "0.9rem",
              boxShadow: "none"
            }}
          >
            {loading ? <CircularProgress size={20} color="inherit" /> : "Send Reset Link to Email"}
          </Button>
        </Box>
      </Card>
    </div>
  );
};

export default SecurityPanel;
