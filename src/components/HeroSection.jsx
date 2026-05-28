import { memo, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import FavoriteIcon from '@mui/icons-material/Favorite';
import api from "../services/api";
import "./HeroSection.css";

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
        hidden:  { opacity: 0, scale: 0.95, y: 30 },
        visible: {
            opacity: 1, scale: 1, y: 0,
            transition: { duration: 1, ease: [0.16, 1, 0.3, 1], staggerChildren: 0.2 },
        },
    };
    const childVariants = {
        hidden:  { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
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
            <motion.div className="hero__image-wrap" style={{ rotateX, rotateY, scale }}>
                <img
                    className="hero__image object-cover w-full h-full"
                    src={settings.HOME_HERO_IMAGE}
                    alt="Community portrait"
                    loading="eager"
                    fetchPriority="high"
                    draggable={false}
                />
            </motion.div>

            <div className="hero__overlay"   aria-hidden="true" />
            <div className="hero__vignette"  aria-hidden="true" />

            <motion.div
                className="hero__content"
                variants={contentVariants}
                initial="hidden"
                animate={loaded ? "visible" : "hidden"}
            >
                <motion.h1 
                  className="hero__headline font-bold text-5xl md:text-7xl drop-shadow-lg leading-tight text-white !text-white" 
                  variants={childVariants}
                >
                    {settings.HOME_HERO_TITLE}
                </motion.h1>
                
                {/* Premium gold gradient accent line */}
                <motion.div 
                  className="w-28 h-1 bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-300 mx-auto my-6 rounded-full shadow-lg"
                  variants={childVariants}
                />

                <motion.p 
                  className="hero__subtitle text-lg md:text-2xl mt-4 font-light text-white/90 !text-white max-w-2xl mx-auto drop-shadow-md" 
                  variants={childVariants}
                >
                    {settings.HOME_HERO_SUBTITLE}
                </motion.p>
                {settings.HOME_HERO_CTA_TEXT && (
                    <motion.div variants={childVariants} className="mt-10">
                        <Button
                            variant="contained"
                            color="primary"
                            size="large"
                            onClick={handleCTA}
                            startIcon={<FavoriteIcon />}
                            sx={{
                                borderRadius: "50px",
                                px: 5,
                                py: 1.5,
                                fontSize: "1.1rem",
                                fontWeight: 700,
                                textTransform: "none",
                                boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
                                '&:hover': {
                                    transform: "translateY(-2px)",
                                    boxShadow: "0 15px 35px rgba(0,0,0,0.4)"
                                },
                                transition: "all 0.3s ease"
                            }}
                        >
                            {settings.HOME_HERO_CTA_TEXT}
                        </Button>
                    </motion.div>
                )}
            </motion.div>

            <motion.div
                className="hero__scroll-hint flex flex-col items-center absolute bottom-10 left-1/2 -translate-x-1/2 text-white/70"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5, duration: 1, repeat: Infinity, repeatType: "reverse" }}
            >
                <span className="text-xs uppercase tracking-widest mb-2 font-medium">Scroll to explore</span>
                <div className="w-[1px] h-12 bg-gradient-to-b from-white/70 to-transparent" />
            </motion.div>
        </section>
    );
});

export default HeroSection;
