import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { pageVariants, pageTransition } from "../constants/motionVariants";
import databaseService from "../services/databaseService";
import { Typography, Paper, CircularProgress } from "@mui/material";

const DEFAULT_MILESTONES = [
  { date: "24 October 2025", event: "Trust Founded", description: "K.V.G Shanmuka Sai Charitable Trust was officially founded with a mission to bring hope, education, clean water, and essential resources to communities in need." },
  { date: "30 October 2025", event: "First Major Event", description: "Free tuition classes for underprivileged children were inaugurated on this day, marking the beginning of the trust's education mission." },
  { date: "12 December 2025", event: "Water Plant Inaugurated", description: "The trust inaugurated a community water purification plant, providing free clean drinking water to thousands of villagers." },
  { date: "2026", event: "Expanding Impact", description: "The trust continues its tree plantation drives, educational programs, and water distribution initiatives, expanding services to reach more communities." },
];

function History() {
  const [pageTitle, setPageTitle] = useState("Our History");
  const [pageSubtitle, setPageSubtitle] = useState("The journey of K.V.G Shanmuka Sai Charitable Trust from its founding to today.");
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
            if (Array.isArray(parsed) && parsed.length > 0) setMilestones(parsed);
          } catch (e) {
            console.warn("Could not parse HISTORY_MILESTONES, using defaults");
          }
        }
      } catch (err) {
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
      className="py-24 px-6 max-w-5xl mx-auto min-h-screen"
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-16"
      >
        <Typography variant="h3" component="h1" align="center" sx={{ fontWeight: 800, color: 'primary.main', mb: 2 }}>
          {pageTitle}
        </Typography>
        <Typography variant="subtitle1" align="center" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto', lineHeight: 1.6 }}>
          {pageSubtitle}
        </Typography>
      </motion.div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <CircularProgress size={48} thickness={4} />
          <Typography sx={{ mt: 3, color: 'text.secondary' }}>Loading history...</Typography>
        </div>
      ) : (
        <div className="relative mt-12 max-w-4xl mx-auto">
          {/* Vertical line */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-primary/50 via-primary/20 to-transparent transform md:-translate-x-1/2 rounded-full" />

          <div className="space-y-12">
            {milestones.map((item, index) => {
              const isEven = index % 2 === 0;
              return (
                <motion.div
                  key={index}
                  className={`relative flex flex-col md:flex-row items-center ${isEven ? 'md:flex-row-reverse' : ''}`}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  {/* Dot */}
                  <div className="absolute left-6 md:left-1/2 w-5 h-5 rounded-full bg-primary border-4 border-white shadow-md transform -translate-x-1/2 z-10" />

                  {/* Content space (empty on one side) */}
                  <div className="hidden md:block w-1/2" />

                  {/* Card */}
                  <div className={`w-full md:w-1/2 pl-16 md:pl-0 ${isEven ? 'md:pr-12' : 'md:pl-12'}`}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 4,
                        borderRadius: 4,
                        border: '1px solid rgba(0,0,0,0.05)',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.04)',
                        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-5px)',
                          boxShadow: '0 20px 40px rgba(0,0,0,0.08)'
                        }
                      }}
                    >
                      <Typography variant="overline" sx={{ fontWeight: 800, color: 'primary.main', letterSpacing: 1.2 }}>
                        {item.date}
                      </Typography>
                      <Typography variant="h5" component="h2" sx={{ fontWeight: 700, mt: 1, mb: 2, color: 'text.primary' }}>
                        {item.event}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                        {item.description}
                      </Typography>
                      {item.imageUrl && (
                        <div className="mt-4 overflow-hidden rounded-xl">
                          <img src={item.imageUrl} alt={item.event} className="w-full h-auto object-cover hover:scale-105 transition-transform duration-500" />
                        </div>
                      )}
                    </Paper>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}
    </motion.div>
  );
}

export default History;
