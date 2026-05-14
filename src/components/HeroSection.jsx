import { memo, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./HeroSection.css";

/**
 * HeroSection — full-screen hero with 3D tilt + zoom on scroll.
 * All content (image, headline, subtitle, CTA) is fetched from
 * the backend system_settings table — fully admin-controlled.
 */
const HeroSection = memo(function HeroSection() {
    const navigate = useNavigate();

    /* ── CMS settings from backend ── */
    const [settings, setSettings] = useState({
        HOME_HERO_IMAGE: "/hero-portrait.png",
        HOME_HERO_TITLE: "Bringing Hope to Every Corner.",
        HOME_HERO_SUBTITLE: "From education to clean water, our work is driven by empathy and measurable results.",
        HOME_HERO_CTA_TEXT: "Support Our Mission",
        HOME_HERO_CTA_LINK: "/donation",
    });
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        api.get("/public/settings/all")
            .then((res) => {
                const s = res.data || {};
                setSettings({
                    HOME_HERO_IMAGE:    s.HOME_HERO_IMAGE    || "/hero-portrait.png",
                    HOME_HERO_TITLE:    s.HOME_HERO_TITLE    || "Bringing Hope to Every Corner.",
                    HOME_HERO_SUBTITLE: s.HOME_HERO_SUBTITLE || "From education to clean water, our work is driven by empathy and measurable results.",
                    HOME_HERO_CTA_TEXT: s.HOME_HERO_CTA_TEXT || "Support Our Mission",
                    HOME_HERO_CTA_LINK: s.HOME_HERO_CTA_LINK || "/donation",
                });
            })
            .catch((err) => console.error("Failed to fetch hero settings:", err))
            .finally(() => setLoaded(true));
    }, []);

    /* ── Scroll-driven 3D tilt ── */
    const { scrollY } = useScroll();
    const rotateX = useTransform(scrollY, [0, 800], [0, 8],   { clamp: true });
    const rotateY = useTransform(scrollY, [0, 800], [0, -6],  { clamp: true });
    const scale   = useTransform(scrollY, [0, 800], [1, 1.05],{ clamp: true });

    const contentVariants = {
        hidden:  { opacity: 0, y: 30 },
        visible: {
            opacity: 1, y: 0,
            transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1], staggerChildren: 0.15 },
        },
    };
    const childVariants = {
        hidden:  { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
    };

    const handleCTA = () => {
        const link = settings.HOME_HERO_CTA_LINK;
        if (link?.startsWith("http")) {
            window.open(link, "_blank", "noopener");
        } else {
            navigate(link || "/donation");
        }
    };

    return (
        <section className="hero" id="hero">
            {/* ── Tilting background image ── */}
            <motion.div className="hero__image-wrap" style={{ rotateX, rotateY, scale }}>
                <img
                    className="hero__image"
                    src={settings.HOME_HERO_IMAGE}
                    alt="Community portrait"
                    loading="eager"
                    fetchPriority="high"
                    draggable={false}
                />
            </motion.div>

            {/* ── Overlays ── */}
            <div className="hero__overlay"   aria-hidden="true" />
            <div className="hero__vignette"  aria-hidden="true" />

            {/* ── Content ── */}
            <motion.div
                className="hero__content"
                variants={contentVariants}
                initial="hidden"
                animate={loaded ? "visible" : "hidden"}
            >
                <motion.h1 className="hero__headline" variants={childVariants}>
                    {settings.HOME_HERO_TITLE}
                </motion.h1>
                <motion.p className="hero__subtitle" variants={childVariants}>
                    {settings.HOME_HERO_SUBTITLE}
                </motion.p>
                {settings.HOME_HERO_CTA_TEXT && (
                    <motion.button
                        variants={childVariants}
                        onClick={handleCTA}
                        className="mt-8 px-8 py-3 bg-white text-primary font-semibold rounded-full shadow-lg hover:bg-primary hover:text-white transition-all duration-300 text-sm tracking-wide"
                    >
                        {settings.HOME_HERO_CTA_TEXT}
                    </motion.button>
                )}
            </motion.div>

            {/* ── Scroll indicator ── */}
            <motion.div
                className="hero__scroll-hint"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.4, duration: 0.8 }}
            >
                <span>Scroll</span>
                <div className="hero__scroll-line" />
            </motion.div>
        </section>
    );
});

export default HeroSection;
