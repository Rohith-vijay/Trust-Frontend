import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { pageVariants, pageTransition, sectionVariants, cardHover } from "../constants/motionVariants";
import { useNavigate } from "react-router-dom";
import databaseService from "../services/databaseService";

const DEFAULT_PILLARS = [
  { title: "Education Expansion", desc: "Increasing access to quality education in underserved regions." },
  { title: "Rural Development", desc: "Empowering villages with infrastructure and resources." },
  { title: "Health Access", desc: "Bringing essential medical services to remote areas." },
  { title: "Skill Empowerment", desc: "Training youth and women for sustainable livelihoods." },
  { title: "Women & Youth Programs", desc: "Focused initiatives to uplift women and young leaders." },
  { title: "Sustainable Communities", desc: "Building models that the community can sustain independently." },
];

const DEFAULT_ROADMAP = [
  "Year 1 – Expand to 3 districts",
  "Year 2 – Launch digital education initiative",
  "Year 3 – Establish health outreach network",
  "Year 4 – Youth skill development centers",
  "Year 5 – Sustainable funding & self-managed programs",
];

const DEFAULT_IMPACTS = [
  { label: "Beneficiaries", value: "100k+" },
  { label: "Volunteers", value: "10k+" },
  { label: "Funding Goal", value: "₹5Cr" },
  { label: "Self-Sufficiency", value: "80% by 2030" },
];

function Vision() {
  const navigate = useNavigate();

  const [heroTitle, setHeroTitle] = useState("Our Vision for the Future");
  const [heroSubtitle, setHeroSubtitle] = useState(
    "We imagine a world where every community thrives through education, health, and opportunity—driven by compassion and clear goals."
  );
  const [mission, setMission] = useState("");
  const [pillars, setPillars] = useState(DEFAULT_PILLARS);
  const [roadmap, setRoadmap] = useState(DEFAULT_ROADMAP);
  const [impacts, setImpacts] = useState(DEFAULT_IMPACTS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const content = await databaseService.getAllPageContent();

        if (content.VISION_HERO_TITLE) setHeroTitle(content.VISION_HERO_TITLE);
        if (content.VISION_HERO_SUBTITLE) setHeroSubtitle(content.VISION_HERO_SUBTITLE);
        if (content.VISION_MISSION) setMission(content.VISION_MISSION);

        if (content.VISION_PILLARS) {
          try {
            const parsed = JSON.parse(content.VISION_PILLARS);
            if (Array.isArray(parsed) && parsed.length > 0) setPillars(parsed);
          } catch (e) {
            console.warn("Could not parse VISION_PILLARS, using defaults");
          }
        }

        if (content.VISION_ROADMAP) {
          const lines = content.VISION_ROADMAP.split("\n").map(l => l.trim()).filter(Boolean);
          if (lines.length > 0) setRoadmap(lines);
        }

        if (content.VISION_IMPACTS) {
          try {
            const parsed = JSON.parse(content.VISION_IMPACTS);
            if (Array.isArray(parsed) && parsed.length > 0) setImpacts(parsed);
          } catch (e) {
            console.warn("Could not parse VISION_IMPACTS, using defaults");
          }
        }
      } catch (err) {
        console.error("Failed to fetch vision content:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-32">
        <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={pageTransition}
      className="py-20 bg-warmBg text-dark"
    >
      {/* Hero */}
      <motion.section
        variants={sectionVariants}
        className="relative text-center py-32 bg-logo-glow"
      >
        <div className="absolute inset-0 bg-logo-glow" />
        <div className="relative z-10 max-w-3xl mx-auto px-6">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 text-primary">
            {heroTitle}
          </h1>
          <p className="text-lg md:text-xl opacity-90">
            {heroSubtitle}
          </p>
        </div>
      </motion.section>

      {/* Mission statement */}
      {mission && (
        <motion.section
          variants={sectionVariants}
          className="py-12 px-6 max-w-3xl mx-auto text-center"
        >
          <p className="text-lg text-gray-700 leading-relaxed italic border-l-4 border-primary pl-4 text-left">
            {mission}
          </p>
        </motion.section>
      )}

      {/* Long-term goals */}
      <motion.section
        variants={sectionVariants}
        className="py-20 px-6 max-w-6xl mx-auto"
      >
        <h2 className="text-3xl font-bold text-center mb-12 text-primary">
          Long‑Term Goals
        </h2>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {pillars.map((p, idx) => (
            <motion.div
              key={idx}
              className="bg-white p-6 rounded-lg shadow-md"
              whileHover={cardHover}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-xl font-semibold mb-2 text-primary">
                {p.title}
              </h3>
              <p className="text-gray-700 text-sm">{p.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Roadmap */}
      <motion.section
        variants={sectionVariants}
        className="py-20 px-6 max-w-4xl mx-auto"
      >
        <h2 className="text-3xl font-bold text-center mb-12 text-primary">
          5‑Year Roadmap
        </h2>
        <ol className="border-l-2 border-primary ml-4 space-y-6">
          {roadmap.map((item, idx) => (
            <li key={idx} className="pl-4">
              <p className="text-gray-700">{item}</p>
            </li>
          ))}
        </ol>
      </motion.section>

      {/* Impact Projection */}
      <motion.section
        variants={sectionVariants}
        className="py-20 px-6 max-w-5xl mx-auto bg-neutralLight rounded-lg"
      >
        <h2 className="text-3xl font-bold text-center mb-12 text-primary">
          Impact Projections
        </h2>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 text-center">
          {impacts.map((i, idx) => (
            <div key={idx}>
              <p className="text-2xl font-bold text-primary">{i.value}</p>
              <p className="text-gray-600 text-sm">{i.label}</p>
            </div>
          ))}
        </div>
      </motion.section>

      {/* CTA */}
      <motion.section
        variants={sectionVariants}
        className="py-20 text-center"
      >
        <h2 className="text-3xl font-bold mb-6 text-primary">
          Be Part of the Vision
        </h2>
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => navigate("/volunteer")}
            className="bg-primary text-white px-6 py-3 rounded-lg hover:brightness-90 transition"
          >
            Volunteer
          </button>
          <button
            onClick={() => navigate("/donation")}
            className="bg-primary text-white px-6 py-3 rounded-lg hover:brightness-90 transition"
          >
            Donate
          </button>
        </div>
      </motion.section>
    </motion.div>
  );
}

export default Vision;
