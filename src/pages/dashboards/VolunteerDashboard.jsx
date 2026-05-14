import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { pageVariants, pageTransition } from "../../constants/motionVariants";
import { useAuth } from "../../hooks/useAuth";

const VolunteerDashboard = () => {
    const { user } = useAuth();

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
            <div className="mb-8">
                <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-2xl">🤝</span>
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-dark">Volunteer Dashboard</h1>
                        <p className="text-gray-500">
                            Welcome, <span className="font-semibold text-primary">{user?.name}</span>
                        </p>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
                {[
                    { label: "Events Joined", value: "0", icon: "📅", color: "bg-blue-50 text-blue-700" },
                    { label: "Hours Contributed", value: "0", icon: "⏱️", color: "bg-emerald-50 text-emerald-700" },
                    { label: "Application Status", value: "Active", icon: "✅", color: "bg-amber-50 text-amber-700" },
                ].map((stat) => (
                    <div
                        key={stat.label}
                        className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-2xl">{stat.icon}</span>
                            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${stat.color}`}>
                                {stat.label}
                            </span>
                        </div>
                        <p className="text-2xl font-bold text-dark">{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="grid sm:grid-cols-2 gap-6 mb-10">
                <Link to="/events" className="group">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md hover:border-green-300 transition-all duration-200">
                        <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <span className="text-2xl">📋</span>
                        </div>
                        <h3 className="font-semibold text-gray-800 mb-1">Browse Events</h3>
                        <p className="text-sm text-gray-500">Find upcoming events to participate in</p>
                    </div>
                </Link>

                <Link to="/donation" className="group">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md hover:border-green-300 transition-all duration-200">
                        <div className="w-12 h-12 bg-amber-50 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <span className="text-2xl">💰</span>
                        </div>
                        <h3 className="font-semibold text-gray-800 mb-1">Donate</h3>
                        <p className="text-sm text-gray-500">Support the trust with a contribution</p>
                    </div>
                </Link>
            </div>

            {/* Profile */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">My Profile</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                        <p className="text-sm text-gray-500">Full Name</p>
                        <p className="font-medium text-gray-800">{user?.name}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium text-gray-800">{user?.email}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Role</p>
                        <span className="inline-block mt-1 text-xs font-medium px-2.5 py-1 rounded-full bg-green-100 text-green-800">
                            Volunteer
                        </span>
                    </div>
                </div>
            </div>

            {/* Activity Feed */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">My Activity</h2>
                <div className="bg-gray-50 rounded-lg p-8 text-center">
                    <span className="text-4xl mb-3 block">📝</span>
                    <p className="text-gray-500">Your volunteer activity and event participation will appear here.</p>
                    <Link
                        to="/events"
                        className="inline-block mt-4 text-sm font-semibold text-primary hover:underline"
                    >
                        Browse available events →
                    </Link>
                </div>
            </div>
        </motion.div>
    );
};

export default VolunteerDashboard;
