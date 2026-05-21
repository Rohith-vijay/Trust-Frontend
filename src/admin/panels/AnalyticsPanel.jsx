import React from "react";
import { motion } from "framer-motion";

const AnalyticsPanel = ({ dashboardData, activities, tabLoading, onRefreshActivities, formatDate }) => {
  const d = dashboardData;

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-8"
    >
      {!d ? (
        <div className="text-center py-12 text-gray-400 font-medium">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          Loading dashboard summary…
        </div>
      ) : (
        <>
          {/* Main Stat Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                label: "Total Collected",
                value: `₹${Number(d.totalAmountCollected || 0).toLocaleString("en-IN")}`,
                color: "from-emerald-500/10 via-teal-500/5 to-transparent text-emerald-800 border-emerald-500/10 hover:border-emerald-500/30",
                icon: "💰"
              },
              {
                label: "Successful Donations",
                value: d.successfulDonations || 0,
                color: "from-blue-500/10 via-cyan-500/5 to-transparent text-blue-800 border-blue-500/10 hover:border-blue-500/30",
                icon: "✓"
              },
              {
                label: "Pending Donations",
                value: d.pendingDonations || 0,
                color: "from-amber-500/10 via-yellow-500/5 to-transparent text-amber-850 border-amber-500/10 hover:border-amber-500/30",
                icon: "⏳"
              },
              {
                label: "Total Events",
                value: d.totalEvents || 0,
                color: "from-indigo-500/10 via-violet-500/5 to-transparent text-indigo-800 border-indigo-500/10 hover:border-indigo-500/30",
                icon: "📅"
              },
              {
                label: "Upcoming Events",
                value: d.upcomingEvents || 0,
                color: "from-purple-500/10 via-fuchsia-500/5 to-transparent text-purple-800 border-purple-500/10 hover:border-purple-500/30",
                icon: "🚀"
              },
              {
                label: "Completed Events",
                value: d.completedEvents || 0,
                color: "from-gray-500/10 via-slate-500/5 to-transparent text-gray-800 border-gray-500/10 hover:border-gray-500/30",
                icon: "✓"
              },
              {
                label: "Total Volunteer Apps",
                value: d.totalApplications || 0,
                color: "from-rose-500/10 via-pink-500/5 to-transparent text-rose-800 border-rose-500/10 hover:border-rose-500/30",
                icon: "🤝"
              },
              {
                label: "Approved Volunteers",
                value: d.approvedVolunteers || 0,
                color: "from-teal-500/10 via-green-500/5 to-transparent text-teal-800 border-teal-500/10 hover:border-teal-500/30",
                icon: "✓"
              },
              {
                label: "Pending Applications",
                value: d.pendingApplications || 0,
                color: "from-orange-500/10 via-amber-500/5 to-transparent text-orange-850 border-orange-500/10 hover:border-orange-500/30",
                icon: "⏳"
              },
            ].map((s) => (
              <motion.div
                variants={cardVariants}
                whileHover={{ y: -4, shadow: "0 10px 25px -5px rgba(0,0,0,0.05)" }}
                key={s.label}
                className={`bg-gradient-to-br ${s.color} border rounded-2xl p-6 shadow-sm transition-all duration-300 relative overflow-hidden group`}
              >
                <span className="absolute top-4 right-4 text-3xl opacity-20 group-hover:scale-110 transition-transform duration-300">{s.icon}</span>
                <p className="text-xs font-bold uppercase tracking-wider opacity-70">{s.label}</p>
                <p className="text-3xl font-black mt-2 tracking-tight text-brand-navy-dark">{s.value}</p>
              </motion.div>
            ))}
          </div>

          {/* Dynamic Timeline for Audit Logs */}
          <motion.div
            variants={cardVariants}
            className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 mt-8"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <span className="text-xl">⏱️</span>
                <h4 className="text-lg font-bold text-brand-navy-dark">Recent Admin Activities</h4>
              </div>
              <button 
                onClick={onRefreshActivities} 
                className="text-xs font-bold text-primary hover:text-amber-700 bg-primary/5 hover:bg-primary/10 px-4.5 py-2 rounded-full transition duration-300"
              >
                Refresh Feed
              </button>
            </div>

            {tabLoading ? (
              <div className="text-center py-12 text-gray-400">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
                Loading activity timeline…
              </div>
            ) : !activities || activities.length === 0 ? (
              <div className="text-center py-12 text-gray-400 bg-gray-50/50 rounded-2xl border border-dashed">
                No recent admin activity found.
              </div>
            ) : (
              <div className="relative pl-6 border-l-2 border-gray-100 space-y-6">
                {activities.map((act) => {
                  let icon = "✏️";
                  if (act.action.toLowerCase().includes("create") || act.action.toLowerCase().includes("add") || act.action.toLowerCase().includes("save")) icon = "➕";
                  if (act.action.toLowerCase().includes("delete") || act.action.toLowerCase().includes("remove")) icon = "❌";
                  if (act.action.toLowerCase().includes("login") || act.action.toLowerCase().includes("auth")) icon = "🔑";

                  return (
                    <div key={act.id} className="relative group">
                      {/* Timeline Dot */}
                      <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-white border-2 border-primary flex items-center justify-center shadow-sm group-hover:scale-125 transition-transform duration-200">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                      </div>

                      <div className="bg-gray-50/30 hover:bg-gray-50/80 border border-gray-50 rounded-2xl p-4 transition duration-200">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="text-sm">{icon}</span>
                            <span className="font-semibold text-brand-navy-dark text-sm">{act.action}</span>
                          </div>
                          <span className="text-xs text-gray-400 font-medium">
                            {formatDate(act.timestamp)}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                          Performed by <span className="font-semibold text-gray-700">{act.username}</span>
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        </>
      )}
    </motion.div>
  );
};

export default AnalyticsPanel;
