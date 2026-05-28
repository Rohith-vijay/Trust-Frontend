import React, { useState } from "react";

const MembersPanel = ({
  members,
  memberForm,
  setMemberForm,
  editingMember,
  setEditingMember,
  tabLoading,
  onAddMember,
  onUpdateMember,
  onDeleteMember,
  LoadingSpinner,
  EmptyState
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      await onAddMember(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      await onUpdateMember(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h3 className="text-lg font-bold text-brand-navy-dark mb-4">Team Members directory</h3>

      {/* Add member form */}
      <form
        onSubmit={handleCreate}
        className="mb-6 border border-dashed border-gray-300 rounded-2xl p-5 space-y-4 bg-gray-50/30"
      >
        <p className="text-sm font-semibold text-gray-700">Add New Team Member</p>
        <div className="grid sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-500">Full Name *</label>
            <input
              value={memberForm.name}
              onChange={(e) => setMemberForm((p) => ({ ...p, name: e.target.value }))}
              placeholder="e.g. Rohith Vijay"
              required
              className="w-full border border-gray-200 rounded-lg px-3.5 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20 bg-white"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-500">Role Title *</label>
            <input
              value={memberForm.role}
              onChange={(e) => setMemberForm((p) => ({ ...p, role: e.target.value }))}
              placeholder="e.g. Managing Director"
              required
              className="w-full border border-gray-200 rounded-lg px-3.5 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20 bg-white"
            />
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-500">Tagline / Motto</label>
            <input
              value={memberForm.tagline}
              onChange={(e) => setMemberForm((p) => ({ ...p, tagline: e.target.value }))}
              placeholder="Tagline or short philosophy"
              className="w-full border border-gray-200 rounded-lg px-3.5 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20 bg-white"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-500">Photo URL</label>
            <input
              value={memberForm.imageUrl}
              onChange={(e) => setMemberForm((p) => ({ ...p, imageUrl: e.target.value }))}
              placeholder="Photo Link https://..."
              className="w-full border border-gray-200 rounded-lg px-3.5 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20 bg-white"
            />
          </div>
        </div>
        <div className="space-y-1">
          <label className="text-xs font-semibold text-gray-500">Short Biography</label>
          <textarea
            value={memberForm.bio}
            onChange={(e) => setMemberForm((p) => ({ ...p, bio: e.target.value }))}
            placeholder="Introduce this member..."
            rows={2}
            className="w-full border border-gray-200 rounded-lg px-3.5 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20 bg-white resize-none"
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className={`px-5 py-2.5 rounded-lg text-sm font-bold transition ${isSubmitting ? "bg-gray-400 text-white cursor-not-allowed" : "bg-primary text-white hover:brightness-95 hover:shadow-md"}`}
        >
          {isSubmitting ? "Adding..." : "+ Add Member"}
        </button>
      </form>

      {tabLoading ? (
        <LoadingSpinner />
      ) : !Array.isArray(members) || members.length === 0 ? (
        <EmptyState
          icon="👤"
          title="No team members yet."
          subtitle="Add members to populate the governance directory."
        />
      ) : (
        <div className="space-y-3">
          {Array.isArray(members) && members.map((m) =>
            editingMember?.id === m.id ? (
              <form
                key={m.id}
                onSubmit={handleUpdate}
                className="border border-primary/20 bg-primary/5 rounded-2xl p-5 space-y-4 shadow-sm"
              >
                <p className="text-sm font-bold text-brand-navy-dark">Editing Member Profile</p>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-500">Full Name</label>
                    <input
                      value={editingMember.name}
                      onChange={(e) =>
                        setEditingMember((p) => ({ ...p, name: e.target.value }))
                      }
                      placeholder="Full Name"
                      required
                      className="w-full border border-gray-200 rounded-lg px-3.5 py-2 text-sm outline-none bg-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-500">Role</label>
                    <input
                      value={editingMember.role || ""}
                      onChange={(e) =>
                        setEditingMember((p) => ({ ...p, role: e.target.value }))
                      }
                      placeholder="Role"
                      className="w-full border border-gray-200 rounded-lg px-3.5 py-2 text-sm outline-none bg-white"
                    />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-500">Tagline</label>
                    <input
                      value={editingMember.tagline || ""}
                      onChange={(e) =>
                        setEditingMember((p) => ({ ...p, tagline: e.target.value }))
                      }
                      placeholder="Tagline"
                      className="w-full border border-gray-200 rounded-lg px-3.5 py-2 text-sm outline-none bg-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-500">Photo URL</label>
                    <input
                      value={editingMember.imageUrl || ""}
                      onChange={(e) =>
                        setEditingMember((p) => ({ ...p, imageUrl: e.target.value }))
                      }
                      placeholder="Photo URL"
                      className="w-full border border-gray-200 rounded-lg px-3.5 py-2 text-sm outline-none bg-white"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-500">Biography</label>
                  <textarea
                    value={editingMember.bio || ""}
                    onChange={(e) =>
                      setEditingMember((p) => ({ ...p, bio: e.target.value }))
                    }
                    placeholder="Bio"
                    rows={2}
                    className="w-full border border-gray-200 rounded-lg px-3.5 py-2 text-sm outline-none bg-white resize-none"
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-500">LinkedIn URL</label>
                    <input
                      value={editingMember.linkedinUrl || ""}
                      onChange={(e) =>
                        setEditingMember((p) => ({ ...p, linkedinUrl: e.target.value }))
                      }
                      placeholder="LinkedIn URL"
                      className="w-full border border-gray-200 rounded-lg px-3.5 py-2 text-sm outline-none bg-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-500">Twitter URL</label>
                    <input
                      value={editingMember.twitterUrl || ""}
                      onChange={(e) =>
                        setEditingMember((p) => ({ ...p, twitterUrl: e.target.value }))
                      }
                      placeholder="Twitter URL"
                      className="w-full border border-gray-200 rounded-lg px-3.5 py-2 text-sm outline-none bg-white"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`px-4.5 py-2 rounded-lg text-xs font-bold transition ${isSubmitting ? "bg-gray-400 text-white cursor-not-allowed" : "bg-primary text-white hover:brightness-95"}`}
                  >
                    {isSubmitting ? "Saving..." : "Save"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingMember(null)}
                    className="bg-gray-100 text-gray-600 px-4.5 py-2 rounded-lg text-xs font-bold hover:bg-gray-200 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div
                key={m.id}
                className="flex items-center gap-4 border border-gray-100 rounded-2xl p-4 bg-white hover:shadow-sm transition"
              >
                {m.imageUrl ? (
                  <img
                    src={m.imageUrl}
                    alt={m.name}
                    className="w-14 h-14 rounded-full object-cover flex-shrink-0 border border-gray-100"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black text-sm flex-shrink-0 border border-primary/20">
                    {(m.name || "")
                      .split(" ")
                      .map((w) => w[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-brand-navy-dark truncate text-sm">{m.name}</h4>
                  <p className="text-xs text-gray-500 font-semibold">{m.role}</p>
                  {m.tagline && (
                    <p className="text-xs text-gray-400 mt-1 italic font-medium truncate">
                      "{m.tagline}"
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => setEditingMember({ ...m })}
                    className="text-xs text-blue-500 hover:text-blue-700 font-bold px-3 py-1.5 hover:bg-blue-50 rounded-md transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDeleteMember(m.id)}
                    className="text-xs text-red-500 hover:text-red-700 font-bold px-3 py-1.5 hover:bg-red-50 rounded-md transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default MembersPanel;
