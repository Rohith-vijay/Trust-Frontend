import { memo, useState, useEffect, useRef } from "react";
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
import HeroLeaderboard from "./hero/HeroLeaderboard";

import "./HeroSection.css";

// Bundled brand film (muted, looping). One 16:9 file serves every device; object-fit keeps it framed.
// Admins can override via the HOME_HERO_VIDEO / HOME_HERO_VIDEO_PORTRAIT CMS settings.
const DEFAULT_VIDEO = "/hero/hero.mp4";
const DEFAULT_VIDEO_PORTRAIT = "/hero/hero-portrait.mp4";
const DEFAULT_POSTER_PORTRAIT = "/hero/hero-portrait-poster.jpg";
const DEFAULT_POSTER = "/hero/hero-poster.jpg";

const HeroSection = memo(function HeroSection() {
  const navigate = useNavigate();
  const [loaded, setLoaded] = useState(false);
  const heroRef = useRef(null);
  const [muted, setMuted] = useState(true);
  const [filmState, setFilmState] = useState("intro");
  const [atTop, setAtTop] = useState(true);

  // While the film plays its first pass (and the page is at the top) the header turns see-through
  useEffect(() => {
    const onScroll = () => setAtTop(window.scrollY < 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
    const root = document.documentElement;
    if (filmState === "intro" && atTop) root.dataset.heroFilm = "intro";
    else delete root.dataset.heroFilm;
    return () => delete root.dataset.heroFilm;
  }, [filmState, atTop]);

  // The fixed header is taller than the 64px the page reserves for it, which hid the top of the
  // film. Measure the real header height and let the CSS start the film exactly below it.
  useEffect(() => {
    const hero = heroRef.current;
    const nav = document.querySelector("nav.fixed, header.fixed, nav");
    if (!hero || !nav) return undefined;
    const apply = () => {
      const navH = nav.offsetHeight;
      // Layout position (immune to page-transition transforms), without the desktop pull-up behind the header
      let top = -(parseFloat(getComputedStyle(hero).marginTop) || 0);
      for (let el = hero; el; el = el.offsetParent) top += el.offsetTop;
      hero.style.setProperty("--hero-top", `${Math.round(top)}px`);
      hero.style.setProperty("--nav-gap", `${Math.max(0, Math.round(navH - top))}px`); // part hidden behind the header
      hero.style.setProperty("--nav-h", `${Math.round(Math.max(navH, top))}px`); // chrome above the film
    };
    apply();
    if (typeof ResizeObserver === "undefined") return undefined;
    const ro = new ResizeObserver(apply);
    ro.observe(nav);
    ro.observe(document.body); // re-measure when anything above the hero changes size
    window.addEventListener("resize", apply);
    // Page-transition animations can shift the section after mount: re-measure once they settle
    const timers = [400, 1200, 2500].map((ms) => setTimeout(apply, ms));
    return () => {
      timers.forEach(clearTimeout);
      ro.disconnect();
      window.removeEventListener("resize", apply);
    };
  }, []);
  
  // Dynamic CMS Settings
  const [settings, setSettings] = useState({
    HOME_HERO_IMAGE: "/hero-bg-clean.jpg",
    HOME_HERO_VIDEO: DEFAULT_VIDEO,
    HOME_HERO_VIDEO_PORTRAIT: DEFAULT_VIDEO_PORTRAIT,
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
          HOME_HERO_VIDEO:          s.HOME_HERO_VIDEO          || DEFAULT_VIDEO,
          HOME_HERO_VIDEO_PORTRAIT: s.HOME_HERO_VIDEO_PORTRAIT || DEFAULT_VIDEO_PORTRAIT,
          HOME_HERO_TITLE:          s.HOME_HERO_TITLE          || "TOGETHER, WE CAN BUILD A BETTER TOMORROW",
          HOME_HERO_SUBTITLE:       (s.HOME_HERO_SUBTITLE || "").trim().length >= 10 ? s.HOME_HERO_SUBTITLE : "K.V.G. Shanmuka Sai Charitable Trust is committed to empowering lives, supporting communities, and creating lasting change through compassion, education, and service.",
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

  const impactCards = [
    getDynamicImpactStat("water", "1,00,000+", "LITRES OF WATER", "Clean drinking water supplied.", "water_drop", "text-blue-500"),
    getDynamicImpactStat("trees", "2,500+", "TREES PLANTED", "Greening our planet for a better future.", "forest", "text-green-500"),
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
    <section className="hero" id="hero" ref={heroRef}>
      {/* Stage: the film, with copy on the left and the live feed bottom-right, all over the video */}
      <div className="hero__stage">
        <HeroBackground
          src={settings.HOME_HERO_IMAGE}
          alt="Community Collage Background"
          videoLandscape={settings.HOME_HERO_VIDEO}
          videoPortrait={settings.HOME_HERO_VIDEO_PORTRAIT}
          posterLandscape={settings.HOME_HERO_VIDEO === DEFAULT_VIDEO ? DEFAULT_POSTER : settings.HOME_HERO_IMAGE}
          posterPortrait={settings.HOME_HERO_VIDEO_PORTRAIT === DEFAULT_VIDEO_PORTRAIT ? DEFAULT_POSTER_PORTRAIT : settings.HOME_HERO_IMAGE}
          muted={muted}
          onMutedChange={setMuted}
          onFilmState={setFilmState}
        />

        <button
          type="button"
          className="hero__sound"
          onClick={() => setMuted((m) => !m)}
          aria-label={muted ? "Turn sound on" : "Turn sound off"}
          aria-pressed={!muted}
        >
          {muted ? (
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><path d="M3 9v6h4l5 5V4L7 9H3zm13.6 3 2.4-2.4-1.4-1.4-2.4 2.4-2.4-2.4-1.4 1.4 2.4 2.4-2.4 2.4 1.4 1.4 2.4-2.4 2.4 2.4 1.4-1.4L16.6 12z"/></svg>
          ) : (
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0 0 14 8v8a4.5 4.5 0 0 0 2.5-4zM14 3.2v2.1a7 7 0 0 1 0 13.4v2.1a9 9 0 0 0 0-17.6z"/></svg>
          )}
          <span>{muted ? "Sound on" : "Sound off"}</span>
        </button>

        <HeroOverlay opacity={parseFloat(settings.HOME_HERO_OPACITY)} />

        <div className="hero__container">
          <motion.div
            className="hero__left-col"
            variants={containerVariants}
            initial="hidden"
            animate={loaded ? "visible" : "hidden"}
          >
            <HeroHeading
              text={renderHeadline(settings.HOME_HERO_TITLE, settings.HOME_HERO_HIGHLIGHT)}
              variants={childVariants}
            />
            <HeroDescription text={settings.HOME_HERO_SUBTITLE} variants={childVariants} />
            <HeroButtons
              primaryText={settings.HOME_HERO_CTA_TEXT}
              secondaryText={settings.HOME_HERO_SECONDARY_TEXT}
              onPrimaryClick={handlePrimaryCTA}
              onSecondaryClick={handleSecondaryCTA}
              variants={childVariants}
            />
          </motion.div>
        </div>

        {/* Live donations: bottom-right over the video */}
        <div className="hero__lb-slot">
          <HeroLeaderboard />
        </div>
      </div>

      {/* Numbers band: sits below the film so it never covers the film's own captions */}
      <div className="hero__band">
        <HeroImpactCards items={impactCards} className="hero__band-cards" variants={childVariants} />
        <HeroStats
          lives={settings.HOME_HERO_STATS_LIVES}
          projects={settings.HOME_HERO_STATS_PROJECTS}
          education={settings.HOME_HERO_STATS_EDUCATION}
          vision={settings.HOME_HERO_STATS_VISION}
          variants={childVariants}
        />
      </div>
    </section>
  );
});

export default HeroSection;
