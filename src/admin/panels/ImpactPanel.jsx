import React, { useState } from "react";

const ImpactPanel = ({
  impactStats,
  impactForm,
  setImpactForm,
  editingImpact,
  setEditingImpact,
  tabLoading,
  onCreateImpactStat,
  onUpdateCounter,
  onUpdateImpactFull,
  onDeleteImpactStat,
  LoadingSpinner,
  EmptyState
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      await onCreateImpactStat(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      await onUpdateImpactFull(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h3 className="text-lg font-bold text-brand-navy-dark mb-4">Impact Initiatives & Metrics</h3>

      {/* Add new stat form */}
      <form
        onSubmit={handleCreate}
        className="mb-6 border border-dashed border-gray-300 rounded-2xl p-5 space-y-4 bg-gray-50/30"
      >
        <p className="text-sm font-semibold text-gray-700">Add New Metric Tracker</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-500">Category Label *</label>
            <input
              value={impactForm.category}
              onChange={(e) => setImpactForm((p) => ({ ...p, category: e.target.value }))}
              placeholder="e.g. WATER"
              required
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20 bg-white"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-500">Current Value *</label>
            <input
              type="number"
              value={impactForm.currentValue}
              onChange={(e) => setImpactForm((p) => ({ ...p, currentValue: e.target.value }))}
              placeholder="Value"
              required
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20 bg-white"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-500">Unit Description</label>
            <input
              value={impactForm.unit}
              onChange={(e) => setImpactForm((p) => ({ ...p, unit: e.target.value }))}
              placeholder="e.g. Liters Distributed"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20 bg-white"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-500">Icon Emblem</label>
            <input
              value={impactForm.icon}
              onChange={(e) => setImpactForm((p) => ({ ...p, icon: e.target.value }))}
              placeholder="e.g. 💧"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20 bg-white"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-500">Display Order</label>
            <input
              type="number"
              value={impactForm.displayOrder}
              onChange={(e) => setImpactForm((p) => ({ ...p, displayOrder: e.target.value }))}
              placeholder="Order"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20 bg-white"
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className={`px-5 py-2.5 rounded-lg text-sm font-bold whitespace-nowrap transition ${isSubmitting ? "bg-gray-400 text-white cursor-not-allowed" : "bg-primary text-white hover:brightness-95 hover:shadow-md"}`}
        >
          {isSubmitting ? "Adding..." : "+ Add Tracker Metric"}
        </button>
      </form>

      {tabLoading ? (
        <LoadingSpinner />
      ) : !Array.isArray(impactStats) || impactStats.length === 0 ? (
        <EmptyState
          icon="📊"
          title="No impact trackers yet."
          subtitle="Define your primary metrics using the builder tool above."
        />
      ) : (
        <div className="space-y-4">
          {Array.isArray(impactStats) && impactStats.map((stat) =>
            editingImpact?.id === stat.id ? (
              <form
                key={stat.id}
                onSubmit={handleUpdate}
                className="border border-primary/20 bg-primary/5 rounded-2xl p-5 space-y-4 shadow-sm"
              >
                <p className="text-sm font-bold text-brand-navy-dark">Editing Metric Config</p>
                <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-500">Category Label</label>
                    <input
                      value={editingImpact.category}
                      onChange={(e) =>
                        setEditingImpact((p) => ({ ...p, category: e.target.value }))
                      }
                      placeholder="Category"
                      required
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20 bg-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-500">Current Value</label>
                    <input
                      type="number"
                      value={editingImpact.currentValue}
                      onChange={(e) =>
                        setEditingImpact((p) => ({ ...p, currentValue: e.target.value }))
                      }
                      placeholder="Value"
                      required
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20 bg-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-500">Unit</label>
                    <input
                      value={editingImpact.unit || ""}
                      onChange={(e) =>
                        setEditingImpact((p) => ({ ...p, unit: e.target.value }))
                      }
                      placeholder="Unit"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20 bg-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-500">Icon</label>
                    <input
                      value={editingImpact.icon || ""}
                      onChange={(e) =>
                        setEditingImpact((p) => ({ ...p, icon: e.target.value }))
                      }
                      placeholder="Icon"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20 bg-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-500">Display Order</label>
                    <input
                      type="number"
                      value={editingImpact.displayOrder}
                      onChange={(e) =>
                        setEditingImpact((p) => ({ ...p, displayOrder: e.target.value }))
                      }
                      placeholder="Order"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20 bg-white"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`px-4.5 py-2 rounded-lg text-xs font-bold transition ${isSubmitting ? "bg-gray-400 text-white cursor-not-allowed" : "bg-primary text-white hover:brightness-95"}`}
                  >
                    {isSubmitting ? "Saving..." : "Save Changes"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingImpact(null)}
                    className="bg-gray-100 text-gray-600 px-4.5 py-2 rounded-lg text-xs font-bold hover:bg-gray-200 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div
                key={stat.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-gray-100 rounded-2xl p-5 bg-white hover:shadow-sm transition"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-2xl border border-gray-100">
                    {stat.icon || "📊"}
                  </div>
                  <div>
                    <p className="font-bold text-brand-navy-dark">{stat.category}</p>
                    {stat.unit && <p className="text-xs text-gray-400 font-semibold">{stat.unit}</p>}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="space-y-0.5">
                    <label className="block text-[10px] font-bold text-gray-400 text-right">Value (Blur to save)</label>
                    <input
                      type="number"
                      defaultValue={stat.currentValue}
                      className="w-36 border border-gray-200 rounded-lg px-3.5 py-2 text-sm font-bold text-right text-brand-navy-dark focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition"
                      onBlur={(e) => {
                        const v = Number(e.target.value);
                        if (v !== stat.currentValue) onUpdateCounter(stat.id, v);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") e.target.blur();
                      }}
                    />
                  </div>
                  <div className="flex items-center gap-2 border-l pl-3 self-end py-1">
                    <button
                      onClick={() => setEditingImpact({ ...stat })}
                      className="text-xs text-blue-500 hover:text-blue-700 font-bold px-2 py-1 hover:bg-blue-50 rounded-md transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDeleteImpactStat(stat.id)}
                      className="text-xs text-red-500 hover:text-red-700 font-bold px-2 py-1 hover:bg-red-50 rounded-md transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default ImpactPanel;
