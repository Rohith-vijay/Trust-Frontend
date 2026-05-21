import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { pageVariants, pageTransition } from "../constants/motionVariants";
import { useNavigate } from "react-router-dom";
import databaseService from "../services/databaseService";
import { Typography, Card, CardContent, Button, CircularProgress } from "@mui/material";
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import HandshakeIcon from '@mui/icons-material/Handshake';

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
  const [heroSubtitle, setHeroSubtitle] = useState("We imagine a world where every community thrives through education, health, and opportunity.");
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
          } catch (e) {}
        }
        if (content.VISION_ROADMAP) {
          const lines = content.VISION_ROADMAP.split("\n").map(l => l.trim()).filter(Boolean);
          if (lines.length > 0) setRoadmap(lines);
        }
        if (content.VISION_IMPACTS) {
          try {
            const parsed = JSON.parse(content.VISION_IMPACTS);
            if (Array.isArray(parsed) && parsed.length > 0) setImpacts(parsed);
          } catch (e) {}
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
      <div className="flex flex-col justify-center items-center py-32 min-h-screen">
        <CircularProgress size={48} thickness={4} />
        <Typography sx={{ mt: 3, color: 'text.secondary' }}>Loading vision...</Typography>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={pageTransition}
      className="bg-gray-50 text-dark min-h-screen"
    >
      {/* Hero */}
      <section className="relative text-center py-32 overflow-hidden bg-white">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5" />
        <motion.div 
          className="relative z-10 max-w-4xl mx-auto px-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Typography variant="h2" component="h1" sx={{ fontWeight: 900, color: 'primary.main', mb: 3, fontSize: { xs: '2.5rem', md: '4rem' } }}>
            {heroTitle}
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 400, lineHeight: 1.6 }}>
            {heroSubtitle}
          </Typography>
        </motion.div>
      </section>

      {/* Mission statement */}
      {mission && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="py-16 px-6 max-w-4xl mx-auto -mt-10 relative z-20"
        >
          <Card elevation={0} sx={{ borderRadius: 6, p: { xs: 4, md: 6 }, boxShadow: '0 20px 40px rgba(0,0,0,0.05)', border: '1px solid rgba(0,0,0,0.03)' }}>
            <Typography variant="h5" sx={{ fontStyle: 'italic', color: 'text.primary', lineHeight: 1.8, textAlign: 'center', fontWeight: 500 }}>
              "{mission}"
            </Typography>
          </Card>
        </motion.section>
      )}

      <div className="max-w-7xl mx-auto px-6 py-16 space-y-32">
        {/* Long-term goals */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <Typography variant="h3" component="h2" align="center" sx={{ fontWeight: 800, color: 'primary.main', mb: 8 }}>
            Long‑Term Goals
          </Typography>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {pillars.map((p, idx) => (
              <motion.div key={idx} variants={itemVariants} whileHover={{ y: -5 }}>
                <Card elevation={0} sx={{ height: '100%', borderRadius: 4, border: '1px solid rgba(0,0,0,0.06)', transition: 'box-shadow 0.3s ease', '&:hover': { boxShadow: '0 10px 30px rgba(0,0,0,0.08)' } }}>
                  <CardContent sx={{ p: 4 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary', mb: 2 }}>{p.title}</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>{p.desc}</Typography>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Roadmap & Impacts */}
        <div className="grid lg:grid-cols-2 gap-16">
          <motion.section
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Typography variant="h4" component="h2" sx={{ fontWeight: 800, color: 'primary.main', mb: 6 }}>
              5‑Year Roadmap
            </Typography>
            <div className="relative pl-6 space-y-8 border-l-2 border-primary/20">
              {roadmap.map((item, idx) => (
                <div key={idx} className="relative">
                  <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-primary border-4 border-white" />
                  <Typography variant="body1" sx={{ fontWeight: 500, color: 'text.primary' }}>{item}</Typography>
                </div>
              ))}
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Typography variant="h4" component="h2" sx={{ fontWeight: 800, color: 'primary.main', mb: 6 }}>
              Impact Projections
            </Typography>
            <div className="grid grid-cols-2 gap-6">
              {impacts.map((i, idx) => (
                <Card key={idx} elevation={0} sx={{ borderRadius: 4, bgcolor: 'primary.50', border: '1px solid rgba(0,0,0,0.03)' }}>
                  <CardContent sx={{ p: 3, textAlign: 'center' }}>
                    <Typography variant="h4" sx={{ fontWeight: 900, color: 'primary.main', mb: 1 }}>{i.value}</Typography>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 1 }}>{i.label}</Typography>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.section>
        </div>

        {/* CTA */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center py-16 bg-white rounded-3xl border border-gray-100 shadow-sm"
        >
          <Typography variant="h3" sx={{ fontWeight: 800, color: 'text.primary', mb: 2 }}>
            Be Part of the Vision
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 6, maxWidth: 500, mx: 'auto' }}>
            Your support can accelerate our journey and touch countless more lives.
          </Typography>
          <div className="flex justify-center flex-wrap gap-4 px-4">
            <Button
              variant="contained"
              color="primary"
              size="large"
              startIcon={<HandshakeIcon />}
              onClick={() => navigate("/volunteer")}
              sx={{ borderRadius: 8, px: 4, py: 1.5, fontWeight: 700, textTransform: 'none' }}
            >
              Become a Volunteer
            </Button>
            <Button
              variant="outlined"
              color="primary"
              size="large"
              startIcon={<VolunteerActivismIcon />}
              onClick={() => navigate("/donation")}
              sx={{ borderRadius: 8, px: 4, py: 1.5, fontWeight: 700, textTransform: 'none', borderWidth: 2, '&:hover': { borderWidth: 2 } }}
            >
              Donate Now
            </Button>
          </div>
        </motion.section>
      </div>
    </motion.div>
  );
}

export default Vision;
