import React, { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";

import GalleryHero from "../components/gallery/GalleryHero";
import GalleryCard from "../components/gallery/GalleryCard";
import GalleryStats from "../components/gallery/GalleryStats";
import GalleryFooterCTA from "../components/gallery/GalleryFooterCTA";
import defaultShowcaseConfig from "../data/defaultShowcaseConfig";
import { premiumEase } from "../constants/motionVariants";
import databaseService from "../services/databaseService";

/**
 * ImpactShowcase — /impact-showcase
 * -----------------------------------------------------------------------------
 * A standalone cinematic gallery/showcase page.
 * CMS-enabled: reads configuration from backend settings or falls back gracefully.
 */
function ImpactShowcase() {
  const gridRef = useRef(null);
  const gridInView = useInView(gridRef, { once: true, margin: "-60px" });
  
  const [config, setConfig] = useState(defaultShowcaseConfig);
  const [loading, setLoading] = useState(true);

  // Set document title for SEO & fetch settings
  useEffect(() => {
    document.title = "Impact Showcase | KVG Trust";
    
    const loadCMSConfig = async () => {
      try {
        const settings = await databaseService.getAllPublicSettings();
        if (settings && settings.IMPACT_SHOWCASE_CONFIG) {
          try {
            const parsed = JSON.parse(settings.IMPACT_SHOWCASE_CONFIG);
            // Deep merge or validate structural keys exist
            if (parsed && typeof parsed === "object") {
              // Ensure critical parts exist, otherwise merge with fallback
              const merged = {
                hero: { ...defaultShowcaseConfig.hero, ...parsed.hero },
                stats: { ...defaultShowcaseConfig.stats, ...parsed.stats },
                galleryTitle: { ...defaultShowcaseConfig.galleryTitle, ...parsed.galleryTitle },
                cards: parsed.cards || defaultShowcaseConfig.cards,
                footerCta: { ...defaultShowcaseConfig.footerCta, ...parsed.footerCta }
              };
              setConfig(merged);
            }
          } catch (jsonErr) {
            console.error("[ImpactShowcase] Malformed CMS Config JSON, using fallback:", jsonErr);
          }
        }
      } catch (err) {
        console.warn("[ImpactShowcase] Failed to load CMS config, using local fallback:", err);
      } finally {
        setLoading(false);
      }
    };

    loadCMSConfig();

    return () => {
      document.title = "KVG Shanmuka Sai Charitable Trust";
    };
  }, []);

  if (loading) {
    return (
      <div 
        className="w-full min-h-screen flex items-center justify-center flex-col gap-4"
        style={{ background: "#080810", color: "#ffffff" }}
      >
        <div className="w-12 h-12 rounded-full border-t-2 border-t-amber-500 animate-spin" />
        <p className="text-xs uppercase tracking-[0.2em] text-gray-400">Loading Cinematic Showcase...</p>
      </div>
    );
  }

  // Filter out any disabled cards
  const activeCards = (config.cards || []).filter(card => card.enabled !== false);

  return (
    <>
      {/*
       * The page intentionally uses a full-bleed dark aesthetic that overrides
       * the Layout wrapper's light background via negative margins.
       */}
      <div
        className="relative overflow-x-hidden"
        style={{
          background: "#080810",
          marginTop: "-40px",
          marginBottom: "-40px",
          color: "#ffffff"
        }}
      >
        {/* ── 1. HERO ── */}
        {config.hero?.enabled !== false && (
          <GalleryHero config={config.hero} />
        )}

        {/* ── 2. STATS BAR ── */}
        {config.stats?.enabled !== false && (
          <GalleryStats config={config.stats} />
        )}

        {/* ── 3. SECTION TITLE ── */}
        {config.galleryTitle?.enabled !== false && (
          <section className="pt-12 pb-4 px-6">
            <div className="max-w-7xl mx-auto">
              {/* Separator rule */}
              <div className="flex items-center gap-4 mb-10">
                <div className="h-px flex-1" style={{ background: "rgba(255,255,255,0.06)" }} />
                <motion.span
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, ease: premiumEase }}
                  className="text-[10px] font-bold uppercase tracking-[0.4em] whitespace-nowrap"
                  style={{ color: "rgba(245,158,11,0.5)" }}
                >
                  {config.galleryTitle?.eyebrow || "Interactive Gallery"}
                </motion.span>
                <div className="h-px flex-1" style={{ background: "rgba(255,255,255,0.06)" }} />
              </div>

              {/* Section headline */}
              <motion.h2
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.75, ease: premiumEase }}
                className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight mb-4"
                style={{
                  background: "linear-gradient(135deg, #fff 40%, rgba(255,255,255,0.5) 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {config.galleryTitle?.title || "Stories Beneath the Surface"}
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.65, delay: 0.1, ease: premiumEase }}
                className="text-sm sm:text-base leading-relaxed max-w-2xl"
                style={{ color: "rgba(255,255,255,0.4)" }}
              >
                {config.galleryTitle?.description || "Move your cursor across each image. What lies beneath is the transformation your support has made possible — hidden in plain sight, waiting to be revealed."}
              </motion.p>
            </div>
          </section>
        )}

        {/* ── 4. CARD GRID ── */}
        <section
          ref={gridRef}
          className="px-6 pb-12"
          aria-label="Interactive impact image gallery"
        >
          <div className="max-w-7xl mx-auto">
            <div
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 lg:gap-6"
              style={{ gridAutoRows: "min-content" }}
            >
              {activeCards.map((item, index) => {
                // Every 3rd card spans full width on xl
                const isFeatured = index % 3 === 0;
                return (
                  <div
                    key={item.id || index}
                    className={
                      isFeatured
                        ? "col-span-1 md:col-span-2 xl:col-span-2"
                        : "col-span-1"
                    }
                  >
                    <GalleryCard {...item} index={index} />
                  </div>
                );
              })}
            </div>

            {/* Instruction hint below grid */}
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.5 }}
              className="text-center mt-10 text-[10px] uppercase tracking-[0.3em]"
              style={{ color: "rgba(255,255,255,0.2)" }}
            >
              On touch devices — tap and drag over the image to reveal
            </motion.p>
          </div>
        </section>

        {/* ── 5. FOOTER CTA ── */}
        {config.footerCta?.enabled !== false && (
          <GalleryFooterCTA config={config.footerCta} />
        )}
      </div>
    </>
  );
}

export default ImpactShowcase;
