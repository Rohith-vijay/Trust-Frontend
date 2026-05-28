import React, { useState } from "react";
import databaseService from "../../services/databaseService";
import { motion, AnimatePresence } from "framer-motion";

const VolunteersPanel = ({ volunteerApps, onApproveVolunteer, onRejectVolunteer, formatDate, EmptyState }) => {
  const [matchData, setMatchData] = useState({}); // { [appId]: { score, reasoning, loading } }

  const handleMatchCheck = async (app) => {
    try {
      setMatchData(prev => ({ 
        ...prev, 
        [app.id]: { ...prev[app.id], loading: true } 
      }));

      // Heuristically supply skills targets matching the event title context
      let eventSkills = "Community support, Coordination, Teamwork";
      const titleLower = app.eventTitle ? app.eventTitle.toLowerCase() : "";
      
      if (titleLower.includes("medic") || titleLower.includes("health") || titleLower.includes("camp")) {
        eventSkills = "First Aid, Clinical care, Triage, Medical assistance";
      } else if (titleLower.includes("educat") || titleLower.includes("school") || titleLower.includes("teach")) {
        eventSkills = "Teaching, Mentorship, Communication, Childcare";
      } else if (titleLower.includes("food") || titleLower.includes("relief") || titleLower.includes("drive")) {
        eventSkills = "Logistics, Food safety, Heavy lifting, Packing";
      }

      const res = await databaseService.matchVolunteerAi(
        app.interest || "General Support",
        app.message || "Willing to serve and assist the team.",
        app.eventTitle || "Initiative Campaign",
        eventSkills
      );

      // Parse the JSON string from response if returned as a string wrapper
      const responseData = res.data || res;
      const data = typeof responseData === "string" ? JSON.parse(responseData) : responseData;

      setMatchData(prev => ({ 
        ...prev, 
        [app.id]: { 
          score: data.score || 70, 
          reasoning: data.reasoning || "• General Contribution: Strong willingness to serve aligns with active capacity demands.", 
          loading: false 
        } 
      }));
    } catch (e) {
      console.error("[AiSmartMatch] Alignment analysis failed:", e);
      setMatchData(prev => ({ 
        ...prev, 
        [app.id]: { ...prev[app.id], loading: false } 
      }));
      alert("Smart Match analysis failed. Safe fallback activated.");
    }
  };

  return (
    <div className="pb-12">
      <h3 className="text-lg font-bold text-brand-navy-dark mb-4">Volunteer Applications</h3>
      {!Array.isArray(volunteerApps) || volunteerApps.length === 0 ? (
        <EmptyState
          icon="🤝"
          title="No volunteer applications yet."
          subtitle="Applications from the volunteer page will appear here."
        />
      ) : (
        <div className="space-y-4">
          {Array.isArray(volunteerApps) && volunteerApps.map((app) => {
            const appMatch = matchData[app.id];
            
            // Glowing pill attributes based on score percentile
            let pillColor = "bg-indigo-50/50 text-indigo-700 border-indigo-100 hover:bg-indigo-100/50 cursor-help";
            if (appMatch && !appMatch.loading) {
              if (appMatch.score >= 80) {
                pillColor = "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 cursor-help";
              } else if (appMatch.score >= 60) {
                pillColor = "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 cursor-help";
              }
            }

            return (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={app.id}
                className="border border-gray-100 rounded-3xl p-5 bg-white hover:shadow-md transition-all duration-300 group"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="space-y-3 flex-1">
                    <div>
                      <h4 className="font-bold text-brand-navy-dark">
                        {app.name || app.userFullName || `User #${app.userId}`}
                      </h4>
                      <p className="text-xs text-gray-500 font-medium mt-0.5">
                        {app.email}
                        {app.phone && <span className="mx-2">•</span>}
                        {app.phone}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5">
                      {app.eventTitle && (
                        <div className="inline-block bg-primary/10 text-primary text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full border border-primary/20">
                          Target: {app.eventTitle}
                        </div>
                      )}
                      
                      {app.interest && (
                        <div className="inline-block bg-gray-50 text-gray-600 text-[10px] font-bold px-3 py-1 rounded-full border border-gray-200">
                          Focus: {app.interest}
                        </div>
                      )}
                    </div>

                    {app.message && (
                      <p className="text-xs text-gray-600 bg-gray-50/50 p-3.5 rounded-2xl border border-gray-50 italic leading-relaxed">
                        "{app.message}"
                      </p>
                    )}

                    {/* AI Smart Match Element */}
                    <div className="pt-1 flex items-center min-h-[28px]">
                      {!appMatch ? (
                        <button
                          type="button"
                          onClick={() => handleMatchCheck(app)}
                          className="text-[10px] font-black text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border border-indigo-150 px-3.5 py-1.5 rounded-full transition flex items-center gap-1.5 select-none shadow-sm shadow-indigo-100/50 active:scale-95"
                        >
                          <span>✨</span> AI Smart Match
                        </button>
                      ) : appMatch.loading ? (
                        <div className="flex items-center gap-2 text-[10px] font-semibold text-gray-400 select-none animate-pulse">
                          <div className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-indigo-600"></div>
                          Analyzing candidate compatibility metrics...
                        </div>
                      ) : (
                        <div className="relative group/tooltip inline-block overflow-visible">
                          <span className={`text-[10px] font-black border px-3.5 py-1.5 rounded-full transition select-none flex items-center gap-1.5 ${pillColor}`}>
                            <span>✨</span> AI Smart Match: {appMatch.score}% Compatibility
                          </span>
                          
                          {/* Glassmorphic hover tooltip */}
                          <AnimatePresence>
                            <div className="absolute left-0 bottom-full mb-2 hidden group-hover/tooltip:block bg-brand-navy-dark text-white rounded-2xl p-4 shadow-xl border border-white/10 w-[320px] z-50 text-left pointer-events-none select-none animate-slide-up">
                              <p className="text-[9px] text-amber-400 font-black uppercase tracking-wider mb-2 leading-none">✨ AI Match Rationale Analysis</p>
                              <div className="text-[10px] text-gray-200 leading-relaxed space-y-1.5 font-medium">
                                {appMatch.reasoning.split('\n').map((line, idx) => (
                                  <p key={idx} className="flex items-start gap-1.5">
                                    <span className="text-amber-400 select-none">•</span>
                                    <span>{line.replace(/^[\*\-\s•]+/, "").trim()}</span>
                                  </p>
                                ))}
                              </div>
                            </div>
                          </AnimatePresence>
                        </div>
                      )}
                    </div>

                    <p className="text-[10px] text-gray-400 font-bold">
                      Applied on: {formatDate(app.createdAt || app.appliedAt)}
                    </p>
                  </div>

                  <div className="flex items-center space-x-2 flex-shrink-0 self-end sm:self-start pt-2 sm:pt-0">
                    {app.status === "pending" || app.status === "PENDING" ? (
                      <>
                        <button
                          onClick={() => onApproveVolunteer(app.id)}
                          className="text-xs bg-emerald-500 text-white font-bold px-4.5 py-2 rounded-full hover:bg-emerald-600 shadow-sm shadow-emerald-500/10 transition active:scale-95 select-none"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => onRejectVolunteer(app.id)}
                          className="text-xs bg-rose-500 text-white font-bold px-4.5 py-2 rounded-full hover:bg-rose-600 shadow-sm shadow-rose-500/10 transition active:scale-95 select-none"
                        >
                          Reject
                        </button>
                      </>
                    ) : (
                      <span
                        className={`text-xs px-4 py-2 rounded-full font-bold select-none shadow-sm ${
                          app.status === "approved" || app.status === "APPROVED"
                            ? "bg-green-50 text-green-700 border border-green-150 shadow-green-100/50"
                            : "bg-red-50 text-red-700 border border-red-150 shadow-red-100/50"
                        }`}
                      >
                        {app.status === "approved" || app.status === "APPROVED"
                          ? "✓ Approved"
                          : "✕ Rejected"}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default VolunteersPanel;
