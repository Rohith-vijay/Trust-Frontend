import { memo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

// Subcomponents
import HeroBackground from "./hero/HeroBackground";
import HeroOverlay from "./hero/HeroOverlay";
import HeroHeading from "./hero/HeroHeading";
import HeroDescription from "./hero/HeroDescription";
import HeroButtons from "./hero/HeroButtons";
import HeroImpactCards from "./hero/HeroImpactCards";
import HeroStats from "./hero/HeroStats";
import HeroMissionBadges from "./hero/HeroMissionBadges";
import ScrollIndicator from "./hero/ScrollIndicator";

import "./HeroSection.css";

const HeroSection = memo(function HeroSection() {
  const navigate = useNavigate();
  const [loaded, setLoaded] = useState(false);
  
  // Dynamic CMS Settings
  const [settings, setSettings] = useState({
    HOME_HERO_IMAGE: "/hero-bg-clean.jpg",
    HOME_HERO_TITLE: "TOGETHER, WE CAN BUILD A BETTER TOMORROW",
    HOME_HERO_SUBTITLE: "K.V.G. Shanmuka Sai Charitable Trust is committed to empowering lives, supporting communities, and creating lasting change through compassion, education, and service.",
    HOME_HERO_HIGHLIGHT: "A BETTER TOMORROW",
    HOME_HERO_CTA_TEXT: "Support Our Mission",
    HOME_HERO_CTA_LINK: "/donation",
    HOME_HERO_SECONDARY_TEXT: "JOIN US IN MAKING A DIFFERENCE",
    HOME_HERO_SECONDARY_LINK: "/volunteer",
    HOME_HERO_OPACITY: "0.35",
    HOME_HERO_STATS_LIVES: "1000+",
    HOME_HERO_STATS_PROJECTS: "50+",
    HOME_HERO_STATS_EDUCATION: "For a Better Future",
    HOME_HERO_STATS_VISION: "Stronger Together"
  });

  // Dynamic Impact Stats from DB
  const [impactData, setImpactData] = useState([]);

  useEffect(() => {
    // 1. Fetch CMS settings
    api.get("/public/settings/all")
      .then((res) => {
        const s = res.data || {};
        
        // Handle image mapping for backward compatibility:
        // If the backend has "/hero-portrait.png" or "/hero-new-collage.jpg" (which contains baked-in text),
        // we map it to "/hero-bg-clean.jpg" so the clean, dynamic overlay can render without text overlap.
        let bgImg = s.HOME_HERO_IMAGE || "/hero-bg-clean.jpg";
        if (bgImg === "/hero-portrait.png" || bgImg === "/hero-new-collage.jpg") {
          bgImg = "/hero-bg-clean.jpg";
        }

        setSettings({
          HOME_HERO_IMAGE:          bgImg,
          HOME_HERO_TITLE:          s.HOME_HERO_TITLE          || "TOGETHER, WE CAN BUILD A BETTER TOMORROW",
          HOME_HERO_SUBTITLE:       s.HOME_HERO_SUBTITLE       || "K.V.G. Shanmuka Sai Charitable Trust is committed to empowering lives, supporting communities, and creating lasting change through compassion, education, and service.",
          HOME_HERO_HIGHLIGHT:      s.HOME_HERO_HIGHLIGHT      || "A BETTER TOMORROW",
          HOME_HERO_CTA_TEXT:       s.HOME_HERO_CTA_TEXT       || "Support Our Mission",
          HOME_HERO_CTA_LINK:       s.HOME_HERO_CTA_LINK       || "/donation",
          HOME_HERO_SECONDARY_TEXT:  s.HOME_HERO_SECONDARY_TEXT  || "JOIN US IN MAKING A DIFFERENCE",
          HOME_HERO_SECONDARY_LINK:  s.HOME_HERO_SECONDARY_LINK  || "/volunteer",
          HOME_HERO_OPACITY:         s.HOME_HERO_OPACITY         || "0.35",
          HOME_HERO_STATS_LIVES:     s.HOME_HERO_STATS_LIVES     || "1000+",
          HOME_HERO_STATS_PROJECTS:  s.HOME_HERO_STATS_PROJECTS  || "50+",
          HOME_HERO_STATS_EDUCATION: s.HOME_HERO_STATS_EDUCATION || "For a Better Future",
          HOME_HERO_STATS_VISION:    s.HOME_HERO_STATS_VISION    || "Stronger Together"
        });
      })
      .catch((err) => console.error("Failed to load hero CMS settings:", err))
      .finally(() => setLoaded(true));

    // 2. Fetch live impact stats
    api.get("/impact-stats")
      .then((res) => {
        if (Array.isArray(res.data)) {
          setImpactData(res.data);
        }
      })
      .catch((err) => console.error("Failed to load impact stats inside hero:", err));
  }, []);

  // CTA Click handlers
  const handlePrimaryCTA = () => {
    const link = settings.HOME_HERO_CTA_LINK;
    if (link?.startsWith("http")) {
      window.open(link, "_blank", "noopener,noreferrer");
    } else {
      navigate(link || "/donation");
    }
  };

  const handleSecondaryCTA = () => {
    const link = settings.HOME_HERO_SECONDARY_LINK;
    if (link?.startsWith("http")) {
      window.open(link, "_blank", "noopener,noreferrer");
    } else {
      navigate(link || "/volunteer");
    }
  };

  // Helper function to extract and format live stats for dynamic cards
  const getDynamicImpactStat = (keyName, fallbackVal, fallbackLabel, fallbackDesc, fallbackIcon, iconColorClass) => {
    const matched = impactData.find(
      (item) => item.category?.toLowerCase() === keyName.toLowerCase() ||
                item.icon?.toLowerCase() === keyName.toLowerCase()
    );
    if (matched) {
      return {
        key: keyName,
        value: matched.currentValue !== undefined ? `${Number(matched.currentValue).toLocaleString("en-IN")}+` : fallbackVal,
        label: matched.category ? matched.category.replace(/_/g, " ") : fallbackLabel,
        description: matched.unit || fallbackDesc,
        icon: matched.icon || fallbackIcon,
        iconColorClass
      };
    }
    return {
      key: keyName,
      value: fallbackVal,
      label: fallbackLabel,
      description: fallbackDesc,
      icon: fallbackIcon,
      iconColorClass
    };
  };

  const row1Cards = [
    getDynamicImpactStat("water", "1,00,000+", "LITRES OF WATER", "Clean drinking water supplied.", "water_drop", "text-blue-500"),
    getDynamicImpactStat("trees", "2,500+", "TREES PLANTED", "Greening our planet for a better future.", "forest", "text-green-500"),
  ];

  const row2Cards = [
    getDynamicImpactStat("students", "500+", "STUDENTS SUPPORTED", "Supporting education and learning opportunities.", "school", "text-amber-500"),
    getDynamicImpactStat("carriages", "50+", "CARRIAGES DONATED", "Providing food support to people in need.", "restaurant", "text-red-500"),
  ];

  // Highlight specific text segment dynamically with gold-gradient
  const renderHeadline = (title, highlight) => {
    if (!highlight) return title;
    const index = title.toLowerCase().indexOf(highlight.toLowerCase());
    if (index === -1) return title;
    const before = title.substring(0, index);
    const matchedText = title.substring(index, index + highlight.length);
    const after = title.substring(index + highlight.length);
    return (
      <>
        {before}
        <span className="highlight">{matchedText}</span>
        {after}
      </>
    );
  };

  // Framer motion variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const childVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <section className="hero" id="hero">
      {/* 1. Sharp LCP Background Image */}
      <HeroBackground src={settings.HOME_HERO_IMAGE} alt="Community Collage Background" />

      {/* 2. Visual Gradients & Vignettes */}
      <HeroOverlay opacity={parseFloat(settings.HOME_HERO_OPACITY)} />

      {/* 3. Responsive Content Overlays */}
      <div className="hero__container">
        <div className="hero__grid">
          {/* Left column: Text, badges, impact cards, and action buttons */}
          <motion.div
            className="hero__left-col"
            variants={containerVariants}
            initial="hidden"
            animate={loaded ? "visible" : "hidden"}
          >
            {/* dynamic title */}
            <HeroHeading 
              text={renderHeadline(settings.HOME_HERO_TITLE, settings.HOME_HERO_HIGHLIGHT)}
              variants={childVariants}
            />

            {/* dynamic subtitle */}
            <HeroDescription 
              text={settings.HOME_HERO_SUBTITLE}
              variants={childVariants}
            />

            {/* dynamic badges */}
            <HeroMissionBadges variants={childVariants} />

            {/* dynamic impact cards Row 1 */}
            <HeroImpactCards 
              items={row1Cards}
              className="row1"
              variants={childVariants}
            />

            {/* CTA action buttons */}
            <HeroButtons
              primaryText={settings.HOME_HERO_CTA_TEXT}
              secondaryText={settings.HOME_HERO_SECONDARY_TEXT}
              onPrimaryClick={handlePrimaryCTA}
              onSecondaryClick={handleSecondaryCTA}
              variants={childVariants}
            />

            {/* dynamic impact cards Row 2 */}
            <HeroImpactCards 
              items={row2Cards}
              className="row2"
              variants={childVariants}
            />
          </motion.div>

          {/* Right column: Spacer to keep content on the left */}
          <div className="hero__right-col"></div>
        </div>

        {/* 4. Bottom Statistics bar */}
        <HeroStats
          lives={settings.HOME_HERO_STATS_LIVES}
          projects={settings.HOME_HERO_STATS_PROJECTS}
          education={settings.HOME_HERO_STATS_EDUCATION}
          vision={settings.HOME_HERO_STATS_VISION}
          variants={childVariants}
        />
      </div>

      {/* 5. Scroll helper indicator */}
      <ScrollIndicator />
    </section>
  );
});

export default HeroSection;
