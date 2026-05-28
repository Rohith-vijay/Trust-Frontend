import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { pageVariants, pageTransition } from "../constants/motionVariants";
import { useAuth } from "../hooks/useAuth";
import databaseService from "../services/databaseService";
import {
  Typography,
  Card,
  CardContent,
  Tabs,
  Tab,
  Box,
  TextField,
  Button,
  MenuItem,
  CircularProgress,
  Dialog,
  DialogContent,
  Grid,
  Divider,
  Alert,
} from "@mui/material";
import QrCode2Icon from "@mui/icons-material/QrCode2";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import DownloadIcon from "@mui/icons-material/Download";
import RefreshIcon from "@mui/icons-material/Refresh";

// Presets for the checkout
const PRESETS = [500, 1000, 2500, 5000];

function Donation() {
  const { user } = useAuth();
  
  // Form states
  const [amount, setAmount] = useState("");
  const [donorName, setDonorName] = useState(user?.name || "");
  const [donorEmail, setDonorEmail] = useState(user?.email || "");
  const [message, setMessage] = useState("");
  const [eventId, setEventId] = useState("");
  const [events, setEvents] = useState([]);
  const [donorPan, setDonorPan] = useState("");
  const [donorAddress, setDonorAddress] = useState("");
  const [panError, setPanError] = useState("");
  
  // UI Flow states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Razorpay Checkout Session Context
  const [checkoutData, setCheckoutData] = useState(null); // { orderId, amount, currency, key, donationId }
  const [showSimulator, setShowSimulator] = useState(false);
  const [simulatorTab, setSimulatorTab] = useState(0);
  
  // Post-payment Outcomes
  const [successReceipt, setSuccessReceipt] = useState(null); // { receiptNumber, amount, transactionId, donorName, donorEmail, message }
  const [paymentFailed, setPaymentFailed] = useState(false);
  const [failureReason, setFailureReason] = useState("");

  // Fetch events list on mount
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await databaseService.getEvents(0, 100);
        // Res might be Spring Page object with `content` array
        if (res && res.content) {
          setEvents(res.content.filter(e => e.status !== "COMPLETED"));
        } else if (Array.isArray(res)) {
          setEvents(res.filter(e => e.status !== "COMPLETED"));
        }
      } catch (err) {
        console.error("[DonationPage] Failed to fetch events:", err);
      }
    };
    fetchEvents();
  }, []);

  // Update donor credentials if user signs in later
  useEffect(() => {
    if (user) {
      setDonorName(user.name || "");
      setDonorEmail(user.email || "");
    }
  }, [user]);

  // Handle Preset Click
  const handlePreset = (val) => {
    setAmount(val.toString());
  };

  // PAN validation (India 80G format)
  const validatePan = (pan) => {
    if (!pan) return true; // optional
    return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan.toUpperCase());
  };

  const handlePanChange = (e) => {
    const val = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 10);
    setDonorPan(val);
    if (val.length > 0) {
      setPanError(validatePan(val) ? "" : "Format: 5 letters, 4 digits, 1 letter (e.g. ABCDE1234F)");
    } else {
      setPanError("");
    }
  };

  // Download PDF Receipt handler
  const handleDownloadReceipt = async (donationId) => {
    try {
      const blob = await databaseService.downloadDonationReceipt(donationId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `receipt-${donationId}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Receipt download failed, falling back to print:', err);
      window.print();
    }
  };

  // ─── STAGE 1: SUBMIT CHECKOUT FORM ───
  const handleInitiateDonation = async (e) => {
    e.preventDefault();
    setError("");
    setPaymentFailed(false);
    
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError("Please enter a valid donation amount greater than 0.");
      return;
    }
    if (!donorName.trim()) {
      setError("Please specify the donor's full name.");
      return;
    }
    if (!donorEmail.trim()) {
      setError("Please specify a valid contact email.");
      return;
    }

    setLoading(true);
    try {
      // 1. Create a Pending Donation Record on backend
      const donationPayload = {
        amount: parsedAmount,
        donorName,
        donorEmail,
        message: message.trim() || null,
        eventId: eventId ? parseInt(eventId) : null,
        donorPan: donorPan.trim() || null,
        donorAddress: donorAddress.trim() || null,
      };
      
      const donationResponse = await databaseService.createDonation(donationPayload);
      const donationId = donationResponse.id;

      // 2. Request a Razorpay Order
      const orderResponse = await databaseService.createPaymentOrder(donationId);

      // Save checkout settings
      const session = {
        donationId,
        orderId: orderResponse.orderId,
        amount: orderResponse.amount,
        currency: orderResponse.currency,
        key: orderResponse.key,
      };

      setCheckoutData(session);

      // 3. Handshake: Trigger real popup or Sandboxed QA simulator
      if (orderResponse.key && (orderResponse.key === "dev_razorpay_key" || orderResponse.key === "dummy")) {
        // Mock Sandbox Trigger
        setShowSimulator(true);
      } else {
        // Real Razorpay integration
        loadRealRazorpayCheckout(session);
      }
    } catch (err) {
      console.error("[DonationPage] Initiation failed:", err);
      setError(err.response?.data?.message || err.message || "Checkout initiation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ─── DYNAMIC SCRIPT LOAD FOR ACTIVE KEY ───
  const loadRealRazorpayCheckout = (session) => {
    // Check if script is already present
    if (document.getElementById("razorpay-checkout-script")) {
      openRealRazorpayPopup(session);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.id = "razorpay-checkout-script";
    script.async = true;
    script.onload = () => openRealRazorpayPopup(session);
    script.onerror = () => {
      setError("Failed to load Razorpay secure checkout script. Please check your network.");
    };
    document.body.appendChild(script);
  };

  const openRealRazorpayPopup = (session) => {
    const options = {
      key: session.key,
      amount: session.amount,
      currency: session.currency,
      name: "K.V.G Shanmuka Sai Trust",
      description: "Support Our Community Mission",
      order_id: session.orderId,
      prefill: {
        name: donorName,
        email: donorEmail,
      },
      handler: async function (response) {
        setLoading(true);
        try {
          // Cryptographic verification packet
          const verifyPayload = {
            donationId: session.donationId,
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
          };
          
          await databaseService.verifyPayment(verifyPayload);

          // Success Outcome
          setSuccessReceipt({
            receiptNumber: "REC-" + Date.now().toString().substring(5),
            amount: parseFloat(amount),
            transactionId: response.razorpay_payment_id,
            donorName,
            donorEmail,
            message: message.trim(),
            date: new Date().toLocaleDateString("en-IN", {
              day: "numeric",
              month: "long",
              year: "numeric",
            }),
          });
        } catch (err) {
          console.error("[DonationPage] Real Payment verify failed:", err);
          setPaymentFailed(true);
          setFailureReason(err.response?.data?.message || err.message || "Cryptographic signature validation failed.");
        } finally {
          setLoading(false);
        }
      },
      modal: {
        ondismiss: function () {
          setLoading(false);
          setError("Checkout popup closed. Transaction pending secure retry.");
        },
      },
      theme: {
        color: "#B07A3F",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  // ─── SIMULATOR QA TRANSACTION ENGINE ───
  const triggerSandboxAction = async (outcome) => {
    setShowSimulator(false);
    setLoading(true);
    setError("");

    if (outcome === "CANCEL") {
      setLoading(false);
      setError("Payment cancelled by the user. Feel free to adjust the amount or retry.");
      return;
    }

    if (outcome === "FAILURE") {
      setTimeout(() => {
        setLoading(false);
        setPaymentFailed(true);
        setFailureReason("Declined by issuing bank (Insufficient sandbox funds - Error Code: 402)");
      }, 1000);
      return;
    }

    if (outcome === "TIMEOUT") {
      setTimeout(() => {
        setLoading(false);
        setPaymentFailed(true);
        setFailureReason("Transaction timed out (Gateway connection threshold exceeded - Try again)");
      }, 1200);
      return;
    }

    // Success outcome
    try {
      const mockPaymentId = "pay_mock_" + Math.random().toString(36).substring(2, 10).toUpperCase();
      const mockVerifyPayload = {
        donationId: checkoutData.donationId,
        razorpayOrderId: checkoutData.orderId,
        razorpayPaymentId: mockPaymentId,
        razorpaySignature: "signature_mock_" + Math.random().toString(36).substring(2, 15),
      };

      await databaseService.verifyPayment(mockVerifyPayload);

      setSuccessReceipt({
        receiptNumber: "REC-MOCK-" + Math.random().toString(36).substring(2, 8).toUpperCase(),
        amount: parseFloat(amount),
        transactionId: mockPaymentId,
        donorName,
        donorEmail,
        message: message.trim(),
        date: new Date().toLocaleDateString("en-IN", {
          day: "numeric",
          month: "long",
          year: "numeric",
        }),
      });
    } catch (err) {
      console.error("[DonationPage] Mock verify call failed:", err);
      setPaymentFailed(true);
      setFailureReason(err.response?.data?.message || err.message || "Mock payment verification failed.");
    } finally {
      setLoading(false);
    }
  };

  // ─── PRINT ACKNOWLEDGEMENT TAX INVOICE ───
  const handlePrintReceipt = () => {
    window.print();
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={pageTransition}
      className="py-24 min-h-screen bg-gray-50/50"
    >
      <div className="max-w-4xl mx-auto px-6 print:p-0">
        
        {/* Header (Hidden when printing invoice) */}
        {!successReceipt && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 print:hidden"
          >
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-5 select-none">
              <VolunteerActivismIcon color="primary" sx={{ fontSize: 32 }} />
            </div>
            <Typography
              variant="h3"
              component="h1"
              sx={{ fontWeight: 900, color: "primary.main", mb: 2, fontSize: { xs: "2rem", md: "3rem" }, tracking: "-0.5px" }}
            >
              Support Our Mission
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 500, mx: "auto", fontWeight: 500 }}>
              Your contributions provide clean drinking water, village schooling, and operational transparency across rural districts.
            </Typography>
          </motion.div>
        )}

        {/* ─── CASE A: SUCCESS RECEIPT & 80G EXEMPTION CARD ─── */}
        {successReceipt ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-2xl mx-auto"
          >
            <Card
              elevation={0}
              sx={{
                borderRadius: 6,
                boxShadow: "0 20px 40px rgba(0,0,0,0.06)",
                border: "1px solid rgba(176,122,63,0.15)",
                overflow: "hidden",
                bgcolor: "white",
              }}
            >
              {/* Success Badge */}
              <Box className="bg-emerald-500/10 text-emerald-800 text-center py-8 px-4 flex flex-col items-center justify-center border-b border-emerald-500/15 print:hidden">
                <CheckCircleIcon color="success" sx={{ fontSize: 56, mb: 1.5 }} />
                <Typography variant="h5" sx={{ fontWeight: 800 }}>Donation Completed Successfully</Typography>
                <Typography variant="caption" className="opacity-85 font-semibold mt-1">
                  Thank you for your generosity! An 80G tax receipt has been generated below.
                </Typography>
              </Box>

              <CardContent className="p-8 md:p-12 print:p-0">
                {/* Official Invoice Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-gray-100 pb-6 mb-8 print:border-b-2 print:border-black">
                  <div>
                    <Typography variant="h6" sx={{ fontWeight: 900, color: "primary.main" }}>
                      K.V.G SHANMUKA SAI CHARITABLE TRUST
                    </Typography>
                    <Typography variant="caption" color="text.secondary" className="block font-bold">
                      Nagpur, Maharashtra, India • Govt Registration Code: NGO-TRUST-4122
                    </Typography>
                  </div>
                  <div className="text-right">
                    <Typography variant="subtitle2" sx={{ fontWeight: 800 }} className="text-brand-navy-dark">
                      DONATION RECEIPT
                    </Typography>
                    <Typography variant="caption" color="text.secondary" className="block font-mono font-bold mt-0.5">
                      {successReceipt.receiptNumber}
                    </Typography>
                  </div>
                </div>

                {/* Receipt Grid */}
                <Grid container spacing={4} className="mb-8">
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" color="text.disabled" className="font-black uppercase tracking-wider block mb-1">Donor Details</Typography>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800 }} className="text-gray-800">{successReceipt.donorName}</Typography>
                    <Typography variant="body2" color="text.secondary" className="font-semibold">{successReceipt.donorEmail}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" color="text.disabled" className="font-black uppercase tracking-wider block mb-1">Transaction Details</Typography>
                    <Typography variant="body2" className="font-semibold">
                      Payment ID: <span className="font-mono text-gray-800 font-bold">{successReceipt.transactionId}</span>
                    </Typography>
                    <Typography variant="body2" className="font-semibold">
                      Date: <span className="font-bold text-gray-800">{successReceipt.date}</span>
                    </Typography>
                  </Grid>
                </Grid>

                {/* Exemption Notice box */}
                <Box className="bg-amber-500/5 border border-amber-500/10 rounded-2xl p-5 mb-8 print:border print:border-black">
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "primary.main", mb: 0.5 }}>
                    80G Tax Exemption Certificate Exemption Acknowledgement
                  </Typography>
                  <Typography variant="caption" color="text.secondary" className="leading-relaxed block font-medium">
                    This receipt serves as official proof of donation towards K.V.G Shanmuka Sai Charitable Trust. Under Section 80G of the Income Tax Act, 1961, 50% of this contribution is eligible for a tax deduction. PAN registration will be automatically reconciled.
                  </Typography>
                </Box>

                <Divider className="mb-6 print:border-t-2 print:border-black" />

                {/* Total box */}
                <div className="flex justify-between items-center bg-gray-50/50 rounded-2xl p-5 border border-gray-100 print:bg-none print:border-none print:p-0">
                  <div>
                    <Typography variant="subtitle2" className="font-bold text-gray-400">Total Gift Amount</Typography>
                    {successReceipt.message && (
                      <Typography variant="caption" color="text.secondary" className="italic mt-1 block">
                        Message: "{successReceipt.message}"
                      </Typography>
                    )}
                  </div>
                  <Typography variant="h4" sx={{ fontWeight: 900, color: "primary.main" }}>
                    ₹{successReceipt.amount.toLocaleString("en-IN")}
                  </Typography>
                </div>

                {/* Action buttons (Hidden when printing) */}
                <div className="flex flex-col sm:flex-row gap-4 mt-10 print:hidden">
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    startIcon={<DownloadIcon />}
                    onClick={() => handleDownloadReceipt(checkoutData?.donationId)}
                    sx={{ py: 1.5, borderRadius: 4, fontWeight: 700, textTransform: "none" }}
                  >
                    Download PDF Receipt
                  </Button>
                  <Button
                    fullWidth
                    variant="outlined"
                    color="primary"
                    startIcon={<DownloadIcon />}
                    onClick={handlePrintReceipt}
                    sx={{ py: 1.5, borderRadius: 4, fontWeight: 700, textTransform: "none" }}
                  >
                    Print Receipt
                  </Button>
                  <Button
                    fullWidth
                    variant="outlined"
                    color="inherit"
                    onClick={() => {
                      setSuccessReceipt(null);
                      setAmount("");
                      setMessage("");
                      setDonorPan("");
                      setDonorAddress("");
                    }}
                    sx={{ py: 1.5, borderRadius: 4, fontWeight: 700, textTransform: "none" }}
                  >
                    Donate Again
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          /* ─── CASE B: STANDARD DONATION FORM ─── */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full max-w-xl mx-auto print:hidden"
          >
            <Card
              elevation={0}
              sx={{
                borderRadius: 6,
                p: { xs: 4, sm: 5 },
                boxShadow: "0 20px 40px rgba(0,0,0,0.06)",
                border: "1px solid rgba(0,0,0,0.05)",
                bgcolor: "white",
              }}
            >
              <form onSubmit={handleInitiateDonation} className="space-y-6">
                
                {/* Exposing general error alerts */}
                {error && (
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                    <Alert severity="error" sx={{ borderRadius: 3 }}>{error}</Alert>
                  </motion.div>
                )}

                {/* Exposing payment failure retry boxes */}
                {paymentFailed && (
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                    <Alert
                      severity="warning"
                      sx={{ borderRadius: 3 }}
                      action={
                        <Button color="inherit" size="small" onClick={() => setPaymentFailed(false)}>
                          Dismiss
                        </Button>
                      }
                    >
                      <Typography variant="subtitle2" sx={{ fontWeight: 800 }} className="leading-tight">
                        Payment Verification Failed
                      </Typography>
                      <Typography variant="caption" className="opacity-90 leading-normal block">
                        Reason: {failureReason}
                      </Typography>
                    </Alert>
                  </motion.div>
                )}

                {/* Amount input */}
                <div>
                  <Typography variant="body2" sx={{ fontWeight: 700, mb: 1.5, color: "text.primary" }}>
                    Select Donation Amount (INR)
                  </Typography>
                  <div className="grid grid-cols-4 gap-3 mb-4">
                    {PRESETS.map((val) => (
                      <Button
                        key={val}
                        type="button"
                        variant={amount === val.toString() ? "contained" : "outlined"}
                        onClick={() => handlePreset(val)}
                        sx={{
                          py: 1,
                          borderRadius: 3,
                          fontWeight: 700,
                          textTransform: "none",
                          fontSize: "0.9rem",
                        }}
                      >
                        ₹{val.toLocaleString("en-IN")}
                      </Button>
                    ))}
                  </div>
                  <TextField
                    fullWidth
                    label="Custom Amount (₹)"
                    variant="outlined"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    disabled={loading}
                    InputProps={{ sx: { borderRadius: 3, fontWeight: 700 } }}
                  />
                </div>

                {/* Optional Events Select */}
                <div>
                  <Typography variant="body2" sx={{ fontWeight: 700, mb: 1.5, color: "text.primary" }}>
                    Choose Initiative to Support (Optional)
                  </Typography>
                  <TextField
                    select
                    fullWidth
                    label="Select Campaign / Project"
                    value={eventId}
                    onChange={(e) => setEventId(e.target.value)}
                    disabled={loading}
                    InputProps={{ sx: { borderRadius: 3 } }}
                  >
                    <MenuItem value="">General/Unallocated Contribution</MenuItem>
                    {events.map((e) => (
                      <MenuItem key={e.id} value={e.id != null ? e.id.toString() : ""}>
                        {e.title}
                      </MenuItem>
                    ))}
                  </TextField>
                </div>

                <Divider className="my-2" />

                {/* Donor Prefill Credentials */}
                <div>
                  <Typography variant="body2" sx={{ fontWeight: 700, mb: 1.5, color: "text.primary" }}>
                    Donor Details
                  </Typography>
                  <div className="space-y-4">
                    <TextField
                      fullWidth
                      label="Full Name"
                      variant="outlined"
                      value={donorName}
                      onChange={(e) => setDonorName(e.target.value)}
                      disabled={loading || user !== null}
                      InputProps={{ sx: { borderRadius: 3 } }}
                      helperText={user ? "Sealed to your authenticated session profile." : ""}
                    />
                    <TextField
                      fullWidth
                      label="Email Address"
                      variant="outlined"
                      type="email"
                      value={donorEmail}
                      onChange={(e) => setDonorEmail(e.target.value)}
                      disabled={loading || user !== null}
                      InputProps={{ sx: { borderRadius: 3 } }}
                    />

                    {/* PAN Card (80G Compliance) */}
                    <div className="space-y-1">
                      <TextField
                        fullWidth
                        label="PAN Card Number (For 80G Tax Exemption)"
                        variant="outlined"
                        value={donorPan}
                        onChange={handlePanChange}
                        disabled={loading}
                        error={!!panError}
                        helperText={panError || "Optional. Providing PAN enables 50% income tax deduction under Sec. 80G."}
                        InputProps={{ sx: { borderRadius: 3, fontFamily: 'monospace', letterSpacing: 2 } }}
                        inputProps={{ maxLength: 10, style: { textTransform: 'uppercase' } }}
                        placeholder="ABCDE1234F"
                      />
                    </div>

                    {/* Address (80G Compliance) */}
                    <TextField
                      fullWidth
                      label="Full Postal Address (For 80G Filing)"
                      variant="outlined"
                      multiline
                      rows={2}
                      value={donorAddress}
                      onChange={(e) => setDonorAddress(e.target.value)}
                      disabled={loading}
                      InputProps={{ sx: { borderRadius: 3 } }}
                      helperText="Optional. Required if PAN is provided for Form 10BD filing."
                    />
                  </div>
                </div>

                {/* Message */}
                <TextField
                  fullWidth
                  label="Add a short message of encouragement (Optional)"
                  variant="outlined"
                  multiline
                  rows={2}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  disabled={loading}
                  InputProps={{ sx: { borderRadius: 3 } }}
                />

                {/* Submit button */}
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  size="large"
                  type="submit"
                  disabled={loading}
                  sx={{
                    py: 1.8,
                    borderRadius: 3,
                    fontWeight: 700,
                    textTransform: "none",
                    fontSize: "1.1rem",
                    boxShadow: "0 8px 20px rgba(176,122,63,0.15)",
                  }}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <CircularProgress size={20} color="inherit" />
                      <span>Initiating Secure Portal...</span>
                    </div>
                  ) : (
                    "Proceed to Secure Payment"
                  )}
                </Button>

              </form>
            </Card>
          </motion.div>
        )}

      </div>

      {/* ─── DUAL CHECKOUT MOCK SANDBOX SIMULATOR DIALOG ─── */}
      <Dialog
        open={showSimulator}
        onClose={() => triggerSandboxAction("CANCEL")}
        maxWidth="xs"
        fullWidth
        scroll="paper"
        PaperProps={{
          sx: { borderRadius: 6, overflow: "hidden", p: 0, boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)" },
        }}
      >
        {/* Custom Razorpay Simulation Branding */}
        <Box className="bg-[#1F2937] text-white p-5 flex justify-between items-center">
          <div>
            <Typography variant="caption" className="uppercase font-bold tracking-widest text-[#6366F1] block mb-0.5">
              Razorpay Sandbox QA Mode
            </Typography>
            <Typography variant="subtitle1" className="font-extrabold flex items-center gap-1">
              <span>💳</span> K.V.G Shanmuka Sai Trust
            </Typography>
          </div>
          <div className="text-right">
            <Typography variant="body2" className="font-black text-emerald-400">
              ₹{parseFloat(amount || "0").toLocaleString("en-IN")}
            </Typography>
            <Typography variant="caption" className="opacity-50 block font-mono text-[9px] uppercase">
              {checkoutData?.orderId}
            </Typography>
          </div>
        </Box>

        {/* Tab system mirroring Razorpay */}
        <Box sx={{ borderBottom: 1, borderColor: "divider", bgcolor: "gray.50" }}>
          <Tabs
            value={simulatorTab}
            onChange={(e, val) => setSimulatorTab(val)}
            variant="fullWidth"
            sx={{ minHeight: 48 }}
          >
            <Tab icon={<CreditCardIcon sx={{ fontSize: 18 }} />} label="Card" sx={{ textTransform: "none", fontWeight: 700, fontSize: "0.85rem", minHeight: 48 }} />
            <Tab icon={<QrCode2Icon sx={{ fontSize: 18 }} />} label="UPI/QR" sx={{ textTransform: "none", fontWeight: 700, fontSize: "0.85rem", minHeight: 48 }} />
            <Tab icon={<AccountBalanceIcon sx={{ fontSize: 18 }} />} label="NetBank" sx={{ textTransform: "none", fontWeight: 700, fontSize: "0.85rem", minHeight: 48 }} />
          </Tabs>
        </Box>

        <DialogContent sx={{ p: 4, minHeight: 220 }} className="flex flex-col justify-between">
          
          <AnimatePresence mode="wait">
            
            {/* Tab 1: CARD SIMULATION */}
            {simulatorTab === 0 && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-4"
              >
                <Alert severity="info" sx={{ py: 0.5, borderRadius: 2 }} className="font-bold text-[11px] leading-tight">
                  Simulating Visa Test Card: 4111 • 1111 • 1111 • 1111
                </Alert>
                <div className="space-y-3">
                  <TextField fullWidth label="Card Number" value="4111 1111 1111 1111" disabled size="small" InputProps={{ sx: { borderRadius: 2, fontClass: "font-mono" } }} />
                  <div className="grid grid-cols-2 gap-3">
                    <TextField label="Expiry MM/YY" value="12/30" disabled size="small" InputProps={{ sx: { borderRadius: 2 } }} />
                    <TextField label="CVV" value="•••" disabled size="small" InputProps={{ sx: { borderRadius: 2 } }} />
                  </div>
                </div>
                <div className="space-y-2 pt-2">
                  <Button
                    fullWidth
                    variant="contained"
                    color="success"
                    onClick={() => triggerSandboxAction("SUCCESS")}
                    sx={{ py: 1, borderRadius: 2.5, fontWeight: 700, textTransform: "none" }}
                  >
                    Simulate Payment Success (Card)
                  </Button>
                  <Button
                    fullWidth
                    variant="outlined"
                    color="error"
                    onClick={() => triggerSandboxAction("FAILURE")}
                    sx={{ py: 1, borderRadius: 2.5, fontWeight: 700, textTransform: "none" }}
                  >
                    Simulate Card Decline (Fail)
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Tab 2: UPI / QR SIMULATION */}
            {simulatorTab === 1 && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-4"
              >
                <Alert severity="info" sx={{ py: 0.5, borderRadius: 2 }} className="font-bold text-[11px] leading-tight">
                  Simulating Instant VPA Handshake (UPI ID)
                </Alert>
                <TextField fullWidth label="Virtual Payment Address (VPA)" value="success@razorpay" disabled size="small" InputProps={{ sx: { borderRadius: 2 } }} />
                <div className="space-y-2 pt-2">
                  <Button
                    fullWidth
                    variant="contained"
                    color="success"
                    onClick={() => triggerSandboxAction("SUCCESS")}
                    sx={{ py: 1, borderRadius: 2.5, fontWeight: 700, textTransform: "none" }}
                  >
                    Simulate UPI Approve (Success)
                  </Button>
                  <Button
                    fullWidth
                    variant="outlined"
                    color="warning"
                    startIcon={<RefreshIcon className="animate-spin" />}
                    onClick={() => triggerSandboxAction("TIMEOUT")}
                    sx={{ py: 1, borderRadius: 2.5, fontWeight: 700, textTransform: "none" }}
                  >
                    Simulate Gateway Timeout (Delay)
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Tab 3: NETBANKING SIMULATION */}
            {simulatorTab === 2 && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-4"
              >
                <Alert severity="info" sx={{ py: 0.5, borderRadius: 2 }} className="font-bold text-[11px] leading-tight">
                  Select issuing NetBanking Institution
                </Alert>
                <TextField fullWidth select label="Sandbox Test Bank" value="sbi" disabled size="small" InputProps={{ sx: { borderRadius: 2 } }}>
                  <MenuItem value="sbi">State Bank of India (Test Mode)</MenuItem>
                </TextField>
                <div className="space-y-2 pt-4">
                  <Button
                    fullWidth
                    variant="contained"
                    color="success"
                    onClick={() => triggerSandboxAction("SUCCESS")}
                    sx={{ py: 1, borderRadius: 2.5, fontWeight: 700, textTransform: "none" }}
                  >
                    Simulate Bank Authorize (Success)
                  </Button>
                  <Button
                    fullWidth
                    variant="contained"
                    color="inherit"
                    onClick={() => triggerSandboxAction("CANCEL")}
                    sx={{ py: 1, borderRadius: 2.5, fontWeight: 700, textTransform: "none", bgcolor: "grey.100" }}
                  >
                    Simulate User Cancellation (Cancel)
                  </Button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}

export default Donation;
