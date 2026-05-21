import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import CountUp from "react-countup";
import { pageVariants, pageTransition } from "../../constants/motionVariants";
import { useAuth } from "../../hooks/useAuth";
import { getMyVolunteerApplications } from "../../services/messageService";

const VolunteerDashboard = () => {
    const { user } = useAuth();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("overview");
    const [filterStatus, setFilterStatus] = useState("ALL");

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const data = await getMyVolunteerApplications();
                setApplications(data || []);
            } catch (err) {
                console.error("Error fetching my volunteer applications:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchApplications();
    }, []);

    const approvedApplications = applications.filter(app => app.status === "APPROVED" || app.status === "approved");
    const pendingApplications = applications.filter(app => app.status === "PENDING" || app.status === "pending");
    
    const approvedCount = approvedApplications.length;
    const pendingCount = pendingApplications.length;

    // Simulated volunteer hours: 8 hours per approved initiative
    const hoursServed = approvedCount * 8;
    // Impact score formula
    const impactScore = (hoursServed * 15) + (approvedCount * 50);

    const filteredApplications = applications.filter(app => {
        if (filterStatus === "ALL") return true;
        return app.status?.toUpperCase() === filterStatus;
    });

    const getAchievements = () => {
        const achievementsList = [];
        if (applications.length > 0) {
            achievementsList.push({ id: "first_apply", title: "Pioneer Roster", desc: "Submitted your first campaign bid", icon: "🤝", color: "from-sky-500/20 to-indigo-600/10 text-sky-400" });
        }
        if (approvedCount >= 1) {
            achievementsList.push({ id: "first_mission", title: "Mission Initiated", desc: "Approved to support a live event", icon: "🚀", color: "from-emerald-500/20 to-teal-600/10 text-emerald-400" });
        }
        if (hoursServed >= 20) {
            achievementsList.push({ id: "hours_pinnacle", title: "Veteran Server", desc: "Logged 20+ hours of service time", icon: "🎖️", color: "from-amber-500/20 to-yellow-600/10 text-yellow-400" });
        }
        if (approvedCount >= 3) {
            achievementsList.push({ id: "three_missions", title: "Impact Champion", desc: "Completed 3+ dynamic initiatives", icon: "🏛️", color: "from-purple-500/20 to-indigo-600/10 text-purple-400" });
        }
        
        // Fallback default achievement so the grid is never completely empty
        if (achievementsList.length === 0) {
            achievementsList.push({ id: "welcome_badge", title: "Registered Helper", desc: "Account setup complete", icon: "✨", color: "from-slate-500/20 to-slate-600/10 text-slate-400" });
        }
        return achievementsList;
    };

    const achievements = getAchievements();

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <motion.div
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={pageTransition}
            className="min-h-screen bg-slate-50/50 py-8 px-4 sm:px-6 lg:px-8"
        >
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
                            <span className="text-2xl p-2 bg-emerald-600 text-white rounded-xl shadow-lg shadow-emerald-600/20">🤝</span>
                            Volunteer Command Center
                        </h1>
                        <p className="text-slate-500 text-sm mt-1">
                            Track service logs, pending listings, achievements, and accredited certificates.
                        </p>
                    </div>
                    
                    {/* Navigation Tabs */}
                    <div className="flex bg-slate-200/60 p-1 rounded-xl self-start md:self-auto border border-slate-300/30">
                        <button
                            onClick={() => setActiveTab("overview")}
                            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                                activeTab === "overview" 
                                ? "bg-white text-emerald-700 shadow-sm" 
                                : "text-slate-600 hover:text-slate-900"
                            }`}
                        >
                            Overview
                        </button>
                        <button
                            onClick={() => setActiveTab("applications")}
                            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                                activeTab === "applications" 
                                ? "bg-white text-emerald-700 shadow-sm" 
                                : "text-slate-600 hover:text-slate-900"
                            }`}
                        >
                            Applications ({applications.length})
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32">
                        <div className="relative w-16 h-16">
                            <div className="absolute inset-0 rounded-full border-4 border-slate-200"></div>
                            <div className="absolute inset-0 rounded-full border-4 border-t-emerald-600 animate-spin"></div>
                        </div>
                        <p className="text-slate-500 mt-4 text-sm font-semibold animate-pulse">Loading service roster...</p>
                    </div>
                ) : (
                    <AnimatePresence mode="wait">
                        {activeTab === "overview" ? (
                            <motion.div
                                key="overview"
                                variants={containerVariants}
                                initial="hidden"
                                animate="show"
                                className="space-y-8"
                            >
                                {/* Hero Card and Impact Tier */}
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                    {/* Greeting card */}
                                    <motion.div 
                                        variants={itemVariants}
                                        className="lg:col-span-2 rounded-3xl glass-panel-navy p-8 text-white relative overflow-hidden shadow-2xl flex flex-col justify-between"
                                    >
                                        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
                                        <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-teal-500/5 rounded-full blur-3xl"></div>
                                        
                                        <div className="relative z-10">
                                            <div className="flex items-center gap-3 mb-4">
                                                <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 tracking-widest uppercase">
                                                    Accredited Agent
                                                </span>
                                            </div>
                                            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                                                Thank You for Serving, <br />
                                                <span className="bg-gradient-to-r from-emerald-300 via-teal-200 to-green-300 bg-clip-text text-transparent font-black font-heading">{user?.name}</span> 🌟
                                            </h2>
                                            <p className="text-emerald-100/80 text-sm sm:text-base mt-3 max-w-lg leading-relaxed">
                                                Your willingness to support our outreach programs fuels direct local relief. Your physical effort translates directly to community strength. We value every hour you invest.
                                            </p>
                                        </div>

                                        <div className="relative z-10 mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 rounded-xl flex items-center justify-center text-xl">
                                                    🎖️
                                                </div>
                                                <div>
                                                    <h4 className="text-xs font-bold text-slate-300">Roster Level</h4>
                                                    <p className="text-[11px] text-emerald-300/70">Certified Volunteer</p>
                                                </div>
                                            </div>

                                            <div className="flex gap-2">
                                                <Link to="/events" className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-emerald-600/20">
                                                    Browse Active Drives 📋
                                                </Link>
                                            </div>
                                        </div>
                                    </motion.div>

                                    {/* Stat Circle / Progress Card */}
                                    <motion.div 
                                        variants={itemVariants}
                                        className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 flex flex-col justify-between relative overflow-hidden"
                                    >
                                        <div className="absolute top-2 right-2 text-4xl opacity-10 select-none">🛡️</div>
                                        <div>
                                            <span className="text-xs font-bold text-slate-400 tracking-wider uppercase">Active Service Summary</span>
                                            <h3 className="text-xl font-extrabold text-slate-800 mt-1 flex items-center gap-2">
                                                <span>⏱️</span> Service Logged
                                            </h3>
                                            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                                                Accumulated volunteer hours calculated dynamically based on campaign registries.
                                            </p>
                                        </div>

                                        <div className="my-6 flex items-center justify-center gap-6">
                                            <div className="relative w-28 h-28 flex items-center justify-center">
                                                <svg className="absolute w-full h-full transform -rotate-90">
                                                    <circle cx="56" cy="56" r="48" stroke="#F1F5F9" strokeWidth="8" fill="transparent" />
                                                    <circle 
                                                        cx="56" 
                                                        cy="56" 
                                                        r="48" 
                                                        stroke="#059669" 
                                                        strokeWidth="8" 
                                                        fill="transparent" 
                                                        strokeDasharray="301.6" 
                                                        strokeDashoffset={301.6 - (301.6 * Math.min(hoursServed, 50)) / 50} 
                                                        strokeLinecap="round"
                                                    />
                                                </svg>
                                                <div className="text-center z-10">
                                                    <p className="text-3xl font-black text-slate-800 font-heading leading-none">
                                                        <CountUp end={hoursServed} duration={1.5} />
                                                    </p>
                                                    <p className="text-[10px] font-bold text-slate-450 uppercase mt-0.5">Hours</p>
                                                </div>
                                            </div>
                                            
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                                                    <span className="w-2.5 h-2.5 bg-emerald-600 rounded-full"></span>
                                                    <span>{hoursServed} hrs served</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                                                    <span className="w-2.5 h-2.5 bg-sky-500 rounded-full"></span>
                                                    <span>Target: 50 hrs</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-450 font-bold">
                                            <span>Tier: Silver Roster Member</span>
                                        </div>
                                    </motion.div>
                                </div>

                                {/* Statistics Grid */}
                                <motion.div 
                                    variants={itemVariants}
                                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                                >
                                    {[
                                        { label: "Approved Drives", value: approvedCount, icon: "📅", color: "border-l-4 border-l-emerald-600", sub: "Accepted placements" },
                                        { label: "Pending Placements", value: pendingCount, icon: "⏱️", color: "border-l-4 border-l-amber-500", sub: "Awaiting review status" },
                                        { label: "Cumulative Hours", value: hoursServed, icon: "⏳", color: "border-l-4 border-l-sky-500", sub: "Hours invested locally" },
                                        { label: "Community Impact Score", value: impactScore, icon: "🔥", color: "border-l-4 border-l-purple-600", sub: "Calculated activity rating" },
                                    ].map((stat, idx) => (
                                        <div
                                            key={stat.label}
                                            className={`bg-white ${stat.color} rounded-2xl shadow-sm border border-slate-100 p-6 relative group overflow-hidden transition-all duration-300 hover:shadow-lg`}
                                        >
                                            <span className="absolute top-4 right-4 text-2xl opacity-35 group-hover:scale-110 transition-transform duration-300">{stat.icon}</span>
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
                                            <p className="text-2xl font-black text-slate-800 mt-2 font-heading">
                                                <CountUp end={stat.value} duration={1.2} />
                                            </p>
                                            <p className="text-[11px] text-slate-400 font-medium mt-1">{stat.sub}</p>
                                        </div>
                                    ))}
                                </motion.div>

                                {/* Activity Timeline & Achievements */}
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                    {/* Action Timeline */}
                                    <motion.div 
                                        variants={itemVariants}
                                        className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-slate-100 p-6"
                                    >
                                        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                            <span>📅</span> Action Timeline & Service Log
                                        </h3>
                                        <p className="text-slate-450 text-xs mt-0.5">Summary of approved volunteer placements completed chronologically.</p>

                                        {approvedApplications.length === 0 ? (
                                            <div className="bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 p-12 text-center mt-6">
                                                <span className="text-4xl mb-3 block">🗓️</span>
                                                <h4 className="font-bold text-slate-600 text-sm">Timeline Awaiting Approvals</h4>
                                                <p className="text-slate-400 text-xs mt-1 max-w-sm mx-auto">Once your submitted volunteer drives are approved, your timeline logs will appear here.</p>
                                            </div>
                                        ) : (
                                            <div className="relative border-l border-slate-150 pl-5 space-y-6 mt-8 ml-2">
                                                {approvedApplications.map((app, idx) => (
                                                    <div key={app.id || idx} className="relative">
                                                        {/* Icon Marker */}
                                                        <span className="absolute -left-[26px] top-1 w-3 h-3 rounded-full bg-emerald-600 ring-4 ring-emerald-50"></span>
                                                        <div>
                                                            <span className="text-[10px] font-extrabold text-emerald-600 uppercase bg-emerald-50 px-2 py-0.5 rounded">
                                                                Approved Placement
                                                            </span>
                                                            <h4 className="text-xs font-black text-slate-800 mt-1">{app.eventTitle || `Event Drive #${app.eventId}`}</h4>
                                                            <p className="text-[11px] text-slate-500 font-medium mt-1 leading-relaxed">
                                                                {app.message || "Enrolled in community assistance and team leadership activities."}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </motion.div>

                                    {/* Achievements side panel */}
                                    <motion.div 
                                        variants={itemVariants}
                                        className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 flex flex-col justify-between"
                                    >
                                        <div>
                                            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                                <span>🎖️</span> Service Achievements
                                            </h3>
                                            <p className="text-slate-400 text-xs mt-0.5">Honors awarded based on cumulative campaign registries.</p>
                                        </div>

                                        <div className="space-y-4 my-6 overflow-y-auto max-h-60 pr-1 custom-scrollbar">
                                            {achievements.map((ach) => (
                                                <div 
                                                    key={ach.id}
                                                    className="flex items-center gap-3.5 p-3 rounded-2xl bg-slate-50 hover:bg-slate-100/80 transition-colors border border-slate-100"
                                                >
                                                    <span className={`text-2xl w-11 h-11 flex items-center justify-center rounded-xl bg-gradient-to-br ${ach.color} shadow-sm border border-white/40`}>
                                                        {ach.icon}
                                                    </span>
                                                    <div>
                                                        <h4 className="text-xs font-black text-slate-800">{ach.title}</h4>
                                                        <p className="text-[10px] text-slate-400 font-semibold mt-0.5">{ach.desc}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="pt-4 border-t border-slate-100 text-center">
                                            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Attend more events to earn honors</span>
                                        </div>
                                    </motion.div>
                                </div>

                                {/* Certificates portal */}
                                <motion.div 
                                    variants={itemVariants}
                                    className="bg-gradient-to-br from-emerald-900 to-emerald-950 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl"
                                >
                                    <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
                                    <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                                        <div className="md:col-span-2 space-y-3">
                                            <span className="text-xs font-black text-emerald-300 uppercase tracking-widest bg-emerald-800/60 px-3 py-1 rounded-full border border-emerald-700">
                                                Roster Credentials
                                            </span>
                                            <h3 className="text-2xl sm:text-3xl font-black font-heading leading-tight">Official Volunteer Service Certificate</h3>
                                            <p className="text-emerald-100/70 text-xs sm:text-sm max-w-xl leading-relaxed">
                                                Download your certified digital document validating cumulative service hours, verified by the trust review board for academic, organizational, or corporate references.
                                            </p>
                                        </div>

                                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center backdrop-blur-md">
                                            <span className="text-4xl mb-2 block">📜</span>
                                            <h4 className="text-xs font-extrabold">Silver Tier Certificate</h4>
                                            <p className="text-[10px] text-emerald-300/80 mt-0.5">Accredited at {hoursServed} hours</p>
                                            
                                            {approvedCount > 0 ? (
                                                <button 
                                                    onClick={() => alert(`Generating accredited service credentials package. Hours: ${hoursServed}...`)}
                                                    className="mt-4 w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold rounded-xl transition-all shadow-lg shadow-emerald-900/30"
                                                >
                                                    Download PDF Statement
                                                </button>
                                            ) : (
                                                <button 
                                                    disabled 
                                                    className="mt-4 w-full py-2.5 bg-white/5 text-white/40 text-xs font-bold rounded-xl border border-white/5 cursor-not-allowed"
                                                >
                                                    Awaiting Approved Placement
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            </motion.div>
                        ) : (
                            /* Detailed Roster Applications Grid */
                            <motion.div
                                key="applications"
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 15 }}
                                className="space-y-6"
                            >
                                {/* Filter bar */}
                                <div className="bg-white rounded-2xl p-4 border border-slate-100 flex flex-wrap gap-4 items-center justify-between shadow-sm">
                                    <h3 className="text-sm font-bold text-slate-800">Review Application List</h3>
                                    
                                    <div className="flex bg-slate-100 p-1 rounded-xl">
                                        {["ALL", "APPROVED", "PENDING", "REJECTED"].map((status) => (
                                            <button
                                                key={status}
                                                onClick={() => setFilterStatus(status)}
                                                className={`px-3 py-1 text-[10px] font-extrabold rounded-lg uppercase tracking-wider transition-all ${
                                                    filterStatus === status 
                                                    ? "bg-white text-emerald-700 shadow-sm" 
                                                    : "text-slate-500 hover:text-slate-700"
                                                }`}
                                            >
                                                {status}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Table layout */}
                                <div className="bg-white rounded-3xl border border-slate-150 overflow-hidden shadow-xl">
                                    {filteredApplications.length === 0 ? (
                                        <div className="p-16 text-center">
                                            <span className="text-5xl block">🤝</span>
                                            <h3 className="text-base font-bold text-slate-750 mt-4">No roster requests match status</h3>
                                            <p className="text-slate-400 text-xs mt-1 max-w-sm mx-auto">Submit volunteer forms on campaign events to view dynamic status details.</p>
                                            <Link 
                                                to="/events" 
                                                className="mt-6 inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-all"
                                            >
                                                Find Open Drives
                                            </Link>
                                        </div>
                                    ) : (
                                        <div className="overflow-x-auto">
                                            <table className="w-full border-collapse align-middle">
                                                <thead>
                                                    <tr className="bg-slate-50 border-b border-slate-150 text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">
                                                        <th className="px-6 py-4 text-left">Initiative Roster Name</th>
                                                        <th className="px-6 py-4 text-left">Placement Notes / Cover message</th>
                                                        <th className="px-6 py-4 text-center">Status</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-100">
                                                    {filteredApplications.map((app, idx) => (
                                                        <tr key={app.id || idx} className="hover:bg-slate-50/50 transition-colors">
                                                            <td className="px-6 py-4 whitespace-nowrap text-xs font-extrabold text-slate-800">
                                                                {app.eventTitle || `Initiative ID: ${app.eventId}`}
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <p className="text-xs text-slate-500 max-w-md font-medium leading-relaxed">
                                                                    {app.message || <span className="italic text-slate-400">No message attached</span>}
                                                                </p>
                                                            </td>
                                                            <td className="px-6 py-4 text-center whitespace-nowrap">
                                                                <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-extrabold border uppercase ${
                                                                    app.status === "APPROVED" || app.status === "approved" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                                                                    app.status === "REJECTED" || app.status === "rejected" ? "bg-rose-50 text-rose-700 border-rose-200" :
                                                                    "bg-amber-50 text-amber-700 border-amber-200"
                                                                }`}>
                                                                    {app.status || "PENDING"}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                )}
            </div>
        </motion.div>
    );
};

export default VolunteerDashboard;
