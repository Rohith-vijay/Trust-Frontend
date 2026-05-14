import api from "./api";

const databaseService = {
  // ─── Impact Stats (Public GET, Admin mutations) ─────────────
  getImpactData: async () => {
    const response = await api.get("/impact-stats");
    return response.data;
  },

  createImpactStat: async (stat) => {
    const response = await api.post("/impact-stats", stat);
    return response.data;
  },

  updateImpactCounter: async (id, newValue) => {
    // PUT expects @RequestBody Long — send as number in JSON body
    const response = await api.put(`/impact-stats/${id}`, newValue, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  },

  updateImpactStatFull: async (id, patch) => {
    const response = await api.patch(`/impact-stats/${id}`, patch);
    return response.data;
  },

  deleteImpactStat: async (id) => {
    await api.delete(`/impact-stats/${id}`);
  },

  // ─── Success Stories (Public GET, Admin mutations) ──────────
  getSuccessStories: async (adminView = false) => {
    const params = adminView ? { admin: true } : {};
    const response = await api.get("/success-stories", { params });
    return response.data;
  },

  createStory: async (story) => {
    const response = await api.post("/success-stories", story);
    return response.data;
  },

  updateStory: async (id, story) => {
    const response = await api.put(`/success-stories/${id}`, story);
    return response.data;
  },

  deleteStory: async (id) => {
    await api.delete(`/success-stories/${id}`);
  },

  toggleStoryPublish: async (id, value) => {
    const response = await api.patch(`/success-stories/${id}/publish`, null, {
      params: { value },
    });
    return response.data;
  },

  // ─── Team Members (Public GET, Admin mutations) ─────────────
  getTeamMembers: async (adminView = false) => {
    const params = adminView ? { admin: true } : {};
    const response = await api.get("/members", { params });
    return response.data;
  },

  addMember: async (member) => {
    const response = await api.post("/members", member);
    return response.data;
  },

  updateMember: async (id, member) => {
    const response = await api.put(`/members/${id}`, member);
    return response.data;
  },

  deleteMember: async (id) => {
    await api.delete(`/members/${id}`);
  },

  // ─── Events (Public GET, Admin mutations) ───────────────────
  getEvents: async (page = 0, size = 20, adminView = false) => {
    const params = { page, size };
    if (adminView) params.admin = true;
    const response = await api.get("/events", { params });
    return response.data; // Spring Page object: { content: [], totalElements: ... }
  },

  getEventById: async (id) => {
    const response = await api.get(`/events/${id}`);
    return response.data;
  },

  createEvent: async (eventData) => {
    const response = await api.post("/events", eventData);
    return response.data;
  },

  updateEvent: async (id, eventData) => {
    const response = await api.put(`/events/${id}`, eventData);
    return response.data;
  },

  deleteEvent: async (id) => {
    await api.delete(`/events/${id}`);
  },

  toggleEventPublish: async (id, value) => {
    const response = await api.patch(`/events/${id}/publish`, null, {
      params: { value },
    });
    return response.data;
  },

  toggleEventFeatured: async (id, value) => {
    const response = await api.patch(`/events/${id}/feature`, null, {
      params: { value },
    });
    return response.data;
  },

  // ─── System Settings ────────────────────────────────────────
  getHeroImage: async () => {
    const response = await api.get("/public/settings/hero-image");
    return response.data;
  },

  getAllPublicSettings: async () => {
    const response = await api.get("/public/settings/all");
    return response.data;
  },

  getAllAdminSettings: async () => {
    const response = await api.get("/admin/settings");
    return response.data;
  },

  upsertSetting: async (key, value) => {
    // Send as plain text string — backend strips any extra quotes
    const response = await api.put(`/admin/settings/${key}`, value, {
      headers: { "Content-Type": "text/plain" },
    });
    return response.data;
  },

  updateHeroImage: async (url) => {
    const response = await api.put("/admin/settings/hero-image", url, {
      headers: { "Content-Type": "text/plain" },
    });
    return response.data;
  },

  // ─── Page Content (History, Vision sections) ────────────────
  getAllPageContent: async () => {
    const response = await api.get("/public/pages/all");
    return response.data; // { HISTORY_INTRO: "...", VISION_MISSION: "...", ... }
  },

  savePageContent: async (key, value) => {
    const response = await api.put(`/admin/pages/${key}`, value, {
      headers: { "Content-Type": "text/plain" },
    });
    return response.data;
  },

  // ─── Dashboard (Admin) ───────────────────────────────────────
  getDashboardSummary: async () => {
    const response = await api.get("/dashboard");
    return response.data;
  },

  // ─── Users (Admin) ──────────────────────────────────────────
  getUsers: async () => {
    const response = await api.get("/admin/users");
    return response.data;
  },

  updateUserRole: async (userId, role) => {
    const response = await api.put(`/admin/users/${userId}/role`, { role });
    return response.data;
  },

  // ─── Donations (Admin) ──────────────────────────────────────
  getDonations: async (page = 0, size = 10, status = null) => {
    const params = { page, size };
    if (status) params.status = status;
    const response = await api.get("/donations", { params });
    return response.data;
  },
};

export default databaseService;