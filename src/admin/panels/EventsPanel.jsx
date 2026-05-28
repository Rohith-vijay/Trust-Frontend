import React, { useState } from "react";
import RichTextEditor from "../components/RichTextEditor";
import SortableList from "../components/SortableList";
import MediaUploader from "../../components/MediaUploader";

const EventsPanel = ({
  events,
  eventForm,
  setEventForm,
  editingEvent,
  setEditingEvent,
  tabLoading,
  onCreateEvent,
  onUpdateEvent,
  onDeleteEvent,
  onReorderEvents,
  onToggleEventPublish,
  onToggleEventFeatured,
  formatDate,
  LoadingSpinner,
  EmptyState
}) => {
  // Local states for Event FAQs
  const [newFaqs, setNewFaqs] = useState([]);
  const [editFaqs, setEditFaqs] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddFaq = (isEdit = false) => {
    const fresh = { question: "", answer: "", displayOrder: isEdit ? editFaqs.length : newFaqs.length };
    if (isEdit) {
      setEditFaqs([...editFaqs, fresh]);
    } else {
      setNewFaqs([...newFaqs, fresh]);
    }
  };

  const handleRemoveFaq = (idx, isEdit = false) => {
    if (isEdit) {
      const copy = [...editFaqs];
      copy.splice(idx, 1);
      setEditFaqs(copy);
    } else {
      const copy = [...newFaqs];
      copy.splice(idx, 1);
      setNewFaqs(copy);
    }
  };

  const triggerCreate = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const payload = {
        ...eventForm,
        coverImageUrl: eventForm.coverImageUrl || eventForm.thumbnailUrl || eventForm.coverImage || "",
        maxVolunteers: eventForm.maxVolunteers ? Number(eventForm.maxVolunteers) : null,
        faqs: newFaqs
      };
      await onCreateEvent(payload);
      setNewFaqs([]);
    } finally {
      setIsSubmitting(false);
    }
  };

  const triggerEditStart = (ev) => {
    const toLocal = (iso) => (iso ? new Date(iso).toISOString().slice(0, 16) : "");
    setEditingEvent({
      ...ev,
      eventDate: toLocal(ev.eventDate),
      registrationDeadline: toLocal(ev.registrationDeadline),
      thumbnailUrl: ev.coverImageUrl || ev.thumbnailUrl || "",
      coverImage: ev.coverImageUrl || ev.coverImage || "",
    });
    setEditFaqs(ev.faqs || []);
  };

  const triggerUpdate = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const payload = {
        ...editingEvent,
        coverImageUrl: editingEvent.coverImageUrl || editingEvent.thumbnailUrl || editingEvent.coverImage || "",
        maxVolunteers: editingEvent.maxVolunteers ? Number(editingEvent.maxVolunteers) : null,
        faqs: editFaqs
      };
      await onUpdateEvent(payload);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h3 className="text-lg font-bold text-brand-navy-dark mb-4">Impact Initiatives & Event CMS</h3>

      {/* Creation Form */}
      {!editingEvent && (
        <form
          onSubmit={triggerCreate}
          className="mb-8 border border-dashed border-gray-300 rounded-3xl p-6 space-y-5 bg-gray-50/20"
        >
          <p className="text-sm font-bold text-brand-navy-dark border-b pb-2">Schedule New Initiative Event</p>
          
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500">Initiative Title *</label>
              <input
                value={eventForm.title}
                onChange={(e) => setEventForm((p) => ({ ...p, title: e.target.value }))}
                placeholder="Event Title (e.g. Literacy Drive Phase 2)"
                required
                className="w-full border border-gray-200 rounded-lg px-3.5 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20 bg-white"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500">Location / Venue *</label>
              <input
                value={eventForm.location}
                onChange={(e) => setEventForm((p) => ({ ...p, location: e.target.value }))}
                placeholder="Location (e.g. Sector-4 Community Center)"
                required
                className="w-full border border-gray-200 rounded-lg px-3.5 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20 bg-white"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500">Event Date & Time *</label>
              <input
                type="datetime-local"
                value={eventForm.eventDate}
                onChange={(e) => setEventForm((p) => ({ ...p, eventDate: e.target.value }))}
                required
                className="w-full border border-gray-200 rounded-lg px-3.5 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20 bg-white"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500">Reg. Deadline Date</label>
              <input
                type="datetime-local"
                value={eventForm.registrationDeadline}
                onChange={(e) => setEventForm((p) => ({ ...p, registrationDeadline: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3.5 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20 bg-white"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500">Maximum Volunteers</label>
              <input
                type="number"
                value={eventForm.maxVolunteers}
                onChange={(e) => setEventForm((p) => ({ ...p, maxVolunteers: e.target.value }))}
                placeholder="e.g. 50"
                className="w-full border border-gray-200 rounded-lg px-3.5 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20 bg-white"
              />
            </div>
          </div>

          {/* New Event Image Architecture */}
          <div className="border border-gray-100 rounded-2xl p-4 bg-gray-50/50 space-y-3">
            <p className="text-xs font-bold text-gray-700">Relational Image Architecture</p>
            <div className="grid sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <MediaUploader
                  mediaType="IMAGE"
                  label="Thumbnail Image (Listings) *"
                  value={eventForm.thumbnailUrl || ""}
                  onUploadSuccess={(metadata) => setEventForm((p) => ({ ...p, thumbnailUrl: metadata.secure_url }))}
                />
              </div>
              <div className="space-y-1">
                <MediaUploader
                  mediaType="IMAGE"
                  label="Hero Image (Header banner)"
                  value={eventForm.heroImageUrl || ""}
                  onUploadSuccess={(metadata) => setEventForm((p) => ({ ...p, heroImageUrl: metadata.secure_url }))}
                />
              </div>
              <div className="space-y-1">
                <MediaUploader
                  mediaType="IMAGE"
                  label="Cover Image (Fallback)"
                  value={eventForm.coverImage || ""}
                  onUploadSuccess={(metadata) => setEventForm((p) => ({ ...p, coverImage: metadata.secure_url }))}
                />
              </div>
            </div>
            <div className="space-y-1 pt-1">
              <label className="text-xs text-gray-500">Gallery Carousel Images (Comma separated URLs)</label>
              <input
                value={eventForm.bannerUrl || ""}
                onChange={(e) => setEventForm((p) => ({ ...p, bannerUrl: e.target.value }))}
                placeholder="https://image1.jpg, https://image2.jpg..."
                className="w-full border border-gray-200 rounded-lg px-3.5 py-2 text-sm outline-none bg-white"
              />
            </div>
          </div>

          {/* Social Links & Highlights */}
          <div className="border border-gray-100 rounded-2xl p-4 bg-gray-50/50 space-y-3">
            <p className="text-xs font-bold text-gray-700">Highlights & Social Video/Photo Integrations</p>
            <div className="grid sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] text-gray-500">Instagram Media Link</label>
                <input
                  value={eventForm.instagramUrl || ""}
                  onChange={(e) => setEventForm((p) => ({ ...p, instagramUrl: e.target.value }))}
                  placeholder="https://instagram.com/..."
                  className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-xs outline-none bg-white"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] text-gray-500">YouTube Video / Highlights Link</label>
                <input
                  value={eventForm.youtubeUrl || ""}
                  onChange={(e) => setEventForm((p) => ({ ...p, youtubeUrl: e.target.value }))}
                  placeholder="https://youtube.com/watch?v=..."
                  className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-xs outline-none bg-white"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] text-gray-500">Facebook Gallery Link</label>
                <input
                  value={eventForm.facebookUrl || ""}
                  onChange={(e) => setEventForm((p) => ({ ...p, facebookUrl: e.target.value }))}
                  placeholder="https://facebook.com/..."
                  className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-xs outline-none bg-white"
                />
              </div>
            </div>
          </div>

          {/* Structured FAQs */}
          <div className="border border-gray-100 rounded-2xl p-4 bg-gray-50/50 space-y-3">
            <div className="flex justify-between items-center">
              <p className="text-xs font-bold text-gray-700">Relational Event FAQs</p>
              <button
                type="button"
                onClick={() => handleAddFaq(false)}
                className="text-xs font-bold text-primary hover:underline"
              >
                + Add FAQ Item
              </button>
            </div>
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {newFaqs.map((faq, idx) => (
                <div key={idx} className="bg-white border rounded-xl p-3 relative space-y-2">
                  <button
                    type="button"
                    onClick={() => handleRemoveFaq(idx, false)}
                    className="absolute top-2 right-2 text-[10px] text-red-500 font-bold hover:underline"
                  >
                    Remove
                  </button>
                  <input
                    value={faq.question}
                    onChange={(e) => {
                      const copy = [...newFaqs];
                      copy[idx].question = e.target.value;
                      setNewFaqs(copy);
                    }}
                    placeholder="Question (e.g. Who can volunteer?)"
                    className="w-full border rounded p-1.5 text-xs outline-none focus:ring-1 focus:ring-primary/30"
                  />
                  <textarea
                    value={faq.answer}
                    onChange={(e) => {
                      const copy = [...newFaqs];
                      copy[idx].answer = e.target.value;
                      setNewFaqs(copy);
                    }}
                    placeholder="Answer narrative..."
                    rows={2}
                    className="w-full border rounded p-1.5 text-xs outline-none resize-none focus:ring-1 focus:ring-primary/30"
                  />
                </div>
              ))}
              {newFaqs.length === 0 && (
                <p className="text-xs text-gray-400 text-center py-4">No FAQs defined. Click add to address registration questions.</p>
              )}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-500">Initiative Narrative Description *</label>
            <RichTextEditor
              content={eventForm.description}
              onChange={(html) => setEventForm((p) => ({ ...p, description: html }))}
              placeholder="Outline deployment goals, timeline, and details..."
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-5 py-2.5 rounded-lg text-sm font-bold transition ${isSubmitting ? "bg-gray-400 text-white cursor-not-allowed" : "bg-primary text-white hover:brightness-95"}`}
          >
            {isSubmitting ? "Saving..." : "+ Create Initiative Event"}
          </button>
        </form>
      )}

      {/* Editing Section Drawer */}
      {editingEvent && (
        <form
          onSubmit={triggerUpdate}
          className="border-2 border-primary/30 bg-primary/5 rounded-3xl p-6 mb-8 space-y-5 shadow-lg"
        >
          <p className="text-sm font-bold text-brand-navy-dark border-b border-primary/20 pb-2">
            Editing Event Configuration: <span className="text-primary font-black">{editingEvent.title}</span>
          </p>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500">Initiative Title *</label>
              <input
                value={editingEvent.title}
                onChange={(e) => setEditingEvent((p) => ({ ...p, title: e.target.value }))}
                placeholder="Event Title"
                required
                className="w-full border border-gray-200 rounded-lg px-3.5 py-2 text-sm outline-none bg-white"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500">Location / Venue *</label>
              <input
                value={editingEvent.location || ""}
                onChange={(e) => setEditingEvent((p) => ({ ...p, location: e.target.value }))}
                placeholder="Location"
                required
                className="w-full border border-gray-200 rounded-lg px-3.5 py-2 text-sm outline-none bg-white"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500">Event Date & Time *</label>
              <input
                type="datetime-local"
                value={editingEvent.eventDate}
                onChange={(e) => setEditingEvent((p) => ({ ...p, eventDate: e.target.value }))}
                required
                className="w-full border border-gray-200 rounded-lg px-3.5 py-2 text-sm outline-none bg-white"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500">Reg. Deadline Date</label>
              <input
                type="datetime-local"
                value={editingEvent.registrationDeadline || ""}
                onChange={(e) => setEditingEvent((p) => ({ ...p, registrationDeadline: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3.5 py-2 text-sm outline-none bg-white"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500">Maximum Volunteers</label>
              <input
                type="number"
                value={editingEvent.maxVolunteers || ""}
                onChange={(e) => setEditingEvent((p) => ({ ...p, maxVolunteers: e.target.value }))}
                placeholder="Max Volunteers"
                className="w-full border border-gray-200 rounded-lg px-3.5 py-2 text-sm outline-none bg-white"
              />
            </div>
          </div>

          {/* Relational Image Architecture */}
          <div className="border border-gray-100 rounded-2xl p-4 bg-white space-y-3 shadow-sm">
            <p className="text-xs font-bold text-gray-700">Relational Image Architecture</p>
            <div className="grid sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <MediaUploader
                  mediaType="IMAGE"
                  label="Thumbnail Image *"
                  value={editingEvent.thumbnailUrl || ""}
                  onUploadSuccess={(metadata) => setEditingEvent((p) => ({ ...p, thumbnailUrl: metadata.secure_url }))}
                />
              </div>
              <div className="space-y-1">
                <MediaUploader
                  mediaType="IMAGE"
                  label="Hero Image"
                  value={editingEvent.heroImageUrl || ""}
                  onUploadSuccess={(metadata) => setEditingEvent((p) => ({ ...p, heroImageUrl: metadata.secure_url }))}
                />
              </div>
              <div className="space-y-1">
                <MediaUploader
                  mediaType="IMAGE"
                  label="Cover Image"
                  value={editingEvent.coverImage || ""}
                  onUploadSuccess={(metadata) => setEditingEvent((p) => ({ ...p, coverImage: metadata.secure_url }))}
                />
              </div>
            </div>
            <div className="space-y-1 pt-1">
              <label className="text-xs text-gray-500">Gallery Carousel Images (Comma separated URLs)</label>
              <input
                value={editingEvent.bannerUrl || ""}
                onChange={(e) => setEditingEvent((p) => ({ ...p, bannerUrl: e.target.value }))}
                placeholder="https://image1.jpg, https://image2.jpg..."
                className="w-full border border-gray-200 rounded-lg px-3.5 py-2 text-sm outline-none bg-gray-50"
              />
            </div>
          </div>

          {/* Social Links & Highlights */}
          <div className="border border-gray-100 rounded-2xl p-4 bg-white space-y-3 shadow-sm">
            <p className="text-xs font-bold text-gray-700">Highlights & Social Video/Photo Integrations</p>
            <div className="grid sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] text-gray-500">Instagram Media Link</label>
                <input
                  value={editingEvent.instagramUrl || ""}
                  onChange={(e) => setEditingEvent((p) => ({ ...p, instagramUrl: e.target.value }))}
                  placeholder="https://instagram.com/..."
                  className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-xs outline-none bg-gray-50"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] text-gray-500">YouTube Video Link</label>
                <input
                  value={editingEvent.youtubeUrl || ""}
                  onChange={(e) => setEditingEvent((p) => ({ ...p, youtubeUrl: e.target.value }))}
                  placeholder="https://youtube.com/watch?v=..."
                  className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-xs outline-none bg-gray-50"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] text-gray-500">Facebook Gallery Link</label>
                <input
                  value={editingEvent.facebookUrl || ""}
                  onChange={(e) => setEditingEvent((p) => ({ ...p, facebookUrl: e.target.value }))}
                  placeholder="https://facebook.com/..."
                  className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-xs outline-none bg-gray-50"
                />
              </div>
            </div>
          </div>

          {/* Structured FAQs */}
          <div className="border border-gray-100 rounded-2xl p-4 bg-white space-y-3 shadow-sm">
            <div className="flex justify-between items-center">
              <p className="text-xs font-bold text-gray-700">Relational Event FAQs</p>
              <button
                type="button"
                onClick={() => handleAddFaq(true)}
                className="text-xs font-bold text-primary hover:underline"
              >
                + Add FAQ Item
              </button>
            </div>
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {editFaqs.map((faq, idx) => (
                <div key={idx} className="bg-gray-50 border rounded-xl p-3 relative space-y-2">
                  <button
                    type="button"
                    onClick={() => handleRemoveFaq(idx, true)}
                    className="absolute top-2 right-2 text-[10px] text-red-500 font-bold hover:underline"
                  >
                    Remove
                  </button>
                  <input
                    value={faq.question || ""}
                    onChange={(e) => {
                      const copy = [...editFaqs];
                      copy[idx].question = e.target.value;
                      setEditFaqs(copy);
                    }}
                    placeholder="Question"
                    className="w-full border rounded p-1.5 text-xs outline-none bg-white focus:ring-1 focus:ring-primary/30"
                  />
                  <textarea
                    value={faq.answer || ""}
                    onChange={(e) => {
                      const copy = [...editFaqs];
                      copy[idx].answer = e.target.value;
                      setEditFaqs(copy);
                    }}
                    placeholder="Answer narrative..."
                    rows={2}
                    className="w-full border rounded p-1.5 text-xs outline-none bg-white resize-none focus:ring-1 focus:ring-primary/30"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-500">Initiative Narrative Description *</label>
            <RichTextEditor
              content={editingEvent.description || ""}
              onChange={(html) => setEditingEvent((p) => ({ ...p, description: html }))}
              placeholder="Outline deployment goals, timeline, and details..."
            />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-5 py-2.5 rounded-lg text-xs font-bold transition ${isSubmitting ? "bg-gray-400 text-white cursor-not-allowed" : "bg-primary text-white hover:brightness-95"}`}
            >
              {isSubmitting ? "Saving..." : "Save Event Config"}
            </button>
            <button
              type="button"
              onClick={() => setEditingEvent(null)}
              className="bg-gray-100 text-gray-600 px-5 py-2.5 rounded-lg text-xs font-bold hover:bg-gray-200 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Event Listings */}
      {tabLoading ? (
        <LoadingSpinner />
      ) : !Array.isArray(events) || events.length === 0 ? (
        <EmptyState
          icon="📅"
          title="No events yet."
          subtitle="Deploy your first impact initiative using the editor above."
        />
      ) : (
        <SortableList
          items={events}
          onReorder={onReorderEvents}
          renderItem={(ev) => (
            <div className="border border-gray-100 rounded-2xl p-5 bg-white hover:shadow-sm transition">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-4 min-w-0">
                  {(ev.coverImageUrl || ev.thumbnailUrl) && (
                    <img
                      src={ev.coverImageUrl || ev.thumbnailUrl}
                      alt={ev.title}
                      className="w-16 h-16 rounded-xl object-cover flex-shrink-0 border"
                    />
                  )}
                  <div className="min-w-0">
                    <h4 className="font-bold text-brand-navy-dark text-base truncate">{ev.title}</h4>
                    <p className="text-xs text-gray-500 font-semibold mt-1">
                      📅 {formatDate(ev.eventDate)} {ev.location && `• 📍 ${ev.location}`}
                    </p>
                    <div className="flex flex-wrap gap-1.5 mt-2.5">
                      {ev.status && (
                        <span
                          className={`text-[9px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                            ev.status === "UPCOMING"
                              ? "bg-blue-50 text-blue-700 border border-blue-100"
                              : ev.status === "ONGOING"
                              ? "bg-amber-50 text-amber-700 border border-amber-100"
                              : "bg-emerald-50 text-emerald-700 border border-emerald-100"
                          }`}
                        >
                          {ev.status}
                        </span>
                      )}
                      {ev.faqs?.length > 0 && (
                        <span className="text-[9px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full font-bold border border-indigo-100">
                          💬 {ev.faqs.length} FAQs
                        </span>
                      )}
                      {ev.instagramUrl && (
                        <span className="text-[9px] bg-pink-50 text-pink-700 px-2 py-0.5 rounded-full font-bold border border-pink-100">
                          📸 Instagram
                        </span>
                      )}
                      {ev.youtubeUrl && (
                        <span className="text-[9px] bg-red-50 text-red-700 px-2 py-0.5 rounded-full font-bold border border-red-100">
                          🎥 YouTube Highlights
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 md:self-center self-start border-t md:border-t-0 pt-3 md:pt-0 w-full md:w-auto justify-end">
                  <button
                    onClick={() => onToggleEventPublish(ev.id, ev.published)}
                    className={`text-xs px-3.5 py-1.5 rounded-full font-bold transition duration-300 ${
                      ev.published
                        ? "bg-emerald-500 text-white hover:bg-emerald-600"
                        : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                    }`}
                  >
                    {ev.published ? "✓ Published" : "Draft"}
                  </button>
                  <button
                    onClick={() => onToggleEventFeatured(ev.id, ev.featured)}
                    className={`text-xs px-3.5 py-1.5 rounded-full font-bold transition duration-300 ${
                      ev.featured
                        ? "bg-amber-500 text-white hover:bg-amber-600 shadow-sm"
                        : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                    }`}
                  >
                    {ev.featured ? "⭐ Featured" : "Feature"}
                  </button>
                  <button
                    onClick={() => triggerEditStart(ev)}
                    className="text-xs text-blue-500 hover:text-blue-700 font-bold px-2 py-1.5 hover:bg-blue-50 rounded-md transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDeleteEvent(ev.id)}
                    className="text-xs text-red-500 hover:text-red-700 font-bold px-2 py-1.5 hover:bg-red-50 rounded-md transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        />
      )}
    </div>
  );
};

export default EventsPanel;
