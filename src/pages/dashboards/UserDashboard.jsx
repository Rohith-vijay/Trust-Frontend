import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import CountUp from "react-countup";
import { pageVariants, pageTransition } from "../../constants/motionVariants";
import { useAuth } from "../../hooks/useAuth";
import databaseService from "../../services/databaseService";

const UserDashboard = () => {
    const { user } = useAuth();
    const [donations, setDonations] = useState([]);
    const [recommendedStories, setRecommendedStories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState("ALL");
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState("overview");

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [donationsData, storiesData] = await Promise.all([
                    databaseService.getMyDonations(),
                    databaseService.getSuccessStories()
                ]);
                setDonations(donationsData || []);
                // Take 2 published success stories as recommended reading
                const publishedStories = (storiesData || []).filter(s => s.published !== false);
                setRecommendedStories(publishedStories.slice(0, 2));
            } catch (err) {
                console.error("Error fetching dashboard data:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    // Filter successful donations
    const successfulDonations = donations.filter(d => d.status === "SUCCESS");
    
    // Sum of successful donations
    const totalDonated = successfulDonations.reduce((sum, d) => sum + (d.amount || 0), 0);
    
    // Number of initiatives supported (unique event/campaign associations)
    const uniqueInitiatives = new Set(successfulDonations.map(d => d.eventTitle || d.eventId || "General Fund")).size;

    // Donor Tier Calculator
    const getDonorTier = (amount) => {
        if (amount >= 100000) return { name: "Patron of Hope", next: "Max Tier", progress: 100, border: "border-yellow-400 text-yellow-500", bg: "from-yellow-600/20 via-amber-500/10 to-transparent", badge: "👑" };
        if (amount >= 25000) return { name: "Community Champion", next: "Patron of Hope (₹1,00,000)", progress: Math.min((amount / 100000) * 100, 100), border: "border-amber-400 text-amber-500", bg: "from-amber-600/20 via-yellow-500/10 to-transparent", badge: "⭐️" };
        if (amount >= 5000) return { name: "Sustaining Supporter", next: "Community Champion (₹25,000)", progress: Math.min((amount / 25000) * 100, 100), border: "border-blue-400 text-blue-500", bg: "from-blue-600/20 via-indigo-500/10 to-transparent", badge: "🛡️" };
        return { name: "Valued Donor", next: "Sustaining Supporter (₹5,000)", progress: Math.min((amount / 5000) * 100, 100), border: "border-slate-400 text-slate-500", bg: "from-slate-600/20 via-slate-500/10 to-transparent", badge: "❤️" };
    };

    const tier = getDonorTier(totalDonated);

    // Format currency to Rupee
    const formatRupee = (value) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0
        }).format(value);
    };

    // Filter and search donations
    const filteredDonations = donations.filter(d => {
        const matchesStatus = filterStatus === "ALL" || d.status === filterStatus;
        const matchesSearch = !searchQuery || 
            (d.receiptNumber && d.receiptNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (d.eventTitle && d.eventTitle.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesStatus && matchesSearch;
    });

    // Mock dynamic giving trend data derived from real donations (grouped by month of last 6 months)
    const getMonthlyTrendData = () => {
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const monthlyData = {};
        
        // Initialize last 6 months with 0
        for (let i = 5; i >= 0; i--) {
            const d = new Date();
            d.setMonth(d.getMonth() - i);
            const mName = months[d.getMonth()];
            monthlyData[mName] = 0;
        }

        successfulDonations.forEach(don => {
            if (don.createdAt) {
                const date = new Date(don.createdAt);
                const mName = months[date.getMonth()];
                if (monthlyData[mName] !== undefined) {
                    monthlyData[mName] += don.amount;
                }
            }
        });

        return Object.entries(monthlyData).map(([name, val]) => ({ name, value: val }));
    };

    const trendData = getMonthlyTrendData();
    const maxTrendVal = Math.max(...trendData.map(d => d.value), 5000);

    // Achievements system based on user activity
    const getAchievements = () => {
        const achievementsList = [];
        if (donations.length > 0) {
            achievementsList.push({ id: "first_gift", title: "First Spark", desc: "Initiated your journey of kindness", icon: "🌱", color: "from-green-500/20 to-emerald-600/10 text-emerald-400" });
        }
        if (totalDonated >= 10000) {
            achievementsList.push({ id: "big_heart", title: "Golden Heart", desc: "Donated over ₹10,000 in support", icon: "💛", color: "from-amber-500/20 to-yellow-600/10 text-yellow-400" });
        }
        if (uniqueInitiatives >= 3) {
            achievementsList.push({ id: "multi_pillar", title: "Cause Catalyst", desc: "Supported 3+ distinct initiatives", icon: "🌐", color: "from-blue-500/20 to-indigo-600/10 text-blue-400" });
        }
        if (successfulDonations.length >= 5) {
            achievementsList.push({ id: "sustained_pillar", title: "Pillar of Trust", desc: "Contributed 5 times or more", icon: "🏛️", color: "from-purple-500/20 to-indigo-600/10 text-purple-400" });
        }
        
        // Fallback default achievement so the grid is never completely empty
        if (achievementsList.length === 0) {
            achievementsList.push({ id: "welcome_badge", title: "New Hope", desc: "Registered on the Trust Platform", icon: "🤝", color: "from-sky-500/20 to-blue-600/10 text-sky-400" });
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
                {/* Cinematic Top Header / Navigation Tab */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
                            <span className="text-2xl p-2 bg-brand-navy-dark text-white rounded-xl shadow-lg shadow-blue-900/20">🏛️</span>
                            My Impact Portal
                        </h1>
                        <p className="text-slate-500 text-sm mt-1">
                            Monitor donations, initiatives, tax statements and community updates.
                        </p>
                    </div>
                    
                    {/* Navigation Tabs */}
                    <div className="flex bg-slate-200/60 p-1 rounded-xl self-start md:self-auto border border-slate-300/30">
                        <button
                            onClick={() => setActiveTab("overview")}
                            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                                activeTab === "overview" 
                                ? "bg-white text-brand-navy-dark shadow-sm" 
                                : "text-slate-600 hover:text-slate-900"
                            }`}
                        >
                            Overview
                        </button>
                        <button
                            onClick={() => setActiveTab("history")}
                            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                                activeTab === "history" 
                                ? "bg-white text-brand-navy-dark shadow-sm" 
                                : "text-slate-600 hover:text-slate-900"
                            }`}
                        >
                            Donations & Receipts
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32">
                        <div className="relative w-16 h-16">
                            <div className="absolute inset-0 rounded-full border-4 border-slate-200"></div>
                            <div className="absolute inset-0 rounded-full border-4 border-t-brand-gold animate-spin"></div>
                        </div>
                        <p className="text-slate-500 mt-4 text-sm font-semibold animate-pulse">Assembling your impact records...</p>
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
                                {/* Hero Premium Banner and Impact Tier */}
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                    {/* Greeting glassmorphic panel */}
                                    <motion.div 
                                        variants={itemVariants}
                                        className="lg:col-span-2 rounded-3xl glass-panel-navy p-8 text-white relative overflow-hidden shadow-2xl flex flex-col justify-between"
                                    >
                                        {/* Radial soft glow */}
                                        <div className="absolute top-0 right-0 w-80 h-80 bg-brand-blue-accent/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
                                        <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl"></div>
                                        
                                        <div className="relative z-10">
                                            <div className="flex items-center gap-3 mb-4">
                                                <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-brand-gold/20 text-brand-gold border border-brand-gold/30 tracking-widest uppercase">
                                                    Honored Supporter
                                                </span>
                                            </div>
                                            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                                                Welcome Back, <br />
                                                <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-200 bg-clip-text text-transparent font-black font-heading">{user?.name}</span> 👋
                                            </h2>
                                            <p className="text-blue-100/80 text-sm sm:text-base mt-3 max-w-lg leading-relaxed">
                                                Your support is the bedrock of our operations. Together, we are funding real change and changing lives permanently. Thank you for your continued benevolence.
                                            </p>
                                        </div>

                                        <div className="relative z-10 mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
                                            <div className="flex items-center gap-3">
                                                {/* Mini circular progress */}
                                                <div className="relative w-12 h-12 flex items-center justify-center">
                                                    <svg className="absolute w-full h-full transform -rotate-95">
                                                        <circle cx="24" cy="24" r="20" stroke="rgba(255,255,255,0.08)" strokeWidth="4" fill="transparent" />
                                                        <circle cx="24" cy="24" r="20" stroke="#B07A3F" strokeWidth="4" fill="transparent" strokeDasharray="125.6" strokeDashoffset={125.6 - (125.6 * 85) / 100} />
                                                    </svg>
                                                    <span className="text-xs font-black text-brand-gold">85%</span>
                                                </div>
                                                <div>
                                                    <h4 className="text-xs font-bold text-slate-300">Profile Verified</h4>
                                                    <p className="text-[11px] text-blue-200/70">80G Tax Deductible Active</p>
                                                </div>
                                            </div>

                                            <div className="flex gap-2">
                                                <Link to="/donation" className="px-4 py-2 bg-brand-gold hover:bg-brand-gold/90 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-brand-gold/20 gold-shimmer-hover">
                                                    Instant Gift 💝
                                                </Link>
                                                <a href="#certificate" onClick={() => alert("Downloading 80G tax statement for financial year 2025-26...")} className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl border border-white/15 transition-all">
                                                    Tax Reciept 📁
                                                </a>
                                            </div>
                                        </div>
                                    </motion.div>

                                    {/* Recognition Tier Card */}
                                    <motion.div 
                                        variants={itemVariants}
                                        className={`rounded-3xl border ${tier.border} p-6 flex flex-col justify-between relative overflow-hidden shadow-xl bg-gradient-to-br ${tier.bg}`}
                                    >
                                        <div className="absolute top-2 right-2 text-4xl opacity-20 select-none">
                                            {tier.badge}
                                        </div>
                                        <div>
                                            <span className="text-xs font-bold text-slate-400 tracking-wider uppercase">Donor Recognition Tier</span>
                                            <h3 className="text-2xl font-black text-slate-800 mt-1 flex items-center gap-2">
                                                <span>{tier.badge}</span> {tier.name}
                                            </h3>
                                            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                                                Calculated from successful cumulative donations on this profile.
                                            </p>
                                        </div>

                                        <div className="mt-6">
                                            <div className="flex justify-between text-xs font-bold mb-1.5">
                                                <span className="text-slate-600">Tier Milestone Progress</span>
                                                <span className="text-brand-gold">{Math.round(tier.progress)}%</span>
                                            </div>
                                            {/* Progress Bar */}
                                            <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                                                <div 
                                                    className="h-full bg-gradient-to-r from-brand-gold to-yellow-500 rounded-full transition-all duration-1000"
                                                    style={{ width: `${tier.progress}%` }}
                                                ></div>
                                            </div>
                                            <div className="flex justify-between text-[10px] text-slate-400 font-medium mt-1">
                                                <span>{formatRupee(totalDonated)}</span>
                                                <span>Next: {tier.next}</span>
                                            </div>
                                        </div>

                                        <div className="mt-4 pt-4 border-t border-slate-200/50 flex items-center justify-between">
                                            <span className="text-[11px] text-slate-500 font-semibold">Tier Benefits:</span>
                                            <span className="text-[10px] bg-slate-200/70 px-2 py-0.5 rounded text-slate-600 font-bold">Annual Reports & Invites</span>
                                        </div>
                                    </motion.div>
                                </div>

                                {/* KPI Impact Cards Grid */}
                                <motion.div 
                                    variants={itemVariants}
                                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                                >
                                    {[
                                        { 
                                            label: "Total Contributions", 
                                            value: totalDonated, 
                                            isCurrency: true, 
                                            icon: "💎", 
                                            bg: "bg-white", 
                                            sub: "Tax-exempt donations", 
                                            accent: "border-l-4 border-l-brand-gold" 
                                        },
                                        { 
                                            label: "Gifts Rendered", 
                                            value: donations.length, 
                                            isCurrency: false, 
                                            icon: "📈", 
                                            bg: "bg-white", 
                                            sub: "Successful + pending slips", 
                                            accent: "border-l-4 border-l-blue-600" 
                                        },
                                        { 
                                            label: "Causes Supported", 
                                            value: uniqueInitiatives, 
                                            isCurrency: false, 
                                            icon: "🎯", 
                                            bg: "bg-white", 
                                            sub: "Impact verticals reached", 
                                            accent: "border-l-4 border-l-emerald-600" 
                                        },
                                        { 
                                            label: "Achievements Unlocked", 
                                            value: achievements.length, 
                                            isCurrency: false, 
                                            icon: "🏆", 
                                            bg: "bg-white", 
                                            sub: "Platform activity badges", 
                                            accent: "border-l-4 border-l-purple-600" 
                                        }
                                    ].map((card, idx) => (
                                        <div
                                            key={card.label}
                                            className={`${card.bg} ${card.accent} rounded-2xl shadow-sm border border-slate-100 p-6 relative group overflow-hidden transition-all duration-300 hover:shadow-lg`}
                                        >
                                            <span className="absolute top-4 right-4 text-2xl opacity-35 group-hover:scale-110 transition-transform duration-300">{card.icon}</span>
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{card.label}</p>
                                            <p className="text-2xl font-black text-slate-800 mt-2 font-heading">
                                                {card.isCurrency ? (
                                                    <span>₹<CountUp end={card.value} duration={1.5} separator="," /></span>
                                                ) : (
                                                    <CountUp end={card.value} duration={1.2} />
                                                )}
                                            </p>
                                            <p className="text-[11px] text-slate-400 font-medium mt-1">{card.sub}</p>
                                        </div>
                                    ))}
                                </motion.div>

                                {/* Dashboard Visualizations & Achievements */}
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                    {/* Giving Trends Chart */}
                                    <motion.div 
                                        variants={itemVariants}
                                        className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-slate-100 p-6 flex flex-col justify-between"
                                    >
                                        <div>
                                            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                                <span>📊</span> Giving Trend Visualization
                                            </h3>
                                            <p className="text-slate-400 text-xs mt-0.5">Custom computed graph reflecting past consecutive month investments.</p>
                                        </div>

                                        {/* SVG Chart Render */}
                                        <div className="h-56 w-full mt-6 relative flex items-end">
                                            {/* Grid background lines */}
                                            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-8">
                                                {[1, 2, 3].map((_, i) => (
                                                    <div key={i} className="w-full border-t border-dashed border-slate-100"></div>
                                                ))}
                                            </div>

                                            <div className="relative z-10 w-full h-40 flex items-end justify-between px-2 gap-4 pb-1">
                                                {trendData.map((data, idx) => {
                                                    const pct = maxTrendVal > 0 ? (data.value / maxTrendVal) * 100 : 0;
                                                    return (
                                                        <div key={data.name} className="flex-1 flex flex-col items-center group h-full justify-end">
                                                            {/* Bar or line projection */}
                                                            <div className="w-full relative flex justify-center">
                                                                {/* Hover details tooltip */}
                                                                <div className="absolute bottom-full mb-2 bg-brand-navy-dark text-white text-[10px] font-black px-2 py-1 rounded shadow opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-30">
                                                                    {formatRupee(data.value)}
                                                                </div>
                                                                {/* Column visual */}
                                                                <motion.div 
                                                                    initial={{ height: 0 }}
                                                                    animate={{ height: `${Math.max(pct, 4)}%` }}
                                                                    transition={{ duration: 0.8, delay: idx * 0.1 }}
                                                                    className={`w-8 sm:w-12 rounded-t-lg transition-all duration-300 ${
                                                                        data.value > 0 
                                                                        ? "bg-gradient-to-t from-brand-navy-dark to-brand-blue-accent group-hover:from-brand-gold group-hover:to-amber-500 shadow-md shadow-blue-500/10" 
                                                                        : "bg-slate-100 border border-dashed border-slate-200"
                                                                    }`}
                                                                ></motion.div>
                                                            </div>
                                                            <span className="text-[10px] font-bold text-slate-500 mt-2 uppercase tracking-wide">{data.name}</span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                                            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-brand-blue-accent rounded-full inline-block"></span> Success Contributions</span>
                                            <span>Showing last 6 active months</span>
                                        </div>
                                    </motion.div>

                                    {/* Achievements Sidecar panel */}
                                    <motion.div 
                                        variants={itemVariants}
                                        className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 flex flex-col justify-between"
                                    >
                                        <div>
                                            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                                <span>🏆</span> Impact Accomplishments
                                            </h3>
                                            <p className="text-slate-400 text-xs mt-0.5">Badges earned through platform participation milestones.</p>
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
                                            <span className="text-[10px] font-bold text-brand-gold uppercase tracking-wider">Expand giving to unlock more honors</span>
                                        </div>
                                    </motion.div>
                                </div>

                                {/* Recommeded Stories & Quick Actions panel split */}
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                    {/* Stories recommendations */}
                                    <div className="lg:col-span-2 space-y-4">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                                <span>📖</span> Recommended Impact Stories
                                            </h3>
                                            <Link to="/stories" className="text-xs font-extrabold text-brand-gold hover:underline">
                                                All stories →
                                            </Link>
                                        </div>

                                        {recommendedStories.length === 0 ? (
                                            <div className="bg-white rounded-2xl p-6 border border-slate-100 text-center">
                                                <p className="text-slate-400 text-xs">Stories are currently being compiled by the editorial team.</p>
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                {recommendedStories.map((story) => (
                                                    <Link to={`/stories/${story.id}`} key={story.id} className="group">
                                                        <div className="bg-white rounded-2xl border border-slate-150 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full">
                                                            {/* Story Banner */}
                                                            <div className="h-32 bg-slate-200 relative overflow-hidden">
                                                                <img 
                                                                    src={story.beforeImageUrl || story.afterImageUrl || "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=500&auto=format"} 
                                                                    alt={story.title} 
                                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                                />
                                                                <div className="absolute top-2 left-2 bg-brand-navy-dark text-white text-[9px] font-extrabold uppercase px-2 py-0.5 rounded tracking-wide">
                                                                    {story.category || "Success Story"}
                                                                </div>
                                                            </div>
                                                            <div className="p-4 flex-1 flex flex-col justify-between">
                                                                <div>
                                                                    <h4 className="text-xs font-extrabold text-slate-800 line-clamp-1 group-hover:text-brand-gold transition-colors">{story.title}</h4>
                                                                    <p className="text-[10px] text-slate-400 line-clamp-2 mt-1 leading-relaxed">{story.subtitle || story.description}</p>
                                                                </div>
                                                                <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-100 text-[10px] font-bold">
                                                                    <span className="text-slate-500">📍 {story.location || "Impact Site"}</span>
                                                                    <span className="text-brand-blue-accent group-hover:translate-x-1 transition-transform">Read Story →</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </Link>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Quick Actions Panel */}
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                            <span>⚡</span> Instant Portal Actions
                                        </h3>
                                        <div className="bg-white rounded-3xl p-5 border border-slate-100 grid grid-cols-2 gap-3">
                                            <Link to="/donation" className="flex flex-col items-center justify-center p-4 bg-slate-50 hover:bg-amber-500/5 rounded-2xl hover:border-amber-200 border border-transparent transition-all group text-center">
                                                <span className="text-2xl mb-1 group-hover:scale-115 transition-transform duration-300">💝</span>
                                                <span className="text-xs font-black text-slate-800">Donate Funds</span>
                                                <span className="text-[9px] text-slate-400 mt-0.5 leading-tight">Apply tax write-off</span>
                                            </Link>
                                            
                                            <Link to="/events" className="flex flex-col items-center justify-center p-4 bg-slate-50 hover:bg-blue-500/5 rounded-2xl hover:border-blue-200 border border-transparent transition-all group text-center">
                                                <span className="text-2xl mb-1 group-hover:scale-115 transition-transform duration-300">📅</span>
                                                <span className="text-xs font-black text-slate-800">Initiatives</span>
                                                <span className="text-[9px] text-slate-400 mt-0.5 leading-tight">Volunteer / Attend</span>
                                            </Link>

                                            <Link to="/volunteer" className="flex flex-col items-center justify-center p-4 bg-slate-50 hover:bg-emerald-500/5 rounded-2xl hover:border-emerald-200 border border-transparent transition-all group text-center">
                                                <span className="text-2xl mb-1 group-hover:scale-115 transition-transform duration-300">🤝</span>
                                                <span className="text-xs font-black text-slate-800">Join Roster</span>
                                                <span className="text-[9px] text-slate-400 mt-0.5 leading-tight">Volunteer drive apply</span>
                                            </Link>

                                            <button 
                                                onClick={() => alert("Generating full official donor certificate package...")}
                                                className="flex flex-col items-center justify-center p-4 bg-slate-50 hover:bg-purple-500/5 rounded-2xl hover:border-purple-200 border border-transparent transition-all group text-center"
                                            >
                                                <span className="text-2xl mb-1 group-hover:scale-115 transition-transform duration-300">📜</span>
                                                <span className="text-xs font-black text-slate-800">Certificate</span>
                                                <span className="text-[9px] text-slate-400 mt-0.5 leading-tight">Impact seal download</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            /* Donations History Table Panel */
                            <motion.div
                                key="history"
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 15 }}
                                className="space-y-6"
                            >
                                {/* Filter bar */}
                                <div className="bg-white rounded-2xl p-4 border border-slate-100 flex flex-col sm:flex-row gap-4 items-center justify-between shadow-sm">
                                    <div className="relative w-full sm:max-w-xs">
                                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔍</span>
                                        <input 
                                            type="text" 
                                            placeholder="Search by receipt or cause..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="w-full bg-slate-50 border border-slate-200 focus:border-brand-gold focus:ring-1 focus:ring-brand-gold rounded-xl py-2 pl-9 pr-4 text-xs font-medium text-slate-700 outline-none transition-all"
                                        />
                                    </div>

                                    {/* Status categories */}
                                    <div className="flex bg-slate-100 p-1 rounded-xl w-full sm:w-auto">
                                        {["ALL", "SUCCESS", "PENDING", "FAILED"].map((status) => (
                                            <button
                                                key={status}
                                                onClick={() => setFilterStatus(status)}
                                                className={`flex-1 sm:flex-initial px-3.5 py-1.5 text-[10px] font-extrabold rounded-lg uppercase tracking-wider transition-all ${
                                                    filterStatus === status 
                                                    ? "bg-white text-brand-navy-dark shadow-sm" 
                                                    : "text-slate-500 hover:text-slate-700"
                                                }`}
                                            >
                                                {status}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Main Receipt table */}
                                <div className="bg-white rounded-3xl border border-slate-150 overflow-hidden shadow-xl">
                                    {filteredDonations.length === 0 ? (
                                        <div className="p-16 text-center">
                                            <span className="text-6xl block">💝</span>
                                            <h3 className="text-lg font-bold text-slate-700 mt-4">No donation slips match criteria</h3>
                                            <p className="text-slate-400 text-xs mt-1 max-w-md mx-auto">Verify that spelling is correct or status filters align with your past transactions.</p>
                                            <button 
                                                onClick={() => { setFilterStatus("ALL"); setSearchQuery(""); }} 
                                                className="mt-6 inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-750 text-xs font-extrabold rounded-xl transition-all"
                                            >
                                                Reset Filters
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="overflow-x-auto">
                                            <table className="w-full border-collapse align-middle">
                                                <thead>
                                                    <tr className="bg-slate-50 border-b border-slate-150 text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">
                                                        <th className="px-6 py-4 text-left">Receipt Number</th>
                                                        <th className="px-6 py-4 text-left">Contribution Date</th>
                                                        <th className="px-6 py-4 text-left">Assigned Initiative / Cause</th>
                                                        <th className="px-6 py-4 text-center">Process Status</th>
                                                        <th className="px-6 py-4 text-right">Receipt File</th>
                                                        <th className="px-6 py-4 text-right">Donation Value</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-100">
                                                    {filteredDonations.map((don, idx) => (
                                                        <tr key={don.id || idx} className="hover:bg-slate-50/50 transition-all group">
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <span className="text-xs font-mono font-bold text-brand-navy-dark px-2.5 py-1 rounded bg-slate-100 group-hover:bg-brand-navy-dark group-hover:text-white transition-colors">
                                                                    {don.receiptNumber || "Pending Processing"}
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-500 font-semibold">
                                                                {don.createdAt 
                                                                    ? new Date(don.createdAt).toLocaleDateString("en-IN", {
                                                                        day: "numeric",
                                                                        month: "short",
                                                                        year: "numeric"
                                                                      })
                                                                    : "N/A"
                                                                }
                                                            </td>
                                                            <td className="px-6 py-4 text-xs text-slate-800 font-extrabold">
                                                                {don.eventTitle || "General Trust Initiative"}
                                                            </td>
                                                            <td className="px-6 py-4 text-center whitespace-nowrap">
                                                                <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-extrabold border ${
                                                                    don.status === "SUCCESS" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                                                                    don.status === "FAILED" ? "bg-rose-50 text-rose-700 border-rose-200" :
                                                                    "bg-amber-50 text-amber-700 border-amber-200"
                                                                }`}>
                                                                    {don.status || "PENDING"}
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-4 text-right whitespace-nowrap">
                                                                {don.status === "SUCCESS" ? (
                                                                    <button
                                                                        onClick={() => alert(`Downloading formal receipt ${don.receiptNumber} for ₹${don.amount}...`)}
                                                                        className="text-xs text-brand-gold hover:underline font-extrabold inline-flex items-center gap-1.5"
                                                                    >
                                                                        <span>📥</span> Download PDF
                                                                    </button>
                                                                ) : (
                                                                    <span className="text-[11px] text-slate-400 italic font-semibold">Slips locked</span>
                                                                )}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-right text-xs font-black text-slate-850">
                                                                {formatRupee(don.amount)}
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

export default UserDashboard;

