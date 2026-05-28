import React, { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import databaseService from "../../services/databaseService";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import LaptopMacIcon from "@mui/icons-material/LaptopMac";
import LanguageIcon from "@mui/icons-material/Language";
import CloseIcon from "@mui/icons-material/Close";
import InfoIcon from "@mui/icons-material/Info";
import ShieldIcon from "@mui/icons-material/Shield";
import WarningIcon from "@mui/icons-material/Warning";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import RefreshIcon from "@mui/icons-material/Refresh";
import { Drawer, IconButton, Tooltip } from "@mui/material";

const AuditLogsPanel = () => {
  const [logs, setLogs] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState(""); // "", "SUCCESS", "FAILED"
  const [loading, setLoading] = useState(true);
  const [selectedLog, setSelectedLog] = useState(null);
  const [copied, setCopied] = useState(false);

  // Debounced search trigger
  const [debouncedSearch, setDebouncedSearch] = useState("");
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 350);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await databaseService.getActivities(debouncedSearch, status, page, 10);
      const payload = res.data || res;
      setLogs(payload.content || []);
      setTotalPages(payload.totalPages || 0);
      setTotalElements(payload.totalElements || 0);
    } catch (err) {
      console.error("Failed to load audit logs:", err);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, status, page]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  // Reset page when search or status filters change
  useEffect(() => {
    setPage(0);
  }, [debouncedSearch, status]);

  const handleNextPage = () => {
    if (page < totalPages - 1) setPage(page + 1);
  };

  const handlePrevPage = () => {
    if (page > 0) setPage(page - 1);
  };

  const handleResetFilters = () => {
    setSearch("");
    setStatus("");
    setPage(0);
  };

  const formatTimestamp = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  // Advanced Operations Analytics calculations
  const stats = useMemo(() => {
    const total = logs.length;
    if (total === 0) {
      return { successRate: 100, anomalyCount: 0, distinctActors: 0 };
    }
    const successCount = logs.filter(l => l.status === "SUCCESS").length;
    const anomalyCount = logs.filter(l => l.status === "FAILED" || String(l.action || "").toUpperCase().includes("VIOLATION")).length;
    const actors = new Set(logs.map(l => l.performedBy || l.username || "System")).size;
    return {
      successRate: Math.round((successCount / total) * 100),
      anomalyCount,
      distinctActors: actors
    };
  }, [logs]);

  // Pretty JSON Formatter Engine for drawers
  const formattedPayload = useMemo(() => {
    if (!selectedLog || !selectedLog.details) return "No details payload attached.";
    try {
      const parsed = JSON.parse(selectedLog.details);
      return JSON.stringify(parsed, null, 2);
    } catch (e) {
      return selectedLog.details;
    }
  }, [selectedLog]);

  const handleCopyPayload = () => {
    if (!selectedLog) return;
    navigator.clipboard.writeText(formattedPayload);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Determine Severity Levels based on Action profiles
  const getLogSeverity = (log) => {
    const actionUpper = String(log.action || "").toUpperCase();
    if (log.status === "FAILED") {
      return actionUpper.includes("VIOLATION") ? "CRITICAL" : "HIGH";
    }
    if (actionUpper.includes("DELETE") || actionUpper.includes("REMOVE")) {
      return "MEDIUM";
    }
    return "INFO";
  };

  return (
    <div className="space-y-6">
      {/* ─── SECURITY OPERATIONS OVERVIEW KPIS ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            label: "Audit Ledger Volume",
            value: totalElements,
            change: "All recorded mutations",
            color: "from-indigo-500/10 via-indigo-500/5 to-transparent text-indigo-700 border-indigo-500/15",
            icon: <ShieldIcon className="opacity-25" sx={{ fontSize: 40 }} />
          },
          {
            label: "Operations Success Rate",
            value: `${stats.successRate}%`,
            change: "Integrity validation score",
            color: "from-emerald-500/10 via-emerald-500/5 to-transparent text-emerald-700 border-emerald-500/15",
            icon: <CheckCircleIcon className="opacity-25" sx={{ fontSize: 40 }} />
          },
          {
            label: "Security Anomalies",
            value: stats.anomalyCount,
            change: "Failure traces and alerts",
            color: "from-rose-500/10 via-rose-500/5 to-transparent text-rose-700 border-rose-500/15",
            icon: <WarningIcon className="opacity-25" sx={{ fontSize: 40 }} />
          },
          {
            label: "Active System Actors",
            value: stats.distinctActors,
            change: "Distinct active sessions",
            color: "from-amber-500/10 via-amber-500/5 to-transparent text-amber-700 border-amber-500/15",
            icon: <LanguageIcon className="opacity-25" sx={{ fontSize: 40 }} />
          }
        ].map((s, idx) => (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            key={s.label}
            className={`bg-gradient-to-br ${s.color} border rounded-3xl p-5 shadow-sm relative overflow-hidden flex flex-col justify-between min-h-[110px]`}
          >
            <div className="absolute top-4 right-4">{s.icon}</div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-gray-500 opacity-75">{s.label}</p>
              <p className="text-2xl font-black mt-1 text-brand-navy-dark">{s.value}</p>
            </div>
            <p className="text-[10px] text-gray-400 font-bold mt-2">{s.change}</p>
          </motion.div>
        ))}
      </div>

      {/* ─── FILTERS HEADER & LIVE activity indicators ─── */}
      <div className="glass-panel rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col lg:flex-row gap-4 items-center justify-between bg-white">
        <div className="flex items-center justify-between w-full lg:w-auto gap-4">
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-2xl bg-amber-50 text-amber-600">
              <InfoIcon />
            </span>
            <div>
              <h3 className="text-lg font-bold text-brand-navy-dark">Operational Security & Systems Console</h3>
              <p className="text-gray-500 text-xs mt-0.5">Automated AOP ledger tracking administrative mutations and auth activities.</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
          {/* Live Activity Radar Indicator */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-widest rounded-full select-none">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600" />
            </span>
            <span>Console Streaming Live</span>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-auto">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" sx={{ fontSize: "1.1rem" }} />
            <input
              type="text"
              placeholder="Search IP, Actor, Action..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-11 pr-4 py-2.5 w-full sm:w-56 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
            />
          </div>

          {/* Status Dropdown */}
          <div className="relative w-full sm:w-auto">
            <FilterListIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" sx={{ fontSize: "1.1rem" }} />
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="pl-11 pr-8 py-2.5 w-full sm:w-auto bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-600 appearance-none focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary cursor-pointer"
            >
              <option value="">All Statuses</option>
              <option value="SUCCESS">Success Only</option>
              <option value="FAILED">Failures Only</option>
            </select>
          </div>

          {/* Refresh Button */}
          <Tooltip title="Force Sync Console">
            <IconButton 
              onClick={fetchLogs} 
              sx={{ border: "1px solid #e5e7eb", borderRadius: 3, p: 1.2, bg: "#f9fafb", "&:hover": { bg: "#f3f4f6" } }}
            >
              <RefreshIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Tooltip>
        </div>
      </div>

      {/* ─── AUDIT TRAILS ROSTER ─── */}
      <div className="glass-panel rounded-3xl overflow-hidden shadow-sm border border-gray-100 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-gray-400 text-[10px] font-extrabold uppercase tracking-wider">
                <th className="px-6 py-4">Security Level</th>
                <th className="px-6 py-4">Action</th>
                <th className="px-6 py-4">Performed By</th>
                <th className="px-6 py-4">IP Address</th>
                <th className="px-6 py-4">Timestamp</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs text-gray-700">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4"><div className="h-6 w-20 bg-gray-100 rounded-full" /></td>
                    <td className="px-6 py-4"><div className="h-4 w-28 bg-gray-100 rounded" /></td>
                    <td className="px-6 py-4"><div className="h-4 w-36 bg-gray-100 rounded" /></td>
                    <td className="px-6 py-4"><div className="h-4 w-24 bg-gray-100 rounded" /></td>
                    <td className="px-6 py-4"><div className="h-4 w-32 bg-gray-100 rounded" /></td>
                    <td className="px-6 py-4 text-right"><div className="h-6 w-12 bg-gray-100 rounded ml-auto" /></td>
                  </tr>
                ))
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-16 text-center select-none">
                    <div className="max-w-md mx-auto flex flex-col items-center justify-center space-y-4">
                      <span className="text-5xl block animate-bounce">🔍</span>
                      <p className="text-brand-navy-dark font-black text-base">No operations activities found</p>
                      <p className="text-gray-400 text-xs font-semibold">We couldn't locate any audit ledger records matching your current filter queries.</p>
                      <button
                        onClick={handleResetFilters}
                        className="text-xs font-black text-white bg-primary hover:bg-amber-700 px-5 py-2.5 rounded-xl transition duration-200"
                      >
                        Reset Console Filters
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                logs.map((log) => {
                  const severity = getLogSeverity(log);
                  let badgeStyle = "bg-blue-50 text-blue-600 border-blue-100";
                  if (severity === "MEDIUM") badgeStyle = "bg-amber-50 text-amber-600 border-amber-100";
                  if (severity === "HIGH") badgeStyle = "bg-orange-50 text-orange-600 border-orange-100";
                  if (severity === "CRITICAL") badgeStyle = "bg-rose-50 text-rose-600 border-rose-100 animate-pulse";

                  return (
                    <tr 
                      key={log.id} 
                      className="hover:bg-amber-50/10 cursor-pointer transition-colors"
                      onClick={() => setSelectedLog(log)}
                    >
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 text-[9px] font-black px-2.5 py-1 rounded-full border uppercase tracking-wider ${badgeStyle}`}>
                          <ShieldIcon sx={{ fontSize: 9 }} /> {severity}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-bold text-brand-navy-dark font-mono bg-brand-navy-dark/5 px-2.5 py-1.2 rounded text-[10px] tracking-tight border border-black/5">
                          {log.action}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-bold text-gray-800 flex items-center gap-2">
                        <div className="w-6 h-6 bg-gradient-to-tr from-primary/20 to-primary/5 rounded-full flex items-center justify-center text-[10px] font-black uppercase text-primary">
                          {String(log.performedBy || log.username || "S").substring(0, 1)}
                        </div>
                        <span>{log.performedBy || log.username || "System Engine"}</span>
                      </td>
                      <td className="px-6 py-4 font-mono text-gray-500 font-medium">{log.ipAddress || "127.0.0.1"}</td>
                      <td className="px-6 py-4 text-gray-400 font-bold">{formatTimestamp(log.timestamp)}</td>
                      <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <button 
                          onClick={() => setSelectedLog(log)}
                          className="px-3.5 py-2 bg-gray-50 hover:bg-primary hover:text-white border border-gray-200 hover:border-primary rounded-xl text-[10px] font-black text-gray-600 transition-all shadow-sm"
                        >
                          Inspect Forensic
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* ─── PAGINATION BAR ─── */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
            <span className="text-xs text-gray-400 font-bold">
              Showing <span className="font-black text-gray-600">{page * 10 + 1}-{Math.min(totalElements, (page + 1) * 10)}</span> of <span className="font-black text-gray-600">{totalElements}</span> logs
            </span>
            <div className="flex gap-2">
              <button
                onClick={handlePrevPage}
                disabled={page === 0}
                className="px-4 py-2 border border-gray-250 rounded-xl text-xs font-black bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
              >
                Prev
              </button>
              <button
                onClick={handleNextPage}
                disabled={page >= totalPages - 1}
                className="px-4 py-2 border border-gray-250 rounded-xl text-xs font-black bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ─── DETAILED FORENSIC INSPECTION DRAWER ─── */}
      <Drawer
        anchor="right"
        open={selectedLog !== null}
        onClose={() => setSelectedLog(null)}
        PaperProps={{
          sx: { 
            width: { xs: "100%", sm: 520 }, 
            p: 4, 
            display: "flex", 
            flexDirection: "column",
            borderLeft: "1px solid rgba(176, 122, 63, 0.15)",
            boxShadow: "-20px 0 40px rgba(0, 0, 0, 0.08)"
          },
        }}
      >
        {selectedLog && (
          <div className="flex flex-col h-full space-y-6 select-text text-left">
            {/* Header */}
            <div className="flex justify-between items-center pb-4 border-b border-gray-150">
              <div>
                <span className="text-[10px] font-black tracking-widest text-primary uppercase">Forensic Inspector Deck</span>
                <h3 className="text-lg font-black text-brand-navy-dark mt-0.5 font-mono truncate max-w-[320px]">{selectedLog.action}</h3>
              </div>
              <IconButton onClick={() => setSelectedLog(null)}>
                <CloseIcon />
              </IconButton>
            </div>

            {/* Core Metadata Specifications */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-2xl p-3 border border-gray-100">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">Security Context</span>
                <div className="mt-1.5">
                  {selectedLog.status === "SUCCESS" ? (
                    <span className="inline-flex text-[9px] font-black text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-100 uppercase tracking-wider">
                      SUCCESSFUL OPERATION
                    </span>
                  ) : (
                    <span className="inline-flex text-[9px] font-black text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded border border-rose-100 uppercase tracking-wider animate-pulse">
                      ANOMALY BREACH / FAIL
                    </span>
                  )}
                </div>
              </div>

              <div className="bg-gray-50 rounded-2xl p-3 border border-gray-100">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">System Timestamp</span>
                <div className="mt-1.5 flex items-center gap-1.5 text-xs text-gray-600 font-bold">
                  <CalendarTodayIcon sx={{ fontSize: 13, color: "primary.main" }} />
                  <span>{formatTimestamp(selectedLog.timestamp)}</span>
                </div>
              </div>

              <div className="bg-gray-50 rounded-2xl p-3 border border-gray-100">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">Origin IP Address</span>
                <div className="mt-1.5 flex items-center gap-1.5 text-xs text-gray-600 font-mono font-bold">
                  <LanguageIcon sx={{ fontSize: 13, color: "primary.main" }} />
                  <span>{selectedLog.ipAddress || "127.0.0.1"}</span>
                </div>
              </div>

              <div className="bg-gray-50 rounded-2xl p-3 border border-gray-100">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">Authenticated Claims</span>
                <div className="mt-1.5 text-xs text-gray-600 font-bold truncate">
                  {selectedLog.performedBy || selectedLog.username || "System Session"}
                </div>
              </div>
            </div>

            {/* Error Message if Failed */}
            {selectedLog.status === "FAILED" && selectedLog.errorMessage && (
              <div className="bg-rose-50/50 border border-rose-100 rounded-2xl p-4 space-y-2 text-left">
                <span className="text-[10px] font-extrabold text-rose-600 uppercase tracking-wider block">Stack Failure Error Trace</span>
                <p className="text-xs text-rose-700 font-bold font-mono whitespace-pre-wrap select-text leading-relaxed bg-white/80 p-3 rounded-xl border border-rose-100/60 shadow-inner max-h-36 overflow-y-auto">{selectedLog.errorMessage}</p>
              </div>
            )}

            {/* HTTP User-Agent Details */}
            <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 space-y-2 text-left">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                <LaptopMacIcon sx={{ fontSize: 13 }} /> Browser & Client User-Agent
              </span>
              <p className="text-[10px] text-gray-600 font-bold leading-relaxed font-mono select-all break-all bg-white/60 p-2.5 rounded-xl border border-gray-200/50">{selectedLog.userAgent || "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/Vite Engine"}</p>
            </div>

            {/* Sanitized Action Parameters Details pretty printed */}
            <div className="flex-grow flex flex-col bg-gray-950 rounded-2xl p-4 border border-gray-800 text-white font-mono text-[10px] overflow-hidden relative">
              <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-3">
                <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest block">Forensic Payload Analysis</span>
                <button
                  onClick={handleCopyPayload}
                  className="text-[9px] bg-white/10 hover:bg-white/20 border border-white/5 text-amber-300 hover:text-amber-400 font-black px-2.5 py-1.2 rounded-lg transition duration-200 flex items-center gap-1 shadow-inner cursor-pointer"
                >
                  <ContentCopyIcon sx={{ fontSize: 9 }} />
                  {copied ? "Copied Payload!" : "Copy Raw JSON"}
                </button>
              </div>
              <div className="flex-grow overflow-y-auto custom-scrollbar select-text leading-relaxed whitespace-pre-wrap select-all font-mono text-[10px] text-gray-200">
                {formattedPayload}
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default AuditLogsPanel;
