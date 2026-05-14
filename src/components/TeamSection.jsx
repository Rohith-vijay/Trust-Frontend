import React, { useState, useEffect } from "react";
import databaseService from "../services/databaseService";
import MemberCard from "./MemberCard";
import { motion } from "framer-motion";
import { sectionVariants } from "../constants/motionVariants";

const TeamSection = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    databaseService
      .getTeamMembers()
      .then((data) => {
        // Map backend keys to what MemberCard expects
        const mapped = data.map((m) => ({
          id: m.id,
          name: m.name,
          role: m.role,
          bio: m.bio,
          // Backend returns camelCase imageUrl
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

  return (
    <section className="py-24">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-primary">
        Our Trust Members
      </h2>
      <p className="text-center text-gray-500 mb-14 max-w-lg mx-auto">
        The passionate team behind every initiative. Click on a card to learn more.
      </p>

      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading team members...</div>
      ) : (
        <motion.div
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto px-4"
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
        >
          {teamMembers.map((m) => (
            <MemberCard key={m.id} member={m} />
          ))}
        </motion.div>
      )}
    </section>
  );
};

export default TeamSection;
