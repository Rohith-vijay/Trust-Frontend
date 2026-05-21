import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { pageVariants, pageTransition } from "../constants/motionVariants";
import { useAuth } from "../hooks/useAuth";
import databaseService from "../services/databaseService";
import {
  getMessages,
  markAsRead,
  deleteMessage,
  getUnreadCount,
  getVolunteerApplications,
  updateApplicationStatus,
} from "../services/messageService";

// Import Modular Tab Panels
import AnalyticsPanel from "./panels/AnalyticsPanel";
import VolunteersPanel from "./panels/VolunteersPanel";
import ImpactPanel from "./panels/ImpactPanel";
import StoriesPanel from "./panels/StoriesPanel";
import MembersPanel from "./panels/MembersPanel";
import EventsPanel from "./panels/EventsPanel";
import DonationsPanel from "./panels/DonationsPanel";
import UsersPanel from "./panels/UsersPanel";
import MediaPanel from "./panels/MediaPanel";
import PagesPanel from "./panels/PagesPanel";
import SettingsPanel from "./panels/SettingsPanel";

import MessagesPanelComponent from "./panels/MessagesPanel"; // specific naming to avoid any keyword clash

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
  const [storyForm, setStoryForm] = useState({ title: "", subtitle: "", imageUrl: "", category: "", description: "", beforeImageUrl: "", afterImageUrl: "", testimonialQuote: "", testimonialAuthor: "" });
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
    VISION_PILLARS: "", VISION_ROADMAP: "", VISION_IMPACTS: ""
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
      setActivities(res.data || res);
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
        setActivities(activitiesRes.value.data || activitiesRes.value);
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
      const content = await databaseService.getAllPageContent();
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
        VISION_IMPACTS: content.VISION_IMPACTS || ""
      }));
    } catch (e) { console.error("Failed to load page content:", e); }
  }, []);

  useEffect(() => {
    refreshCore();
    loadDashboard();
    const interval = setInterval(refreshCore, 15000);
    return () => clearInterval(interval);
  }, [refreshCore, loadDashboard]);

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
      setStoryForm({ title: "", subtitle: "", imageUrl: "", category: "", description: "", beforeImageUrl: "", afterImageUrl: "", testimonialQuote: "", testimonialAuthor: "" });
      loadStories();
    } catch (err) { console.error(err); }
  };

  const handleUpdateStory = async (storyData) => {
    try {
      await databaseService.updateStory(storyData.id, storyData);
      loadStories();
    } catch (err) { console.error(err); }
  };

  const handleDeleteStory = async (id) => {
    if (!window.confirm("Remove this success story?")) return;
    try { await databaseService.deleteStory(id); loadStories(); }
    catch (err) { console.error(err); }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    try {
      await databaseService.addMember(memberForm);
      setMemberForm({ name: "", role: "", tagline: "", bio: "", imageUrl: "" });
      loadMembers();
    } catch (err) { console.error(err); }
  };

  const handleUpdateMember = async (e) => {
    e.preventDefault();
    try {
      await databaseService.updateMember(editingMember.id, editingMember);
      setEditingMember(null);
      loadMembers();
    } catch (err) { console.error(err); }
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
      loadEvents();
    } catch (err) { console.error(err); }
  };

  const handleUpdateEvent = async (eventData) => {
    try {
      await databaseService.updateEvent(eventData.id, eventData);
      setEditingEvent(null);
      loadEvents();
    } catch (err) { console.error(err); }
  };

  const handleDeleteEvent = async (id) => {
    if (!window.confirm("Delete this initiative event?")) return;
    try { await databaseService.deleteEvent(id); loadEvents(); }
    catch (err) { console.error(err); }
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
      loadImpact();
    } catch (err) { console.error(err); }
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
    } catch (err) { console.error(err); }
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
        className="mb-8 p-8 rounded-3xl bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent border border-indigo-500/10 shadow-sm relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -mr-16 -mt-16 animate-pulse"></div>
        <div className="relative z-10 flex items-center gap-4">
          <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-3xl shadow-sm">
            👑
          </div>
          <div>
            <h1 className="text-4xl font-extrabold text-brand-navy-dark tracking-tight">Admin CMS Dashboard</h1>
            <p className="text-gray-600 mt-2 text-lg">
              Authorized session: <span className="font-bold text-indigo-600">{user?.name || user?.email}</span>
            </p>
          </div>
        </div>
        {unreadCount > 0 && (
          <motion.button
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            onClick={() => setActiveTab("messages")}
            className="relative z-10 flex items-center space-x-2 bg-red-50 text-red-600 px-6 py-3 rounded-full text-sm font-bold hover:bg-red-100 hover:shadow-lg hover:shadow-red-500/20 transition-all duration-300 border border-red-100"
          >
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
            </span>
            <span>{unreadCount} new message{unreadCount > 1 ? "s" : ""}</span>
          </motion.button>
        )}
      </motion.div>

      {/* Stats row cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { label: "Messages Log", value: messages.length, change: `${unreadCount} unread`, color: "bg-red-50 text-red-700" },
          { label: "Volunteers App", value: dashboardData?.totalApplications ?? volunteerApps.length, change: `${dashboardData?.pendingApplications ?? volunteerApps.filter(a => a.status === "pending").length} pending`, color: "bg-green-50 text-green-700" },
          { label: "Collected Fundings", value: dashboardData?.totalAmountCollected != null ? `₹${Number(dashboardData.totalAmountCollected).toLocaleString("en-IN")}` : "—", change: dashboardData ? `${dashboardData.totalDonations} transactions` : "Loading…", color: "bg-amber-50 text-amber-700" },
          { label: "Initiative Campaigns", value: dashboardData?.totalEvents ?? "—", change: dashboardData ? `${dashboardData.upcomingEvents} upcoming` : "Loading…", color: "bg-purple-50 text-purple-700" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
            <p className="text-sm text-gray-500 font-semibold mb-1">{stat.label}</p>
            <p className="text-2xl font-black text-brand-navy-dark">{stat.value}</p>
            <p className={`text-xs mt-2 font-bold px-3 py-1 rounded-full inline-block ${stat.color}`}>{stat.change}</p>
          </div>
        ))}
      </div>

      {/* Main sidebar tab wrapper */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-150 overflow-hidden flex flex-col md:flex-row min-h-[600px]">
        {/* Navigation Sidebar Panel */}
        <div className="w-full md:w-64 bg-gray-50/50 border-r border-gray-150 flex flex-col p-4 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center justify-between px-4 py-3 text-sm font-bold rounded-xl transition duration-200 ${
                activeTab === tab.key
                  ? "bg-primary text-white shadow-sm"
                  : "text-gray-600 hover:text-brand-navy-dark hover:bg-gray-100"
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className="text-base">{tab.icon}</span>
                <span>{tab.label}</span>
              </div>
              {tab.badge && (
                <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold animate-pulse">
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Action Panel Content Slot */}
        <div className="flex-1 p-8">
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
    <div className="text-center py-16 text-gray-400 font-bold flex flex-col items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-3"></div>
      Synching database registers…
    </div>
  );
}

export default Dashboard;