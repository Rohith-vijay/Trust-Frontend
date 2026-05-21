import React, { useState, useEffect } from "react";
import databaseService from "../services/databaseService";
import MemberCard from "./MemberCard";
import { motion } from "framer-motion";
import { Typography } from "@mui/material";

const TeamSection = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    databaseService
      .getTeamMembers()
      .then((data) => {
        const mapped = data.map((m) => ({
          id: m.id,
          name: m.name,
          role: m.role,
          bio: m.bio,
          photo: m.imageUrl || null,
          tagline: m.tagline || "",
          twitterUrl: m.twitterUrl || null,
          linkedinUrl: m.linkedinUrl || null,
          achievements: m.achievements || [],
          initials: (m.name || "")
            .split(" ")
            .map((w) => w[0])
            .join("")
            .toUpperCase()
            .slice(0, 2),
        }));
        setTeamMembers(mapped);
      })
      .catch((err) => console.error("Failed to load team members:", err))
      .finally(() => setLoading(false));
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <section className="py-24 bg-gray-50/30">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <Typography variant="h3" component="h2" align="center" sx={{ fontWeight: 800, color: 'primary.main', mb: 2 }}>
          Our Trust Members
        </Typography>
        <Typography variant="subtitle1" align="center" color="text.secondary" sx={{ mb: 10, maxWidth: 600, mx: 'auto' }}>
          The passionate team behind every initiative. Tap on a card to discover their journey and contributions.
        </Typography>
      </motion.div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading team members...</div>
      ) : (
        <motion.div
          className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 max-w-7xl mx-auto px-6 h-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {teamMembers.map((m) => (
            <motion.div key={m.id} variants={itemVariants} className="h-[400px]">
              <MemberCard member={m} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </section>
  );
};

export default TeamSection;
