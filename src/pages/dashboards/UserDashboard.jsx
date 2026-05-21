import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { pageVariants, pageTransition } from "../../constants/motionVariants";
import { useAuth } from "../../hooks/useAuth";
import databaseService from "../../services/databaseService";

const UserDashboard = () => {
    const { user } = useAuth();
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDonations = async () => {
            try {
                const data = await databaseService.getMyDonations();
                setDonations(data || []);
            } catch (err) {
                console.error("Error fetching my donations:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchDonations();
    }, []);

    // Format currency to Rupee
    const formatRupee = (value) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0
        }).format(value);
    };

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
                className="mb-10 p-8 rounded-3xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/10 shadow-sm relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -mr-16 -mt-16 animate-pulse"></div>
                <div className="relative z-10">
                    <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">My Dashboard</h1>
                    <p className="text-gray-600 mt-2 text-lg">
                        Welcome back, <span className="font-semibold text-primary">{user?.name}</span> 👋
                    </p>
                </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                transition={{ duration: 0.5, delay: 0.2 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10"
            >
                <Link to="/donation" className="group">
                    <motion.div whileHover={{ y: -8 }} transition={{ duration: 0.3 }} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-xl hover:shadow-amber-500/10 hover:border-amber-200 transition-all duration-300">
                        <div className="w-14 h-14 bg-amber-50 text-amber-500 rounded-xl flex items-center justify-center mb-5 group-hover:bg-amber-500 group-hover:text-white transition-colors duration-300">
                            <span className="text-2xl">💰</span>
                        </div>
                        <h3 className="text-lg font-bold text-gray-800 mb-2">Make a Donation</h3>
                        <p className="text-sm text-gray-500 leading-relaxed">Contribute to our causes and community drives to make an impact.</p>
                    </motion.div>
                </Link>

                <Link to="/events" className="group">
                    <motion.div whileHover={{ y: -8 }} transition={{ duration: 0.3 }} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-xl hover:shadow-blue-500/10 hover:border-blue-200 transition-all duration-300">
                        <div className="w-14 h-14 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center mb-5 group-hover:bg-blue-500 group-hover:text-white transition-colors duration-300">
                            <span className="text-2xl">📅</span>
                        </div>
                        <h3 className="text-lg font-bold text-gray-800 mb-2">View Events</h3>
                        <p className="text-sm text-gray-500 leading-relaxed">Discover upcoming and ongoing events to support the trust.</p>
                    </motion.div>
                </Link>

                <Link to="/volunteer" className="group">
                    <motion.div whileHover={{ y: -8 }} transition={{ duration: 0.3 }} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-xl hover:shadow-green-500/10 hover:border-green-200 transition-all duration-300">
                        <div className="w-14 h-14 bg-green-50 text-green-500 rounded-xl flex items-center justify-center mb-5 group-hover:bg-green-500 group-hover:text-white transition-colors duration-300">
                            <span className="text-2xl">🤝</span>
                        </div>
                        <h3 className="text-lg font-bold text-gray-800 mb-2">Become a Volunteer</h3>
                        <p className="text-sm text-gray-500 leading-relaxed">Apply to volunteer for our initiatives and help the community.</p>
                    </motion.div>
                </Link>
            </motion.div>

            {/* Profile Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <span>👤</span> My Profile
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
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Membership Level</p>
                        <div>
                            <span className="inline-flex mt-1 text-xs font-bold px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 uppercase tracking-wide">
                                Member
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Donation History Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mt-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <span>📋</span> My Donations History
                </h2>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
                        <p className="text-gray-500 mt-3 text-sm font-medium">Loading history...</p>
                    </div>
                ) : donations.length === 0 ? (
                    <div className="bg-gray-50/50 rounded-xl border border-dashed border-gray-200 p-10 text-center">
                        <span className="text-5xl mb-3 block">💝</span>
                        <h3 className="font-bold text-gray-700 text-lg">No Donations Yet</h3>
                        <p className="text-gray-400 mt-1 text-sm max-w-md mx-auto">Your generous contributions enable our humanitarian work. Make your first contribution today and become part of our family.</p>
                        <Link
                            to="/donation"
                            className="inline-flex items-center gap-2 mt-5 text-sm font-bold text-white bg-primary hover:bg-primary/95 px-5 py-2.5 rounded-xl shadow-md shadow-primary/20 transition-all"
                        >
                            Make a Donation <span>→</span>
                        </Link>
                    </div>
                ) : (
                    <div className="overflow-x-auto rounded-xl border border-gray-100">
                        <table className="min-w-full divide-y divide-gray-100">
                            <thead className="bg-gray-50/60">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Receipt No</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase tracking-wider">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100">
                                {donations.map((donation, index) => (
                                    <motion.tr 
                                        key={donation.id || index}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3, delay: index * 0.05 }}
                                        className="hover:bg-gray-50/30 transition-colors"
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-sm font-mono font-bold text-gray-600">
                                                {donation.receiptNumber || "Pending Processing"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-sm text-gray-500 font-medium">
                                                {donation.createdAt 
                                                    ? new Date(donation.createdAt).toLocaleDateString("en-IN", {
                                                        day: "numeric",
                                                        month: "short",
                                                        year: "numeric"
                                                      })
                                                    : "N/A"
                                                }
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold border ${
                                                donation.status === "SUCCESS" ? "bg-green-50 text-green-700 border-green-200" :
                                                donation.status === "FAILED" ? "bg-red-50 text-red-700 border-red-200" :
                                                "bg-amber-50 text-amber-700 border-amber-200"
                                            }`}>
                                                {donation.status || "PENDING"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-extrabold text-gray-800">
                                            {formatRupee(donation.amount)}
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

export default UserDashboard;
