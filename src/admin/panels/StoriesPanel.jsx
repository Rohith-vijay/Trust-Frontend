import React, { useState } from "react";

const StoriesPanel = ({
  stories,
  storyForm,
  setStoryForm,
  editingStory,
  setEditingStory,
  tabLoading,
  onCreateStory,
  onUpdateStory,
  onDeleteStory,
  LoadingSpinner,
  EmptyState
}) => {
  // Local states for sub-entries during create
  const [newMilestones, setNewMilestones] = useState([]);
  const [newMetrics, setNewMetrics] = useState([]);

  // Local states for sub-entries during edit
  const [editMilestones, setEditMilestones] = useState([]);
  const [editMetrics, setEditMetrics] = useState([]);

  const handleAddMilestone = (isEdit = false) => {
    const fresh = { date: "", title: "", description: "", imageUrl: "", orderIndex: isEdit ? editMilestones.length : newMilestones.length };
    if (isEdit) {
      setEditMilestones([...editMilestones, fresh]);
    } else {
      setNewMilestones([...newMilestones, fresh]);
    }
  };

  const handleRemoveMilestone = (idx, isEdit = false) => {
    if (isEdit) {
      const copy = [...editMilestones];
      copy.splice(idx, 1);
      setEditMilestones(copy);
    } else {
      const copy = [...newMilestones];
      copy.splice(idx, 1);
      setNewMilestones(copy);
    }
  };

  const handleAddMetric = (isEdit = false) => {
    const fresh = { label: "", value: "", icon: "📈", displayOrder: isEdit ? editMetrics.length : newMetrics.length };
    if (isEdit) {
      setEditMetrics([...editMetrics, fresh]);
    } else {
      setNewMetrics([...newMetrics, fresh]);
    }
  };

  const handleRemoveMetric = (idx, isEdit = false) => {
    if (isEdit) {
      const copy = [...editMetrics];
      copy.splice(idx, 1);
      setEditMetrics(copy);
    } else {
      const copy = [...newMetrics];
      copy.splice(idx, 1);
      setNewMetrics(copy);
    }
  };

  const triggerCreate = (e) => {
    e.preventDefault();
    // Build story package including milestones and metrics lists
    const packageData = {
      ...storyForm,
      milestones: newMilestones,
      metrics: newMetrics
    };
    onCreateStory(packageData);
    // Reset local lists
    setNewMilestones([]);
    setNewMetrics([]);
  };

  const triggerEditStart = (s) => {
    setEditingStory(s);
    setEditMilestones(s.milestones || []);
    setEditMetrics(s.metrics || []);
  };

  const triggerUpdate = (e) => {
    e.preventDefault();
    const packageData = {
      ...editingStory,
      milestones: editMilestones,
      metrics: editMetrics
    };
    onUpdateStory(packageData);
    setEditingStory(null);
  };

  return (
    <div>
      <h3 className="text-lg font-bold text-brand-navy-dark mb-4">Success Stories CMS</h3>

      {/* Structured Create Form */}
      {!editingStory && (
        <form
          onSubmit={triggerCreate}
          className="mb-8 border border-dashed border-gray-300 rounded-3xl p-6 space-y-5 bg-gray-50/20"
        >
          <p className="text-sm font-bold text-brand-navy-dark border-b pb-2">Publish Immersive Success Story</p>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500">Story Title *</label>
              <input
                value={storyForm.title}
                onChange={(e) => setStoryForm((p) => ({ ...p, title: e.target.value }))}
                placeholder="Title (e.g. Hope Restored in Village)"
                required
                className="w-full border border-gray-200 rounded-lg px-3.5 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20 bg-white"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500">Subtitle / Tagline *</label>
              <input
                value={storyForm.subtitle || ""}
                onChange={(e) => setStoryForm((p) => ({ ...p, subtitle: e.target.value }))}
                placeholder="e.g. Restoring potable drinking water for 500+ households"
                required
                className="w-full border border-gray-200 rounded-lg px-3.5 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20 bg-white"
              />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500">Category Tag</label>
              <input
                value={storyForm.category}
                onChange={(e) => setStoryForm((p) => ({ ...p, category: e.target.value }))}
                placeholder="Category (e.g. Water Relief, Education)"
                className="w-full border border-gray-200 rounded-lg px-3.5 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20 bg-white"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500">Cover Thumbnail Image URL *</label>
              <input
                value={storyForm.imageUrl}
                onChange={(e) => setStoryForm((p) => ({ ...p, imageUrl: e.target.value }))}
                placeholder="https://..."
                required
                className="w-full border border-gray-200 rounded-lg px-3.5 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20 bg-white"
              />
            </div>
          </div>

          {/* Before/After Showcase URLs */}
          <div className="border border-gray-100 rounded-2xl p-4 bg-gray-50/50 space-y-4">
            <p className="text-xs font-bold text-gray-700">Before & After Showcase (Optional)</p>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs text-gray-500">Before Status Image URL</label>
                <input
                  value={storyForm.beforeImageUrl || ""}
                  onChange={(e) => setStoryForm((p) => ({ ...p, beforeImageUrl: e.target.value }))}
                  placeholder="https://..."
                  className="w-full border border-gray-200 rounded-lg px-3.5 py-2 text-sm outline-none bg-white"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-gray-500">After Status Image URL</label>
                <input
                  value={storyForm.afterImageUrl || ""}
                  onChange={(e) => setStoryForm((p) => ({ ...p, afterImageUrl: e.target.value }))}
                  placeholder="https://..."
                  className="w-full border border-gray-200 rounded-lg px-3.5 py-2 text-sm outline-none bg-white"
                />
              </div>
            </div>
          </div>

          {/* Testimonial Quote */}
          <div className="border border-gray-100 rounded-2xl p-4 bg-gray-50/50 space-y-4">
            <p className="text-xs font-bold text-gray-700">Beneficiary Testimonial (Optional)</p>
            <div className="space-y-2">
              <input
                value={storyForm.testimonialAuthor || ""}
                onChange={(e) => setStoryForm((p) => ({ ...p, testimonialAuthor: e.target.value }))}
                placeholder="Author Name (e.g. Ramesh Kumar, Local Teacher)"
                className="w-full border border-gray-200 rounded-lg px-3.5 py-2 text-sm outline-none bg-white"
              />
              <textarea
                value={storyForm.testimonialQuote || ""}
                onChange={(e) => setStoryForm((p) => ({ ...p, testimonialQuote: e.target.value }))}
                placeholder="Testimonial Quote / Statements..."
                rows={2}
                className="w-full border border-gray-200 rounded-lg px-3.5 py-2 text-sm outline-none bg-white resize-none"
              />
            </div>
          </div>

          {/* Relational Content Lists (Milestones & Metrics) */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Story Timeline Milestones */}
            <div className="border border-gray-100 rounded-2xl p-4 bg-gray-50/50 space-y-3">
              <div className="flex justify-between items-center">
                <p className="text-xs font-bold text-gray-700">Story Milestones Timeline</p>
                <button
                  type="button"
                  onClick={() => handleAddMilestone(false)}
                  className="text-xs font-bold text-primary hover:underline"
                >
                  + Add Event
                </button>
              </div>
              <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                {newMilestones.map((m, idx) => (
                  <div key={idx} className="bg-white border rounded-xl p-3 relative space-y-2">
                    <button
                      type="button"
                      onClick={() => handleRemoveMilestone(idx, false)}
                      className="absolute top-2 right-2 text-[10px] text-red-500 font-bold hover:underline"
                    >
                      Remove
                    </button>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        value={m.date}
                        onChange={(e) => {
                          const copy = [...newMilestones];
                          copy[idx].date = e.target.value;
                          setNewMilestones(copy);
                        }}
                        placeholder="Date/Phase (e.g. Oct 2025)"
                        className="border rounded p-1.5 text-xs outline-none"
                      />
                      <input
                        value={m.title}
                        onChange={(e) => {
                          const copy = [...newMilestones];
                          copy[idx].title = e.target.value;
                          setNewMilestones(copy);
                        }}
                        placeholder="Milestone Title"
                        className="border rounded p-1.5 text-xs outline-none"
                      />
                    </div>
                    <input
                      value={m.imageUrl || ""}
                      onChange={(e) => {
                        const copy = [...newMilestones];
                        copy[idx].imageUrl = e.target.value;
                        setNewMilestones(copy);
                      }}
                      placeholder="Milestone Image URL"
                      className="w-full border rounded p-1.5 text-xs outline-none"
                    />
                    <textarea
                      value={m.description}
                      onChange={(e) => {
                        const copy = [...newMilestones];
                        copy[idx].description = e.target.value;
                        setNewMilestones(copy);
                      }}
                      placeholder="Short detail description..."
                      rows={2}
                      className="w-full border rounded p-1.5 text-xs outline-none resize-none"
                    />
                  </div>
                ))}
                {newMilestones.length === 0 && (
                  <p className="text-xs text-gray-400 text-center py-4">No milestones defined. Click add to outline story key phases.</p>
                )}
              </div>
            </div>

            {/* Story Impact Metrics */}
            <div className="border border-gray-100 rounded-2xl p-4 bg-gray-50/50 space-y-3">
              <div className="flex justify-between items-center">
                <p className="text-xs font-bold text-gray-700">Story Impact Metrics</p>
                <button
                  type="button"
                  onClick={() => handleAddMetric(false)}
                  className="text-xs font-bold text-primary hover:underline"
                >
                  + Add Metric
                </button>
              </div>
              <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                {newMetrics.map((mt, idx) => (
                  <div key={idx} className="bg-white border rounded-xl p-3 relative space-y-2">
                    <button
                      type="button"
                      onClick={() => handleRemoveMetric(idx, false)}
                      className="absolute top-2 right-2 text-[10px] text-red-500 font-bold hover:underline"
                    >
                      Remove
                    </button>
                    <div className="grid grid-cols-3 gap-2">
                      <input
                        value={mt.icon}
                        onChange={(e) => {
                          const copy = [...newMetrics];
                          copy[idx].icon = e.target.value;
                          setNewMetrics(copy);
                        }}
                        placeholder="Icon (💧)"
                        className="border rounded p-1.5 text-xs outline-none text-center"
                      />
                      <input
                        value={mt.value}
                        onChange={(e) => {
                          const copy = [...newMetrics];
                          copy[idx].value = e.target.value;
                          setNewMetrics(copy);
                        }}
                        placeholder="Value (500+)"
                        className="border rounded p-1.5 text-xs outline-none col-span-2"
                      />
                    </div>
                    <input
                      value={mt.label}
                      onChange={(e) => {
                        const copy = [...newMetrics];
                        copy[idx].label = e.target.value;
                        setNewMetrics(copy);
                      }}
                      placeholder="Label (e.g. Children Enrolled)"
                      className="w-full border rounded p-1.5 text-xs outline-none"
                    />
                  </div>
                ))}
                {newMetrics.length === 0 && (
                  <p className="text-xs text-gray-400 text-center py-4">No metrics configured. Add metric keys to display statistics cards.</p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-500">Story Body narrative (Markdown / Text) *</label>
            <textarea
              value={storyForm.description}
              onChange={(e) => setStoryForm((p) => ({ ...p, description: e.target.value }))}
              placeholder="Provide a cinematic, immersive success story narrative..."
              required
              rows={4}
              className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20 bg-white"
            />
          </div>

          <button
            type="submit"
            className="bg-primary text-white px-5 py-2.5 rounded-lg text-sm font-bold hover:brightness-95 transition"
          >
            + Publish Immersive Story
          </button>
        </form>
      )}

      {/* Editing Modal/Form Drawer */}
      {editingStory && (
        <form
          onSubmit={triggerUpdate}
          className="border-2 border-primary/30 bg-primary/5 rounded-3xl p-6 mb-8 space-y-5 shadow-lg"
        >
          <p className="text-sm font-bold text-brand-navy-dark border-b border-primary/20 pb-2">
            Editing Story Config: <span className="text-primary font-black">{editingStory.title}</span>
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500">Story Title *</label>
              <input
                value={editingStory.title}
                onChange={(e) => setEditingStory((p) => ({ ...p, title: e.target.value }))}
                placeholder="Title"
                required
                className="w-full border border-gray-200 rounded-lg px-3.5 py-2 text-sm outline-none bg-white"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500">Subtitle / Tagline *</label>
              <input
                value={editingStory.subtitle || ""}
                onChange={(e) => setEditingStory((p) => ({ ...p, subtitle: e.target.value }))}
                placeholder="Subtitle"
                required
                className="w-full border border-gray-200 rounded-lg px-3.5 py-2 text-sm outline-none bg-white"
              />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500">Category Tag</label>
              <input
                value={editingStory.category || ""}
                onChange={(e) => setEditingStory((p) => ({ ...p, category: e.target.value }))}
                placeholder="Category"
                className="w-full border border-gray-200 rounded-lg px-3.5 py-2 text-sm outline-none bg-white"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500">Cover Thumbnail URL</label>
              <input
                value={editingStory.imageUrl || ""}
                onChange={(e) => setEditingStory((p) => ({ ...p, imageUrl: e.target.value }))}
                placeholder="Cover URL"
                className="w-full border border-gray-200 rounded-lg px-3.5 py-2 text-sm outline-none bg-white"
              />
            </div>
          </div>

          {/* Before/After Showcase */}
          <div className="border border-gray-100 bg-white rounded-2xl p-4 space-y-4">
            <p className="text-xs font-bold text-gray-700">Before & After Showcase</p>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs text-gray-500">Before Status Image URL</label>
                <input
                  value={editingStory.beforeImageUrl || ""}
                  onChange={(e) => setEditingStory((p) => ({ ...p, beforeImageUrl: e.target.value }))}
                  placeholder="https://..."
                  className="w-full border border-gray-200 rounded-lg px-3.5 py-2 text-sm outline-none bg-gray-50"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-gray-500">After Status Image URL</label>
                <input
                  value={editingStory.afterImageUrl || ""}
                  onChange={(e) => setEditingStory((p) => ({ ...p, afterImageUrl: e.target.value }))}
                  placeholder="https://..."
                  className="w-full border border-gray-200 rounded-lg px-3.5 py-2 text-sm outline-none bg-gray-50"
                />
              </div>
            </div>
          </div>

          {/* Testimonial Quote */}
          <div className="border border-gray-100 bg-white rounded-2xl p-4 space-y-4">
            <p className="text-xs font-bold text-gray-700">Beneficiary Testimonial</p>
            <div className="space-y-2">
              <input
                value={editingStory.testimonialAuthor || ""}
                onChange={(e) => setEditingStory((p) => ({ ...p, testimonialAuthor: e.target.value }))}
                placeholder="Author Name"
                className="w-full border border-gray-200 rounded-lg px-3.5 py-2 text-sm outline-none bg-gray-50"
              />
              <textarea
                value={editingStory.testimonialQuote || ""}
                onChange={(e) => setEditingStory((p) => ({ ...p, testimonialQuote: e.target.value }))}
                placeholder="Testimonial Quote Statements"
                rows={2}
                className="w-full border border-gray-200 rounded-lg px-3.5 py-2 text-sm outline-none bg-gray-50 resize-none"
              />
            </div>
          </div>

          {/* Relational lists editing */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="border border-gray-100 rounded-2xl p-4 bg-white space-y-3">
              <div className="flex justify-between items-center">
                <p className="text-xs font-bold text-gray-700">Story Milestones Timeline</p>
                <button
                  type="button"
                  onClick={() => handleAddMilestone(true)}
                  className="text-xs font-bold text-primary hover:underline"
                >
                  + Add Event
                </button>
              </div>
              <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                {editMilestones.map((m, idx) => (
                  <div key={idx} className="bg-gray-50 border rounded-xl p-3 relative space-y-2">
                    <button
                      type="button"
                      onClick={() => handleRemoveMilestone(idx, true)}
                      className="absolute top-2 right-2 text-[10px] text-red-500 font-bold hover:underline"
                    >
                      Remove
                    </button>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        value={m.date || ""}
                        onChange={(e) => {
                          const copy = [...editMilestones];
                          copy[idx].date = e.target.value;
                          setEditMilestones(copy);
                        }}
                        placeholder="Date/Phase"
                        className="border rounded p-1.5 text-xs outline-none bg-white"
                      />
                      <input
                        value={m.title || ""}
                        onChange={(e) => {
                          const copy = [...editMilestones];
                          copy[idx].title = e.target.value;
                          setEditMilestones(copy);
                        }}
                        placeholder="Milestone Title"
                        className="border rounded p-1.5 text-xs outline-none bg-white"
                      />
                    </div>
                    <input
                      value={m.imageUrl || ""}
                      onChange={(e) => {
                        const copy = [...editMilestones];
                        copy[idx].imageUrl = e.target.value;
                        setEditMilestones(copy);
                      }}
                      placeholder="Milestone Image URL"
                      className="w-full border rounded p-1.5 text-xs outline-none bg-white"
                    />
                    <textarea
                      value={m.description || ""}
                      onChange={(e) => {
                        const copy = [...editMilestones];
                        copy[idx].description = e.target.value;
                        setEditMilestones(copy);
                      }}
                      placeholder="Detail description..."
                      rows={2}
                      className="w-full border rounded p-1.5 text-xs outline-none bg-white resize-none"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="border border-gray-100 rounded-2xl p-4 bg-white space-y-3">
              <div className="flex justify-between items-center">
                <p className="text-xs font-bold text-gray-700">Story Impact Metrics</p>
                <button
                  type="button"
                  onClick={() => handleAddMetric(true)}
                  className="text-xs font-bold text-primary hover:underline"
                >
                  + Add Metric
                </button>
              </div>
              <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                {editMetrics.map((mt, idx) => (
                  <div key={idx} className="bg-gray-50 border rounded-xl p-3 relative space-y-2">
                    <button
                      type="button"
                      onClick={() => handleRemoveMetric(idx, true)}
                      className="absolute top-2 right-2 text-[10px] text-red-500 font-bold hover:underline"
                    >
                      Remove
                    </button>
                    <div className="grid grid-cols-3 gap-2">
                      <input
                        value={mt.icon || ""}
                        onChange={(e) => {
                          const copy = [...editMetrics];
                          copy[idx].icon = e.target.value;
                          setEditMetrics(copy);
                        }}
                        placeholder="Icon (💧)"
                        className="border rounded p-1.5 text-xs outline-none text-center bg-white"
                      />
                      <input
                        value={mt.value || ""}
                        onChange={(e) => {
                          const copy = [...editMetrics];
                          copy[idx].value = e.target.value;
                          setEditMetrics(copy);
                        }}
                        placeholder="Value (500+)"
                        className="border rounded p-1.5 text-xs outline-none col-span-2 bg-white"
                      />
                    </div>
                    <input
                      value={mt.label || ""}
                      onChange={(e) => {
                        const copy = [...editMetrics];
                        copy[idx].label = e.target.value;
                        setEditMetrics(copy);
                      }}
                      placeholder="Label (e.g. Children Enrolled)"
                      className="w-full border rounded p-1.5 text-xs outline-none bg-white"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-500">Story Body DescriptionNarrative *</label>
            <textarea
              value={editingStory.description}
              onChange={(e) => setEditingStory((p) => ({ ...p, description: e.target.value }))}
              placeholder="Description narrative"
              required
              rows={4}
              className="w-full border border-gray-200 rounded-lg px-3.5 py-2 text-sm outline-none bg-white"
            />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-primary text-white px-5 py-2.5 rounded-lg text-xs font-bold hover:brightness-95 transition"
            >
              Save Story Configuration
            </button>
            <button
              type="button"
              onClick={() => setEditingStory(null)}
              className="bg-gray-100 text-gray-600 px-5 py-2.5 rounded-lg text-xs font-bold hover:bg-gray-200 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Main Listings */}
      {tabLoading ? (
        <LoadingSpinner />
      ) : stories.length === 0 ? (
        <EmptyState
          icon="📖"
          title="No stories yet."
          subtitle="Add your first immersive success story above."
        />
      ) : (
        <div className="space-y-3">
          {stories.map((s) => (
            <div
              key={s.id}
              className="flex flex-col sm:flex-row items-center gap-4 border border-gray-100 rounded-2xl p-4 bg-white hover:shadow-sm transition"
            >
              {s.imageUrl && (
                <img
                  src={s.imageUrl}
                  alt={s.title}
                  className="w-20 h-20 rounded-xl object-cover flex-shrink-0 border border-gray-100"
                />
              )}
              <div className="flex-1 min-w-0 text-center sm:text-left">
                <h4 className="font-bold text-brand-navy-dark truncate text-base">{s.title}</h4>
                {s.subtitle && (
                  <p className="text-xs text-gray-500 font-semibold truncate mt-0.5">
                    {s.subtitle}
                  </p>
                )}
                <p className="text-sm text-gray-400 line-clamp-1 mt-1 font-medium">
                  {s.description}
                </p>
                <div className="flex flex-wrap justify-center sm:justify-start gap-1.5 mt-2">
                  {s.category && (
                    <span className="text-[10px] bg-primary/10 text-primary px-2.5 py-0.5 rounded-full font-bold">
                      {s.category}
                    </span>
                  )}
                  {s.milestones?.length > 0 && (
                    <span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-bold border border-blue-100">
                      📅 {s.milestones.length} Milestones
                    </span>
                  )}
                  {s.metrics?.length > 0 && (
                    <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-bold border border-emerald-100">
                      📈 {s.metrics.length} Impact Metrics
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0 self-center sm:self-center border-t sm:border-t-0 pt-3 sm:pt-0 w-full sm:w-auto justify-center">
                <button
                  onClick={() => triggerEditStart(s)}
                  className="text-xs text-blue-500 hover:text-blue-700 font-bold px-3 py-1.5 hover:bg-blue-50 rounded-md transition"
                >
                  Edit Configuration
                </button>
                <button
                  onClick={() => onDeleteStory(s.id)}
                  className="text-xs text-red-500 hover:text-red-700 font-bold px-3 py-1.5 hover:bg-red-50 rounded-md transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StoriesPanel;
