import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../hooks/useAuth";
import notificationService from "../services/notificationService";

const NotificationBell = () => {
    const { user } = useAuth();
    const [open, setOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [connectionStatus, setConnectionStatus] = useState("DISCONNECTED");
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("ALL");
    const dropdownRef = useRef(null);

    // Debounce search input
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(search);
        }, 300);
        return () => clearTimeout(handler);
    }, [search]);

    // Fetch initial notifications and count
    const fetchData = async () => {
        if (!user) return;
        try {
            const countRes = await notificationService.getUnreadCount();
            setUnreadCount(countRes?.data || countRes || 0);

            const categoryFilter = selectedCategory === "ALL" ? null : selectedCategory;
            const listRes = await notificationService.getNotifications(categoryFilter, null, debouncedSearch, 0, 20);
            const content = listRes?.data?.content || listRes?.content || listRes?.data || listRes || [];
            setNotifications(content);
        } catch (err) {
            console.error("Error fetching notifications:", err);
        }
    };

    // Close dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Refresh notifications whenever tab, category or search changes
    useEffect(() => {
        fetchData();
    }, [user, selectedCategory, debouncedSearch]);

    // Setup real-time WebSocket connection
    useEffect(() => {
        if (!user) return;

        const controller = notificationService.connectWebSocket(
            user.email,
            (newNotification) => {
                // Audio cue on new notification
                try {
                    const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2869/2869-500.wav");
                    audio.volume = 0.3;
                    audio.play().catch(() => {});
                } catch (e) {}

                // Prepend new notification to the active view list
                setNotifications(prev => [newNotification, ...prev].slice(0, 20));
                setUnreadCount(prev => prev + 1);
            },
            (err) => console.error("[WebSocket] error:", err),
            (status) => setConnectionStatus(status)
        );

        return () => {
            if (controller) controller.disconnect();
        };
    }, [user]);

    const handleMarkAsRead = async (id, isRead) => {
        if (isRead) return;
        try {
            await notificationService.markAsRead(id);
            // Update local state instantly
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (err) {
            console.error("Failed to mark as read:", err);
        }
    };

    const handleMarkAllRead = async () => {
        try {
            await notificationService.markAllAsRead();
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            setUnreadCount(0);
        } catch (err) {
            console.error("Failed to mark all as read:", err);
        }
    };

    const getCategoryIcon = (category) => {
        switch (category?.toUpperCase()) {
            case "DONATION": return "💰";
            case "APPROVAL": return "🤝";
            case "SYSTEM": return "⚙️";
            case "ADMIN": return "🛡️";
            default: return "🔔";
        }
    };

    const getCategoryBadgeStyle = (category) => {
        switch (category?.toUpperCase()) {
            case "DONATION": return "bg-emerald-50 text-emerald-700 border-emerald-100";
            case "APPROVAL": return "bg-indigo-50 text-indigo-700 border-indigo-100";
            case "SYSTEM": return "bg-amber-50 text-amber-700 border-amber-100";
            default: return "bg-slate-50 text-slate-700 border-slate-100";
        }
    };

    // Calculate dynamic time ago format
    const formatTimeAgo = (dateStr) => {
        if (!dateStr) return "";
        try {
            const date = new Date(dateStr);
            const now = new Date();
            const diffMs = now - date;
            const diffMins = Math.floor(diffMs / 60000);
            const diffHours = Math.floor(diffMins / 60);
            
            if (diffMins < 1) return "Just now";
            if (diffMins < 60) return `${diffMins}m ago`;
            if (diffHours < 24) return `${diffHours}h ago`;
            return date.toLocaleDateString([], { month: "short", day: "numeric" });
        } catch (e) {
            return "";
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Bell trigger button */}
            <button
                onClick={() => setOpen(!open)}
                className="relative p-2 rounded-full text-slate-600 hover:bg-slate-100 hover:text-primary transition-all duration-200 focus:outline-none"
                aria-label="View notifications"
            >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                </svg>

                {/* Pulse badge */}
                <AnimatePresence>
                    {unreadCount > 0 && (
                        <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            className="absolute top-1 right-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-rose-600 text-[9px] font-black text-white shadow-md shadow-rose-900/30 select-none px-1"
                        >
                            {unreadCount > 9 ? "9+" : unreadCount}
                        </motion.span>
                    )}
                </AnimatePresence>
            </button>

            {/* Notification Dropdown Panel */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: 15, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 15, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-3.5 w-80 sm:w-96 bg-white rounded-3xl shadow-2xl border border-slate-100 z-50 overflow-hidden flex flex-col max-h-[500px]"
                    >
                        {/* Header */}
                        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                            <div className="space-y-0.5">
                                <h4 className="text-sm font-black text-slate-800 flex items-center gap-1.5">
                                    Notifications
                                    <span className={`h-1.5 w-1.5 rounded-full ${connectionStatus === "CONNECTED" ? "bg-emerald-500 animate-ping" : "bg-slate-400"}`}></span>
                                </h4>
                                <p className="text-[10px] font-bold text-slate-400">
                                    {connectionStatus === "CONNECTED" ? "Real-time sync on" : "Websocket offline"}
                                </p>
                            </div>
                            {unreadCount > 0 && (
                                <button
                                    onClick={handleMarkAllRead}
                                    className="text-[10px] font-black text-primary hover:text-emerald-700 transition"
                                >
                                    Mark all read
                                </button>
                            )}
                        </div>

                        {/* Search & Category filter */}
                        <div className="p-3 border-b border-slate-50 space-y-2">
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search alerts..."
                                className="w-full bg-slate-100 border border-transparent hover:border-slate-200 focus:border-primary focus:bg-white text-xs px-3 py-1.5 rounded-xl transition duration-150 outline-none"
                            />

                            <div className="flex gap-1 overflow-x-auto pb-0.5 scrollbar-none">
                                {["ALL", "APPROVAL", "DONATION", "SYSTEM"].map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => setSelectedCategory(cat)}
                                        className={`px-2.5 py-1 text-[9px] font-extrabold uppercase rounded-lg border transition-all ${
                                            selectedCategory === cat
                                                ? "bg-primary text-white border-primary shadow-sm"
                                                : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"
                                        }`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Notifications List */}
                        <div className="overflow-y-auto flex-1 divide-y divide-slate-50 max-h-[300px] scrollbar-thin">
                            {notifications.length === 0 ? (
                                <div className="p-10 text-center text-slate-400">
                                    <span className="text-3xl block mb-2">📬</span>
                                    <p className="text-xs font-semibold">No alerts found</p>
                                    <p className="text-[10px] mt-0.5">We'll alert you when something happens.</p>
                                </div>
                            ) : (
                                notifications.map(alert => (
                                    <div
                                        key={alert.id}
                                        onClick={() => handleMarkAsRead(alert.id, alert.isRead)}
                                        className={`p-4 transition cursor-pointer flex gap-3 items-start ${
                                            alert.isRead ? "bg-white hover:bg-slate-50/50" : "bg-emerald-50/20 hover:bg-emerald-50/40"
                                        }`}
                                    >
                                        {/* Category Icon */}
                                        <div className={`w-8 h-8 rounded-full border flex items-center justify-center text-sm shadow-sm flex-shrink-0 ${getCategoryBadgeStyle(alert.category)}`}>
                                            {getCategoryIcon(alert.category)}
                                        </div>

                                        {/* Content block */}
                                        <div className="space-y-1 flex-1 min-w-0">
                                            <div className="flex justify-between items-start gap-1">
                                                <h5 className={`text-xs truncate ${alert.isRead ? "font-bold text-slate-700" : "font-black text-slate-900"}`}>
                                                    {alert.title}
                                                </h5>
                                                {!alert.isRead && (
                                                    <span className="h-1.5 w-1.5 bg-rose-600 rounded-full flex-shrink-0 mt-1 shadow-sm shadow-rose-450"></span>
                                                )}
                                            </div>
                                            <p className="text-[11px] text-slate-500 font-medium leading-normal break-words">
                                                {alert.message}
                                            </p>
                                            <span className="text-[9px] text-slate-400 font-extrabold block">
                                                {formatTimeAgo(alert.createdAt)}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default NotificationBell;
