import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import databaseService from "../../services/databaseService";
import ErrorBoundary from "../../components/ErrorBoundary";

const AnalyticsPanel = ({ dashboardData, activities, tabLoading, onRefreshActivities, formatDate }) => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);
  const [hoveredDot, setHoveredDot] = useState(null); // { x, y, value, label } for Area Chart
  const [hoveredBar, setHoveredBar] = useState(null); // { x, y, value, cap, label } for Bar Chart
  const [activeTabMetric, setActiveTabMetric] = useState("all");

  const [aiSummary, setAiSummary] = useState("");
  const [aiSummaryLoading, setAiSummaryLoading] = useState(true);
  const [reportType, setReportType] = useState("monthly");
  const [reportText, setReportText] = useState("");
  const [reportLoading, setReportLoading] = useState(false);

  useEffect(() => {
    let active = true;
    const fetchAiSummary = async () => {
      try {
        setAiSummaryLoading(true);
        const res = await databaseService.summarizeAnalyticsAi();
        if (active) {
          setAiSummary(res.data || res);
        }
      } catch (err) {
        console.error("[AnalyticsPanel] Failed to fetch AI summary:", err);
      } finally {
        if (active) setAiSummaryLoading(false);
      }
    };
    if (dashboardData) {
      fetchAiSummary();
    }
    return () => { active = false; };
  }, [dashboardData]);

  useEffect(() => {
    let active = true;
    const fetchAnalytics = async () => {
      try {
        setAnalyticsLoading(true);
        const res = await databaseService.getAnalyticsSummary();
        if (active) {
          setAnalyticsData(res.data || res);
        }
      } catch (err) {
        console.error("[AnalyticsPanel] Failed to fetch advanced analytics:", err);
      } finally {
        if (active) setAnalyticsLoading(false);
      }
    };

    fetchAnalytics();
    return () => { active = false; };
  }, [dashboardData]);

  // Card list and overall containers animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } }
  };

  // --- SVG 1: Monthly Donations Area Chart calculation ---
  const areaChartData = useMemo(() => {
    if (!dashboardData || !Array.isArray(dashboardData.monthlyDonations) || dashboardData.monthlyDonations.length === 0) {
      return [
        { month: "Jan", totalAmount: 4000 },
        { month: "Feb", totalAmount: 7500 },
        { month: "Mar", totalAmount: 5000 },
        { month: "Apr", totalAmount: 12000 },
        { month: "May", totalAmount: 9000 },
        { month: "Jun", totalAmount: 15000 }
      ];
    }
    return dashboardData.monthlyDonations;
  }, [dashboardData]);

  const areaChartConfig = useMemo(() => {
    const width = 500;
    const height = 220;
    const paddingLeft = 60;
    const paddingRight = 20;
    const paddingTop = 30;
    const paddingBottom = 40;

    const values = areaChartData.map(d => Number(d.totalAmount || 0));
    const maxVal = Math.max(...values, 1000);
    const minVal = 0;
    const range = maxVal - minVal;

    const chartWidth = width - paddingLeft - paddingRight;
    const chartHeight = height - paddingTop - paddingBottom;

    const divisor = areaChartData.length > 1 ? areaChartData.length - 1 : 1;

    const points = areaChartData.map((d, index) => {
      const x = paddingLeft + (index / divisor) * chartWidth;
      const y = paddingTop + chartHeight - ((Number(d.totalAmount || 0) - minVal) / (range || 1)) * chartHeight;
      return { x, y, value: d.totalAmount, label: d.month };
    });

    // Make smooth bezier curve strings
    let pathD = "";
    let areaD = "";
    if (points.length > 0) {
      pathD = `M ${points[0].x} ${points[0].y}`;
      for (let i = 0; i < points.length - 1; i++) {
        const p0 = points[i];
        const p1 = points[i + 1];
        const cpX1 = p0.x + chartWidth / divisor / 2;
        const cpY1 = p0.y;
        const cpX2 = p1.x - chartWidth / divisor / 2;
        const cpY2 = p1.y;
        pathD += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${p1.x} ${p1.y}`;
      }
      areaD = `${pathD} L ${points[points.length - 1].x} ${height - paddingBottom} L ${points[0].x} ${height - paddingBottom} Z`;
    }

    return { width, height, paddingLeft, paddingRight, paddingTop, paddingBottom, points, pathD, areaD, maxVal, chartHeight, chartWidth };
  }, [areaChartData]);


  // --- SVG 2: Volunteer Application vs Capacity Bar Chart calculation ---
  const barChartData = useMemo(() => {
    if (!analyticsData || !Array.isArray(analyticsData.eventEngagement) || analyticsData.eventEngagement.length === 0) {
      return [
        { eventTitle: "Education Campaign", maxVolunteers: 20, totalApplications: 15 },
        { eventTitle: "Food Relief Drive", maxVolunteers: 15, totalApplications: 22 },
        { eventTitle: "Green Earth Planting", maxVolunteers: 30, totalApplications: 12 },
        { eventTitle: "Medical Camp 2026", maxVolunteers: 25, totalApplications: 29 },
        { eventTitle: "Clean India Drive", maxVolunteers: 10, totalApplications: 8 }
      ];
    }
    return analyticsData.eventEngagement.slice(0, 5); // Take top 5
  }, [analyticsData]);

  const barChartConfig = useMemo(() => {
    const width = 500;
    const height = 220;
    const paddingLeft = 50;
    const paddingRight = 20;
    const paddingTop = 30;
    const paddingBottom = 40;

    const maxVal = Math.max(
      ...barChartData.map(d => Math.max(d.maxVolunteers || 0, d.totalApplications || 0)),
      10
    );

    const chartWidth = width - paddingLeft - paddingRight;
    const chartHeight = height - paddingTop - paddingBottom;
    const groupWidth = chartWidth / barChartData.length;
    const barWidth = 14;

    const bars = barChartData.map((d, index) => {
      const xGroup = paddingLeft + index * groupWidth + (groupWidth - barWidth * 2 - 4) / 2;
      const hCap = ((d.maxVolunteers || 0) / maxVal) * chartHeight;
      const yCap = paddingTop + chartHeight - hCap;

      const hApps = ((d.totalApplications || 0) / maxVal) * chartHeight;
      const yApps = paddingTop + chartHeight - hApps;

      const eventTitle = d.eventTitle || "Untitled Event";
      const shortLabel = eventTitle.length > 15 ? eventTitle.substring(0, 12) + "..." : eventTitle;

      return {
        xCap: xGroup,
        yCap,
        hCap,
        xApps: xGroup + barWidth + 4,
        yApps,
        hApps,
        label: shortLabel,
        fullLabel: eventTitle,
        capValue: d.maxVolunteers,
        appsValue: d.totalApplications
      };
    });

    return { width, height, paddingLeft, paddingRight, paddingTop, paddingBottom, bars, maxVal, chartHeight };
  }, [barChartData]);


  // Helper: Format large numbers into shortened scales (e.g. 15K, 2.5L)
  const formatShortNumber = (num) => {
    if (num >= 100000) return `₹${(num / 100000).toFixed(1)}L`;
    if (num >= 1000) return `₹${(num / 1000).toFixed(0)}K`;
    return `₹${num}`;
  };

  const donorStats = useMemo(() => analyticsData?.donorAnalytics || {}, [analyticsData]);

  const repeatDonorRate = useMemo(() => {
    if (!donorStats.totalDonorsCount) return 0;
    return (donorStats.repeatDonorsCount / donorStats.totalDonorsCount) * 100;
  }, [donorStats]);

  const mediaRatio = useMemo(() => {
    const imageCount = analyticsData?.imageCount || 0;
    const videoCount = analyticsData?.videoCount || 0;
    const total = imageCount + videoCount;
    return total > 0 ? imageCount / total : 0;
  }, [analyticsData]);

  const mediaPercentage = useMemo(() => {
    return Math.round(mediaRatio * 100);
  }, [mediaRatio]);

  const storiesRatio = useMemo(() => {
    const published = analyticsData?.publishedStoriesCount || 0;
    const draft = analyticsData?.draftStoriesCount || 0;
    const total = published + draft;
    return total > 0 ? published / total : 0;
  }, [analyticsData]);

  const storiesPercentage = useMemo(() => {
    return Math.round(storiesRatio * 100);
  }, [storiesRatio]);

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-8 pb-12"
    >
      {/* Dynamic Grid of Advanced Metrics & Standard KPIs */}
      {!dashboardData ? (
        <div className="text-center py-16 text-gray-400 font-medium">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          Loading operational analytics…
        </div>
      ) : (
        <>
          {/* AI Executive Intelligence Insights */}
          <motion.div
            variants={itemVariants}
            className="bg-gradient-to-r from-amber-500/5 via-indigo-500/5 to-transparent border border-amber-500/15 rounded-3xl p-6 shadow-sm relative overflow-hidden group"
          >
            <ErrorBoundary name="AI Executive Intelligence Summary" title="AI Summary Unavailable">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-amber-500/10 to-indigo-500/10 rounded-bl-full opacity-50 blur-xl group-hover:scale-125 transition-transform duration-500" />
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl animate-pulse select-none">✨</span>
                <div>
                  <h4 className="text-base font-black text-brand-navy-dark tracking-tight">Director's Executive Intelligence Summary</h4>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Real-time operational anomaly & campaign momentum tracing</p>
                </div>
              </div>
              
              {aiSummaryLoading ? (
                <div className="flex items-center gap-2 py-2 text-xs font-semibold text-gray-400">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-amber-600"></div>
                  Analyzing database aggregates and recent activity logs...
                </div>
              ) : (aiSummary && typeof aiSummary === "string") ? (
                <div className="space-y-2 text-xs font-medium text-gray-700 leading-relaxed max-w-4xl">
                  {aiSummary.split('\n').filter(line => line.trim().startsWith('*') || line.trim().startsWith('-')).map((line, idx) => {
                    const cleanText = line.replace(/^[\*\-\s]+/, '').trim();
                    const boldSplit = cleanText.split('**');
                    return (
                      <motion.div 
                        initial={{ opacity: 0, x: -10 }} 
                        animate={{ opacity: 1, x: 0 }} 
                        transition={{ delay: idx * 0.1 }}
                        key={idx} 
                        className="flex items-start gap-2 bg-white/40 border border-white/60 rounded-xl p-3 hover:bg-white/80 transition-colors"
                      >
                        <span className="text-amber-500 mt-0.5 select-none">✦</span>
                        <span>
                          {boldSplit.map((text, sIdx) => sIdx % 2 === 1 ? <strong key={sIdx} className="font-black text-brand-navy-dark">{text}</strong> : text)}
                        </span>
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-xs text-gray-400">Unable to generate intelligence insights summary.</div>
              )}
            </ErrorBoundary>
          </motion.div>

          {/* Core Premium Stats Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                label: "Total Collected",
                value: `₹${Number(dashboardData.totalAmountCollected || 0).toLocaleString("en-IN")}`,
                color: "from-amber-500/10 via-amber-500/5 to-transparent text-amber-700 border-amber-500/15 hover:border-amber-500/30",
                icon: "💰",
                subtitle: `${dashboardData.successfulDonations || 0} Successful Transactions`
              },
              {
                label: "Admin Awareness Alerts",
                value: activities ? activities.length : 0,
                color: "from-indigo-500/10 via-indigo-500/5 to-transparent text-indigo-700 border-indigo-500/15 hover:border-indigo-500/30",
                icon: "⚡",
                subtitle: "Real-time activity logs"
              },
              {
                label: "Volunteer Mobilization",
                value: dashboardData.approvedVolunteers || 0,
                color: "from-emerald-500/10 via-emerald-500/5 to-transparent text-emerald-700 border-emerald-500/15 hover:border-emerald-500/30",
                icon: "🤝",
                subtitle: `${dashboardData.pendingApplications || 0} Pending approvals`
              },
              {
                label: "NGO Media Density",
                value: analyticsLoading ? "—" : `${(analyticsData?.imageCount || 0) + (analyticsData?.videoCount || 0)} Assets`,
                color: "from-rose-500/10 via-rose-500/5 to-transparent text-rose-700 border-rose-500/15 hover:border-rose-500/30",
                icon: "🎬",
                subtitle: analyticsLoading ? "Loading densities..." : `${analyticsData?.imageCount || 0} Imgs • ${analyticsData?.videoCount || 0} Vids`
              }
            ].map((s, idx) => (
              <motion.div
                variants={itemVariants}
                whileHover={{ y: -5, boxShadow: "0 15px 30px -10px rgba(0,0,0,0.08)" }}
                key={idx}
                className={`bg-gradient-to-br ${s.color} border rounded-3xl p-6 shadow-sm transition-all duration-300 relative overflow-hidden group`}
              >
                <span className="absolute top-4 right-4 text-3xl opacity-20 group-hover:scale-110 transition-transform duration-300 select-none">{s.icon}</span>
                <p className="text-[11px] font-black uppercase tracking-wider opacity-60 text-gray-500">{s.label}</p>
                <p className="text-3xl font-black mt-2 tracking-tight text-brand-navy-dark">{s.value}</p>
                <p className="text-xs text-gray-500 mt-2 font-medium">{s.subtitle}</p>
              </motion.div>
            ))}
          </div>

          {/* SVG Customized Interactive Chart Engine Layout */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Chart Container 1: Area Chart */}
            <motion.div
              variants={itemVariants}
              className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 relative overflow-visible group"
            >
              <ErrorBoundary name="Revenue Stream Chart" title="Chart Display Failed">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="text-base font-bold text-brand-navy-dark">Donation Revenue Stream</h4>
                    <p className="text-xs text-gray-400">Cinematic visual of monthly funding progress</p>
                  </div>
                  <span className="text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-100 select-none">Area Aggregation</span>
                </div>

                {/* Chart SVG viewPort */}
                <div className="relative w-full h-[220px]">
                  <svg
                    viewBox={`0 0 ${areaChartConfig.width} ${areaChartConfig.height}`}
                    className="w-full h-full overflow-visible"
                  >
                    <defs>
                      <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="rgba(245, 158, 11, 0.25)" />
                        <stop offset="100%" stopColor="rgba(245, 158, 11, 0.00)" />
                      </linearGradient>
                    </defs>

                    {/* Horizontal Gridlines */}
                    {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
                      const y = areaChartConfig.paddingTop + areaChartConfig.chartHeight * (1 - ratio);
                      const labelVal = areaChartConfig.maxVal * ratio;
                      return (
                        <g key={i} className="opacity-40">
                          <line
                            x1={areaChartConfig.paddingLeft}
                            y1={y}
                            x2={areaChartConfig.width - areaChartConfig.paddingRight}
                            y2={y}
                            stroke="#e5e7eb"
                            strokeWidth="1"
                            strokeDasharray="4 4"
                          />
                          <text
                            x={areaChartConfig.paddingLeft - 8}
                            y={y + 4}
                            className="text-[10px] text-gray-400 font-bold"
                            textAnchor="end"
                          >
                            {formatShortNumber(Math.round(labelVal))}
                          </text>
                        </g>
                      );
                    })}

                    {/* SVG Area (Fill) */}
                    <motion.path
                      d={areaChartConfig.areaD}
                      fill="url(#areaGrad)"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                    />

                    {/* SVG Stroke Line (Outline) */}
                    <motion.path
                      d={areaChartConfig.pathD}
                      fill="none"
                      stroke="#d97706"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1.2, ease: "easeOut" }}
                    />

                    {/* Data Point Dots & Hover Interactivities */}
                    {areaChartConfig.points.map((p, idx) => (
                      <g key={idx}>
                        <circle
                          cx={p.x}
                          cy={p.y}
                          r="5"
                          fill="#fff"
                          stroke="#d97706"
                          strokeWidth="3"
                          className="cursor-pointer transition-all duration-200 hover:scale-150"
                          onMouseEnter={() => setHoveredDot(p)}
                          onMouseLeave={() => setHoveredDot(null)}
                        />
                        <text
                          x={p.x}
                          y={areaChartConfig.height - 12}
                          className="text-[10px] text-gray-400 font-bold"
                          textAnchor="middle"
                        >
                          {p.label}
                        </text>
                      </g>
                    ))}
                  </svg>

                  {/* React Hover Tooltip */}
                  <AnimatePresence>
                    {hoveredDot && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        style={{
                          position: "absolute",
                          left: `${(hoveredDot.x / areaChartConfig.width) * 100}%`,
                          top: `${(hoveredDot.y / areaChartConfig.height) * 100 - 45}%`,
                          transform: "translateX(-50%)"
                        }}
                        className="bg-brand-navy-dark text-white rounded-xl py-1.5 px-3 shadow-lg border border-white/10 text-center pointer-events-none select-none z-10 whitespace-nowrap font-sans"
                      >
                        <p className="text-[10px] text-amber-400 font-black uppercase tracking-wider leading-none">{hoveredDot.label}</p>
                        <p className="text-xs font-black mt-1">₹{Number(hoveredDot.value).toLocaleString("en-IN")}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </ErrorBoundary>
            </motion.div>

            {/* Chart Container 2: Dynamic Bar Chart */}
            <motion.div
              variants={itemVariants}
              className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 relative overflow-visible group"
            >
              <ErrorBoundary name="Volunteer Mobilization Chart" title="Chart Display Failed">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="text-base font-bold text-brand-navy-dark">Volunteer Application Capacity</h4>
                    <p className="text-xs text-gray-400">Applications mobilization vs targets across initiatives</p>
                  </div>
                  <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100 select-none">Pillar Comparison</span>
                </div>

                {/* Bar Chart SVG viewPort */}
                <div className="relative w-full h-[220px]">
                  <svg
                    viewBox={`0 0 ${barChartConfig.width} ${barChartConfig.height}`}
                    className="w-full h-full overflow-visible"
                  >
                    {/* Horizontal Gridlines */}
                    {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
                      const y = barChartConfig.paddingTop + barChartConfig.chartHeight * (1 - ratio);
                      const labelVal = barChartConfig.maxVal * ratio;
                      return (
                        <g key={i} className="opacity-40">
                          <line
                            x1={barChartConfig.paddingLeft}
                            y1={y}
                            x2={barChartConfig.width - barChartConfig.paddingRight}
                            y2={y}
                            stroke="#e5e7eb"
                            strokeWidth="1"
                            strokeDasharray="4 4"
                          />
                          <text
                            x={barChartConfig.paddingLeft - 8}
                            y={y + 4}
                            className="text-[10px] text-gray-400 font-bold"
                            textAnchor="end"
                          >
                            {Math.round(labelVal)}
                          </text>
                        </g>
                      );
                    })}

                    {/* Render Pillars */}
                    {barChartConfig.bars.map((bar, idx) => (
                      <g key={idx}>
                        {/* Capacity Bar (Solid Slate/Grey Background Pillar) */}
                        <motion.rect
                          x={bar.xCap}
                          y={bar.yCap}
                          width="14"
                          height={bar.hCap}
                          fill="#cbd5e1"
                          rx="3.5"
                          className="cursor-pointer opacity-75 hover:opacity-100 transition-opacity"
                          initial={{ height: 0, y: barChartConfig.height - barChartConfig.paddingBottom }}
                          animate={{ height: bar.hCap, y: bar.yCap }}
                          transition={{ duration: 0.8, delay: idx * 0.1, ease: "easeOut" }}
                          onMouseEnter={() => setHoveredBar(bar)}
                          onMouseLeave={() => setHoveredBar(null)}
                        />

                        {/* Applications Bar (Vibrant Indigo Mobilization Pillar) */}
                        <motion.rect
                          x={bar.xApps}
                          y={bar.yApps}
                          width="14"
                          height={bar.hApps}
                          fill="#6366f1"
                          rx="3.5"
                          className="cursor-pointer opacity-90 hover:opacity-100 transition-opacity"
                          initial={{ height: 0, y: barChartConfig.height - barChartConfig.paddingBottom }}
                          animate={{ height: bar.hApps, y: bar.yApps }}
                          transition={{ duration: 1.0, delay: idx * 0.1 + 0.1, ease: "easeOut" }}
                          onMouseEnter={() => setHoveredBar(bar)}
                          onMouseLeave={() => setHoveredBar(null)}
                        />

                        {/* Text Label */}
                        <text
                          x={(bar.xCap + bar.xApps + 14) / 2}
                          y={barChartConfig.height - 12}
                          className="text-[9px] text-gray-400 font-bold"
                          textAnchor="middle"
                        >
                          {bar.label}
                        </text>
                      </g>
                    ))}
                  </svg>

                  {/* React Hover Tooltip for Bars */}
                  <AnimatePresence>
                    {hoveredBar && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        style={{
                          position: "absolute",
                          left: `${((hoveredBar.xCap + hoveredBar.xApps + 14) / (2 * barChartConfig.width)) * 100}%`,
                          top: `${(Math.min(hoveredBar.yCap, hoveredBar.yApps) / barChartConfig.height) * 100 - 55}%`,
                          transform: "translateX(-50%)"
                        }}
                        className="bg-brand-navy-dark text-white rounded-2xl p-3 shadow-lg border border-white/10 pointer-events-none select-none z-10 whitespace-nowrap text-left"
                      >
                        <p className="text-[10px] text-indigo-400 font-black uppercase tracking-wider leading-none mb-1.5">{hoveredBar.fullLabel}</p>
                        <div className="space-y-0.5 text-xs">
                          <p className="font-semibold text-gray-300">Target Seats: <span className="font-black text-white">{hoveredBar.capValue}</span></p>
                          <p className="font-semibold text-indigo-300">Applications: <span className="font-black text-white">{hoveredBar.appsValue}</span></p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </ErrorBoundary>
            </motion.div>
          </div>

          {/* Operational Intelligence and Media Density Deep-Dive Indicators */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
            {/* Box 1: Repeat Donor Loyalty */}
            <motion.div
              variants={itemVariants}
              className="bg-white rounded-3xl border border-gray-100 p-6 flex flex-col items-center text-center shadow-sm relative overflow-hidden group hover:border-amber-500/20 transition-all duration-300"
            >
              <h5 className="text-xs font-black uppercase tracking-wider text-gray-400 self-start mb-4">Donor Engagement Index</h5>
              {analyticsLoading ? (
                <div className="py-8 flex items-center justify-center"><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-amber-600"></div></div>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="relative w-24 h-24 mb-4 select-none">
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                      <circle cx="50" cy="50" r="42" fill="none" stroke="#f3f4f6" strokeWidth="7" />
                      <motion.circle
                        cx="50"
                        cy="50"
                        r="42"
                        fill="none"
                        stroke="#d97706"
                        strokeWidth="7"
                        strokeDasharray={2 * Math.PI * 42}
                        initial={{ strokeDashoffset: 2 * Math.PI * 42 }}
                        animate={{ strokeDashoffset: 2 * Math.PI * 42 * (1 - repeatDonorRate / 100) }}
                        transition={{ duration: 1.2, delay: 0.2 }}
                        strokeLinecap="round"
                        transform="rotate(-90 50 50)"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center text-lg font-black text-brand-navy-dark">
                      {Math.round(repeatDonorRate)}%
                    </div>
                  </div>
                  <p className="text-sm font-black text-brand-navy-dark mt-1">Loyalty/Repeat Ratio</p>
                  <p className="text-xs text-gray-400 mt-1">Avg Gift: ₹{Number(donorStats.averageDonationSize || 0).toLocaleString("en-IN")}</p>
                </div>
              )}
            </motion.div>

            {/* Box 2: Volunteer Funnel Status */}
            <motion.div
              variants={itemVariants}
              className="bg-white rounded-3xl border border-gray-100 p-6 flex flex-col items-center text-center shadow-sm relative overflow-hidden group hover:border-indigo-500/20 transition-all duration-300"
            >
              <h5 className="text-xs font-black uppercase tracking-wider text-gray-400 self-start mb-4">Volunteer Approved Status</h5>
              {analyticsLoading ? (
                <div className="py-8 flex items-center justify-center"><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div></div>
              ) : (
                <div className="flex flex-col items-center w-full">
                  <div className="relative w-24 h-24 mb-4 select-none">
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                      <circle cx="50" cy="50" r="42" fill="none" stroke="#f3f4f6" strokeWidth="7" />
                      <motion.circle
                        cx="50"
                        cy="50"
                        r="42"
                        fill="none"
                        stroke="#6366f1"
                        strokeWidth="7"
                        strokeDasharray={2 * Math.PI * 42}
                        initial={{ strokeDashoffset: 2 * Math.PI * 42 }}
                        animate={{ strokeDashoffset: 2 * Math.PI * 42 * (1 - (analyticsData?.volunteerApprovedRatio || 0)) }}
                        transition={{ duration: 1.2, delay: 0.3 }}
                        strokeLinecap="round"
                        transform="rotate(-90 50 50)"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center text-lg font-black text-brand-navy-dark">
                      {Math.round((analyticsData?.volunteerApprovedRatio || 0) * 100)}%
                    </div>
                  </div>
                  <p className="text-sm font-black text-brand-navy-dark mt-1">Approval Velocity</p>
                  <p className="text-xs text-gray-400 mt-1">{Math.round((analyticsData?.volunteerPendingRatio || 0) * 100)}% remains pending</p>
                </div>
              )}
            </motion.div>

            {/* Box 3: Media Index Coverage */}
            <motion.div
              variants={itemVariants}
              className="bg-white rounded-3xl border border-gray-100 p-6 flex flex-col items-center text-center shadow-sm relative overflow-hidden group hover:border-emerald-500/20 transition-all duration-300"
            >
              <h5 className="text-xs font-black uppercase tracking-wider text-gray-400 self-start mb-4">Media Assets Ratio</h5>
              {analyticsLoading ? (
                <div className="py-8 flex items-center justify-center"><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-600"></div></div>
              ) : (
                <div className="flex flex-col items-center w-full">
                  <div className="relative w-24 h-24 mb-4 select-none">
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                      <circle cx="50" cy="50" r="42" fill="none" stroke="#f3f4f6" strokeWidth="7" />
                      <motion.circle
                        cx="50"
                        cy="50"
                        r="42"
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="7"
                        strokeDasharray={2 * Math.PI * 42}
                        initial={{ strokeDashoffset: 2 * Math.PI * 42 }}
                        animate={{
                          strokeDashoffset: 2 * Math.PI * 42 * (1 - mediaRatio)
                        }}
                        transition={{ duration: 1.2, delay: 0.4 }}
                        strokeLinecap="round"
                        transform="rotate(-90 50 50)"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center text-lg font-black text-brand-navy-dark">
                      {mediaPercentage}%
                    </div>
                  </div>
                  <p className="text-sm font-black text-brand-navy-dark mt-1">Image Asset Dominance</p>
                  <p className="text-xs text-gray-400 mt-1">Avg Media/Post: {Number(analyticsData?.averageMediaItemsPerContent || 0).toFixed(1)} items</p>
                </div>
              )}
            </motion.div>

            {/* Box 4: Stories Integration & Version Control */}
            <motion.div
              variants={itemVariants}
              className="bg-white rounded-3xl border border-gray-100 p-6 flex flex-col items-center text-center shadow-sm relative overflow-hidden group hover:border-rose-500/20 transition-all duration-300"
            >
              <h5 className="text-xs font-black uppercase tracking-wider text-gray-400 self-start mb-4">CMS Publishing Stability</h5>
              {analyticsLoading ? (
                <div className="py-8 flex items-center justify-center"><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-rose-600"></div></div>
              ) : (
                <div className="flex flex-col items-center w-full">
                  <div className="relative w-24 h-24 mb-4 select-none">
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                      <circle cx="50" cy="50" r="42" fill="none" stroke="#f3f4f6" strokeWidth="7" />
                      <motion.circle
                        cx="50"
                        cy="50"
                        r="42"
                        fill="none"
                        stroke="#f43f5e"
                        strokeWidth="7"
                        strokeDasharray={2 * Math.PI * 42}
                        initial={{ strokeDashoffset: 2 * Math.PI * 42 }}
                        animate={{
                          strokeDashoffset: 2 * Math.PI * 42 * (1 - storiesRatio)
                        }}
                        transition={{ duration: 1.2, delay: 0.5 }}
                        strokeLinecap="round"
                        transform="rotate(-90 50 50)"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center text-lg font-black text-brand-navy-dark">
                      {storiesPercentage}%
                    </div>
                  </div>
                  <p className="text-sm font-black text-brand-navy-dark mt-1">Stories Publication Rate</p>
                  <p className="text-xs text-gray-400 mt-1">Average versions: {Number(analyticsData?.averageVersionsPerStory || 1.0).toFixed(1)}/doc</p>
                </div>
              )}
            </motion.div>
          </div>

          {/* AI Impact Report Hub */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-3xl border border-gray-100 p-6 mt-8 shadow-sm relative overflow-visible"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-50 pb-4 mb-6">
              <div>
                <h4 className="text-base font-bold text-brand-navy-dark flex items-center gap-2">
                  <span>📊</span> ✨ AI Intelligence Reporting Hub
                </h4>
                <p className="text-xs text-gray-400">Generate professional, emotionally compelling, metrics-grounded operational reports</p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  className="text-xs bg-gray-50 border border-gray-200 rounded-full py-1.5 px-4 font-bold text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="monthly">Monthly Synthesis Report</option>
                  <option value="campaign">Campaign Spotlight & Outcomes</option>
                  <option value="donor">Donor Loyalty & Transparency</option>
                </select>
                <button
                  onClick={async () => {
                    try {
                      setReportLoading(true);
                      const res = await databaseService.generateAiReport(reportType);
                      setReportText(res.data || res);
                    } catch (e) {
                      console.error(e);
                    } finally {
                      setReportLoading(false);
                    }
                  }}
                  disabled={reportLoading}
                  className="text-xs font-black text-white bg-gradient-to-r from-amber-500 to-indigo-600 hover:brightness-95 disabled:opacity-50 px-5 py-2.5 rounded-full transition duration-300 shadow-sm flex items-center gap-1.5"
                >
                  {reportLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-white"></div>
                      Generating Synthesis...
                    </>
                  ) : (
                    <>
                      <span>✨</span> Compile Report
                    </>
                  )}
                </button>
              </div>
            </div>

            {reportLoading ? (
              <div className="text-center py-16 text-gray-400 font-medium">
                <div className="animate-pulse flex flex-col items-center">
                  <span className="text-4xl animate-bounce mb-4 select-none">🪄</span>
                  <p className="text-xs font-bold text-indigo-600">Formulating Prompt & Analyzing Aggregates...</p>
                  <p className="text-[10px] text-gray-400 mt-1 max-w-sm">Generating auditable, grounded, and emotionally compelling narrative blocks.</p>
                </div>
              </div>
            ) : (reportText && typeof reportText === "string") ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-50/50 border border-gray-100 rounded-2xl p-6 mt-4 relative group"
              >
                {/* Actions overlay */}
                <div className="absolute top-4 right-4 flex items-center gap-2 opacity-80 hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(reportText);
                      alert("Report copied to clipboard!");
                    }}
                    className="text-[10px] bg-white border border-gray-200 text-gray-600 font-bold px-3 py-1.5 rounded-lg hover:bg-gray-50 transition"
                  >
                    📋 Copy Text
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="text-[10px] bg-white border border-gray-200 text-gray-600 font-bold px-3 py-1.5 rounded-lg hover:bg-gray-50 transition"
                  >
                    🖨️ Export PDF
                  </button>
                </div>

                {/* Markdown formatted container */}
                <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed font-sans mt-2 space-y-4">
                  {reportText.split('\n').map((line, idx) => {
                    const cleanLine = line.trim();
                    if (cleanLine.startsWith('# ')) {
                      return <h2 key={idx} className="text-xl font-black text-brand-navy-dark tracking-tight border-b pb-2 mt-6 mb-4">{cleanLine.replace('# ', '')}</h2>;
                    }
                    if (cleanLine.startsWith('## ')) {
                      return <h3 key={idx} className="text-lg font-black text-brand-navy-dark mt-6 mb-2">{cleanLine.replace('## ', '')}</h3>;
                    }
                    if (cleanLine.startsWith('> ')) {
                      return <p key={idx} className="border-l-4 border-amber-500 pl-4 italic text-gray-500 bg-amber-50/30 py-2 rounded-r-lg font-mono text-[11px]">{cleanLine.replace('> ', '')}</p>;
                    }
                    if (cleanLine.startsWith('* ') || cleanLine.startsWith('- ')) {
                      const boldSplit = cleanLine.replace(/^[\*\-\s]+/, '').split('**');
                      return (
                        <li key={idx} className="ml-4 list-disc pl-1 text-xs">
                          {boldSplit.map((text, sIdx) => sIdx % 2 === 1 ? <strong key={sIdx} className="font-black text-brand-navy-dark">{text}</strong> : text)}
                        </li>
                      );
                    }
                    if (/^\d+\./.test(cleanLine)) {
                      const boldSplit = cleanLine.replace(/^\d+\.\s*/, '').split('**');
                      return (
                        <li key={idx} className="ml-4 list-decimal pl-1 text-xs">
                          {boldSplit.map((text, sIdx) => sIdx % 2 === 1 ? <strong key={sIdx} className="font-black text-brand-navy-dark">{text}</strong> : text)}
                        </li>
                      );
                    }
                    if (!cleanLine) return <div key={idx} className="h-2" />;
                    
                    const boldSplit = cleanLine.split('**');
                    return (
                      <p key={idx} className="text-xs">
                        {boldSplit.map((text, sIdx) => sIdx % 2 === 1 ? <strong key={sIdx} className="font-black text-brand-navy-dark">{text}</strong> : text)}
                      </p>
                    );
                  })}
                </div>
              </motion.div>
            ) : (
              <div className="text-center py-12 text-gray-400 bg-gray-50/30 rounded-2xl border border-dashed text-xs font-semibold">
                No report has been compiled yet. Choose a reporting scope and click "Compile Report".
              </div>
            )}
          </motion.div>

          {/* Dynamic Timeline for Real-time Audit Activity logs & WebSocket integration */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 mt-8 relative overflow-hidden"
          >
            <ErrorBoundary name="Operational Activity Feed" title="Activity Feed Unavailable">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <span className="text-xl">⏱️</span>
                  <div>
                    <h4 className="text-lg font-bold text-brand-navy-dark">Operational Activity Feed</h4>
                    <p className="text-xs text-gray-400">Security violations and administrative activities, updated in real time via WebSockets</p>
                  </div>
                </div>
                <button
                  onClick={onRefreshActivities}
                  className="text-xs font-bold text-primary hover:text-amber-700 bg-primary/5 hover:bg-primary/10 px-4.5 py-2 rounded-full transition duration-300 flex items-center gap-1.5"
                >
                  <span>🔄</span> Refresh Feed
                </button>
              </div>

              {tabLoading ? (
                <div className="text-center py-12 text-gray-400">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
                  Loading activity timeline…
                </div>
              ) : !Array.isArray(activities) || activities.length === 0 ? (
                <div className="text-center py-12 text-gray-400 bg-gray-50/50 rounded-2xl border border-dashed">
                  No recent admin activity found.
                </div>
              ) : (
                <div className="relative pl-6 border-l-2 border-gray-100 space-y-6">
                  {activities.map((act, actIdx) => {
                    let icon = "✏️";
                    let cardStyle = "bg-gray-50/30 hover:bg-gray-50/80 border-gray-50";
                    const actionStr = String(act?.action || "");

                    if (actionStr.toLowerCase().includes("create") || actionStr.toLowerCase().includes("add") || actionStr.toLowerCase().includes("save")) {
                      icon = "➕";
                    }
                    if (actionStr.toLowerCase().includes("delete") || actionStr.toLowerCase().includes("remove")) {
                      icon = "❌";
                    }
                    if (actionStr.toLowerCase().includes("login") || actionStr.toLowerCase().includes("auth")) {
                      icon = "🔑";
                    }
                    if (actionStr.toUpperCase().includes("SECURITY_VIOLATION")) {
                      icon = "🚨";
                      cardStyle = "bg-red-50/40 hover:bg-red-50/80 border-red-100/50 text-red-900";
                    }

                    return (
                      <div key={act?.id || actIdx} className="relative group">
                        {/* Timeline Dot */}
                        <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-white border-2 border-primary flex items-center justify-center shadow-sm group-hover:scale-125 transition-transform duration-200">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                        </div>

                        <div className={`border rounded-2xl p-4 transition duration-200 ${cardStyle}`}>
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <span className="text-sm">{icon}</span>
                              <span className="font-bold text-brand-navy-dark text-sm">{actionStr || "Unknown Action"}</span>
                            </div>
                            <span className="text-xs text-gray-400 font-medium">
                              {formatDate(act.timestamp)}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                            Performed by <span className="font-semibold text-gray-700">{act.performedBy || act.username || "Unknown"}</span>
                          </p>
                          {act.details && (
                            <p className="text-[10px] bg-white/50 border border-black/5 rounded-lg p-1.5 mt-2 font-mono text-gray-500 max-w-full overflow-x-auto">
                              {act.details}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </ErrorBoundary>
          </motion.div>
        </>
      )}
    </motion.div>
  );
};

export default AnalyticsPanel;
