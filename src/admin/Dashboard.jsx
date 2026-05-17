import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { pageVariants, pageTransition } from "../constants/motionVariants";
import { useAuth } from "../hooks/useAuth";
import api from "../services/api";
import databaseService from "../services/databaseService";
import {
  getMessages,
  markAsRead,
  deleteMessage,
  getUnreadCount,
  getVolunteerApplications,
  updateApplicationStatus,
} from "../services/messageService";

// ─────────────────────────────────────────────────────────────
// ADMIN DASHBOARD
// ─────────────────────────────────────────────────────────────
const Dashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  // ── Shared / Overview data ──
  const [dashboardData, setDashboardData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [volunteerApps, setVolunteerApps] = useState([]);

  // ── Tab-specific data ──
  const [impactStats, setImpactStats] = useState([]);
  const [stories, setStories] = useState([]);
  const [members, setMembers] = useState([]);
  const [events, setEvents] = useState([]);
  const [donations, setDonations] = useState([]);
  const [users, setUsers] = useState([]);
  const [heroImageUrl, setHeroImageUrl] = useState("");

  // ── Form states ──
  const [storyForm, setStoryForm] = useState({ title: "", description: "", imageUrl: "", category: "" });
  const [memberForm, setMemberForm] = useState({ name: "", role: "", tagline: "", bio: "", imageUrl: "" });
  const [eventForm, setEventForm] = useState({
    title: "", description: "", location: "", eventDate: "", registrationDeadline: "", maxVolunteers: "", bannerUrl: ""
  });
  const [heroInput, setHeroInput] = useState("");

  // ── New: impact create form ──
  const [impactForm, setImpactForm] = useState({ category: "", currentValue: 0, unit: "", icon: "", displayOrder: 0 });

  // ── New: inline editing states ──
  const [editingStory, setEditingStory] = useState(null);
  const [editingMember, setEditingMember] = useState(null);
  const [editingEvent, setEditingEvent] = useState(null);
  const [editingImpact, setEditingImpact] = useState(null);

  // ── New: settings key-value map ──
  const [settingInputs, setSettingInputs] = useState({
    HOME_HERO_IMAGE: "", HOME_HERO_TITLE: "", HOME_HERO_SUBTITLE: "",
    HOME_HERO_CTA_TEXT: "", HOME_HERO_CTA_LINK: "",
  });

  // ── Pages content (History + Vision) ──
  const [pageContent, setPageContent] = useState({});
  const [historyTitle, setHistoryTitle] = useState("Our History");
  const [historySubtitle, setHistorySubtitle] = useState("The journey of K.V.G Shanmuka Sai Charitable Trust from its founding to today.");
  const [historyMilestones, setHistoryMilestones] = useState([
    { date: "", event: "", description: "" },
  ]);
  const [visionHeroTitle, setVisionHeroTitle] = useState("Our Vision for the Future");
  const [visionHeroSubtitle, setVisionHeroSubtitle] = useState("We imagine a world where every community thrives.");
  const [visionMission, setVisionMission] = useState("");
  const [visionPillars, setVisionPillars] = useState([
    { title: "", desc: "" },
  ]);
  const [visionRoadmap, setVisionRoadmap] = useState("Year 1 – Expand to 3 districts\nYear 2 – Launch digital education initiative");
  const [visionImpacts, setVisionImpacts] = useState([
    { label: "", value: "" },
  ]);
  const [pageSaveStatus, setPageSaveStatus] = useState("");

  // ── Loading ──
  const [tabLoading, setTabLoading] = useState(false);

  // ──────────────────────────────────────────────────────────
  // DATA FETCHING
  // ──────────────────────────────────────────────────────────

  // Core refresh — messages + volunteers (always needed)
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

  // Load dashboard summary
  const loadDashboard = useCallback(async () => {
    try {
      const res = await databaseService.getDashboardSummary();
      setDashboardData(res.data || res);
    } catch (err) {
      console.error("Error loading dashboard:", err);
    }
  }, []);

  // Tab loaders
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

  const loadDonations = useCallback(async () => {
    setTabLoading(true);
    try {
      const res = await databaseService.getDonations(0, 50);
      const page = res.data || res;
      setDonations(page.content || page);
    } catch (e) { console.error(e); }
    setTabLoading(false);
  }, []);

  const loadUsers = useCallback(async () => {
    setTabLoading(true);
    try {
      const res = await databaseService.getUsers();
      setUsers(res.data || res);
    } catch (e) { console.error(e); }
    setTabLoading(false);
  }, []);

  // Replaces loadHeroImage — loads ALL settings at once
  const loadSettings = useCallback(async () => {
    try {
      const s = await databaseService.getAllPublicSettings();
      const img = s.HOME_HERO_IMAGE || "";
      setHeroImageUrl(img);
      setHeroInput(img);
      setSettingInputs({
        HOME_HERO_IMAGE: s.HOME_HERO_IMAGE || "",
        HOME_HERO_TITLE: s.HOME_HERO_TITLE || "",
        HOME_HERO_SUBTITLE: s.HOME_HERO_SUBTITLE || "",
        HOME_HERO_CTA_TEXT: s.HOME_HERO_CTA_TEXT || "",
        HOME_HERO_CTA_LINK: s.HOME_HERO_CTA_LINK || "",
      });
    } catch (e) { console.error(e); }
  }, []);

  // Loads page content (History, Vision) from the new /api/public/pages/all endpoint
  const loadPageContent = useCallback(async () => {
    try {
      const content = await databaseService.getAllPageContent();
      setPageContent(content);
      if (content.HISTORY_TITLE) setHistoryTitle(content.HISTORY_TITLE);
      if (content.HISTORY_SUBTITLE) setHistorySubtitle(content.HISTORY_SUBTITLE);
      if (content.HISTORY_MILESTONES) {
        try {
          const parsed = JSON.parse(content.HISTORY_MILESTONES);
          if (Array.isArray(parsed) && parsed.length > 0) setHistoryMilestones(parsed);
        } catch (e) { }
      }
      if (content.VISION_HERO_TITLE) setVisionHeroTitle(content.VISION_HERO_TITLE);
      if (content.VISION_HERO_SUBTITLE) setVisionHeroSubtitle(content.VISION_HERO_SUBTITLE);
      if (content.VISION_MISSION) setVisionMission(content.VISION_MISSION);
      if (content.VISION_PILLARS) {
        try {
          const parsed = JSON.parse(content.VISION_PILLARS);
          if (Array.isArray(parsed) && parsed.length > 0) setVisionPillars(parsed);
        } catch (e) { }
      }
      if (content.VISION_ROADMAP) setVisionRoadmap(content.VISION_ROADMAP);
      if (content.VISION_IMPACTS) {
        try {
          const parsed = JSON.parse(content.VISION_IMPACTS);
          if (Array.isArray(parsed) && parsed.length > 0) setVisionImpacts(parsed);
        } catch (e) { }
      }
    } catch (e) { console.error("Failed to load page content:", e); }
  }, []);

  // Initial load
  useEffect(() => {
    refreshCore();
    loadDashboard();
    const interval = setInterval(refreshCore, 15000);
    return () => clearInterval(interval);
  }, [refreshCore, loadDashboard]);

  // Load tab data on tab switch
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
  // ACTION HANDLERS
  // ──────────────────────────────────────────────────────────

  const handleMarkRead = async (id) => { await markAsRead(id); refreshCore(); };
  const handleDeleteMessage = async (id) => { await deleteMessage(id); refreshCore(); };
  const handleApproveVolunteer = async (id) => { await updateApplicationStatus(id, "approved"); refreshCore(); };
  const handleRejectVolunteer = async (id) => { await updateApplicationStatus(id, "rejected"); refreshCore(); };

  // Impact counter inline edit
  const handleUpdateCounter = async (id, newValue) => {
    try {
      await databaseService.updateImpactCounter(id, Number(newValue));
      loadImpact();
    } catch (e) { console.error("Failed to update counter:", e); }
  };

  // Stories
  const handleCreateStory = async (e) => {
    e.preventDefault();
    try {
      await databaseService.createStory(storyForm);
      setStoryForm({ title: "", description: "", imageUrl: "", category: "" });
      loadStories();
    } catch (err) { console.error("Failed to create story:", err); }
  };
  const handleDeleteStory = async (id) => {
    try { await databaseService.deleteStory(id); loadStories(); }
    catch (err) { console.error("Failed to delete story:", err); }
  };

  // Members
  const handleAddMember = async (e) => {
    e.preventDefault();
    try {
      await databaseService.addMember(memberForm);
      setMemberForm({ name: "", role: "", tagline: "", bio: "", imageUrl: "" });
      loadMembers();
    } catch (err) { console.error("Failed to add member:", err); }
  };
  const handleDeleteMember = async (id) => {
    try { await databaseService.deleteMember(id); loadMembers(); }
    catch (err) { console.error("Failed to delete member:", err); }
  };

  // Events
  const handleCreateEvent = async (e) => {
    e.preventDefault();
    const payload = {
      ...eventForm,
      maxVolunteers: eventForm.maxVolunteers ? Number(eventForm.maxVolunteers) : null,
    };
    try {
      await databaseService.createEvent(payload);
      setEventForm({ title: "", description: "", location: "", eventDate: "", registrationDeadline: "", maxVolunteers: "" });
      loadEvents();
    } catch (err) { console.error("Failed to create event:", err); }
  };

  // Hero image
  const handleUpdateHero = async (e) => {
    e.preventDefault();
    try {
      await databaseService.updateHeroImage(heroInput);
      setHeroImageUrl(heroInput);
    } catch (err) { console.error("Failed to update hero image:", err); }
  };

  // User role
  const handleRoleChange = async (userId, newRole) => {
    try {
      await databaseService.updateUserRole(userId, newRole);
      loadUsers();
    } catch (err) { console.error("Failed to update role:", err); }
  };

  // ── Impact ──
  const handleCreateImpactStat = async (e) => {
    e.preventDefault();
    try {
      await databaseService.createImpactStat({
        ...impactForm,
        currentValue: Number(impactForm.currentValue),
        displayOrder: Number(impactForm.displayOrder),
      });
      setImpactForm({ category: "", currentValue: 0, unit: "", icon: "", displayOrder: 0 });
      loadImpact();
    } catch (err) { console.error("Failed to create impact stat:", err); }
  };

  const handleDeleteImpactStat = async (id) => {
    try { await databaseService.deleteImpactStat(id); loadImpact(); }
    catch (err) { console.error("Failed to delete impact stat:", err); }
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
      loadImpact();
    } catch (err) { console.error("Failed to update impact stat:", err); }
  };

  // ── Stories edit ──
  const handleUpdateStory = async (e) => {
    e.preventDefault();
    try {
      await databaseService.updateStory(editingStory.id, editingStory);
      setEditingStory(null);
      loadStories();
    } catch (err) { console.error("Failed to update story:", err); }
  };

  // ── Members edit ──
  const handleUpdateMember = async (e) => {
    e.preventDefault();
    try {
      await databaseService.updateMember(editingMember.id, editingMember);
      setEditingMember(null);
      loadMembers();
    } catch (err) { console.error("Failed to update member:", err); }
  };

  // ── Events edit / delete / publish / feature ──
  const startEditingEvent = (ev) => {
    const toLocal = (iso) => iso ? new Date(iso).toISOString().slice(0, 16) : "";
    setEditingEvent({ ...ev, eventDate: toLocal(ev.eventDate), registrationDeadline: toLocal(ev.registrationDeadline) });
  };

  const handleUpdateEvent = async (e) => {
    e.preventDefault();
    const payload = { ...editingEvent, maxVolunteers: editingEvent.maxVolunteers ? Number(editingEvent.maxVolunteers) : null };
    try {
      await databaseService.updateEvent(editingEvent.id, payload);
      setEditingEvent(null);
      loadEvents();
    } catch (err) { console.error("Failed to update event:", err); }
  };

  const handleDeleteEvent = async (id) => {
    if (!window.confirm("Delete this event?")) return;
    try { await databaseService.deleteEvent(id); loadEvents(); }
    catch (err) { console.error("Failed to delete event:", err); }
  };

  const handleToggleEventPublish = async (id, current) => {
    try { await databaseService.toggleEventPublish(id, !current); loadEvents(); }
    catch (err) { console.error("Failed to toggle publish:", err); }
  };

  const handleToggleEventFeatured = async (id, current) => {
    try { await databaseService.toggleEventFeatured(id, !current); loadEvents(); }
    catch (err) { console.error("Failed to toggle featured:", err); }
  };

  // ── Generic setting upsert ──
  const handleSaveSetting = async (key) => {
    try {
      await databaseService.upsertSetting(key, settingInputs[key]);
      if (key === "HOME_HERO_IMAGE") setHeroImageUrl(settingInputs[key]);
    } catch (err) { console.error("Failed to save setting:", err); }
  };

  // ── Pages content save handlers ──
  const handleSaveHistory = async () => {
    setPageSaveStatus("Saving History...");
    try {
      await databaseService.savePageContent("HISTORY_TITLE", historyTitle);
      await databaseService.savePageContent("HISTORY_SUBTITLE", historySubtitle);
      await databaseService.savePageContent("HISTORY_MILESTONES", JSON.stringify(historyMilestones));
      setPageSaveStatus("History saved successfully!");
      setTimeout(() => setPageSaveStatus(""), 3000);
    } catch (err) {
      console.error("Failed to save history:", err);
      setPageSaveStatus("Failed to save History.");
    }
  };

  const handleSaveVision = async () => {
    setPageSaveStatus("Saving Vision...");
    try {
      await databaseService.savePageContent("VISION_HERO_TITLE", visionHeroTitle);
      await databaseService.savePageContent("VISION_HERO_SUBTITLE", visionHeroSubtitle);
      await databaseService.savePageContent("VISION_MISSION", visionMission);
      await databaseService.savePageContent("VISION_PILLARS", JSON.stringify(visionPillars));
      await databaseService.savePageContent("VISION_ROADMAP", visionRoadmap);
      await databaseService.savePageContent("VISION_IMPACTS", JSON.stringify(visionImpacts));
      setPageSaveStatus("Vision saved successfully!");
      setTimeout(() => setPageSaveStatus(""), 3000);
    } catch (err) {
      console.error("Failed to save vision:", err);
      setPageSaveStatus("Failed to save Vision.");
    }
  };

  // ──────────────────────────────────────────────────────────
  // TABS CONFIG
  // ──────────────────────────────────────────────────────────

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
    { key: "pages", label: "Pages", icon: "📄" },
    { key: "settings", label: "Settings", icon: "⚙️" },
  ];

  const formatDate = (iso) => {
    if (!iso) return "—";
    const d = new Date(iso);
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  const d = dashboardData; // shorthand

  // ──────────────────────────────────────────────────────────
  // RENDER
  // ──────────────────────────────────────────────────────────
  return (
    <motion.div
      variants={pageVariants} initial="initial" animate="animate" exit="exit"
      transition={pageTransition} className="py-8"
    >
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-dark">Admin Dashboard</h1>
          <p className="text-gray-500 mt-1">
            Welcome back, <span className="font-semibold text-primary">{user?.name || user?.email}</span>
          </p>
        </div>
        {unreadCount > 0 && (
          <motion.button
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            onClick={() => setActiveTab("messages")}
            className="flex items-center space-x-2 bg-red-50 text-red-600 px-4 py-2 rounded-full text-sm font-semibold hover:bg-red-100 transition"
          >
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
            </span>
            <span>{unreadCount} new message{unreadCount > 1 ? "s" : ""}</span>
          </motion.button>
        )}
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { label: "Messages", value: messages.length, change: `${unreadCount} unread`, color: "bg-red-50 text-red-700" },
          { label: "Volunteers", value: d?.totalApplications ?? volunteerApps.length, change: `${d?.pendingApplications ?? volunteerApps.filter(a => a.status === "pending").length} pending`, color: "bg-green-50 text-green-700" },
          { label: "Total Donations", value: d?.totalAmountCollected != null ? `₹${Number(d.totalAmountCollected).toLocaleString("en-IN")}` : "—", change: d ? `${d.totalDonations} donations` : "Loading…", color: "bg-amber-50 text-amber-700" },
          { label: "Events", value: d?.totalEvents ?? "—", change: d ? `${d.upcomingEvents} upcoming` : "Loading…", color: "bg-purple-50 text-purple-700" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
            <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
            <p className="text-2xl font-bold text-dark">{stat.value}</p>
            <p className={`text-xs mt-2 font-medium px-2 py-0.5 rounded-full inline-block ${stat.color}`}>{stat.change}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="flex border-b border-gray-100 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center space-x-2 px-5 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors duration-200 ${activeTab === tab.key ? "border-primary text-primary bg-primary/5" : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"}`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
              {tab.badge && (
                <span className="ml-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold animate-pulse">
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="p-6">

          {/* ─── OVERVIEW ─── */}
          {activeTab === "overview" && (
            <div>
              {!d ? (
                <div className="text-center py-12 text-gray-400">Loading dashboard summary…</div>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    { label: "Total Collected", value: `₹${Number(d.totalAmountCollected).toLocaleString("en-IN")}` },
                    { label: "Successful Donations", value: d.successfulDonations },
                    { label: "Pending Donations", value: d.pendingDonations },
                    { label: "Total Events", value: d.totalEvents },
                    { label: "Upcoming Events", value: d.upcomingEvents },
                    { label: "Completed Events", value: d.completedEvents },
                    { label: "Total Volunteer Apps", value: d.totalApplications },
                    { label: "Approved Volunteers", value: d.approvedVolunteers },
                    { label: "Pending Applications", value: d.pendingApplications },
                  ].map((s) => (
                    <div key={s.label} className="bg-gray-50 rounded-lg p-5">
                      <p className="text-sm text-gray-500">{s.label}</p>
                      <p className="text-xl font-bold text-dark mt-1">{s.value}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ─── MESSAGES ─── */}
          {activeTab === "messages" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">
                  Contact Messages
                  {unreadCount > 0 && <span className="ml-2 text-sm text-red-500 font-normal">({unreadCount} unread)</span>}
                </h3>
              </div>
              {messages.length === 0 ? (
                <EmptyState icon="📭" title="No messages yet." subtitle="Messages from the contact form will appear here." />
              ) : (
                <div className="space-y-3">
                  <AnimatePresence>
                    {messages.map((msg) => (
                      <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -50 }}
                        className={`border rounded-xl p-4 transition-all ${msg.read ? "border-gray-100 bg-white" : "border-primary/30 bg-primary/5"}`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2">
                              {!msg.read && <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />}
                              <h4 className="font-semibold text-gray-800 truncate">{msg.name}</h4>
                              <span className="text-xs text-gray-400">{formatDate(msg.createdAt)}</span>
                            </div>
                            <p className="text-sm text-gray-500 mt-0.5">{msg.email}</p>
                            <p className="text-sm text-gray-700 mt-2 whitespace-pre-line">{msg.message}</p>
                          </div>
                          <div className="flex items-center space-x-2 ml-4 flex-shrink-0">
                            {!msg.read && <button onClick={() => handleMarkRead(msg.id)} className="text-xs text-primary hover:underline">Mark read</button>}
                            <button onClick={() => handleDeleteMessage(msg.id)} className="text-xs text-red-400 hover:text-red-600">Delete</button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>
          )}

          {/* ─── VOLUNTEERS ─── */}
          {activeTab === "volunteers" && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Volunteer Applications</h3>
              {volunteerApps.length === 0 ? (
                <EmptyState icon="🤝" title="No volunteer applications yet." subtitle="Applications from the volunteer page will appear here." />
              ) : (
                <div className="space-y-3">
                  {volunteerApps.map((app) => (
                    <div key={app.id} className="border border-gray-100 rounded-xl p-4 bg-white">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold text-gray-800">{app.name || app.userName || `User #${app.userId}`}</h4>
                          <p className="text-sm text-gray-500">{app.email}{app.phone && ` • ${app.phone}`}</p>
                          {app.interest && <p className="text-sm text-gray-600 mt-1">Interest: {app.interest}</p>}
                          {app.message && <p className="text-sm text-gray-600 mt-1">{app.message}</p>}
                          <p className="text-xs text-gray-400 mt-1">Applied: {formatDate(app.createdAt || app.appliedAt)}</p>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          {(app.status === "pending" || app.status === "PENDING") ? (
                            <>
                              <button onClick={() => handleApproveVolunteer(app.id)} className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full hover:bg-green-200 transition">Approve</button>
                              <button onClick={() => handleRejectVolunteer(app.id)} className="text-xs bg-red-100 text-red-700 px-3 py-1 rounded-full hover:bg-red-200 transition">Reject</button>
                            </>
                          ) : (
                            <span className={`text-xs px-3 py-1 rounded-full font-medium ${app.status === "approved" || app.status === "APPROVED" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                              {app.status === "approved" || app.status === "APPROVED" ? "✓ Approved" : "✕ Rejected"}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ─── IMPACT COUNTERS ─── */}
          {activeTab === "impact" && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Impact Counters</h3>

              {/* Add new stat form */}
              <form onSubmit={handleCreateImpactStat} className="mb-6 border border-dashed border-gray-300 rounded-xl p-4 space-y-3">
                <p className="text-sm font-medium text-gray-600">Add New Counter</p>
                <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
                  <input value={impactForm.category} onChange={(e) => setImpactForm(p => ({ ...p, category: e.target.value }))} placeholder="Category (e.g. WATER)" required className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30" />
                  <input type="number" value={impactForm.currentValue} onChange={(e) => setImpactForm(p => ({ ...p, currentValue: e.target.value }))} placeholder="Value" required className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30" />
                  <input value={impactForm.unit} onChange={(e) => setImpactForm(p => ({ ...p, unit: e.target.value }))} placeholder="Unit (e.g. Liters)" className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30" />
                  <input value={impactForm.icon} onChange={(e) => setImpactForm(p => ({ ...p, icon: e.target.value }))} placeholder="Icon (e.g. 💧)" className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30" />
                  <input type="number" value={impactForm.displayOrder} onChange={(e) => setImpactForm(p => ({ ...p, displayOrder: e.target.value }))} placeholder="Order" className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30" />
                </div>
                <button type="submit" className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:brightness-90 transition">+ Add Counter</button>
              </form>

              {tabLoading ? <LoadingSpinner /> : impactStats.length === 0 ? (
                <EmptyState icon="📊" title="No impact counters yet." subtitle="Add a counter above." />
              ) : (
                <div className="space-y-4">
                  {impactStats.map((stat) => (
                    editingImpact?.id === stat.id ? (
                      <form key={stat.id} onSubmit={handleUpdateImpactFull} className="border border-primary/30 bg-primary/5 rounded-xl p-4 space-y-3">
                        <p className="text-sm font-medium text-gray-600">Editing Counter</p>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
                          <input value={editingImpact.category} onChange={(e) => setEditingImpact(p => ({ ...p, category: e.target.value }))} placeholder="Category" required className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30" />
                          <input type="number" value={editingImpact.currentValue} onChange={(e) => setEditingImpact(p => ({ ...p, currentValue: e.target.value }))} placeholder="Value" required className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30" />
                          <input value={editingImpact.unit || ""} onChange={(e) => setEditingImpact(p => ({ ...p, unit: e.target.value }))} placeholder="Unit" className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30" />
                          <input value={editingImpact.icon || ""} onChange={(e) => setEditingImpact(p => ({ ...p, icon: e.target.value }))} placeholder="Icon" className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30" />
                          <input type="number" value={editingImpact.displayOrder} onChange={(e) => setEditingImpact(p => ({ ...p, displayOrder: e.target.value }))} placeholder="Order" className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30" />
                        </div>
                        <div className="flex gap-2">
                          <button type="submit" className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:brightness-90 transition">Save</button>
                          <button type="button" onClick={() => setEditingImpact(null)} className="bg-gray-100 text-gray-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-200 transition">Cancel</button>
                        </div>
                      </form>
                    ) : (
                      <div key={stat.id} className="flex items-center gap-4 border border-gray-100 rounded-xl p-4 bg-white">
                        <span className="text-2xl">{stat.icon || "📊"}</span>
                        <div className="flex-1">
                          <p className="font-medium text-gray-800">{stat.category}</p>
                          {stat.unit && <p className="text-xs text-gray-400">{stat.unit}</p>}
                        </div>
                        <input
                          type="number"
                          defaultValue={stat.currentValue}
                          className="w-32 border border-gray-200 rounded-lg px-3 py-2 text-sm text-right focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
                          onBlur={(e) => {
                            const v = Number(e.target.value);
                            if (v !== stat.currentValue) handleUpdateCounter(stat.id, v);
                          }}
                          onKeyDown={(e) => { if (e.key === "Enter") e.target.blur(); }}
                        />
                        <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                          <button onClick={() => setEditingImpact({ ...stat })} className="text-xs text-blue-500 hover:text-blue-700">Edit</button>
                          <button onClick={() => handleDeleteImpactStat(stat.id)} className="text-xs text-red-400 hover:text-red-600">Delete</button>
                        </div>
                      </div>
                    )
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ─── SUCCESS STORIES ─── */}
          {activeTab === "stories" && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Success Stories</h3>

              {/* Add story form */}
              <form onSubmit={handleCreateStory} className="mb-6 border border-dashed border-gray-300 rounded-xl p-4 space-y-3">
                <p className="text-sm font-medium text-gray-600">Add New Story</p>
                <div className="grid sm:grid-cols-2 gap-3">
                  <input value={storyForm.title} onChange={(e) => setStoryForm(p => ({ ...p, title: e.target.value }))} placeholder="Title" required className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30" />
                  <input value={storyForm.category} onChange={(e) => setStoryForm(p => ({ ...p, category: e.target.value }))} placeholder="Category" className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30" />
                </div>
                <input value={storyForm.imageUrl} onChange={(e) => setStoryForm(p => ({ ...p, imageUrl: e.target.value }))} placeholder="Image URL" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30" />
                <textarea value={storyForm.description} onChange={(e) => setStoryForm(p => ({ ...p, description: e.target.value }))} placeholder="Description" required rows={3} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30" />
                <button type="submit" className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:brightness-90 transition">+ Add Story</button>
              </form>

              {tabLoading ? <LoadingSpinner /> : stories.length === 0 ? (
                <EmptyState icon="📖" title="No stories yet." subtitle="Add a success story above." />
              ) : (
                <div className="space-y-3">
                  {stories.map((s) => (
                    editingStory?.id === s.id ? (
                      <form key={s.id} onSubmit={handleUpdateStory} className="border border-primary/30 bg-primary/5 rounded-xl p-4 space-y-3">
                        <p className="text-sm font-medium text-gray-600">Editing story</p>
                        <div className="grid sm:grid-cols-2 gap-3">
                          <input value={editingStory.title} onChange={(e) => setEditingStory(p => ({ ...p, title: e.target.value }))} placeholder="Title" required className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30" />
                          <input value={editingStory.category || ""} onChange={(e) => setEditingStory(p => ({ ...p, category: e.target.value }))} placeholder="Category" className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30" />
                        </div>
                        <input value={editingStory.imageUrl || ""} onChange={(e) => setEditingStory(p => ({ ...p, imageUrl: e.target.value }))} placeholder="Image URL" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30" />
                        <textarea value={editingStory.description} onChange={(e) => setEditingStory(p => ({ ...p, description: e.target.value }))} placeholder="Description" required rows={3} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30" />
                        <div className="flex gap-2">
                          <button type="submit" className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:brightness-90 transition">Save</button>
                          <button type="button" onClick={() => setEditingStory(null)} className="bg-gray-100 text-gray-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-200 transition">Cancel</button>
                        </div>
                      </form>
                    ) : (
                      <div key={s.id} className="flex items-center gap-4 border border-gray-100 rounded-xl p-4 bg-white">
                        {s.imageUrl && <img src={s.imageUrl} alt={s.title} className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-800 truncate">{s.title}</h4>
                          <p className="text-sm text-gray-500 line-clamp-1">{s.description}</p>
                          {s.category && <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">{s.category}</span>}
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <button onClick={() => setEditingStory({ ...s })} className="text-xs text-blue-500 hover:text-blue-700">Edit</button>
                          <button onClick={() => handleDeleteStory(s.id)} className="text-xs text-red-400 hover:text-red-600">Delete</button>
                        </div>
                      </div>
                    )
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ─── MEMBERS ─── */}
          {activeTab === "members" && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Team Members</h3>

              <form onSubmit={handleAddMember} className="mb-6 border border-dashed border-gray-300 rounded-xl p-4 space-y-3">
                <p className="text-sm font-medium text-gray-600">Add New Member</p>
                <div className="grid sm:grid-cols-2 gap-3">
                  <input value={memberForm.name} onChange={(e) => setMemberForm(p => ({ ...p, name: e.target.value }))} placeholder="Full Name" required className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30" />
                  <input value={memberForm.role} onChange={(e) => setMemberForm(p => ({ ...p, role: e.target.value }))} placeholder="Role (e.g. Treasurer)" required className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30" />
                </div>
                <input value={memberForm.tagline} onChange={(e) => setMemberForm(p => ({ ...p, tagline: e.target.value }))} placeholder="Tagline" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30" />
                <input value={memberForm.imageUrl} onChange={(e) => setMemberForm(p => ({ ...p, imageUrl: e.target.value }))} placeholder="Photo URL" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30" />
                <textarea value={memberForm.bio} onChange={(e) => setMemberForm(p => ({ ...p, bio: e.target.value }))} placeholder="Bio" rows={2} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30" />
                <button type="submit" className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:brightness-90 transition">+ Add Member</button>
              </form>

              {tabLoading ? <LoadingSpinner /> : members.length === 0 ? (
                <EmptyState icon="👤" title="No members yet." subtitle="Add a team member above." />
              ) : (
                <div className="space-y-3">
                  {members.map((m) => (
                    editingMember?.id === m.id ? (
                      <form key={m.id} onSubmit={handleUpdateMember} className="border border-primary/30 bg-primary/5 rounded-xl p-4 space-y-3">
                        <p className="text-sm font-medium text-gray-600">Editing member</p>
                        <div className="grid sm:grid-cols-2 gap-3">
                          <input value={editingMember.name} onChange={(e) => setEditingMember(p => ({ ...p, name: e.target.value }))} placeholder="Full Name" required className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30" />
                          <input value={editingMember.role || ""} onChange={(e) => setEditingMember(p => ({ ...p, role: e.target.value }))} placeholder="Role" className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30" />
                        </div>
                        <input value={editingMember.tagline || ""} onChange={(e) => setEditingMember(p => ({ ...p, tagline: e.target.value }))} placeholder="Tagline" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30" />
                        <input value={editingMember.imageUrl || ""} onChange={(e) => setEditingMember(p => ({ ...p, imageUrl: e.target.value }))} placeholder="Photo URL" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30" />
                        <textarea value={editingMember.bio || ""} onChange={(e) => setEditingMember(p => ({ ...p, bio: e.target.value }))} placeholder="Bio" rows={2} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30" />
                        <div className="grid sm:grid-cols-2 gap-3">
                          <input value={editingMember.linkedinUrl || ""} onChange={(e) => setEditingMember(p => ({ ...p, linkedinUrl: e.target.value }))} placeholder="LinkedIn URL" className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30" />
                          <input value={editingMember.twitterUrl || ""} onChange={(e) => setEditingMember(p => ({ ...p, twitterUrl: e.target.value }))} placeholder="Twitter URL" className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30" />
                        </div>
                        <div className="flex gap-2">
                          <button type="submit" className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:brightness-90 transition">Save</button>
                          <button type="button" onClick={() => setEditingMember(null)} className="bg-gray-100 text-gray-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-200 transition">Cancel</button>
                        </div>
                      </form>
                    ) : (
                      <div key={m.id} className="flex items-center gap-4 border border-gray-100 rounded-xl p-4 bg-white">
                        {m.imageUrl ? (
                          <img src={m.imageUrl} alt={m.name} className="w-12 h-12 rounded-full object-cover flex-shrink-0" />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold flex-shrink-0">
                            {(m.name || "").split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-800">{m.name}</h4>
                          <p className="text-sm text-gray-500">{m.role}</p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <button onClick={() => setEditingMember({ ...m })} className="text-xs text-blue-500 hover:text-blue-700">Edit</button>
                          <button onClick={() => handleDeleteMember(m.id)} className="text-xs text-red-400 hover:text-red-600">Delete</button>
                        </div>
                      </div>
                    )
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ─── EVENTS ─── */}
          {activeTab === "events" && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Event Management</h3>

              <form onSubmit={handleCreateEvent} className="mb-6 border border-dashed border-gray-300 rounded-xl p-4 space-y-3">
                <p className="text-sm font-medium text-gray-600">Create New Event</p>
                <div className="grid sm:grid-cols-2 gap-3">
                  <input value={eventForm.title} onChange={(e) => setEventForm(p => ({ ...p, title: e.target.value }))} placeholder="Event Title" required className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30" />
                  <input value={eventForm.location} onChange={(e) => setEventForm(p => ({ ...p, location: e.target.value }))} placeholder="Location" className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30" />
                </div>
                <div className="grid sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Event Date</label>
                    <input type="datetime-local" value={eventForm.eventDate} onChange={(e) => setEventForm(p => ({ ...p, eventDate: e.target.value }))} required className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Reg. Deadline</label>
                    <input type="datetime-local" value={eventForm.registrationDeadline} onChange={(e) => setEventForm(p => ({ ...p, registrationDeadline: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Max Volunteers</label>
                    <input type="number" value={eventForm.maxVolunteers} onChange={(e) => setEventForm(p => ({ ...p, maxVolunteers: e.target.value }))} placeholder="50" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30" />
                  </div>
                </div>
                <input value={eventForm.bannerUrl} onChange={(e) => setEventForm(p => ({ ...p, bannerUrl: e.target.value }))} placeholder="Banner Image URL" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30" />
                <textarea value={eventForm.description} onChange={(e) => setEventForm(p => ({ ...p, description: e.target.value }))} placeholder="Event Description" required rows={3} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30" />
                <button type="submit" className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:brightness-90 transition">+ Create Event</button>
              </form>

              {tabLoading ? <LoadingSpinner /> : events.length === 0 ? (
                <EmptyState icon="📅" title="No events yet." subtitle="Create an event above." />
              ) : (
                <div className="space-y-3">
                  {events.map((ev) => (
                    editingEvent?.id === ev.id ? (
                      <form key={ev.id} onSubmit={handleUpdateEvent} className="border border-primary/30 bg-primary/5 rounded-xl p-4 space-y-3">
                        <p className="text-sm font-medium text-gray-600">Editing event</p>
                        <div className="grid sm:grid-cols-2 gap-3">
                          <input value={editingEvent.title} onChange={(e) => setEditingEvent(p => ({ ...p, title: e.target.value }))} placeholder="Event Title" required className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30" />
                          <input value={editingEvent.location || ""} onChange={(e) => setEditingEvent(p => ({ ...p, location: e.target.value }))} placeholder="Location" className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30" />
                        </div>
                        <div className="grid sm:grid-cols-2 gap-3">
                          <div><label className="block text-xs text-gray-500 mb-1">Event Date</label><input type="datetime-local" value={editingEvent.eventDate} onChange={(e) => setEditingEvent(p => ({ ...p, eventDate: e.target.value }))} required className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30" /></div>
                          <div><label className="block text-xs text-gray-500 mb-1">Reg. Deadline</label><input type="datetime-local" value={editingEvent.registrationDeadline || ""} onChange={(e) => setEditingEvent(p => ({ ...p, registrationDeadline: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30" /></div>
                        </div>
                        <input value={editingEvent.bannerUrl || ""} onChange={(e) => setEditingEvent(p => ({ ...p, bannerUrl: e.target.value }))} placeholder="Banner Image URL" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30" />
                        <textarea value={editingEvent.description || ""} onChange={(e) => setEditingEvent(p => ({ ...p, description: e.target.value }))} placeholder="Description" rows={3} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30" />
                        <div className="flex gap-2">
                          <button type="submit" className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:brightness-90 transition">Save</button>
                          <button type="button" onClick={() => setEditingEvent(null)} className="bg-gray-100 text-gray-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-200 transition">Cancel</button>
                        </div>
                      </form>
                    ) : (
                      <div key={ev.id} className="border border-gray-100 rounded-xl p-4 bg-white">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-gray-800">{ev.title}</h4>
                            <p className="text-sm text-gray-500">{formatDate(ev.eventDate)}{ev.location && ` • ${ev.location}`}</p>
                          </div>
                          <div className="flex flex-wrap items-center gap-1.5 flex-shrink-0">
                            {ev.status && (
                              <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${ev.status === "UPCOMING" ? "bg-blue-100 text-blue-700" : ev.status === "COMPLETED" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                                {ev.status}
                              </span>
                            )}
                            <button onClick={() => handleToggleEventPublish(ev.id, ev.published)}
                              className={`text-xs px-2.5 py-1 rounded-full font-medium transition ${ev.published ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}>
                              {ev.published ? "✓ Published" : "Draft"}
                            </button>
                            <button onClick={() => handleToggleEventFeatured(ev.id, ev.featured)}
                              className={`text-xs px-2.5 py-1 rounded-full font-medium transition ${ev.featured ? "bg-amber-100 text-amber-700 hover:bg-amber-200" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}>
                              {ev.featured ? "⭐ Featured" : "Feature"}
                            </button>
                            <button onClick={() => startEditingEvent(ev)} className="text-xs text-blue-500 hover:text-blue-700 px-1">Edit</button>
                            <button onClick={() => handleDeleteEvent(ev.id)} className="text-xs text-red-400 hover:text-red-600 px-1">Delete</button>
                          </div>
                        </div>
                      </div>
                    )
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ─── DONATIONS ─── */}
          {activeTab === "donations" && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Donation Records</h3>
              {tabLoading ? <LoadingSpinner /> : !Array.isArray(donations) || donations.length === 0 ? (
                <EmptyState icon="💰" title="No donations yet." subtitle="Donation records will appear here." />
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-gray-200 text-gray-500">
                        <th className="py-3 px-2">ID</th>
                        <th className="py-3 px-2">Amount</th>
                        <th className="py-3 px-2">Status</th>
                        <th className="py-3 px-2">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {donations.map((don) => (
                        <tr key={don.id} className="border-b border-gray-50 hover:bg-gray-50">
                          <td className="py-3 px-2">#{don.id}</td>
                          <td className="py-3 px-2 font-medium">₹{Number(don.amount).toLocaleString("en-IN")}</td>
                          <td className="py-3 px-2">
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${don.status === "SUCCESS" ? "bg-green-100 text-green-700" : don.status === "PENDING" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}`}>
                              {don.status}
                            </span>
                          </td>
                          <td className="py-3 px-2 text-gray-500">{formatDate(don.createdAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ─── USERS ─── */}
          {activeTab === "users" && (
            <div>
              <h3 className="text-lg font-semibold mb-4">User Management</h3>
              {tabLoading ? <LoadingSpinner /> : !Array.isArray(users) || users.length === 0 ? (
                <EmptyState icon="👥" title="No users found." subtitle="Registered users will appear here." />
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-gray-200 text-gray-500">
                        <th className="py-3 px-2">Name</th>
                        <th className="py-3 px-2">Email</th>
                        <th className="py-3 px-2">Role</th>
                        <th className="py-3 px-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((u) => (
                        <tr key={u.id} className="border-b border-gray-50 hover:bg-gray-50">
                          <td className="py-3 px-2 font-medium">{u.name || "—"}</td>
                          <td className="py-3 px-2 text-gray-500">{u.email}</td>
                          <td className="py-3 px-2">
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${u.role === "ADMIN" ? "bg-purple-100 text-purple-700" : u.role === "VOLUNTEER" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                              {u.role}
                            </span>
                          </td>
                          <td className="py-3 px-2">
                            <select
                              value={u.role}
                              onChange={(e) => handleRoleChange(u.id, e.target.value)}
                              className="text-xs border border-gray-200 rounded px-2 py-1 outline-none focus:ring-1 focus:ring-primary/30"
                            >
                              <option value="USER">USER</option>
                              <option value="VOLUNTEER">VOLUNTEER</option>
                              <option value="ADMIN">ADMIN</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ─── SETTINGS ─── */}
          {activeTab === "settings" && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Site Settings — Hero Section</h3>
              <div className="border border-gray-100 rounded-xl p-6 bg-white space-y-6">

                {/* Hero Image */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Hero Background Image URL</label>
                  <div className="flex gap-3">
                    <input type="text" value={settingInputs.HOME_HERO_IMAGE} onChange={(e) => setSettingInputs(p => ({ ...p, HOME_HERO_IMAGE: e.target.value }))} placeholder="https://example.com/hero.jpg" className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30" />
                    <button onClick={() => handleSaveSetting("HOME_HERO_IMAGE")} className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:brightness-90 transition whitespace-nowrap">Save</button>
                  </div>
                  {settingInputs.HOME_HERO_IMAGE && (
                    <div className="mt-4">
                      <p className="text-xs text-gray-400 mb-2">Preview:</p>
                      <img src={settingInputs.HOME_HERO_IMAGE} alt="Hero preview" className="max-h-48 rounded-lg object-cover border" />
                    </div>
                  )}
                </div>

                {/* Hero Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Hero Headline</label>
                  <div className="flex gap-3">
                    <input type="text" value={settingInputs.HOME_HERO_TITLE} onChange={(e) => setSettingInputs(p => ({ ...p, HOME_HERO_TITLE: e.target.value }))} placeholder="e.g. Bringing Hope to Every Corner." className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30" />
                    <button onClick={() => handleSaveSetting("HOME_HERO_TITLE")} className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:brightness-90 transition whitespace-nowrap">Save</button>
                  </div>
                </div>

                {/* Hero Subtitle */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Hero Subtitle</label>
                  <div className="flex gap-3">
                    <textarea value={settingInputs.HOME_HERO_SUBTITLE} onChange={(e) => setSettingInputs(p => ({ ...p, HOME_HERO_SUBTITLE: e.target.value }))} placeholder="e.g. From education to clean water…" rows={2} className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
                    <button onClick={() => handleSaveSetting("HOME_HERO_SUBTITLE")} className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:brightness-90 transition self-start whitespace-nowrap">Save</button>
                  </div>
                </div>

                {/* CTA Button */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">CTA Button Text</label>
                    <div className="flex gap-3">
                      <input type="text" value={settingInputs.HOME_HERO_CTA_TEXT} onChange={(e) => setSettingInputs(p => ({ ...p, HOME_HERO_CTA_TEXT: e.target.value }))} placeholder="e.g. Support Our Mission" className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30" />
                      <button onClick={() => handleSaveSetting("HOME_HERO_CTA_TEXT")} className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:brightness-90 transition whitespace-nowrap">Save</button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">CTA Button Link</label>
                    <div className="flex gap-3">
                      <input type="text" value={settingInputs.HOME_HERO_CTA_LINK} onChange={(e) => setSettingInputs(p => ({ ...p, HOME_HERO_CTA_LINK: e.target.value }))} placeholder="e.g. /donation or https://..." className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30" />
                      <button onClick={() => handleSaveSetting("HOME_HERO_CTA_LINK")} className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:brightness-90 transition whitespace-nowrap">Save</button>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-gray-400 pt-2 border-t border-gray-100">Changes take effect on the public site immediately after saving. Refresh the home page to see updates.</p>
              </div>
            </div>
          )}

          {/* ─── PAGES CONTENT ─── */}
          {activeTab === "pages" && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Pages Content Management</h3>
              <div className="space-y-6">

                {/* History Milestones */}
                <div className="border border-gray-100 rounded-xl p-6 bg-white">
                  <h4 className="font-semibold text-gray-800 mb-2">History Milestones (JSON format)</h4>
                  <p className="text-xs text-gray-500 mb-4">Edit the history timeline. Array of objects with `date`, `event`, and `description`.</p>
                  <textarea value={settingInputs.HISTORY_MILESTONES} onChange={(e) => setSettingInputs(p => ({ ...p, HISTORY_MILESTONES: e.target.value }))} rows={8} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30 font-mono text-xs" />
                  <button onClick={() => handleSaveSetting("HISTORY_MILESTONES")} className="mt-3 bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:brightness-90 transition">Save Milestones</button>
                </div>

                {/* Vision Pillars */}
                <div className="border border-gray-100 rounded-xl p-6 bg-white">
                  <h4 className="font-semibold text-gray-800 mb-2">Vision Pillars (JSON format)</h4>
                  <p className="text-xs text-gray-500 mb-4">Array of objects with `title` and `desc`.</p>
                  <textarea value={settingInputs.VISION_PILLARS} onChange={(e) => setSettingInputs(p => ({ ...p, VISION_PILLARS: e.target.value }))} rows={8} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30 font-mono text-xs" />
                  <button onClick={() => handleSaveSetting("VISION_PILLARS")} className="mt-3 bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:brightness-90 transition">Save Pillars</button>
                </div>

                {/* Vision Roadmap */}
                <div className="border border-gray-100 rounded-xl p-6 bg-white">
                  <h4 className="font-semibold text-gray-800 mb-2">Vision Roadmap (One per line)</h4>
                  <textarea value={settingInputs.VISION_ROADMAP} onChange={(e) => setSettingInputs(p => ({ ...p, VISION_ROADMAP: e.target.value }))} rows={6} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30" />
                  <button onClick={() => handleSaveSetting("VISION_ROADMAP")} className="mt-3 bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:brightness-90 transition">Save Roadmap</button>
                </div>

                {/* Vision Impacts */}
                <div className="border border-gray-100 rounded-xl p-6 bg-white">
                  <h4 className="font-semibold text-gray-800 mb-2">Vision Impacts (JSON format)</h4>
                  <p className="text-xs text-gray-500 mb-4">Array of objects with `label` and `value`.</p>
                  <textarea value={settingInputs.VISION_IMPACTS} onChange={(e) => setSettingInputs(p => ({ ...p, VISION_IMPACTS: e.target.value }))} rows={6} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30 font-mono text-xs" />
                  <button onClick={() => handleSaveSetting("VISION_IMPACTS")} className="mt-3 bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:brightness-90 transition">Save Impacts</button>
                </div>

              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// ─── Helper Components ──────────────────────────────────────

function EmptyState({ icon, title, subtitle }) {
  return (
    <div className="bg-gray-50 rounded-lg p-8 text-center">
      <span className="text-4xl mb-2 block">{icon}</span>
      <p className="text-gray-500">{title}</p>
      {subtitle && <p className="text-gray-400 text-sm mt-1">{subtitle}</p>}
    </div>
  );
}

function LoadingSpinner() {
  return <div className="text-center py-8 text-gray-400">Loading…</div>;
}

export default Dashboard;