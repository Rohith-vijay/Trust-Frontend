import React, { useState, useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { pageVariants, pageTransition } from "../constants/motionVariants";
import { useAuth } from "../hooks/useAuth";
import databaseService from "../services/databaseService";
import notificationService from "../services/notificationService";
import {
  getMessages,
  markAsRead,
  deleteMessage,
  getUnreadCount,
  getVolunteerApplications,
  updateApplicationStatus,
} from "../services/messageService";

import { lazy, Suspense } from "react";

// Lazy-loaded Modular Tab Panels
const AnalyticsPanel = lazy(() => import("./panels/AnalyticsPanel"));
const VolunteersPanel = lazy(() => import("./panels/VolunteersPanel"));
const ImpactPanel = lazy(() => import("./panels/ImpactPanel"));
const StoriesPanel = lazy(() => import("./panels/StoriesPanel"));
const MembersPanel = lazy(() => import("./panels/MembersPanel"));
const EventsPanel = lazy(() => import("./panels/EventsPanel"));
const DonationsPanel = lazy(() => import("./panels/DonationsPanel"));
const UsersPanel = lazy(() => import("./panels/UsersPanel"));
const MediaPanel = lazy(() => import("./panels/MediaPanel"));
const PagesPanel = lazy(() => import("./panels/PagesPanel"));
const SettingsPanel = lazy(() => import("./panels/SettingsPanel"));

const MessagesPanelComponent = lazy(() => import("./panels/MessagesPanel")); // specific naming to avoid any keyword clash
const AuditLogsPanel = lazy(() => import("./panels/AuditLogsPanel"));

// ─── ERROR BOUNDARY SHIELD ───
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("[DashboardErrorBoundary] Caught a fatal runtime exception:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 bg-rose-50/50 border border-rose-100 rounded-3xl text-rose-950 space-y-4 shadow-sm">
          <div className="flex items-center gap-3 text-rose-700 font-extrabold">
            <span className="text-3xl">🚨</span>
            <div>
              <h4 className="text-lg font-black leading-tight">Dashboard Panel Crash Prevented</h4>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">Protected by Antigravity Shield Boundary</p>
            </div>
          </div>
          <p className="text-xs font-semibold leading-relaxed">
            A fatal exception occurred inside this tab panel's React tree. The dashboard shell was shielded from crashing and remains fully responsive.
          </p>
          <div className="bg-white/80 border border-rose-100/60 rounded-2xl p-4 font-mono text-[10px] text-rose-800 max-h-48 overflow-auto whitespace-pre-wrap select-text shadow-inner">
            {this.state.error?.stack || this.state.error?.toString()}
          </div>
          <button 
            onClick={() => this.setState({ hasError: false, error: null })}
            className="text-xs font-black text-white bg-rose-600 hover:bg-rose-700 hover:shadow-lg hover:shadow-rose-600/20 px-5 py-2.5 rounded-xl transition duration-200"
          >
            Clear Exception & Re-Render Panel
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// ─────────────────────────────────────────────────────────────
// ADMIN DASHBOARD SHELL
// ─────────────────────────────────────────────────────────────
const Dashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  // ── Shared / Core data ──
  const [dashboardData, setDashboardData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [volunteerApps, setVolunteerApps] = useState([]);
  const [activities, setActivities] = useState([]);

  // ── WebSockets & Notifications States ──
  const [notifications, setNotifications] = useState([]);
  const [unreadAlertsCount, setUnreadAlertsCount] = useState(0);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const notificationRef = useRef(null);
  const [alertFilter, setAlertFilter] = useState("ALL");
  const [wsStatus, setWsStatus] = useState("DISCONNECTED");
  const [portalCoords, setPortalCoords] = useState(null);

  const updateCoords = useCallback(() => {
    if (notificationRef.current) {
      const rect = notificationRef.current.getBoundingClientRect();
      const width = Math.min(320, window.innerWidth - 32);
      let left = rect.right - width;
      if (left < 16) {
        left = 16;
      }
      if (left + width > window.innerWidth - 16) {
        left = window.innerWidth - width - 16;
      }
      setPortalCoords({
        top: rect.bottom + 8,
        left: left,
        width: width,
      });
    }
  }, []);

  useEffect(() => {
    if (isNotificationOpen) {
      updateCoords();
      window.addEventListener("resize", updateCoords);
      window.addEventListener("scroll", updateCoords);
    }
    return () => {
      window.removeEventListener("resize", updateCoords);
      window.removeEventListener("scroll", updateCoords);
    };
  }, [isNotificationOpen, updateCoords]);

  // ── Tab-specific datasets ──
  const [impactStats, setImpactStats] = useState([]);
  const [stories, setStories] = useState([]);
  const [members, setMembers] = useState([]);
  const [events, setEvents] = useState([]);
  const [donations, setDonations] = useState([]);
  const [users, setUsers] = useState([]);
  const [heroImageUrl, setHeroImageUrl] = useState("");
  const [donationPage, setDonationPage] = useState(0);
  const [totalDonationPages, setTotalDonationPages] = useState(1);
  const [userPage, setUserPage] = useState(0);

  // ── CRITICAL FIX: Declaring the missing pageContent state to prevent runtime crash ──
  const [pageContent, setPageContent] = useState({});

  // ── Form fields states ──
  const [storyForm, setStoryForm] = useState({ title: "", subtitle: "", imageUrl: "", category: "", description: "", beforeImageUrl: "", afterImageUrl: "", testimonialQuote: "", testimonialAuthor: "", videoUrl: "" });
  const [memberForm, setMemberForm] = useState({ name: "", role: "", tagline: "", bio: "", imageUrl: "" });
  const [eventForm, setEventForm] = useState({
    title: "", description: "", location: "", eventDate: "", registrationDeadline: "", maxVolunteers: "", bannerUrl: "", thumbnailUrl: "", heroImageUrl: "", coverImage: "", instagramUrl: "", youtubeUrl: "", facebookUrl: ""
  });

  // ── New: impact create form ──
  const [impactForm, setImpactForm] = useState({ category: "", currentValue: 0, unit: "", icon: "", displayOrder: 0 });

  // ── New: inline editing states ──
  const [editingStory, setEditingStory] = useState(null);
  const [editingMember, setEditingMember] = useState(null);
  const [editingEvent, setEditingEvent] = useState(null);
  const [editingImpact, setEditingImpact] = useState(null);

  // ── Settings keys state ──
  const [settingInputs, setSettingInputs] = useState({
    HOME_HERO_IMAGE: "", HOME_HERO_TITLE: "", HOME_HERO_SUBTITLE: "",
    HOME_HERO_CTA_TEXT: "", HOME_HERO_CTA_LINK: "",
    HISTORY_TITLE: "", HISTORY_SUBTITLE: "", HISTORY_MILESTONES: "",
    VISION_HERO_TITLE: "", VISION_HERO_SUBTITLE: "", VISION_MISSION: "",
    VISION_PILLARS: "", VISION_ROADMAP: "", VISION_IMPACTS: "",
    IMPACT_SHOWCASE_CONFIG: ""
  });

  const [tabLoading, setTabLoading] = useState(false);

  // ──────────────────────────────────────────────────────────
  // DATA ACTIONS & CORE LIFECYCLE
  // ──────────────────────────────────────────────────────────

  const refreshCore = useCallback(async () => {
    try {
      const [msgs, count, apps] = await Promise.all([
        getMessages(),
        getUnreadCount(),
        getVolunteerApplications(),
      ]);
      setMessages(msgs);
      setUnreadCount(count);
      setVolunteerApps(apps);
    } catch (err) {
      console.error("Error refreshing core data:", err);
    }
  }, []);

  const loadActivities = useCallback(async () => {
    try {
      const res = await databaseService.getActivities();
      const payload = res.data || res;
      setActivities(payload.content || (Array.isArray(payload) ? payload : []));
    } catch (e) {
      console.error("Failed to load activities:", e);
    }
  }, []);

  const loadDashboard = useCallback(async () => {
    try {
      const [summaryRes, activitiesRes] = await Promise.allSettled([
        databaseService.getDashboardSummary(),
        databaseService.getActivities()
      ]);
      if (summaryRes.status === "fulfilled") {
        setDashboardData(summaryRes.value.data || summaryRes.value);
      }
      if (activitiesRes.status === "fulfilled") {
        const payload = activitiesRes.value.data || activitiesRes.value;
        setActivities(payload.content || (Array.isArray(payload) ? payload : []));
      }
    } catch (err) {
      console.error("Error loading dashboard:", err);
    }
  }, []);

  const loadImpact = useCallback(async () => {
    setTabLoading(true);
    try { setImpactStats(await databaseService.getImpactData()); } catch (e) { console.error(e); }
    setTabLoading(false);
  }, []);

  const loadStories = useCallback(async () => {
    setTabLoading(true);
    try { setStories(await databaseService.getSuccessStories(true)); } catch (e) { console.error(e); }
    setTabLoading(false);
  }, []);

  const loadMembers = useCallback(async () => {
    setTabLoading(true);
    try { setMembers(await databaseService.getTeamMembers(true)); } catch (e) { console.error(e); }
    setTabLoading(false);
  }, []);

  const loadEvents = useCallback(async () => {
    setTabLoading(true);
    try {
      const page = await databaseService.getEvents(0, 50, true);
      setEvents(page.content || page);
    } catch (e) { console.error(e); }
    setTabLoading(false);
  }, []);

  const loadDonations = useCallback(async (pageNo = 0) => {
    setTabLoading(true);
    try {
      const res = await databaseService.getDonations(pageNo, 10);
      const page = res.data || res;
      setDonations(page.content || page);
      setTotalDonationPages(page.totalPages || 1);
      setDonationPage(pageNo);
    } catch (e) { console.error(e); }
    setTabLoading(false);
  }, []);

  const loadUsers = useCallback(async () => {
    setTabLoading(true);
    try {
      const res = await databaseService.getUsers();
      setUsers(res.data || res);
      setUserPage(0);
    } catch (e) { console.error(e); }
    setTabLoading(false);
  }, []);

  const loadSettings = useCallback(async () => {
    try {
      const s = await databaseService.getAllPublicSettings();
      const img = s.HOME_HERO_IMAGE || "";
      setHeroImageUrl(img);
      setSettingInputs(prev => ({
        ...prev,
        HOME_HERO_IMAGE: s.HOME_HERO_IMAGE || "",
        HOME_HERO_TITLE: s.HOME_HERO_TITLE || "",
        HOME_HERO_SUBTITLE: s.HOME_HERO_SUBTITLE || "",
        HOME_HERO_CTA_TEXT: s.HOME_HERO_CTA_TEXT || "",
        HOME_HERO_CTA_LINK: s.HOME_HERO_CTA_LINK || "",
      }));
    } catch (e) { console.error(e); }
  }, []);

  const loadPageContent = useCallback(async () => {
    try {
      const [content, settings] = await Promise.all([
        databaseService.getAllPageContent(),
        databaseService.getAllPublicSettings()
      ]);
      setPageContent(content);
      setSettingInputs(prev => ({
        ...prev,
        HISTORY_TITLE: content.HISTORY_TITLE || "",
        HISTORY_SUBTITLE: content.HISTORY_SUBTITLE || "",
        HISTORY_MILESTONES: content.HISTORY_MILESTONES || "",
        VISION_HERO_TITLE: content.VISION_HERO_TITLE || "",
        VISION_HERO_SUBTITLE: content.VISION_HERO_SUBTITLE || "",
        VISION_MISSION: content.VISION_MISSION || "",
        VISION_PILLARS: content.VISION_PILLARS || "",
        VISION_ROADMAP: content.VISION_ROADMAP || "",
        VISION_IMPACTS: content.VISION_IMPACTS || "",
        IMPACT_SHOWCASE_CONFIG: settings.IMPACT_SHOWCASE_CONFIG || ""
      }));
    } catch (e) { console.error("Failed to load page content:", e); }
  }, []);

  useEffect(() => {
    refreshCore();
    loadDashboard();
    const interval = setInterval(refreshCore, 15000);
    return () => clearInterval(interval);
  }, [refreshCore, loadDashboard]);

  // ── WebSockets & Notifications Real-Time STOMP Client mount ──
  useEffect(() => {
    if (!user || !user.email) return;

    const loadAlerts = async () => {
      try {
        const res = await notificationService.getNotifications(0, 20);
        const countRes = await notificationService.getUnreadCount();
        setNotifications(res.data?.content || res.content || []);
        setUnreadAlertsCount(countRes.data != null ? countRes.data : countRes);
      } catch (err) {
        console.error("Failed to load initial notifications:", err);
      }
    };
    loadAlerts();

    const stompClient = notificationService.connectWebSocket(
      user.email,
      (newAlert) => {
        setNotifications(prev => [newAlert, ...prev]);
        setUnreadAlertsCount(prev => prev + 1);
        if (typeof window !== "undefined" && "Notification" in window && window.Notification.permission === "granted") {
          try {
            new window.Notification(newAlert.title, { body: newAlert.message });
          } catch (e) {
            console.warn("[NotificationEngine] Native notification display failed:", e);
          }
        }
        // Real-time update of KPIs and audit timeline
        loadDashboard();
      },
      (err) => {
        console.error("[Dashboard] WebSocket error:", err);
      },
      (status) => {
        setWsStatus(status);
      }
    );

    if (typeof window !== "undefined" && "Notification" in window && window.Notification.permission === "default") {
      try {
        window.Notification.requestPermission();
      } catch (e) {
        console.warn("[NotificationEngine] Failed to request permission:", e);
      }
    }

    return () => {
      try {
        if (stompClient && typeof stompClient.disconnect === "function") {
          stompClient.disconnect(() => {
            console.log("[NotificationEngine] STOMP Client disconnected cleanly.");
          });
        }
      } catch (err) {
        console.error("[NotificationEngine] Error during disconnect cleanup:", err);
      }
    };
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current && 
        !notificationRef.current.contains(event.target) &&
        !event.target.closest(".notification-portal-panel")
      ) {
        setIsNotificationOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const loaders = {
      impact: loadImpact,
      stories: loadStories,
      members: loadMembers,
      events: loadEvents,
      donations: loadDonations,
      users: loadUsers,
      settings: loadSettings,
      pages: loadPageContent,
    };
    if (loaders[activeTab]) loaders[activeTab]();
  }, [activeTab, loadImpact, loadStories, loadMembers, loadEvents, loadDonations, loadUsers, loadSettings, loadPageContent]);

  // ──────────────────────────────────────────────────────────
  // HANDLERS
  // ──────────────────────────────────────────────────────────

  const handleMarkRead = async (id) => { await markAsRead(id); refreshCore(); };
  const handleDeleteMessage = async (id) => { await deleteMessage(id); refreshCore(); };
  const handleApproveVolunteer = async (id) => { await updateApplicationStatus(id, "approved"); refreshCore(); };
  const handleRejectVolunteer = async (id) => { await updateApplicationStatus(id, "rejected"); refreshCore(); };

  const handleUpdateCounter = async (id, newValue) => {
    try {
      await databaseService.updateImpactCounter(id, Number(newValue));
      loadImpact();
    } catch (e) { console.error(e); }
  };

  const handleCreateStory = async (storyData) => {
    try {
      await databaseService.createStory(storyData);
      setStoryForm({ title: "", subtitle: "", imageUrl: "", category: "", description: "", beforeImageUrl: "", afterImageUrl: "", testimonialQuote: "", testimonialAuthor: "", videoUrl: "" });
      await loadStories();
    } catch (err) { console.error(err); throw err; }
  };

  const handleUpdateStory = async (storyData) => {
    try {
      await databaseService.updateStory(storyData.id, storyData);
      await loadStories();
    } catch (err) { console.error(err); throw err; }
  };

  const handleDeleteStory = async (id) => {
    if (!window.confirm("Remove this success story?")) return;
    try { await databaseService.deleteStory(id); loadStories(); }
    catch (err) { console.error(err); }
  };

  const handleReorderStories = async (newStories) => {
    setStories(newStories); // Optimistic UI update
    try {
      await databaseService.reorderStories(newStories.map(s => s.id));
    } catch (err) {
      console.error(err);
      loadStories(); // Revert on failure
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    try {
      await databaseService.addMember(memberForm);
      setMemberForm({ name: "", role: "", tagline: "", bio: "", imageUrl: "" });
      await loadMembers();
    } catch (err) { console.error(err); throw err; }
  };

  const handleUpdateMember = async (e) => {
    e.preventDefault();
    try {
      await databaseService.updateMember(editingMember.id, editingMember);
      setEditingMember(null);
      await loadMembers();
    } catch (err) { console.error(err); throw err; }
  };

  const handleDeleteMember = async (id) => {
    if (!window.confirm("Remove this team member?")) return;
    try { await databaseService.deleteMember(id); loadMembers(); }
    catch (err) { console.error(err); }
  };

  const handleCreateEvent = async (eventData) => {
    try {
      await databaseService.createEvent(eventData);
      setEventForm({
        title: "", description: "", location: "", eventDate: "", registrationDeadline: "", maxVolunteers: "", bannerUrl: "", thumbnailUrl: "", heroImageUrl: "", coverImage: "", instagramUrl: "", youtubeUrl: "", facebookUrl: ""
      });
      await loadEvents();
    } catch (err) { console.error(err); throw err; }
  };

  const handleUpdateEvent = async (eventData) => {
    try {
      await databaseService.updateEvent(eventData.id, eventData);
      setEditingEvent(null);
      await loadEvents();
    } catch (err) { console.error(err); throw err; }
  };

  const handleDeleteEvent = async (id) => {
    if (!window.confirm("Delete this initiative event?")) return;
    try { await databaseService.deleteEvent(id); loadEvents(); }
    catch (err) { console.error(err); }
  };

  const handleReorderEvents = async (newEvents) => {
    setEvents(newEvents); // Optimistic UI update
    try {
      await databaseService.reorderEvents(newEvents.map(e => e.id));
    } catch (err) {
      console.error(err);
      loadEvents(); // Revert on failure
    }
  };

  const handleToggleEventPublish = async (id, current) => {
    try { await databaseService.toggleEventPublish(id, !current); loadEvents(); }
    catch (err) { console.error(err); }
  };

  const handleToggleEventFeatured = async (id, current) => {
    try { await databaseService.toggleEventFeatured(id, !current); loadEvents(); }
    catch (err) { console.error(err); }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await databaseService.updateUserRole(userId, newRole);
      loadUsers();
    } catch (err) { console.error(err); }
  };

  const handleCreateImpactStat = async (e) => {
    e.preventDefault();
    try {
      await databaseService.createImpactStat({
        ...impactForm,
        currentValue: Number(impactForm.currentValue),
        displayOrder: Number(impactForm.displayOrder),
      });
      setImpactForm({ category: "", currentValue: 0, unit: "", icon: "", displayOrder: 0 });
      await loadImpact();
    } catch (err) { console.error(err); throw err; }
  };

  const handleUpdateImpactFull = async (e) => {
    e.preventDefault();
    try {
      await databaseService.updateImpactStatFull(editingImpact.id, {
        ...editingImpact,
        currentValue: Number(editingImpact.currentValue),
        displayOrder: Number(editingImpact.displayOrder),
      });
      setEditingImpact(null);
      await loadImpact();
    } catch (err) { console.error(err); throw err; }
  };

  const handleDeleteImpactStat = async (id) => {
    if (!window.confirm("Delete this metric?")) return;
    try { await databaseService.deleteImpactStat(id); loadImpact(); }
    catch (err) { console.error(err); }
  };

  const handleSaveSetting = async (key) => {
    try {
      await databaseService.upsertSetting(key, settingInputs[key]);
      if (key === "HOME_HERO_IMAGE") setHeroImageUrl(settingInputs[key]);
    } catch (err) { console.error(err); }
  };

  const formatDate = (iso) => {
    if (!iso) return "—";
    const d = new Date(iso);
    if (isNaN(d.getTime())) return "—";
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  const tabs = [
    { key: "overview", label: "Overview", icon: "📊" },
    { key: "messages", label: "Messages", icon: "✉️", badge: unreadCount > 0 ? unreadCount : null },
    { key: "volunteers", label: "Volunteers", icon: "🤝" },
    { key: "impact", label: "Impact", icon: "📈" },
    { key: "stories", label: "Stories", icon: "📖" },
    { key: "members", label: "Members", icon: "👤" },
    { key: "events", label: "Events", icon: "📅" },
    { key: "donations", label: "Donations", icon: "💰" },
    { key: "users", label: "Users", icon: "👥" },
    { key: "media", label: "Media Assets", icon: "🖼️" },
    { key: "pages", label: "Pages", icon: "📄" },
    { key: "settings", label: "Settings", icon: "⚙️" },
    { key: "audit", label: "Audit Logs", icon: "🛡️" },
  ];

  return (
    <motion.div
      variants={pageVariants} initial="initial" animate="animate" exit="exit"
      transition={pageTransition} className="py-8"
    >
      {/* Header Glass greeting */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8 p-8 rounded-3xl bg-gradient-to-br from-amber-500/[0.04] via-primary/[0.01] to-transparent border border-amber-500/15 shadow-sm relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/[0.03] rounded-full blur-3xl -mr-16 -mt-16 animate-pulse"></div>
        <div className="relative z-10 flex items-center gap-5">
          <div className="w-16 h-16 bg-amber-50 text-amber-700 rounded-2xl border border-amber-100 flex items-center justify-center text-3xl shadow-sm">
            👑
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-brand-navy-dark tracking-tight">Admin Operations Command</h1>
            <p className="text-gray-500 mt-1.5 text-sm flex flex-wrap items-center gap-3">
              Session Identity: <span className="font-bold text-primary">{user?.name || user?.email}</span>
              <span className={`inline-flex items-center gap-1.5 text-[9px] uppercase tracking-wider font-extrabold px-2.5 py-0.5 rounded-full select-none border transition-all ${
                wsStatus === "CONNECTED" ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
                wsStatus === "CONNECTING" ? "bg-amber-50 text-amber-700 border-amber-100 animate-pulse" :
                "bg-rose-50 text-rose-700 border-rose-100"
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${
                  wsStatus === "CONNECTED" ? "bg-emerald-500" :
                  wsStatus === "CONNECTING" ? "bg-amber-500 animate-ping" :
                  "bg-rose-500"
                }`} />
                {wsStatus === "CONNECTED" ? "Telemetry Connected" : wsStatus}
              </span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 relative z-[9999]">
          {/* Real-time Notification Center Bell */}
          <div className="relative z-[9999]" ref={notificationRef}>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              className="relative p-3 bg-white border border-amber-100/60 rounded-full hover:bg-amber-50/20 hover:shadow-md transition-all duration-300 flex items-center justify-center"
            >
              <span className="text-xl">🔔</span>
              {unreadAlertsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-[10px] font-black rounded-full h-5 w-5 flex items-center justify-center animate-pulse border border-white">
                  {unreadAlertsCount}
                </span>
              )}
            </motion.button>
 
            {/* Dropdown Menu List Panel via React Portal */}
            {createPortal(
              <AnimatePresence>
                {isNotificationOpen && (
                  <div className="fixed inset-0 z-[99999] pointer-events-none">
                    {/* Click outside backdrop overlay */}
                    <div 
                      className="fixed inset-0 pointer-events-auto bg-black/[0.02]" 
                      onClick={() => setIsNotificationOpen(false)}
                    />
                    <ErrorBoundary>
                      <motion.div
                        initial={{ opacity: 0, y: 12, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 12, scale: 0.96 }}
                        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        style={{
                          position: "fixed",
                          top: portalCoords ? `${portalCoords.top}px` : "80px",
                          left: portalCoords ? `${portalCoords.left}px` : "auto",
                          right: portalCoords ? "auto" : "24px",
                          width: portalCoords ? `${portalCoords.width}px` : "320px",
                        }}
                        className="notification-portal-panel pointer-events-auto bg-white border border-indigo-50/80 shadow-2xl overflow-hidden flex flex-col max-h-[450px] rounded-2xl"
                      >
                        <div className="px-4.5 py-3.5 border-b border-gray-150 bg-gray-50/50 flex items-center justify-between">
                          <span className="text-xs font-black text-brand-navy-dark uppercase tracking-wider">Alert Center</span>
                          <div className="flex items-center gap-2">
                            {unreadAlertsCount > 0 && (
                              <button
                                onClick={async () => {
                                  try {
                                    await notificationService.markAllAsRead();
                                    setUnreadAlertsCount(0);
                                    setNotifications(prev => (prev || []).map(n => ({ ...n, isRead: true })));
                                  } catch (e) {
                                    console.error(e);
                                  }
                                }}
                                className="text-[10px] font-extrabold text-primary hover:text-amber-700 bg-primary/5 px-2.5 py-1 rounded-full transition-all"
                              >
                                Clear All
                              </button>
                            )}
                            <button
                              onClick={() => setIsNotificationOpen(false)}
                              className="sm:hidden text-gray-400 hover:text-gray-600 text-sm font-black p-1"
                            >
                              ✕
                            </button>
                          </div>
                        </div>
 
                        {/* Category Filter Tabs */}
                        <div className="flex items-center gap-1.5 px-4 py-2 border-b border-gray-100 bg-white overflow-x-auto scrollbar-none">
                          {["ALL", "SYSTEM", "DONATION", "APPROVAL"].map((cat) => (
                            <button
                              key={cat}
                              onClick={() => setAlertFilter(cat)}
                              className={`text-[9px] font-black px-2.5 py-1 rounded-full border transition-all whitespace-nowrap ${
                                alertFilter === cat
                                  ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                                  : "bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100"
                              }`}
                            >
                              {cat === "ALL" ? "All Alerts" : cat}
                            </button>
                          ))}
                        </div>
 
                        <div className="overflow-y-auto divide-y divide-gray-50 max-h-[300px] sm:max-h-[320px] custom-scrollbar flex-grow text-left">
                          {(notifications || []).filter(n => alertFilter === "ALL" || n.category === alertFilter).length === 0 ? (
                            <div className="p-8 text-center text-xs text-gray-450 font-semibold">
                              No {alertFilter !== "ALL" ? alertFilter.toLowerCase() : ""} notifications recorded.
                            </div>
                          ) : (
                            (notifications || [])
                              .filter(n => alertFilter === "ALL" || n.category === alertFilter)
                              .map((alert) => {
                                let categoryColor = "bg-blue-50 text-blue-600 border-blue-100";
                                if (alert.category === "DONATION") categoryColor = "bg-emerald-50 text-emerald-600 border-emerald-100";
                                if (alert.category === "SYSTEM") categoryColor = "bg-rose-50 text-rose-600 border-rose-100";
                                if (alert.category === "APPROVAL") categoryColor = "bg-purple-50 text-purple-600 border-purple-100";
 
                                return (
                                  <div 
                                    key={alert.id} 
                                    onClick={async () => {
                                      try {
                                        if (!alert.isRead) {
                                          await notificationService.markAsRead(alert.id);
                                          setUnreadAlertsCount(prev => Math.max(0, prev - 1));
                                          setNotifications(prev => (prev || []).map(n => n.id === alert.id ? { ...n, isRead: true } : n));
                                        }
                                      } catch (e) {
                                        console.error(e);
                                      }
                                    }}
                                    className={`p-4 flex gap-3 hover:bg-gray-50/50 cursor-pointer transition-colors relative text-left ${!alert.isRead ? "bg-indigo-50/10 border-l-2 border-l-indigo-500" : ""}`}
                                  >
                                    <div className="flex-grow space-y-1 select-none">
                                      <div className="flex justify-between items-start gap-2">
                                        <h5 className="font-bold text-xs text-brand-navy-dark leading-tight">{alert.title}</h5>
                                        <span className={`text-[8px] font-extrabold px-1.5 py-0.5 rounded border uppercase tracking-wider ${categoryColor}`}>
                                          {alert.category}
                                        </span>
                                      </div>
                                      <p className="text-[10px] text-gray-500 leading-normal">{alert.message}</p>
                                      <span className="text-[9px] text-gray-400 block pt-0.5">
                                        {(() => {
                                          if (!alert.createdAt) return "—";
                                          const d = new Date(alert.createdAt);
                                          if (isNaN(d.getTime())) return "—";
                                          return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                                        })()}
                                      </span>
                                    </div>
                                  </div>
                                );
                              })
                          )}
                        </div>
                      </motion.div>
                    </ErrorBoundary>
                  </div>
                )}
              </AnimatePresence>,
              document.body
            )}
          </div>
 
          {unreadCount > 0 && (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab("messages")}
              className="flex items-center space-x-2 bg-rose-50 text-rose-700 px-6 py-3 rounded-full text-xs font-bold hover:bg-rose-100 hover:shadow-md transition-all duration-300 border border-rose-100"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500" />
              </span>
              <span>{unreadCount} Inbox {unreadCount > 1 ? "s" : ""}</span>
            </motion.button>
          )}
        </div>
      </motion.div>
 
      {/* Stats row cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { label: "Messages Log", value: Array.isArray(messages) ? messages.length : 0, change: `${unreadCount} unread`, color: "bg-red-50 text-red-700 border-l-4 border-l-red-500" },
          { label: "Volunteers App", value: dashboardData?.totalApplications ?? (Array.isArray(volunteerApps) ? volunteerApps.length : 0), change: `${dashboardData?.pendingApplications ?? (Array.isArray(volunteerApps) ? volunteerApps.filter(a => a.status === "pending").length : 0)} pending`, color: "bg-emerald-50 text-emerald-700 border-l-4 border-l-emerald-500" },
          { label: "Collected Fundings", value: dashboardData?.totalAmountCollected != null ? `₹${Number(dashboardData.totalAmountCollected).toLocaleString("en-IN")}` : "—", change: dashboardData ? `${dashboardData.totalDonations} transactions` : "Loading…", color: "bg-amber-50 text-amber-700 border-l-4 border-l-amber-500" },
          { label: "Initiative Campaigns", value: dashboardData?.totalEvents ?? "—", change: dashboardData ? `${dashboardData.upcomingEvents} upcoming` : "Loading…", color: "bg-indigo-50 text-indigo-700 border-l-4 border-l-indigo-500" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl shadow-sm border border-gray-100/80 p-6 hover-glow-gold hover:shadow-md transition-all duration-300 flex flex-col justify-between min-h-[140px] relative overflow-hidden group">
            <div>
              <p className="text-[11px] uppercase tracking-wider text-gray-400 font-extrabold mb-1.5">{stat.label}</p>
              <p className="text-3xl font-black text-brand-navy-dark tracking-tight">{stat.value}</p>
            </div>
            <div className="mt-3">
              <span className={`text-[10px] font-extrabold px-3 py-1 rounded-full inline-block ${stat.color}`}>{stat.change}</span>
            </div>
          </div>
        ))}
      </div>
 
      {/* Main sidebar tab wrapper */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-150 overflow-hidden flex flex-col md:flex-row min-h-[600px]">
        {/* Navigation Sidebar Panel */}
        <div className="w-full md:w-64 bg-gray-50/50 border-r border-gray-150 flex flex-row md:flex-col p-4 overflow-x-auto md:overflow-visible space-x-2 md:space-x-0 md:space-y-1 scrollbar-hide md:min-w-[240px]">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-shrink-0 flex items-center justify-between px-5 py-3 text-xs uppercase tracking-wider font-extrabold rounded-xl transition-all duration-350 ${
                activeTab === tab.key
                  ? "bg-gradient-to-r from-amber-500/[0.06] to-primary/[0.02] text-primary border-l-4 border-l-primary shadow-sm shadow-amber-500/[0.01]"
                  : "text-gray-600 hover:text-brand-navy-dark hover:bg-gray-50 border-l-4 border-l-transparent"
              }`}
            >
              <div className="flex items-center space-x-3 whitespace-nowrap">
                <span className="text-base">{tab.icon}</span>
                <span>{tab.label}</span>
              </div>
              {tab.badge && (
                <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold animate-pulse ml-2">
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Action Panel Content Slot */}
        <div className="flex-1 p-8">
          <ErrorBoundary>
            <Suspense fallback={<LoadingSpinner />}>
              {activeTab === "overview" && (
                <AnalyticsPanel
                  dashboardData={dashboardData}
                  activities={activities}
                  tabLoading={tabLoading}
                  onRefreshActivities={loadActivities}
                  formatDate={formatDate}
                />
              )}

              {activeTab === "messages" && (
                <MessagesPanelComponent
                  messages={messages}
                  unreadCount={unreadCount}
                  onMarkRead={handleMarkRead}
                  onDeleteMessage={handleDeleteMessage}
                  formatDate={formatDate}
                  EmptyState={EmptyState}
                />
              )}

              {activeTab === "volunteers" && (
                <VolunteersPanel
                  volunteerApps={volunteerApps}
                  onApproveVolunteer={handleApproveVolunteer}
                  onRejectVolunteer={handleRejectVolunteer}
                  formatDate={formatDate}
                  EmptyState={EmptyState}
                />
              )}

              {activeTab === "impact" && (
                <ImpactPanel
                  impactStats={impactStats}
                  impactForm={impactForm}
                  setImpactForm={setImpactForm}
                  editingImpact={editingImpact}
                  setEditingImpact={setEditingImpact}
                  tabLoading={tabLoading}
                  onCreateImpactStat={handleCreateImpactStat}
                  onUpdateCounter={handleUpdateCounter}
                  onUpdateImpactFull={handleUpdateImpactFull}
                  onDeleteImpactStat={handleDeleteImpactStat}
                  LoadingSpinner={LoadingSpinner}
                  EmptyState={EmptyState}
                />
              )}

              {activeTab === "stories" && (
                <StoriesPanel
                  stories={stories}
                  storyForm={storyForm}
                  setStoryForm={setStoryForm}
                  editingStory={editingStory}
                  setEditingStory={setEditingStory}
                  tabLoading={tabLoading}
                  onCreateStory={handleCreateStory}
                  onUpdateStory={handleUpdateStory}
                  onDeleteStory={handleDeleteStory}
                  onReorderStories={handleReorderStories}
                  LoadingSpinner={LoadingSpinner}
                  EmptyState={EmptyState}
                />
              )}

              {activeTab === "members" && (
                <MembersPanel
                  members={members}
                  memberForm={memberForm}
                  setMemberForm={setMemberForm}
                  editingMember={editingMember}
                  setEditingMember={setEditingMember}
                  tabLoading={tabLoading}
                  onAddMember={handleAddMember}
                  onUpdateMember={handleUpdateMember}
                  onDeleteMember={handleDeleteMember}
                  LoadingSpinner={LoadingSpinner}
                  EmptyState={EmptyState}
                />
              )}

              {activeTab === "events" && (
                <EventsPanel
                  events={events}
                  eventForm={eventForm}
                  setEventForm={setEventForm}
                  editingEvent={editingEvent}
                  setEditingEvent={setEditingEvent}
                  tabLoading={tabLoading}
                  onCreateEvent={handleCreateEvent}
                  onUpdateEvent={handleUpdateEvent}
                  onDeleteEvent={handleDeleteEvent}
                  onReorderEvents={handleReorderEvents}
                  onToggleEventPublish={handleToggleEventPublish}
                  onToggleEventFeatured={handleToggleEventFeatured}
                  formatDate={formatDate}
                  LoadingSpinner={LoadingSpinner}
                  EmptyState={EmptyState}
                />
              )}

              {activeTab === "donations" && (
                <DonationsPanel
                  donations={donations}
                  donationPage={donationPage}
                  totalDonationPages={totalDonationPages}
                  tabLoading={tabLoading}
                  onLoadDonations={loadDonations}
                  formatDate={formatDate}
                  LoadingSpinner={LoadingSpinner}
                  EmptyState={EmptyState}
                />
              )}

              {activeTab === "users" && (
                <UsersPanel
                  users={users}
                  userPage={userPage}
                  tabLoading={tabLoading}
                  setUserPage={setUserPage}
                  onRoleChange={handleRoleChange}
                  LoadingSpinner={LoadingSpinner}
                  EmptyState={EmptyState}
                />
              )}

              {activeTab === "media" && (
                <MediaPanel />
              )}

              {activeTab === "pages" && (
                <PagesPanel
                  settingInputs={settingInputs}
                  setSettingInputs={setSettingInputs}
                />
              )}

              {activeTab === "settings" && (
                <SettingsPanel
                  settingInputs={settingInputs}
                  setSettingInputs={setSettingInputs}
                  onSaveSetting={handleSaveSetting}
                />
              )}

              {activeTab === "audit" && (
                <AuditLogsPanel />
              )}
            </Suspense>
          </ErrorBoundary>
        </div>
      </div>
    </motion.div>
  );
};

// ─── Shared Helpers (Passed as visual utilities) ─────────────────────────

function EmptyState({ icon, title, subtitle }) {
  return (
    <div className="bg-gray-50 rounded-2xl p-12 text-center border border-dashed">
      <span className="text-5xl mb-3 block select-none">{icon}</span>
      <p className="text-brand-navy-dark font-bold text-base">{title}</p>
      {subtitle && <p className="text-gray-400 text-sm mt-1.5 font-medium">{subtitle}</p>}
    </div>
  );
}

function LoadingSpinner() {
  return (
    <div className="space-y-4 animate-pulse w-full py-2">
      <div className="shimmer-bg h-6 w-48 rounded-lg mb-4" />
      <div className="shimmer-bg h-4 w-full rounded" />
      <div className="shimmer-bg h-4 w-11/12 rounded" />
      <div className="shimmer-bg h-4 w-5/6 rounded" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
        <div className="shimmer-bg h-24 rounded-2xl" />
        <div className="shimmer-bg h-24 rounded-2xl" />
      </div>
    </div>
  );
}

export default Dashboard;