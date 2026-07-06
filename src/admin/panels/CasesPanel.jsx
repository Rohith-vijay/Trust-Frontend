import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import databaseService from "../../services/databaseService";
import { TextField, Button, Typography, CircularProgress, Alert, MenuItem, Tab, Tabs, Switch, FormControlLabel } from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import SendIcon from "@mui/icons-material/Send";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import SecurityIcon from "@mui/icons-material/Security";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import DescriptionIcon from "@mui/icons-material/Description";

const STATUSES = ["DRAFT", "SUBMITTED", "UNDER_REVIEW", "DOCUMENT_VERIFICATION", "FIELD_VERIFICATION", "COMMITTEE_REVIEW", "APPROVED", "REJECTED", "AID_DISTRIBUTION", "RESOLVED", "CLOSED"];
const CATEGORIES = ["EDUCATION", "MEDICAL", "FINANCIAL", "FOOD", "EMERGENCY", "ENVIRONMENT", "SKILL_DEVELOPMENT", "OTHER"];

const CasesPanel = ({ formatDate, LoadingSpinner, EmptyState }) => {
  const [cases, setCases] = useState([]);
  const [activeCase, setActiveCase] = useState(null);
  const [messages, setMessages] = useState([]);
  const [officers, setOfficers] = useState([]);

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
  
  // Loaders
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [filterPriority, setFilterPriority] = useState("ALL");
  const [filterCategory, setFilterCategory] = useState("ALL");
  const [filterOfficer, setFilterOfficer] = useState("ALL");
  const [page, setPage] = useState(0);

  // Workspace Tabs
  const [workspaceTab, setWorkspaceTab] = useState(0);

  // Right Panel Inputs
  const [assignOfficerId, setAssignOfficerId] = useState("");
  const [scheduledVisitDate, setScheduledVisitDate] = useState("");
  const [estimatedCost, setEstimatedCost] = useState("");
  const [approvedAmount, setApprovedAmount] = useState("");
  const [disbursedAmount, setDisbursedAmount] = useState("");
  const [statusForm, setStatusForm] = useState({ status: "UNDER_REVIEW", comment: "" });
  const [internalNotes, setInternalNotes] = useState("");
  const [committeeNotes, setCommitteeNotes] = useState("");
  const [caseTags, setCaseTags] = useState("");
  const [isEscalated, setIsEscalated] = useState(false);

  // Chat window inputs
  const [newMessage, setNewMessage] = useState("");
  const [chatIsInternal, setChatIsInternal] = useState(false);
  const chatEndRef = useRef(null);

  const loadCases = async () => {
    setLoading(true);
    try {
      const res = await databaseService.getAllCases(page, 100, null);
      setCases(res.data?.content || res.content || []);
    } catch (err) {
      console.error("Failed to load cases:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadOfficers = async () => {
    try {
      const res = await databaseService.getUsers();
      const usersList = res.data || res || [];
      setOfficers(usersList.filter(u => u.role === "ADMIN" || u.role === "VOLUNTEER"));
    } catch (err) {
      console.error("Failed to load potential case officers:", err);
    }
  };

  useEffect(() => {
    loadCases();
    loadOfficers();
  }, [page]);

  const selectCase = async (caseNum) => {
    setDetailLoading(true);
    try {
      const res = await databaseService.getCaseDetails(caseNum);
      const data = res.data || res;
      setActiveCase(data);
      setStatusForm({ status: data.status, comment: "" });
      setAssignOfficerId(data.assignedOfficerId || "");
      setScheduledVisitDate(data.scheduledVisit ? data.scheduledVisit.substring(0, 16) : "");
      setEstimatedCost(data.estimatedCost || "");
      setApprovedAmount(data.approvedAmount || "");
      setDisbursedAmount(data.disbursedAmount || "");
      setInternalNotes(data.internalNotes || "");
      setCommitteeNotes(data.committeeNotes || "");
      setCaseTags(data.tags || "");
      setIsEscalated(data.escalated || false);

      const msgRes = await databaseService.getCaseMessages(caseNum);
      setMessages(msgRes.data || msgRes || []);
    } catch (err) {
      console.error("Failed to load case detail:", err);
    } finally {
      setDetailLoading(false);
    }
  };

  useEffect(() => {
    if (activeCase && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, activeCase]);

  // Handler calls
  const handleUpdateStatus = async (e) => {
    if (e) e.preventDefault();
    if (!activeCase) return;
    setUpdateLoading(true);
    try {
      await databaseService.updateCaseStatus(activeCase.caseNumber, statusForm.status, statusForm.comment);
      window.dispatchEvent(new CustomEvent("app-toast", {
        detail: { message: "Case status successfully updated!", severity: "success" }
      }));
      selectCase(activeCase.caseNumber);
      loadCases();
    } catch (err) {
      console.error("Failed to update status", err);
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleAssignOfficer = async () => {
    if (!activeCase || !assignOfficerId) return;
    setUpdateLoading(true);
    try {
      await databaseService.assignCaseOfficer(activeCase.caseNumber, assignOfficerId);
      window.dispatchEvent(new CustomEvent("app-toast", {
        detail: { message: "Assigned officer updated!", severity: "success" }
      }));
      selectCase(activeCase.caseNumber);
      loadCases();
    } catch (err) {
      console.error("Failed to assign officer", err);
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleScheduleVisit = async () => {
    if (!activeCase || !scheduledVisitDate) return;
    setUpdateLoading(true);
    try {
      await databaseService.scheduleCaseVisit(activeCase.caseNumber, scheduledVisitDate + ":00");
      window.dispatchEvent(new CustomEvent("app-toast", {
        detail: { message: "Field visit scheduled successfully!", severity: "success" }
      }));
      selectCase(activeCase.caseNumber);
    } catch (err) {
      console.error("Failed to schedule visit", err);
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleUpdateCosts = async () => {
    if (!activeCase) return;
    setUpdateLoading(true);
    try {
      if (estimatedCost) await databaseService.updateCaseEstimatedCost(activeCase.caseNumber, parseFloat(estimatedCost));
      if (approvedAmount) await databaseService.updateCaseApprovedAmount(activeCase.caseNumber, parseFloat(approvedAmount));
      if (disbursedAmount) await databaseService.updateCaseDisbursedAmount(activeCase.caseNumber, parseFloat(disbursedAmount));
      window.dispatchEvent(new CustomEvent("app-toast", {
        detail: { message: "Financial limits and costs updated!", severity: "success" }
      }));
      selectCase(activeCase.caseNumber);
    } catch (err) {
      console.error("Failed to update costs", err);
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleSaveNotes = async () => {
    if (!activeCase) return;
    try {
      await databaseService.updateCaseInternalNotes(activeCase.caseNumber, internalNotes);
      await databaseService.updateCaseCommitteeNotes(activeCase.caseNumber, committeeNotes);
      window.dispatchEvent(new CustomEvent("app-toast", {
        detail: { message: "Internal & Committee evaluation notes saved!", severity: "success" }
      }));
      selectCase(activeCase.caseNumber);
    } catch (err) {
      console.error("Failed to save notes", err);
    }
  };

  const handleUpdateTags = async () => {
    if (!activeCase) return;
    try {
      await databaseService.updateCaseTags(activeCase.caseNumber, caseTags);
      window.dispatchEvent(new CustomEvent("app-toast", {
        detail: { message: "Case labels and tags updated!", severity: "success" }
      }));
      selectCase(activeCase.caseNumber);
    } catch (err) {
      console.error("Failed to update tags", err);
    }
  };

  const handleToggleEscalation = async (escalatedVal) => {
    if (!activeCase) return;
    try {
      await databaseService.toggleCaseEscalation(activeCase.caseNumber, escalatedVal);
      setIsEscalated(escalatedVal);
      window.dispatchEvent(new CustomEvent("app-toast", {
        detail: { message: escalatedVal ? "Case ESCALATED!" : "Escalation cleared", severity: "info" }
      }));
      selectCase(activeCase.caseNumber);
    } catch (err) {
      console.error("Failed to toggle escalation", err);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeCase) return;

    try {
      const sent = await databaseService.sendCaseMessage(activeCase.caseNumber, newMessage, chatIsInternal);
      setMessages(prev => [...prev, sent.data || sent]);
      setNewMessage("");
    } catch (err) {
      console.error("Failed to send message", err);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "DRAFT":
        return <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[10px] font-bold border border-slate-200">Draft</span>;
      case "SUBMITTED":
        return <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-[10px] font-bold border border-gray-200">Submitted</span>;
      case "UNDER_REVIEW":
        return <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-[10px] font-bold border border-blue-200">Under Review</span>;
      case "DOCUMENT_VERIFICATION":
        return <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded text-[10px] font-bold border border-indigo-200">Doc Verification</span>;
      case "FIELD_VERIFICATION":
        return <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded text-[10px] font-bold border border-purple-200">Field Verification</span>;
      case "COMMITTEE_REVIEW":
        return <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded text-[10px] font-bold border border-amber-200">Committee Review</span>;
      case "APPROVED":
        return <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-[10px] font-bold border border-green-200">Approved</span>;
      case "REJECTED":
        return <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded text-[10px] font-bold border border-red-200">Rejected</span>;
      case "AID_DISTRIBUTION":
        return <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded text-[10px] font-bold border border-orange-200">Aid Distribution</span>;
      case "RESOLVED":
        return <span className="bg-teal-100 text-teal-700 px-2 py-0.5 rounded text-[10px] font-bold border border-teal-200">Resolved</span>;
      case "CLOSED":
        return <span className="bg-slate-200 text-slate-800 px-2 py-0.5 rounded text-[10px] font-bold border border-slate-350">Closed</span>;
      default:
        return <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-[10px] font-bold">{status}</span>;
    }
  };

  const getPriorityBadge = (prio) => {
    switch (prio) {
      case "CRITICAL":
        return <span className="bg-rose-100 text-rose-800 px-2 py-0.5 rounded text-[9px] font-extrabold tracking-wider">CRITICAL</span>;
      case "HIGH":
        return <span className="bg-orange-100 text-orange-800 px-2 py-0.5 rounded text-[9px] font-extrabold tracking-wider">HIGH</span>;
      case "MEDIUM":
        return <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded text-[9px] font-extrabold tracking-wider">MEDIUM</span>;
      default:
        return <span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded text-[9px] font-extrabold tracking-wider">LOW</span>;
    }
  };

  // Filter application matching
  const filteredCases = cases.filter(c => {
    const matchesSearch = c.caseNumber.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.applicantName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "ALL" || c.status === filterStatus;
    const matchesPriority = filterPriority === "ALL" || c.priority === filterPriority;
    const matchesCategory = filterCategory === "ALL" || c.category === filterCategory;
    const matchesOfficer = filterOfficer === "ALL" || 
                           (filterOfficer === "UNASSIGNED" && !c.assignedOfficerId) || 
                           c.assignedOfficerId === parseInt(filterOfficer);
    
    return matchesSearch && matchesStatus && matchesPriority && matchesCategory && matchesOfficer;
  });

  return (
    <div className="h-[80vh] flex flex-col md:flex-row gap-6 overflow-hidden">
      {/* LEFT PANEL: Master Applications List */}
      <div className="w-full md:w-1/4 bg-white border border-gray-100 rounded-3xl p-4 flex flex-col h-full shadow-sm">
        <Typography variant="subtitle1" className="font-extrabold text-slate-800 mb-3">Beneficiary Cases</Typography>
        
        {/* Filters Panel */}
        <div className="space-y-2 mb-4">
          <TextField
            fullWidth size="small" placeholder="Search Number, Applicant..."
            value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            slotProps={{ input: { sx: { borderRadius: 3, fontSize: "0.75rem" } } }}
          />
          <div className="grid grid-cols-2 gap-2">
            <TextField
              select size="small" label="Status" value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              slotProps={{ input: { sx: { borderRadius: 2.5, fontSize: "0.7rem" } } }}
            >
              <MenuItem value="ALL">All Statuses</MenuItem>
              {STATUSES.map(s => <MenuItem key={s} value={s}>{s.replace("_", " ")}</MenuItem>)}
            </TextField>
            <TextField
              select size="small" label="Priority" value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              slotProps={{ input: { sx: { borderRadius: 2.5, fontSize: "0.7rem" } } }}
            >
              <MenuItem value="ALL">All Priorities</MenuItem>
              <MenuItem value="LOW">LOW</MenuItem>
              <MenuItem value="MEDIUM">MEDIUM</MenuItem>
              <MenuItem value="HIGH">HIGH</MenuItem>
              <MenuItem value="CRITICAL">CRITICAL</MenuItem>
            </TextField>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <TextField
              select size="small" label="Category" value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              slotProps={{ input: { sx: { borderRadius: 2.5, fontSize: "0.7rem" } } }}
            >
              <MenuItem value="ALL">All Categories</MenuItem>
              {CATEGORIES.map(c => <MenuItem key={c} value={c}>{c.replace("_", " ")}</MenuItem>)}
            </TextField>
            <TextField
              select size="small" label="Officer" value={filterOfficer}
              onChange={(e) => setFilterOfficer(e.target.value)}
              slotProps={{ input: { sx: { borderRadius: 2.5, fontSize: "0.7rem" } } }}
            >
              <MenuItem value="ALL">All Officers</MenuItem>
              <MenuItem value="UNASSIGNED">Unassigned Only</MenuItem>
              {officers.map(o => <MenuItem key={o.id} value={o.id}>{o.fullName}</MenuItem>)}
            </TextField>
          </div>
        </div>

        {/* Master List View */}
        <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
          {loading ? (
            <div className="flex justify-center items-center py-20"><CircularProgress size={24} /></div>
          ) : filteredCases.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-xs italic">No cases match filters.</div>
          ) : (
            filteredCases.map(c => {
              const isActive = activeCase?.id === c.id;
              return (
                <div
                  key={c.id} onClick={() => selectCase(c.caseNumber)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                    isActive 
                      ? "bg-slate-50 border-[#B07A3F]/30 shadow-sm" 
                      : "bg-white border-slate-100 hover:bg-slate-50/50"
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-mono text-[10px] font-black text-[#B07A3F]">{c.caseNumber}</span>
                    {getPriorityBadge(c.priority)}
                  </div>
                  <Typography variant="subtitle2" className="font-bold text-slate-800 truncate text-[11px]">{c.title}</Typography>
                  <div className="flex justify-between items-center mt-1.5">
                    <span className="text-[9px] text-slate-400 truncate max-w-[80px] font-semibold">{c.applicantName}</span>
                    {getStatusBadge(c.status)}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* CENTER & RIGHT WORKSPACE */}
      {activeCase ? (
        <div className="flex-1 flex flex-col md:flex-row gap-6 overflow-hidden h-full">
          {/* CENTER: Workspace & Tabs */}
          <div className="flex-1 bg-white border border-gray-100 rounded-3xl p-5 flex flex-col h-full overflow-hidden shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-2 mb-4">
              <div>
                <Typography variant="subtitle1" className="font-extrabold text-slate-800">{activeCase.title}</Typography>
                <Typography variant="caption" className="text-slate-400 block">
                  Created by: <span className="font-bold text-slate-600">{activeCase.applicantName}</span> ({activeCase.applicantEmail})
                </Typography>
              </div>
              <div className="flex items-center gap-1.5">
                {activeCase.escalated && <span className="bg-rose-500 text-white font-extrabold text-[8px] px-2 py-0.5 rounded tracking-widest animate-pulse">ESCALATED</span>}
                {getStatusBadge(activeCase.status)}
              </div>
            </div>

            {/* Workspace tabs selection */}
            <Tabs
              value={workspaceTab} onChange={(e, val) => setWorkspaceTab(val)}
              variant="scrollable" scrollButtons="auto"
              className="border-b mb-4"
              sx={{ minHeight: 32, "& .MuiTab-root": { minHeight: 32, fontSize: "0.7rem", fontWeight: "bold", textTransform: "none", py: 0.5 } }}
            >
              <Tab label="👤 Profile" />
              <Tab label="📋 Details" />
              <Tab label="📑 Documents" />
              <Tab label="✨ AI Report" />
              <Tab label="⚙️ Milestones" />
            </Tabs>

            {/* Workspace Tab Contents */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-1 text-xs text-slate-700">
              {detailLoading ? (
                <div className="flex justify-center items-center py-20"><CircularProgress size={24} /></div>
              ) : (
                <>
                  {workspaceTab === 0 && (
                    <div className="space-y-4">
                      {/* Personal */}
                      <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-2">
                        <Typography variant="subtitle2" className="font-bold text-slate-800 border-b pb-1">Personal Details</Typography>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          <div><span className="text-slate-400 font-medium">Age:</span> <p className="font-bold">{activeCase.age || "N/A"}</p></div>
                          <div><span className="text-slate-400 font-medium">Gender:</span> <p className="font-bold">{activeCase.gender || "N/A"}</p></div>
                          <div><span className="text-slate-400 font-medium">Date of Birth:</span> <p className="font-bold">{activeCase.dateOfBirth || "N/A"}</p></div>
                          <div><span className="text-slate-400 font-medium">Mobile:</span> <p className="font-bold">{activeCase.mobile || "N/A"}</p></div>
                          <div><span className="text-slate-400 font-medium">Email:</span> <p className="font-bold">{activeCase.email || "N/A"}</p></div>
                          <div><span className="text-slate-400 font-medium">Preferred Contact:</span> <p className="font-bold">{activeCase.preferredContact || "N/A"}</p></div>
                          <div><span className="text-slate-400 font-medium">Aadhaar No.:</span> <p className="font-bold">{activeCase.aadhaar || "N/A"}</p></div>
                          <div><span className="text-slate-400 font-medium">PAN Card:</span> <p className="font-bold">{activeCase.pan || "N/A"}</p></div>
                        </div>
                      </div>

                      {/* Address */}
                      <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-2">
                        <Typography variant="subtitle2" className="font-bold text-slate-800 border-b pb-1">Address Info</Typography>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          <div><span className="text-slate-400 font-medium">House:</span> <p className="font-bold">{activeCase.house || "N/A"}</p></div>
                          <div><span className="text-slate-400 font-medium">Street:</span> <p className="font-bold">{activeCase.street || "N/A"}</p></div>
                          <div><span className="text-slate-400 font-medium">Village:</span> <p className="font-bold">{activeCase.village || "N/A"}</p></div>
                          <div><span className="text-slate-400 font-medium">City:</span> <p className="font-bold">{activeCase.city || "N/A"}</p></div>
                          <div><span className="text-slate-400 font-medium">District:</span> <p className="font-bold">{activeCase.district || "N/A"}</p></div>
                          <div><span className="text-slate-400 font-medium">State:</span> <p className="font-bold">{activeCase.state || "N/A"}</p></div>
                          <div><span className="text-slate-400 font-medium">Pincode:</span> <p className="font-bold">{activeCase.pincode || "N/A"}</p></div>
                        </div>
                      </div>

                      {/* Family details */}
                      <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-2">
                        <Typography variant="subtitle2" className="font-bold text-slate-800 border-b pb-1">Family & Financials</Typography>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          <div><span className="text-slate-400 font-medium">Occupation:</span> <p className="font-bold">{activeCase.occupation || "N/A"}</p></div>
                          <div><span className="text-slate-400 font-medium">Monthly Income:</span> <p className="font-bold">{activeCase.monthlyIncome || "N/A"}</p></div>
                          <div><span className="text-slate-400 font-medium">Family Members:</span> <p className="font-bold">{activeCase.familyMembers || "N/A"}</p></div>
                          <div><span className="text-slate-400 font-medium">Dependents:</span> <p className="font-bold">{activeCase.familyDependents || "N/A"}</p></div>
                        </div>
                      </div>
                    </div>
                  )}

                  {workspaceTab === 1 && (
                    <div className="space-y-4">
                      <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-2">
                        <Typography variant="subtitle2" className="font-bold text-slate-800 border-b pb-1">Case Description</Typography>
                        <p className="leading-relaxed whitespace-pre-wrap">{activeCase.description}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4">
                          <Typography variant="caption" className="text-slate-400 font-bold block">Assigned Officer</Typography>
                          <span className="text-xs font-bold text-slate-700">{activeCase.assignedOfficerName || "Unassigned"}</span>
                        </div>
                        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4">
                          <Typography variant="caption" className="text-slate-400 font-bold block">Scheduled Visit Date</Typography>
                          <span className="text-xs font-bold text-slate-700">{activeCase.scheduledVisit ? formatDateTime(activeCase.scheduledVisit) : "No visit scheduled"}</span>
                        </div>
                      </div>

                      {activeCase.outcomeDetails && (
                        <div className="bg-green-50 border border-green-100 rounded-2xl p-4 text-green-950">
                          <Typography variant="subtitle2" className="font-extrabold text-green-900 border-b border-green-200 pb-1 mb-1.5">📢 Resolution Details</Typography>
                          <p>{activeCase.outcomeDetails}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {workspaceTab === 2 && (
                    <div className="space-y-4">
                      <Typography variant="subtitle2" className="font-bold text-slate-800">Verification Proof Attachments</Typography>
                      {(activeCase.documents || []).length === 0 ? (
                        <Typography variant="caption" className="text-slate-400 italic block">No files attached by applicant.</Typography>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {activeCase.documents.map((doc, idx) => (
                            <div key={idx} className="flex flex-col p-3.5 bg-slate-50 border border-slate-150 rounded-2xl justify-between gap-3 shadow-sm hover:shadow transition-all">
                              <div className="flex items-center gap-2">
                                <DescriptionIcon color="primary" fontSize="small" />
                                <span className="truncate text-slate-800 font-bold max-w-[130px]">{doc.documentName}</span>
                              </div>
                              <Button
                                component="a" href={doc.documentUrl} target="_blank" rel="noreferrer"
                                size="small" variant="outlined" className="font-extrabold normal-case text-[10px] rounded-lg w-full" color="primary"
                              >
                                View File
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {workspaceTab === 3 && (
                    <div className="space-y-4">
                      <div className="bg-gradient-to-br from-indigo-50/20 to-violet-50/20 border border-indigo-100 rounded-2xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-lg">✨</span>
                          <Typography variant="subtitle2" className="font-black text-indigo-950 uppercase tracking-wider">AI Case Urgency & Suggestion</Typography>
                        </div>
                        {activeCase.aiSummary ? (
                          <div className="leading-relaxed whitespace-pre-wrap">{activeCase.aiSummary}</div>
                        ) : (
                          <Typography variant="caption" className="text-slate-400 italic">No summary available. AI evaluation failed during submission.</Typography>
                        )}
                      </div>
                    </div>
                  )}

                  {workspaceTab === 4 && (
                    <div className="space-y-4">
                      <Typography variant="subtitle2" className="font-bold text-slate-800">Timeline Milestones</Typography>
                      <div className="space-y-3 pl-2 border-l-2 border-slate-100 ml-1">
                        {(activeCase.milestones || []).map((m, idx) => (
                          <div key={idx} className="relative pl-4 text-xs">
                            {/* Milestone bullet */}
                            <div className="absolute -left-[14px] top-1 w-2.5 h-2.5 rounded-full bg-slate-400 border-2 border-white shadow-sm" />
                            <p className="font-bold text-slate-700">{m.title} <span className="font-normal text-slate-400 ml-2">{formatDateTime(m.timestamp)}</span></p>
                            <p className="text-slate-500 mt-0.5">{m.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* RIGHT PANEL: Workflow Actions & Case Chat */}
          <div className="w-[320px] bg-white border border-gray-100 rounded-3xl p-4 flex flex-col h-full overflow-hidden shadow-sm gap-4">
            {/* Quick Actions Tabs */}
            <div className="overflow-y-auto flex-1 space-y-4 pr-1">
              <Typography variant="subtitle2" className="font-extrabold text-slate-800">Workflow Management</Typography>

              {/* Status Update Form */}
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3.5 space-y-2">
                <Typography variant="caption" className="font-bold text-slate-500 block">Workflow Lifecycle</Typography>
                <div className="space-y-2">
                  <TextField
                    fullWidth select size="small" label="Select Status"
                    value={statusForm.status} onChange={(e) => setStatusForm(prev => ({ ...prev, status: e.target.value }))}
                    slotProps={{ input: { sx: { borderRadius: 2.5, fontSize: "0.75rem" } } }}
                  >
                    {STATUSES.map(s => <MenuItem key={s} value={s}>{s.replace("_", " ")}</MenuItem>)}
                  </TextField>
                  <TextField
                    fullWidth multiline rows={2} size="small" label="Reason/Comment"
                    value={statusForm.comment} onChange={(e) => setStatusForm(prev => ({ ...prev, comment: e.target.value }))}
                    placeholder="Reason for change..."
                    slotProps={{ input: { sx: { borderRadius: 2.5, fontSize: "0.7rem" } } }}
                  />
                  <Button
                    fullWidth onClick={handleUpdateStatus} variant="contained" color="primary" size="small" disabled={updateLoading}
                    className="rounded-xl font-bold normal-case py-1.5 text-[10px]"
                  >
                    Update Case Status
                  </Button>
                </div>
              </div>

              {/* Officer & Scheduling */}
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3.5 space-y-3">
                {/* Officer Assignment */}
                <div>
                  <Typography variant="caption" className="font-bold text-slate-500 block mb-1">Case Assignment</Typography>
                  <div className="flex gap-2">
                    <TextField
                      select size="small" label="Officer" value={assignOfficerId}
                      onChange={(e) => setAssignOfficerId(e.target.value)}
                      className="flex-1"
                      slotProps={{ input: { sx: { borderRadius: 2.5, fontSize: "0.75rem" } } }}
                    >
                      <MenuItem value="">Unassigned</MenuItem>
                      {officers.map(o => (
                        <MenuItem key={o.id} value={o.id}>
                          {o.fullName}
                        </MenuItem>
                      ))}
                    </TextField>
                    <Button
                      onClick={handleAssignOfficer} variant="outlined" size="small" disabled={updateLoading}
                      className="rounded-xl font-extrabold normal-case text-[10px]"
                    >
                      Assign
                    </Button>
                  </div>
                </div>

                {/* Visit Scheduling */}
                <div>
                  <Typography variant="caption" className="font-bold text-slate-500 block mb-1">Schedule Field Visit</Typography>
                  <div className="flex gap-2">
                    <TextField
                      type="datetime-local" size="small" value={scheduledVisitDate}
                      onChange={(e) => setScheduledVisitDate(e.target.value)}
                      className="flex-1"
                      slotProps={{ input: { sx: { borderRadius: 2.5, fontSize: "0.75rem" } } }}
                    />
                    <Button
                      onClick={handleScheduleVisit} variant="outlined" size="small" disabled={updateLoading}
                      className="rounded-xl font-extrabold normal-case text-[10px]"
                    >
                      Schedule
                    </Button>
                  </div>
                </div>
              </div>

              {/* Costs allocations */}
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3.5 space-y-2">
                <Typography variant="caption" className="font-bold text-slate-500 block">Assistance Allocations</Typography>
                <div className="grid grid-cols-3 gap-2">
                  <TextField
                    size="small" label="Est. Cost" type="number" value={estimatedCost}
                    onChange={(e) => setEstimatedCost(e.target.value)}
                    slotProps={{ input: { sx: { borderRadius: 2, fontSize: "0.7rem" } } }}
                  />
                  <TextField
                    size="small" label="Appr. Amt" type="number" value={approvedAmount}
                    onChange={(e) => setApprovedAmount(e.target.value)}
                    slotProps={{ input: { sx: { borderRadius: 2, fontSize: "0.7rem" } } }}
                  />
                  <TextField
                    size="small" label="Disb. Amt" type="number" value={disbursedAmount}
                    onChange={(e) => setDisbursedAmount(e.target.value)}
                    slotProps={{ input: { sx: { borderRadius: 2, fontSize: "0.7rem" } } }}
                  />
                </div>
                <Button
                  fullWidth onClick={handleUpdateCosts} variant="outlined" size="small" disabled={updateLoading}
                  className="rounded-xl font-bold normal-case text-[10px]"
                >
                  Save Funding Parameters
                </Button>
              </div>

              {/* internal & committee Notes */}
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3.5 space-y-2.5">
                <div>
                  <Typography variant="caption" className="font-bold text-slate-500 block">Confidential Notes</Typography>
                  <Typography variant="caption" className="text-[9px] text-slate-400 italic block">Hidden from the applicant user</Typography>
                </div>
                <TextField
                  fullWidth multiline rows={2} label="Internal Notes"
                  value={internalNotes} onChange={(e) => setInternalNotes(e.target.value)}
                  slotProps={{ input: { sx: { borderRadius: 2.5, fontSize: "0.7rem" } } }}
                />
                <TextField
                  fullWidth multiline rows={2} label="Committee Notes"
                  value={committeeNotes} onChange={(e) => setCommitteeNotes(e.target.value)}
                  slotProps={{ input: { sx: { borderRadius: 2.5, fontSize: "0.7rem" } } }}
                />
                <Button
                  fullWidth onClick={handleSaveNotes} variant="contained" color="primary" size="small"
                  className="rounded-xl font-bold normal-case text-[10px] py-1.5"
                >
                  Save Internal Notes
                </Button>
              </div>

              {/* Tags & Escalation */}
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3.5 space-y-2">
                <div className="flex gap-2">
                  <TextField
                    size="small" label="Case Tags" value={caseTags}
                    onChange={(e) => setCaseTags(e.target.value)}
                    className="flex-1"
                    placeholder="e.g. medical, urgency"
                    slotProps={{ input: { sx: { borderRadius: 2.5, fontSize: "0.75rem" } } }}
                  />
                  <Button
                    onClick={handleUpdateTags} variant="outlined" size="small"
                    className="rounded-xl font-extrabold normal-case text-[10px]"
                  >
                    Save
                  </Button>
                </div>
                <FormControlLabel
                  control={
                    <Switch
                      checked={isEscalated}
                      onChange={(e) => handleToggleEscalation(e.target.checked)}
                      size="small"
                      color="error"
                    />
                  }
                  label={<span className="text-[10px] font-bold text-rose-600 tracking-wider">Escalate Case</span>}
                />
              </div>
            </div>

            {/* Persistent chat window */}
            <div className="border border-slate-150 rounded-2xl overflow-hidden flex flex-col h-[280px]">
              <div className="p-2.5 bg-slate-50 border-b border-gray-150 flex items-center justify-between">
                <Typography variant="caption" className="font-extrabold text-slate-800">Case Messenger</Typography>
              </div>

              {/* Chat messages */}
              <div className="flex-1 overflow-y-auto p-2 space-y-2.5 bg-slate-50/20 text-[10px]">
                {messages.length === 0 ? (
                  <div className="text-center py-10 text-slate-400 italic">No communication logged.</div>
                ) : (
                  messages.map((m, idx) => (
                    <div key={idx} className={`flex ${m.senderRole === "ADMIN" || m.senderRole === "VOLUNTEER" ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[85%] rounded-xl px-2.5 py-1.5 ${
                        m.isInternal ? "bg-amber-100 border border-amber-200 text-amber-900 rounded-tr-none" :
                        (m.senderRole === "ADMIN" || m.senderRole === "VOLUNTEER") ? "bg-primary text-white rounded-tr-none" : 
                        "bg-white text-slate-800 border border-slate-100 rounded-tl-none"
                      }`}>
                        {m.isInternal && <span className="font-extrabold text-[7px] text-amber-700 block mb-0.5">🔒 INTERNAL</span>}
                        {!m.isInternal && (m.senderRole !== "ADMIN" && m.senderRole !== "VOLUNTEER") && (
                          <span className="font-extrabold text-[8px] text-[#B07A3F] block mb-0.5">{m.senderName}</span>
                        )}
                        <p className="leading-normal whitespace-pre-wrap">{m.messageContent}</p>
                        <span className="text-[6px] text-slate-400 mt-0.5 block text-right">
                          {formatDateTime(m.sentAt, "time")}
                        </span>
                      </div>
                    </div>
                  ))
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Chat form */}
              <form onSubmit={handleSendMessage} className="p-2 border-t border-gray-150 bg-white space-y-1.5">
                <div className="flex gap-1.5">
                  <input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type message..."
                    className="flex-1 border border-slate-200 rounded-lg px-2 py-1 text-[10px] outline-none focus:ring-1 focus:ring-primary/20 bg-slate-50/50"
                  />
                  <Button type="submit" variant="contained" color="primary" sx={{ minWidth: 28, width: 28, height: 24, borderRadius: 2, p: 0 }}>
                    <SendIcon sx={{ fontSize: 10 }} />
                  </Button>
                </div>
                <label className="flex items-center gap-1 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={chatIsInternal}
                    onChange={(e) => setChatIsInternal(e.target.checked)}
                    className="rounded text-primary focus:ring-primary/30 w-2.5 h-2.5"
                  />
                  <span className="text-[8px] font-black text-amber-700 uppercase tracking-wider flex items-center gap-0.5">
                    <SecurityIcon sx={{ fontSize: 8 }} />
                    Internal Note
                  </span>
                </label>
              </form>
            </div>
          </div>
        </div>
      ) : (
        /* Empty Case details */
        <div className="flex-1 bg-white border border-gray-100 rounded-3xl p-5 flex items-center justify-center h-full shadow-sm text-slate-400 italic">
          Select a case from the left panel to begin investigation.
        </div>
      )}
    </div>
  );
};

export default CasesPanel;
