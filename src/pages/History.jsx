import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { pageVariants, pageTransition } from "../constants/motionVariants";
import databaseService from "../services/databaseService";

// Default milestones shown when no backend data exists yet
const DEFAULT_MILESTONES = [
  {
    date: "24 October 2025",
    event: "Trust Founded",
    description:
      "K.V.G Shanmuka Sai Charitable Trust was officially founded with a mission to bring hope, education, clean water, and essential resources to communities in need.",
  },
  {
    date: "30 October 2025",
    event: "First Major Event — Mr. K.V.G.S. Sai's Birthday",
    description:
      "On the auspicious occasion of Mr. K.V.G.S. Sai's birthday, the trust organized its first major community event. Free tuition classes for underprivileged children were inaugurated on this day, marking the beginning of the trust's education mission.",
  },
  {
    date: "12 December 2025",
    event: "Water Plant Inaugurated",
    description:
      "The trust inaugurated a community water purification plant, providing free clean drinking water to thousands of villagers. This milestone reinforced the trust's commitment to public health and sustainable community service.",
  },
  {
    date: "2026",
    event: "Ongoing — Expanding Impact",
    description:
      "The trust continues its tree plantation drives, educational programs, and water distribution initiatives, expanding services to reach more communities and transform more lives.",
  },
];

function History() {
  const [pageTitle, setPageTitle] = useState("Our History");
  const [pageSubtitle, setPageSubtitle] = useState(
    "The journey of K.V.G Shanmuka Sai Charitable Trust from its founding to today."
  );
  const [milestones, setMilestones] = useState(DEFAULT_MILESTONES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const content = await databaseService.getAllPageContent();

        if (content.HISTORY_TITLE) setPageTitle(content.HISTORY_TITLE);
        if (content.HISTORY_SUBTITLE) setPageSubtitle(content.HISTORY_SUBTITLE);

        if (content.HISTORY_MILESTONES) {
          try {
            const parsed = JSON.parse(content.HISTORY_MILESTONES);
            if (Array.isArray(parsed) && parsed.length > 0) {
              setMilestones(parsed);
            }
          } catch (e) {
            // JSON parse error — keep defaults, don't crash
            console.warn("Could not parse HISTORY_MILESTONES, using defaults");
          }
        }
      } catch (err) {
        // Network/API error — keep defaults, don't crash
        console.error("Failed to fetch history content:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={pageTransition}
      className="py-20 px-6 max-w-4xl mx-auto bg-warmBg text-dark"
    >
      <h1 className="text-4xl font-bold mb-4 text-center text-primary">
        {pageTitle}
      </h1>
      <p className="text-center text-gray-500 mb-12 max-w-lg mx-auto">
        {pageSubtitle}
      </p>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      ) : (
        /* Timeline */
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-primary/20" />

          <div className="space-y-10">
            {milestones.map((item, index) => (
              <motion.div
                key={index}
                className="relative pl-16"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
              >
                {/* Dot */}
                <div className="absolute left-4 top-1 w-5 h-5 rounded-full bg-primary border-4 border-warmBg" />

                {/* Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                  <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                    {item.date}
                  </span>
                  <h2 className="text-xl font-bold text-gray-800 mt-1">
                    {item.event}
                  </h2>
                  <p className="mt-2 text-gray-600 text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}

export default History;
