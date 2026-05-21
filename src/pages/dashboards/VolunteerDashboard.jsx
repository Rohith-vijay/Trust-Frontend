import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { pageVariants, pageTransition } from "../../constants/motionVariants";
import { useAuth } from "../../hooks/useAuth";
import { getMyVolunteerApplications } from "../../services/messageService";

const VolunteerDashboard = () => {
    const { user } = useAuth();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

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

    const approvedCount = applications.filter(app => app.status === "APPROVED" || app.status === "approved").length;
    const pendingCount = applications.filter(app => app.status === "PENDING" || app.status === "pending").length;

    return (
        <motion.div
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={pageTransition}
            className="py-8"
        >
            {/* Header */}
            <motion.div 
                initial={{ opacity: 0, y: -20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.6 }}
                className="mb-10 p-8 rounded-3xl bg-gradient-to-br from-green-500/10 via-green-500/5 to-transparent border border-green-500/10 shadow-sm relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/10 rounded-full blur-3xl -mr-16 -mt-16 animate-pulse"></div>
                <div className="relative z-10 flex items-center gap-4">
                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center text-3xl shadow-sm">
                        🤝
                    </div>
                    <div>
                        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Volunteer Dashboard</h1>
                        <p className="text-gray-600 mt-2 text-lg">
                            Welcome, <span className="font-semibold text-green-600">{user?.name}</span>! Thank you for making a difference.
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
                {[
                    { label: "Approved Events", value: approvedCount, icon: "📅", color: "bg-blue-50 text-blue-700" },
                    { label: "Pending Applications", value: pendingCount, icon: "⏱️", color: "bg-amber-50 text-amber-700" },
                    { label: "Volunteer Status", value: "Active", icon: "✅", color: "bg-emerald-50 text-emerald-700" },
                ].map((stat, idx) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: idx * 0.1 }}
                        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-xl hover:border-green-200 transition-all duration-300"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-2xl">{stat.icon}</span>
                            <span className={`text-xs font-bold px-3 py-1 rounded-full ${stat.color} uppercase tracking-wider`}>
                                {stat.label}
                            </span>
                        </div>
                        <p className="text-3xl font-extrabold text-gray-800">{stat.value}</p>
                    </motion.div>
                ))}
            </div>

            {/* Quick Actions */}
            <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                transition={{ duration: 0.5, delay: 0.2 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10"
            >
                <Link to="/events" className="group">
                    <motion.div whileHover={{ y: -8 }} transition={{ duration: 0.3 }} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-xl hover:shadow-blue-500/10 hover:border-blue-200 transition-all duration-300 h-full">
                        <div className="w-14 h-14 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center mb-5 group-hover:bg-blue-500 group-hover:text-white transition-colors duration-300">
                            <span className="text-2xl">📋</span>
                        </div>
                        <h3 className="text-lg font-bold text-gray-800 mb-2">Browse Events</h3>
                        <p className="text-sm text-gray-500 leading-relaxed">Find upcoming and ongoing events to participate in.</p>
                    </motion.div>
                </Link>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 opacity-75">
                    <div className="w-14 h-14 bg-gray-50 text-gray-400 rounded-xl flex items-center justify-center mb-5">
                        <span className="text-2xl">📈</span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-850 mb-2">My Impact Metrics</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">Coming soon. Track your total service hours and campaign contributions.</p>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 opacity-75">
                    <div className="w-14 h-14 bg-gray-50 text-gray-400 rounded-xl flex items-center justify-center mb-5">
                        <span className="text-2xl">🎓</span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-850 mb-2">Training & Guidelines</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">Coming soon. Access code of conduct, manuals, and resources.</p>
                </div>
            </motion.div>

            {/* Profile */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <span>👤</span> Profile Information
                </h2>
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
                    <div>
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Full Name</p>
                        <p className="font-semibold text-gray-800 mt-1">{user?.name}</p>
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Email Address</p>
                        <p className="font-semibold text-gray-800 mt-1">{user?.email}</p>
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Registered Role</p>
                        <div>
                            <span className="inline-flex mt-1 text-xs font-bold px-3 py-1 rounded-full bg-green-50 text-green-700 border border-green-200 uppercase tracking-wide">
                                Volunteer
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Activity Feed */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <span>📝</span> Active Event Applications
                </h2>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-500"></div>
                        <p className="text-gray-500 mt-3 text-sm font-medium">Loading applications...</p>
                    </div>
                ) : applications.length === 0 ? (
                    <div className="bg-gray-50/50 rounded-xl border border-dashed border-gray-200 p-10 text-center">
                        <span className="text-5xl mb-3 block">📝</span>
                        <h3 className="font-bold text-gray-700 text-lg">No Applications Found</h3>
                        <p className="text-gray-400 mt-1 text-sm max-w-md mx-auto">You haven't applied to volunteer for any events yet. Check out our open campaigns and join today!</p>
                        <Link
                            to="/events"
                            className="inline-flex items-center gap-2 mt-5 text-sm font-bold text-white bg-green-600 hover:bg-green-700 px-5 py-2.5 rounded-xl shadow-md shadow-green-500/20 transition-all"
                        >
                            Browse available events <span>→</span>
                        </Link>
                    </div>
                ) : (
                    <div className="overflow-x-auto rounded-xl border border-gray-100">
                        <table className="min-w-full divide-y divide-gray-100">
                            <thead className="bg-gray-50/60">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Campaign Event</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Submitted Note</th>
                                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100">
                                {applications.map((app, index) => (
                                    <motion.tr 
                                        key={app.id || index}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3, delay: index * 0.05 }}
                                        className="hover:bg-gray-50/30 transition-colors"
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-sm font-bold text-gray-800">
                                                {app.eventTitle || `Event ID: ${app.eventId}`}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm text-gray-500 font-medium line-clamp-1 max-w-sm">
                                                {app.message || <span className="italic text-gray-400">No message attached</span>}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold border uppercase ${
                                                app.status === "APPROVED" || app.status === "approved" ? "bg-green-50 text-green-700 border-green-200" :
                                                app.status === "REJECTED" || app.status === "rejected" ? "bg-red-50 text-red-700 border-red-200" :
                                                "bg-amber-50 text-amber-700 border-amber-200"
                                            }`}>
                                                {app.status || "PENDING"}
                                            </span>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default VolunteerDashboard;
