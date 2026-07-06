import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { pageVariants, pageTransition } from "../../constants/motionVariants";
import { useAuth } from "../../hooks/useAuth";
import databaseService from "../../services/databaseService";
import notificationService from "../../services/notificationService";
import MediaUploader from "../../components/MediaUploader";
import ErrorBoundary from "../../components/ErrorBoundary";
import { TextField, Button, Box, Typography, CircularProgress, Alert, MenuItem } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CancelIcon from "@mui/icons-material/Cancel";
import PendingIcon from "@mui/icons-material/Pending";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import SendIcon from "@mui/icons-material/Send";
import ChatIcon from "@mui/icons-material/Chat";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import PersonIcon from "@mui/icons-material/Person";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PeopleIcon from "@mui/icons-material/People";
import RequestQuoteIcon from "@mui/icons-material/RequestQuote";
import DescriptionIcon from "@mui/icons-material/Description";
import SaveIcon from "@mui/icons-material/Save";

const CATEGORIES = [
  { value: "EDUCATION", label: "Education Support" },
  { value: "MEDICAL", label: "Medical Assistance" },
  { value: "FINANCIAL", label: "Financial Aid" },
  { value: "FOOD", label: "Food Security" },
  { value: "EMERGENCY", label: "Emergency Relief" },
  { value: "ENVIRONMENT", label: "Environmental Help" },
  { value: "SKILL_DEVELOPMENT", label: "Skill Development" },
  { value: "OTHER", label: "Other Assistance" }
];

const STATUS_STEPS = [
  { status: "DRAFT", label: "Draft" },
  { status: "SUBMITTED", label: "Submitted" },
  { status: "UNDER_REVIEW", label: "Under Review" },
  { status: "DOCUMENT_VERIFICATION", label: "Doc Verification" },
  { status: "FIELD_VERIFICATION", label: "Field Verification" },
  { status: "COMMITTEE_REVIEW", label: "Committee Review" },
  { status: "APPROVED", label: "Approved" },
  { status: "AID_DISTRIBUTION", label: "Aid Distribution" },
  { status: "CLOSED", label: "Closed" }
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

const formatRupee = (value) => {
  if (value === null || value === undefined) return "₹0";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(value);
};

const ApplicantDashboard = () => {
  const { user } = useAuth();
  const [cases, setCases] = useState([]);
  const [selectedCaseNumber, setSelectedCaseNumber] = useState(null);
  const [activeCase, setActiveCase] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const formatDateTime = (dateStr, formatType = "datetime") => {
    if (!dateStr || dateStr === "null") return "N/A";
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return "N/A";
      if (formatType === "date") {
        return date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
      }
      if (formatType === "time") {
        return date.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" });
      }
      return date.toLocaleString("en-IN");
    } catch (e) {
      return "N/A";
    }
  };
  const [loading, setLoading] = useState(true);
  const [caseLoading, setCaseLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  // Wizard and Form State
  const [wizardStep, setWizardStep] = useState(1);
  const [form, setForm] = useState({
    fullName: user?.fullName || "",
    dob: "",
    age: "",
    gender: "Male",
    mobile: "",
    email: user?.email || "",
    aadhaar: "",
    pan: "",
    house: "",
    street: "",
    village: "",
    city: "",
    district: "",
    state: "",
    pincode: "",
    occupation: "",
    monthlyIncome: "",
    familyMembers: "",
    familyDependents: "",
    category: "MEDICAL",
    priority: "MEDIUM",
    title: "",
    description: "",
    estimatedCost: "",
    preferredContact: "Email"
  });
  const [uploadedDocs, setUploadedDocs] = useState([]); 
  const [submitError, setSubmitError] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Profile Edit State
  const [profileName, setProfileName] = useState(user?.fullName || "");
  const [profileLoading, setProfileLoading] = useState(false);

  // Chat window anchor ref
  const chatEndRef = useRef(null);
  const stompClientRef = useRef(null);

  const fetchCases = async () => {
    try {
      const res = await databaseService.getMyCases(0, 50);
      setCases(res.data?.content || res.content || []);
    } catch (err) {
      console.error("Failed to load applicant cases:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCases();
  }, []);

  // Autosave / load draft logic
  useEffect(() => {
    const savedDraft = localStorage.getItem("trust_assistance_draft");
    if (savedDraft) {
      try {
        setForm(JSON.parse(savedDraft));
      } catch (e) {
        console.error("Failed to parse draft", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("trust_assistance_draft", JSON.stringify(form));
  }, [form]);

  // WebSockets setup for real-time notifications
  useEffect(() => {
    if (!user?.email) return;

    const stompController = notificationService.connectWebSocket(
      user.email,
      (newAlert) => {
        if (newAlert.title.toLowerCase().includes("case") || newAlert.title.toLowerCase().includes("message")) {
          fetchCases();
          if (selectedCaseNumber) {
            loadCaseDetails(selectedCaseNumber);
          }
        }
      },
      (err) => console.error("Stomp error:", err)
    );

    stompClientRef.current = stompController;

    return () => {
      if (stompClientRef.current) {
        stompClientRef.current.disconnect();
      }
    };
  }, [user, selectedCaseNumber]);

  const loadCaseDetails = async (caseNum) => {
    setCaseLoading(true);
    try {
      const caseRes = await databaseService.getCaseDetails(caseNum);
      setActiveCase(caseRes.data || caseRes);
      
      const msgRes = await databaseService.getCaseMessages(caseNum);
      setMessages(msgRes.data || msgRes || []);
      
      setSelectedCaseNumber(caseNum);
      setActiveTab("details");
    } catch (err) {
      console.error("Failed to load case detail:", err);
    } finally {
      setCaseLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "details" && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, activeTab]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedCaseNumber) return;

    try {
      const sent = await databaseService.sendCaseMessage(selectedCaseNumber, newMessage, false);
      setMessages(prev => [...prev, sent.data || sent]);
      setNewMessage("");
    } catch (err) {
      console.error("Failed to send case message:", err);
    }
  };

  const handleCreateCase = async (isDraft = false) => {
    setSubmitError("");
    setSubmitLoading(true);

    if (!isDraft && (!form.title.trim() || !form.description.trim())) {
      setSubmitError("Please fill out Title and Description.");
      setSubmitLoading(false);
      return;
    }

    try {
      const caseRes = await databaseService.applyForAssistance({
        ...form,
        draft: isDraft
      });
      const newCase = caseRes.data || caseRes;

      if (uploadedDocs.length > 0) {
        for (const doc of uploadedDocs) {
          await databaseService.uploadCaseDocument(newCase.caseNumber, doc.name, doc.url, doc.publicId, doc.fileType);
        }
      }

      if (isDraft) {
        window.dispatchEvent(new CustomEvent("app-toast", {
          detail: { message: "Draft saved successfully!", severity: "success" }
        }));
      } else {
        setSubmitSuccess(true);
        setSelectedCaseNumber(newCase.caseNumber);
        localStorage.removeItem("trust_assistance_draft");
        setForm({
          fullName: user?.fullName || "",
          dob: "",
          age: "",
          gender: "Male",
          mobile: "",
          email: user?.email || "",
          aadhaar: "",
          pan: "",
          house: "",
          street: "",
          village: "",
          city: "",
          district: "",
          state: "",
          pincode: "",
          occupation: "",
          monthlyIncome: "",
          familyMembers: "",
          familyDependents: "",
          category: "MEDICAL",
          priority: "MEDIUM",
          title: "",
          description: "",
          estimatedCost: "",
          preferredContact: "Email"
        });
        setUploadedDocs([]);
        setWizardStep(1);
      }
      await fetchCases();
    } catch (err) {
      setSubmitError(err.response?.data?.message || err.message || "Failed to save request.");
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleAttachMoreDoc = async (metadata) => {
    if (!selectedCaseNumber) return;
    try {
      await databaseService.uploadCaseDocument(
        selectedCaseNumber,
        metadata.original_filename || "Attached Document",
        metadata.secure_url,
        metadata.public_id,
        metadata.format
      );
      loadCaseDetails(selectedCaseNumber);
      window.dispatchEvent(new CustomEvent("app-toast", {
        detail: { message: "Document attached successfully!", severity: "success" }
      }));
    } catch (err) {
      console.error("Document upload DB mapping failed", err);
    }
  };

  const handleDeleteAttachedDoc = async (docId) => {
    try {
      await databaseService.deleteCaseDocument(activeCase.caseNumber, docId);
      window.dispatchEvent(new CustomEvent("app-toast", {
        detail: { message: "Document deleted successfully!", severity: "success" }
      }));
      loadCaseDetails(activeCase.caseNumber);
    } catch (err) {
      console.error("Failed to delete document", err);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!profileName.trim()) return;
    setProfileLoading(true);
    try {
      await databaseService.updateUserProfile(profileName);
      window.dispatchEvent(new CustomEvent("app-toast", {
        detail: { message: "Profile updated successfully! Refreshing...", severity: "success" }
      }));
      setTimeout(() => window.location.reload(), 1000);
    } catch (err) {
      console.error("Failed to update profile", err);
    } finally {
      setProfileLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "DRAFT":
        return <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-xs font-bold border border-slate-200">Draft</span>;
      case "SUBMITTED":
        return <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-bold border border-gray-200">Submitted</span>;
      case "UNDER_REVIEW":
        return <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold border border-blue-200">Under Review</span>;
      case "DOCUMENT_VERIFICATION":
        return <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold border border-indigo-200">Document Verification</span>;
      case "FIELD_VERIFICATION":
        return <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-bold border border-purple-200">Field Verification</span>;
      case "COMMITTEE_REVIEW":
        return <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-bold border border-amber-200">Committee Review</span>;
      case "APPROVED":
        return <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold border border-green-200">Approved</span>;
      case "REJECTED":
        return <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold border border-red-200">Rejected</span>;
      case "AID_DISTRIBUTION":
        return <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-bold border border-orange-200">Aid Distribution</span>;
      case "RESOLVED":
        return <span className="bg-teal-100 text-teal-700 px-3 py-1 rounded-full text-xs font-bold border border-teal-200">Resolved</span>;
      case "CLOSED":
        return <span className="bg-slate-200 text-slate-800 px-3 py-1 rounded-full text-xs font-bold border border-slate-350">Closed</span>;
      default:
        return <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-bold">{status}</span>;
    }
  };

  const getPriorityBadge = (prio) => {
    switch (prio) {
      case "CRITICAL":
        return <span className="bg-rose-100 text-rose-800 px-2 py-0.5 rounded text-[10px] font-extrabold tracking-wider">CRITICAL</span>;
      case "HIGH":
        return <span className="bg-orange-100 text-orange-800 px-2 py-0.5 rounded text-[10px] font-extrabold tracking-wider">HIGH</span>;
      case "MEDIUM":
        return <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded text-[10px] font-extrabold tracking-wider">MEDIUM</span>;
      default:
        return <span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded text-[10px] font-extrabold tracking-wider">LOW</span>;
    }
  };

  const getStepIndex = (status) => {
    const idx = STATUS_STEPS.findIndex(step => step.status === status);
    if (idx !== -1) return idx;
    if (status === "REJECTED") return 6;
    if (status === "RESOLVED") return 8;
    return 0;
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={pageTransition}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen"
    >
      {/* Overview/Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            <span className="text-2xl p-2 bg-[#B07A3F] text-white rounded-xl shadow-lg">
              🏥
            </span>
            Assistance Applicant Portal
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Apply for support, track evaluations, upload verification documents, and chat with coordinators.
          </p>
        </div>

        <div className="flex bg-slate-200/60 p-1 rounded-xl gap-1 self-start md:self-auto border border-slate-300/30">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
              activeTab === "overview" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            📋 Overview
          </button>
          <button
            onClick={() => { setActiveTab("apply"); setSubmitSuccess(false); }}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
              activeTab === "apply" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            ➕ Apply For Assistance
          </button>
          {selectedCaseNumber && (
            <button
              onClick={() => setActiveTab("details")}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                activeTab === "details" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              🔎 Case details ({selectedCaseNumber})
            </button>
          )}
          <button
            onClick={() => setActiveTab("profile")}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
              activeTab === "profile" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            👤 Profile
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <CircularProgress color="primary" />
        </div>
      ) : (
        <AnimatePresence mode="wait">
          {/* OVERVIEW TAB */}
          {activeTab === "overview" && (
            <motion.div
              key="overview"
              variants={containerVariants}
              initial="hidden"
              animate="show"
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
                  <Typography variant="subtitle2" color="text.secondary" className="font-bold uppercase tracking-wider">Total Applications</Typography>
                  <Typography variant="h3" className="font-extrabold mt-2 text-slate-800">{cases.length}</Typography>
                </div>
                <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
                  <Typography variant="subtitle2" color="text.secondary" className="font-bold uppercase tracking-wider">Active Reviews</Typography>
                  <Typography variant="h3" className="font-extrabold mt-2 text-blue-600">
                    {cases.filter(c => c.status === "UNDER_REVIEW" || c.status === "COMMITTEE_REVIEW").length}
                  </Typography>
                </div>
                <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
                  <Typography variant="subtitle2" color="text.secondary" className="font-bold uppercase tracking-wider">Approved Cases</Typography>
                  <Typography variant="h3" className="font-extrabold mt-2 text-green-600">
                    {cases.filter(c => c.status === "APPROVED" || c.status === "RESOLVED").length}
                  </Typography>
                </div>
              </div>

              {cases.length === 0 ? (
                <div className="bg-slate-50 border border-slate-200 border-dashed rounded-3xl p-12 text-center">
                  <span className="text-4xl block mb-3">📋</span>
                  <Typography variant="h6" className="font-bold text-slate-700">No current ongoing applications</Typography>
                  <Typography variant="body2" color="text.secondary" className="max-w-md mx-auto mt-1 mb-6">
                    You don't have any active assistance applications. Click below to submit details for medical, educational, or emergency support.
                  </Typography>
                  <Button onClick={() => setActiveTab("apply")} variant="contained" color="primary" className="rounded-xl px-5 py-2.5 normal-case font-bold">
                    Apply for Assistance
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {cases.map((c) => (
                    <motion.div
                      key={c.id}
                      variants={itemVariants}
                      className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-all duration-300"
                    >
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="font-mono text-xs font-black bg-amber-50 text-[#B07A3F] border border-amber-100 px-3 py-1 rounded-full">
                            {c.caseNumber}
                          </span>
                          <div className="flex gap-1.5">
                            {getPriorityBadge(c.priority)}
                            {getStatusBadge(c.status)}
                          </div>
                        </div>
                        <div>
                          <Typography variant="h6" className="font-bold text-slate-800 line-clamp-1">{c.title}</Typography>
                          <Typography variant="caption" className="text-slate-400 block mt-0.5">
                            Category: <span className="font-semibold text-slate-600">{c.category}</span> | Submitted: {formatDateTime(c.createdAt, "date")}
                          </Typography>
                        </div>
                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                          {c.description}
                        </p>
                      </div>
                      <div className="pt-5 border-t border-slate-100 mt-5 flex justify-end">
                        <Button
                          onClick={() => loadCaseDetails(c.caseNumber)}
                          variant="contained"
                          color="primary"
                          className="font-extrabold normal-case text-xs rounded-xl px-4 py-2"
                        >
                          Track Application Details
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* APPLY TAB */}
          {activeTab === "apply" && (
            <motion.div
              key="apply"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="max-w-3xl mx-auto"
            >
              {submitSuccess ? (
                <div className="bg-white border border-gray-100 rounded-3xl p-8 text-center shadow-sm space-y-4">
                  <CheckCircleIcon color="success" sx={{ fontSize: 72 }} />
                  <Typography variant="h5" className="font-extrabold text-slate-800">Application Submitted!</Typography>
                  <Typography variant="body2" color="text.secondary" className="max-w-md mx-auto leading-relaxed">
                    We've received your request. The system has initiated an AI case review. A coordinator will evaluate the details and get back to you shortly.
                  </Typography>
                  <div className="pt-4 flex justify-center gap-3">
                    <Button 
                      onClick={() => loadCaseDetails(selectedCaseNumber)} 
                      variant="contained" 
                      color="primary" 
                      className="rounded-xl px-5 py-2.5 normal-case font-bold"
                    >
                      Track Application Details
                    </Button>
                    <Button onClick={() => setSubmitSuccess(false)} variant="outlined" color="primary" className="rounded-xl px-5 py-2.5 normal-case font-bold">
                      Apply Again
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm space-y-8">
                  {/* Wizard Header Progress Bar */}
                  <div className="flex items-center justify-between border-b pb-6 overflow-x-auto whitespace-nowrap gap-4">
                    {[
                      { step: 1, label: "Personal", icon: <PersonIcon sx={{ fontSize: 16 }} /> },
                      { step: 2, label: "Address", icon: <LocationOnIcon sx={{ fontSize: 16 }} /> },
                      { step: 3, label: "Financials", icon: <PeopleIcon sx={{ fontSize: 16 }} /> },
                      { step: 4, label: "Assistance", icon: <RequestQuoteIcon sx={{ fontSize: 16 }} /> },
                      { step: 5, label: "Documents", icon: <DescriptionIcon sx={{ fontSize: 16 }} /> }
                    ].map((s) => (
                      <div key={s.step} className="flex items-center gap-2">
                        <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                          wizardStep === s.step 
                            ? "bg-[#B07A3F] text-white shadow-md shadow-amber-700/20" 
                            : wizardStep > s.step 
                            ? "bg-slate-800 text-white" 
                            : "bg-slate-100 text-slate-400 border border-slate-200"
                        }`}>
                          {s.icon}
                        </span>
                        <span className={`text-xs font-bold ${wizardStep === s.step ? "text-[#B07A3F]" : "text-slate-500"}`}>
                          {s.label}
                        </span>
                        {s.step < 5 && <ChevronRightIcon sx={{ fontSize: 14, color: "grey.400" }} />}
                      </div>
                    ))}
                  </div>

                  <div>
                    <Typography variant="h5" className="font-extrabold text-slate-800">Apply for Support</Typography>
                    <Typography variant="body2" color="text.secondary" className="mt-1">
                      Step {wizardStep} of 5: Fill in your details carefully. You can save your progress as a draft anytime.
                    </Typography>
                  </div>

                  {submitError && <Alert severity="error" className="rounded-xl">{submitError}</Alert>}

                  <div className="space-y-6">
                    {/* STEP 1: PERSONAL INFORMATION */}
                    {wizardStep === 1 && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <TextField
                          fullWidth label="Full Name" value={form.fullName}
                          onChange={(e) => setForm(p => ({ ...p, fullName: e.target.value }))}
                          required variant="outlined" slotProps={{ input: { sx: { borderRadius: 3 } } }}
                        />
                        <TextField
                          fullWidth label="Date of Birth (YYYY-MM-DD)" value={form.dob}
                          onChange={(e) => setForm(p => ({ ...p, dob: e.target.value }))}
                          placeholder="e.g. 1995-08-24"
                          variant="outlined" slotProps={{ input: { sx: { borderRadius: 3 } } }}
                        />
                        <TextField
                          fullWidth label="Age" type="number" value={form.age}
                          onChange={(e) => setForm(p => ({ ...p, age: e.target.value }))}
                          variant="outlined" slotProps={{ input: { sx: { borderRadius: 3 } } }}
                        />
                        <TextField
                          fullWidth select label="Gender" value={form.gender}
                          onChange={(e) => setForm(p => ({ ...p, gender: e.target.value }))}
                          variant="outlined" slotProps={{ input: { sx: { borderRadius: 3 } } }}
                        >
                          <MenuItem value="Male">Male</MenuItem>
                          <MenuItem value="Female">Female</MenuItem>
                          <MenuItem value="Other">Other</MenuItem>
                        </TextField>
                        <TextField
                          fullWidth label="Mobile Number" value={form.mobile}
                          onChange={(e) => setForm(p => ({ ...p, mobile: e.target.value }))}
                          variant="outlined" slotProps={{ input: { sx: { borderRadius: 3 } } }}
                        />
                        <TextField
                          fullWidth label="Email Address" value={form.email}
                          onChange={(e) => setForm(p => ({ ...p, email: e.target.value }))}
                          variant="outlined" slotProps={{ input: { sx: { borderRadius: 3 } } }}
                        />
                        <TextField
                          fullWidth label="Aadhaar Card (Optional)" value={form.aadhaar}
                          onChange={(e) => setForm(p => ({ ...p, aadhaar: e.target.value }))}
                          variant="outlined" slotProps={{ input: { sx: { borderRadius: 3 } } }}
                        />
                        <TextField
                          fullWidth label="PAN Card (Optional)" value={form.pan}
                          onChange={(e) => setForm(p => ({ ...p, pan: e.target.value }))}
                          variant="outlined" slotProps={{ input: { sx: { borderRadius: 3 } } }}
                        />
                      </div>
                    )}

                    {/* STEP 2: ADDRESS DETAILS */}
                    {wizardStep === 2 && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <TextField
                          fullWidth label="House / Flat No." value={form.house}
                          onChange={(e) => setForm(p => ({ ...p, house: e.target.value }))}
                          variant="outlined" slotProps={{ input: { sx: { borderRadius: 3 } } }}
                        />
                        <TextField
                          fullWidth label="Street" value={form.street}
                          onChange={(e) => setForm(p => ({ ...p, street: e.target.value }))}
                          variant="outlined" slotProps={{ input: { sx: { borderRadius: 3 } } }}
                        />
                        <TextField
                          fullWidth label="Village / Locality" value={form.village}
                          onChange={(e) => setForm(p => ({ ...p, village: e.target.value }))}
                          variant="outlined" slotProps={{ input: { sx: { borderRadius: 3 } } }}
                        />
                        <TextField
                          fullWidth label="City" value={form.city}
                          onChange={(e) => setForm(p => ({ ...p, city: e.target.value }))}
                          variant="outlined" slotProps={{ input: { sx: { borderRadius: 3 } } }}
                        />
                        <TextField
                          fullWidth label="District" value={form.district}
                          onChange={(e) => setForm(p => ({ ...p, district: e.target.value }))}
                          variant="outlined" slotProps={{ input: { sx: { borderRadius: 3 } } }}
                        />
                        <TextField
                          fullWidth label="State" value={form.state}
                          onChange={(e) => setForm(p => ({ ...p, state: e.target.value }))}
                          variant="outlined" slotProps={{ input: { sx: { borderRadius: 3 } } }}
                        />
                        <TextField
                          fullWidth label="Pincode" value={form.pincode}
                          onChange={(e) => setForm(p => ({ ...p, pincode: e.target.value }))}
                          variant="outlined" slotProps={{ input: { sx: { borderRadius: 3 } } }}
                        />
                      </div>
                    )}

                    {/* STEP 3: FAMILY & FINANCIALS */}
                    {wizardStep === 3 && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <TextField
                          fullWidth label="Occupation" value={form.occupation}
                          onChange={(e) => setForm(p => ({ ...p, occupation: e.target.value }))}
                          variant="outlined" slotProps={{ input: { sx: { borderRadius: 3 } } }}
                        />
                        <TextField
                          fullWidth label="Monthly Income (INR)" type="number" value={form.monthlyIncome}
                          onChange={(e) => setForm(p => ({ ...p, monthlyIncome: e.target.value }))}
                          variant="outlined" slotProps={{ input: { sx: { borderRadius: 3 } } }}
                        />
                        <TextField
                          fullWidth label="Family Members" type="number" value={form.familyMembers}
                          onChange={(e) => setForm(p => ({ ...p, familyMembers: e.target.value }))}
                          variant="outlined" slotProps={{ input: { sx: { borderRadius: 3 } } }}
                        />
                        <TextField
                          fullWidth label="Dependents" type="number" value={form.familyDependents}
                          onChange={(e) => setForm(p => ({ ...p, familyDependents: e.target.value }))}
                          variant="outlined" slotProps={{ input: { sx: { borderRadius: 3 } } }}
                        />
                      </div>
                    )}

                    {/* STEP 4: ASSISTANCE REQUEST */}
                    {wizardStep === 4 && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <TextField
                            fullWidth select label="Category" value={form.category}
                            onChange={(e) => setForm(p => ({ ...p, category: e.target.value }))}
                            required variant="outlined" slotProps={{ input: { sx: { borderRadius: 3 } } }}
                          >
                            {CATEGORIES.map((opt) => (
                              <MenuItem key={opt.value} value={opt.value}>
                                {opt.label}
                              </MenuItem>
                            ))}
                          </TextField>
                          <TextField
                            fullWidth select label="Priority" value={form.priority}
                            onChange={(e) => setForm(p => ({ ...p, priority: e.target.value }))}
                            variant="outlined" slotProps={{ input: { sx: { borderRadius: 3 } } }}
                          >
                            <MenuItem value="LOW">Low</MenuItem>
                            <MenuItem value="MEDIUM">Medium</MenuItem>
                            <MenuItem value="HIGH">High</MenuItem>
                            <MenuItem value="CRITICAL">Critical / Emergency</MenuItem>
                          </TextField>
                          <TextField
                            fullWidth label="Estimated Financial Requirement (INR)" type="number" value={form.estimatedCost}
                            onChange={(e) => setForm(p => ({ ...p, estimatedCost: e.target.value }))}
                            variant="outlined" slotProps={{ input: { sx: { borderRadius: 3 } } }}
                          />
                          <TextField
                            fullWidth select label="Preferred Contact Method" value={form.preferredContact}
                            onChange={(e) => setForm(p => ({ ...p, preferredContact: e.target.value }))}
                            variant="outlined" slotProps={{ input: { sx: { borderRadius: 3 } } }}
                          >
                            <MenuItem value="Email">Email</MenuItem>
                            <MenuItem value="Mobile">Mobile Call</MenuItem>
                            <MenuItem value="SMS">SMS Message</MenuItem>
                            <MenuItem value="WhatsApp">WhatsApp</MenuItem>
                          </TextField>
                        </div>
                        <TextField
                          fullWidth label="Assistance Case Title" value={form.title}
                          onChange={(e) => setForm(p => ({ ...p, title: e.target.value }))}
                          placeholder="e.g. Higher education support"
                          required variant="outlined" slotProps={{ input: { sx: { borderRadius: 3 } } }}
                        />
                        <TextField
                          fullWidth label="Detailed Explanation" value={form.description}
                          onChange={(e) => setForm(p => ({ ...p, description: e.target.value }))}
                          placeholder="Explain your situation in detail. Mention financial gaps, dependents, or urgencies."
                          required multiline rows={4} variant="outlined" slotProps={{ input: { sx: { borderRadius: 3 } } }}
                        />
                      </div>
                    )}

                    {/* STEP 5: SUPPORTING DOCUMENTS */}
                    {wizardStep === 5 && (
                      <div className="border border-gray-100 rounded-2xl p-4 bg-slate-50/50 space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <Typography variant="subtitle2" className="font-bold text-slate-700">Verification Proof Documents</Typography>
                            <Typography variant="caption" color="text.secondary">Upload PDFs, bills, or verification transcripts (Max 10MB each)</Typography>
                          </div>
                          <UploadFileIcon className="text-slate-400" />
                        </div>

                        <MediaUploader
                          mediaType="IMAGE"
                          label="Upload Document / Receipt File"
                          onUploadSuccess={(metadata) => {
                            const doc = {
                              name: metadata.original_filename || "Attached Certificate",
                              url: metadata.secure_url,
                              publicId: metadata.public_id,
                              fileType: metadata.format
                            };
                            setUploadedDocs(p => [...p, doc]);
                            window.dispatchEvent(new CustomEvent("app-toast", {
                              detail: { message: "Document uploaded successfully!", severity: "success" }
                            }));
                          }}
                        />

                        {uploadedDocs.length > 0 && (
                          <div className="space-y-2 pt-2 border-t border-gray-100">
                            <Typography variant="caption" className="font-bold text-slate-500 block">Uploaded Proofs:</Typography>
                            {uploadedDocs.map((doc, idx) => (
                              <div key={idx} className="flex items-center justify-between p-2.5 bg-white border border-gray-200 rounded-xl text-xs font-semibold">
                                <span className="truncate text-slate-700 max-w-sm">{doc.name}.{doc.fileType}</span>
                                <Button
                                  size="small" color="error" variant="text"
                                  onClick={() => setUploadedDocs(p => p.filter((_, i) => i !== idx))}
                                  className="font-bold normal-case text-[10px]"
                                >
                                  Remove
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex justify-between items-center pt-6 border-t gap-3">
                      <div className="flex gap-2">
                        {wizardStep > 1 && (
                          <Button
                            onClick={() => setWizardStep(p => p - 1)}
                            variant="outlined" startIcon={<ChevronLeftIcon />}
                            className="rounded-xl px-4 py-2 font-bold normal-case text-xs"
                          >
                            Previous
                          </Button>
                        )}
                        <Button
                          onClick={() => handleCreateCase(true)}
                          variant="text" startIcon={<SaveIcon />}
                          disabled={submitLoading}
                          className="rounded-xl px-4 py-2 font-bold normal-case text-xs"
                        >
                          Save Draft
                        </Button>
                      </div>

                      {wizardStep < 5 ? (
                        <Button
                          onClick={() => setWizardStep(p => p + 1)}
                          variant="contained" endIcon={<ChevronRightIcon />}
                          className="rounded-xl px-5 py-2.5 font-bold normal-case text-xs"
                        >
                          Next
                        </Button>
                      ) : (
                        <Button
                          onClick={() => handleCreateCase(false)}
                          variant="contained" disabled={submitLoading}
                          className="rounded-xl px-6 py-2.5 font-bold normal-case text-xs bg-slate-800 text-white"
                        >
                          {submitLoading ? <CircularProgress size={20} color="inherit" /> : "Submit Application"}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* PROFILE TAB */}
          {activeTab === "profile" && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="max-w-md mx-auto"
            >
              <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm space-y-6">
                <div>
                  <Typography variant="h5" className="font-extrabold text-slate-800">Edit Profile</Typography>
                  <Typography variant="body2" color="text.secondary" className="mt-1">
                    Manage your personal account profile details.
                  </Typography>
                </div>

                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <TextField
                    fullWidth label="Full Name" value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    required variant="outlined" slotProps={{ input: { sx: { borderRadius: 3 } } }}
                  />
                  <TextField
                    fullWidth label="Email Address (Read-only)" value={user?.email || ""}
                    disabled variant="outlined" slotProps={{ input: { sx: { borderRadius: 3 } } }}
                  />
                  <Button
                    fullWidth type="submit" variant="contained" color="primary" size="large" disabled={profileLoading}
                    sx={{ py: 1.5, borderRadius: 3, fontWeight: 700, textTransform: 'none', fontSize: '1rem', boxShadow: 'none' }}
                  >
                    {profileLoading ? <CircularProgress size={24} color="inherit" /> : "Save Changes"}
                  </Button>
                </form>
              </div>
            </motion.div>
          )}

          {/* DETAILS TAB */}
          {activeTab === "details" && activeCase && (
            <motion.div
              key="details"
              variants={containerVariants}
              initial="hidden"
              animate="show"
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <div className="flex justify-between items-center border-b pb-4">
                <Button
                  onClick={() => setActiveTab("overview")}
                  variant="outlined"
                  size="small"
                  className="normal-case font-bold rounded-xl"
                >
                  ← Back to My Applications
                </Button>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Side: Case Details & Timeline */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Title Panel */}
                  <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <span className="font-mono text-xs font-black bg-amber-50 text-[#B07A3F] border border-amber-100 px-3 py-1 rounded-full">
                          {activeCase.caseNumber}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        {getPriorityBadge(activeCase.priority)}
                        {getStatusBadge(activeCase.status)}
                      </div>
                    </div>

                    <Typography variant="h5" className="font-extrabold text-slate-800">{activeCase.title}</Typography>
                    
                    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">
                      {activeCase.description}
                    </div>

                    {activeCase.outcomeDetails && (
                      <div className="bg-green-50/50 border border-green-100 rounded-2xl p-4 text-green-950 text-sm">
                        <Typography variant="subtitle2" className="font-extrabold text-green-900 mb-1">📢 Resolution Outcome Details</Typography>
                        <p>{activeCase.outcomeDetails}</p>
                      </div>
                    )}
                  </div>

                  {/* AI Summary Section */}
                  <div className="bg-gradient-to-br from-indigo-50/30 to-violet-50/20 border border-indigo-100/60 rounded-3xl p-6 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-xl -mr-10 -mt-10" />
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xl">✨</span>
                      <Typography variant="subtitle2" className="font-black text-indigo-950 uppercase tracking-wider">AI Case Summary & Analysis</Typography>
                    </div>
                    {activeCase.aiSummary ? (
                      <div className="prose prose-sm text-indigo-900 text-xs font-medium leading-relaxed whitespace-pre-wrap">
                        {activeCase.aiSummary}
                      </div>
                    ) : (
                      <Typography variant="caption" className="text-slate-400 italic">Summary evaluation is in progress. The system will index your documents shortly.</Typography>
                    )}
                  </div>

                  {/* Step Timeline */}
                  <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-6">
                    <Typography variant="h6" className="font-bold text-slate-800">Application Evaluation Path</Typography>
                    
                    {/* Desktop timeline layout */}
                    <div className="hidden sm:grid grid-cols-4 relative border-t-2 border-slate-100 pt-6">
                      {STATUS_STEPS.map((step, idx) => {
                        const activeIndex = getStepIndex(activeCase.status);
                        const isCompleted = idx < activeIndex;
                        const isActive = idx === activeIndex;
                        return (
                          <div key={idx} className="flex flex-col items-center text-center relative animate-fade-in">
                            {/* Dot overlay */}
                            <div
                              className={`w-6 h-6 rounded-full flex items-center justify-center -mt-9 z-10 border-2 transition-all ${
                                isCompleted ? "bg-green-500 border-green-500 text-white" :
                                isActive ? "bg-primary border-primary text-white scale-110 shadow-lg shadow-primary/30" :
                                "bg-white border-slate-200 text-slate-400"
                              }`}
                            >
                              {isCompleted ? "✓" : idx + 1}
                            </div>
                            <span className={`text-[11px] font-bold mt-2 ${isActive ? "text-slate-800 font-extrabold" : "text-slate-400"}`}>
                              {step.label}
                            </span>
                            {/* Decision Special cases */}
                            {isActive && step.status === "APPROVED" && (
                              <span className="text-[10px] text-slate-500 font-semibold mt-0.5 block">{activeCase.status}</span>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Mobile timeline vertical layout */}
                    <div className="block sm:hidden space-y-6 pl-5 border-l-2 border-slate-150 relative ml-2.5 mt-4">
                      {STATUS_STEPS.map((step, idx) => {
                        const activeIndex = getStepIndex(activeCase.status);
                        const isCompleted = idx < activeIndex;
                        const isActive = idx === activeIndex;
                        return (
                          <div key={idx} className="flex items-center gap-3.5 relative">
                            {/* Dot indicator aligned with vertical line */}
                            <div
                              className={`w-6 h-6 rounded-full flex items-center justify-center -ml-[33px] z-10 border-2 transition-all ${
                                isCompleted ? "bg-green-500 border-green-500 text-white" :
                                isActive ? "bg-primary border-primary text-white scale-110 shadow-lg shadow-primary/30" :
                                "bg-white border-slate-200 text-slate-400"
                              }`}
                            >
                              {isCompleted ? "✓" : idx + 1}
                            </div>
                            <div className="flex flex-col">
                              <span className={`text-xs font-bold ${isActive ? "text-slate-800 font-extrabold" : "text-slate-400"}`}>
                                {step.label}
                              </span>
                              {isActive && step.status === "APPROVED" && (
                                <span className="text-[10px] text-slate-500 font-semibold block">{activeCase.status}</span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="space-y-3 mt-6 pt-6 border-t border-slate-100">
                      <Typography variant="subtitle2" className="font-bold text-slate-800">Timeline Logs</Typography>
                      <div className="space-y-4">
                        {(activeCase.milestones || []).map((m, idx) => (
                          <div key={idx} className="flex gap-4 items-start text-xs">
                            <AccessTimeIcon sx={{ fontSize: 16, mt: 0.5, color: "#64748b" }} />
                            <div>
                              <p className="font-bold text-slate-700">{m.title} <span className="font-normal text-slate-400 ml-2">{formatDateTime(m.timestamp)}</span></p>
                              <p className="text-slate-500 mt-0.5">{m.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Side: Message Board / Case Chat & Documents */}
                <div className="space-y-6">
                  {/* Message board */}
                  <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm flex flex-col h-[480px]">
                    <div className="p-4 bg-slate-50/50 border-b border-gray-100 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ChatIcon className="text-slate-500" fontSize="small" />
                        <Typography variant="subtitle2" className="font-bold text-slate-800">Case Coordinator Chat</Typography>
                      </div>
                      {activeCase.assignedOfficerName ? (
                        <span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-bold border border-blue-100">
                          Officer: {activeCase.assignedOfficerName}
                        </span>
                      ) : (
                        <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-bold">Unassigned</span>
                      )}
                    </div>

                    {/* Messages Body */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/20">
                      {messages.length === 0 ? (
                        <div className="text-center py-10 text-slate-400 text-xs italic">No messages yet. Send a message to start conversation with the officer.</div>
                      ) : (
                        messages.map((m, idx) => {
                          const isMe = m.senderId === user.id;
                          return (
                            <div key={idx} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                              <div className={`max-w-[75%] rounded-2xl px-3.5 py-2.5 text-xs shadow-sm ${
                                isMe ? "bg-primary text-white rounded-tr-none" : "bg-white text-slate-800 border border-slate-100 rounded-tl-none"
                              }`}>
                                {!isMe && <span className="font-extrabold text-[10px] text-primary block mb-0.5">{m.senderName} ({m.senderRole})</span>}
                                <p className="leading-relaxed whitespace-pre-wrap">{m.messageContent}</p>
                                <span className={`text-[8px] mt-1 block text-right ${isMe ? "text-white/60" : "text-slate-400"}`}>
                                  {formatDateTime(m.sentAt, "time")}
                                </span>
                              </div>
                            </div>
                          );
                        })
                      )}
                      <div ref={chatEndRef} />
                    </div>

                    {/* Input Field */}
                    <form onSubmit={handleSendMessage} className="p-3 border-t border-gray-100 bg-white flex gap-2">
                      <input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type message regarding your case..."
                        className="flex-1 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-primary/20 bg-slate-50/50"
                      />
                      <Button type="submit" variant="contained" color="primary" sx={{ minWidth: 40, width: 40, height: 36, borderRadius: 3, p: 0 }}>
                        <SendIcon sx={{ fontSize: 16 }} />
                      </Button>
                    </form>
                  </div>

                  {/* Documents Attached Panel */}
                  <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-4">
                    <Typography variant="subtitle2" className="font-bold text-slate-800">Attached Documents</Typography>
                    
                    {(activeCase.documents || []).length === 0 ? (
                      <Typography variant="caption" className="text-slate-400 italic block">No documents attached yet.</Typography>
                    ) : (
                      <div className="space-y-2">
                        {activeCase.documents.map((doc, idx) => (
                          <div key={idx} className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold">
                            <span className="truncate text-slate-700 max-w-[150px]">{doc.documentName}</span>
                             <div className="flex gap-1.5">
                              <Button
                                component="a"
                                href={doc.documentUrl}
                                target="_blank"
                                rel="noreferrer"
                                size="small"
                                variant="text"
                                className="font-bold normal-case text-[10px]"
                                color="primary"
                              >
                                Download
                              </Button>
                              {(activeCase.status === "DRAFT" || activeCase.status === "SUBMITTED") && (
                                <Button
                                  size="small"
                                  variant="text"
                                  onClick={() => handleDeleteAttachedDoc(doc.id)}
                                  className="font-bold normal-case text-[10px]"
                                  color="error"
                                >
                                  Delete
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="pt-2 border-t border-slate-100 space-y-2">
                      <Typography variant="caption" className="font-bold text-slate-600 block">Attach More Documents:</Typography>
                      <MediaUploader
                        mediaType="IMAGE"
                        label="Upload Document Proof"
                        onUploadSuccess={handleAttachMoreDoc}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </motion.div>
  );
};

export default ApplicantDashboard;
