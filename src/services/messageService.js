import api from "./api";

// ─── Contact Messages (Admin) ────────────────────────────────

// GET /api/messages
export async function getMessages() {
    const response = await api.get("/messages");
    return response.data;
}

// POST /api/messages
export async function submitMessage({ name, email, message }) {
    const response = await api.post("/messages", { name, email, message });
    return response.data;
}

// PUT /api/messages/:id/read
export async function markAsRead(id) {
    const response = await api.put(`/messages/${id}/read`);
    return response.data;
}

// DELETE /api/messages/:id
export async function deleteMessage(id) {
    const response = await api.delete(`/messages/${id}`);
    return response.data;
}

// GET /api/messages/unread-count
export async function getUnreadCount() {
    const response = await api.get("/messages/unread-count");
    return response.data;
}

// ─── Volunteer Applications ─────────────────────────────────

// GET /api/volunteers
export async function getVolunteerApplications() {
    const response = await api.get("/volunteers");
    return response.data;
}

// POST /api/volunteers/apply
// Matches ApplyVolunteerRequest DTO: { eventId: Long (required), message: String }
export async function submitVolunteerApplication(eventId, message = "") {
    const response = await api.post("/volunteers/apply", { eventId, message });
    return response.data;
}

// GET /api/volunteers/my
export async function getMyVolunteerApplications() {
    const response = await api.get("/volunteers/my");
    return response.data;
}

// PUT /api/volunteers/:id/status?status=... (Admin)
export async function updateApplicationStatus(id, status) {
    const response = await api.put(`/volunteers/${id}/status`, null, { params: { status } });
    return response.data;
}

// ─── User Personal Activity Log ─────────────────────────────

// GET /api/users/me/activity
export async function getMyActivity() {
    const response = await api.get("/users/me/activity");
    return response.data;
}