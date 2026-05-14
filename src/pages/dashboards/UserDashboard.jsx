import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { pageVariants, pageTransition } from "../../constants/motionVariants";
import { useAuth } from "../../hooks/useAuth";

const UserDashboard = () => {
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
                <h1 className="text-3xl font-bold text-dark">My Dashboard</h1>
                <p className="text-gray-500 mt-1">
                    Welcome, <span className="font-semibold text-primary">{user?.name}</span>
                </p>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                <Link to="/donation" className="group">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md hover:border-primary/30 transition-all duration-200">
                        <div className="w-12 h-12 bg-amber-50 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <span className="text-2xl">💰</span>
                        </div>
                        <h3 className="font-semibold text-gray-800 mb-1">Make a Donation</h3>
                        <p className="text-sm text-gray-500">Contribute to our causes and community drives</p>
                    </div>
                </Link>

                <Link to="/events" className="group">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md hover:border-primary/30 transition-all duration-200">
                        <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <span className="text-2xl">📅</span>
                        </div>
                        <h3 className="font-semibold text-gray-800 mb-1">View Events</h3>
                        <p className="text-sm text-gray-500">Discover upcoming events and campaigns</p>
                    </div>
                </Link>

                <Link to="/volunteer" className="group">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md hover:border-primary/30 transition-all duration-200">
                        <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <span className="text-2xl">🤝</span>
                        </div>
                        <h3 className="font-semibold text-gray-800 mb-1">Become a Volunteer</h3>
                        <p className="text-sm text-gray-500">Apply to volunteer for our initiatives</p>
                    </div>
                </Link>
            </div>

            {/* Profile Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
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
                        <span className="inline-block mt-1 text-xs font-medium px-2.5 py-1 rounded-full bg-blue-100 text-blue-800">
                            Member
                        </span>
                    </div>
                </div>
            </div>

            {/* Donation History Placeholder */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mt-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">My Donations</h2>
                <div className="bg-gray-50 rounded-lg p-8 text-center">
                    <span className="text-4xl mb-3 block">📋</span>
                    <p className="text-gray-500">Your donation history will appear here.</p>
                    <Link
                        to="/donation"
                        className="inline-block mt-4 text-sm font-semibold text-primary hover:underline"
                    >
                        Make your first donation →
                    </Link>
                </div>
            </div>
        </motion.div>
    );
};

export default UserDashboard;
