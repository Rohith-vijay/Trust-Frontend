import React, { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import CursorReveal from "./CursorReveal";
import { premiumEase } from "../../constants/motionVariants";

/**
 * GalleryCard
 * ─────────────────────────────────────────────────────────────────────────────
 * A single interactive impact story card.
 * Composes <CursorReveal> with metadata overlay, tags, and stat display.
 *
 * Props: mirrors the shape of impactGalleryData entries + an `index` for stagger.
 */
const GalleryCard = React.memo(function GalleryCard({
  id,
  baseImage,
  revealImage,
  title,
  subtitle,
  description,
  stat,
  statLabel,
  tags = [],
  accentColor,
  index = 0,
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [hovered, setHovered] = useState(false);

  const cardVariants = {
    hidden: { opacity: 0, y: 48, scale: 0.97 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.75,
        delay: index * 0.12,
        ease: premiumEase,
      },
    },
  };

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: index * 0.12 + i * 0.08 + 0.3, duration: 0.55, ease: premiumEase },
    }),
  };

  return (
    <motion.article
      ref={ref}
      id={`gallery-card-${id}`}
      aria-label={title}
      variants={cardVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="group relative flex flex-col rounded-3xl overflow-hidden bg-[#0d0d0d] border border-white/[0.06]"
      style={{
        boxShadow: hovered
          ? `0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px ${accentColor}`
          : "0 8px 40px rgba(0,0,0,0.4)",
        transition: "box-shadow 0.5s ease",
        willChange: "transform",
      }}
    >
      {/* ── Image reveal zone ── */}
      <div className="relative w-full overflow-hidden" style={{ aspectRatio: "16/10" }}>
        <CursorReveal
          baseImage={baseImage}
          revealImage={revealImage}
          alt={title}
          revealSize={300}
          lerpFactor={0.08}
          accentColor={accentColor}
          className="w-full h-full"
        />

        {/* Cinematic gradient overlay at bottom of image */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(to bottom, transparent 50%, rgba(13,13,13,0.95) 100%)",
          }}
        />

        {/* Tags overlay — top-left */}
        <div className="absolute top-4 left-4 flex flex-wrap gap-2 z-10 pointer-events-none">
          {tags.map((tag) => (
            <motion.span
              key={tag}
              custom={0}
              variants={textVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full"
              style={{
                background: "rgba(0,0,0,0.5)",
                backdropFilter: "blur(10px)",
                color: "rgba(255,255,255,0.7)",
                border: `1px solid ${accentColor}`,
              }}
            >
              {tag}
            </motion.span>
          ))}
        </div>

        {/* Stat badge — top-right */}
        <motion.div
          custom={1}
          variants={textVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="absolute top-4 right-4 z-10 text-right pointer-events-none"
          style={{
            background: "rgba(0,0,0,0.55)",
            backdropFilter: "blur(12px)",
            borderRadius: "14px",
            padding: "8px 14px",
            border: `1px solid ${accentColor}`,
          }}
        >
          <div
            className="text-xl font-black leading-none"
            style={{ color: "rgba(255,255,255,0.95)" }}
          >
            {stat}
          </div>
          <div
            className="text-[9px] uppercase tracking-widest mt-0.5"
            style={{ color: "rgba(255,255,255,0.5)" }}
          >
            {statLabel}
          </div>
        </motion.div>

        {/* Reveal hint label */}
        <motion.div
          className="absolute bottom-4 right-4 z-10 pointer-events-none flex items-center gap-1.5"
          animate={{ opacity: hovered ? 0 : 0.6 }}
          transition={{ duration: 0.3 }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-white/60 animate-pulse" />
          <span className="text-[9px] uppercase tracking-[0.2em] text-white/60 font-semibold">
            Move cursor to reveal
          </span>
        </motion.div>
      </div>

      {/* ── Content area ── */}
      <div className="flex flex-col gap-3 px-6 py-6">
        {/* Subtitle / category */}
        <motion.p
          custom={2}
          variants={textVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="text-xs font-bold uppercase tracking-[0.22em]"
          style={{ color: accentColor.replace("0.18", "0.9") }}
        >
          {subtitle}
        </motion.p>

        {/* Title */}
        <motion.h3
          custom={3}
          variants={textVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="text-xl font-black leading-snug text-white"
        >
          {title}
        </motion.h3>

        {/* Description */}
        <motion.p
          custom={4}
          variants={textVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="text-sm leading-relaxed"
          style={{ color: "rgba(255,255,255,0.55)" }}
        >
          {description}
        </motion.p>

        {/* Animated bottom line */}
        <motion.div
          className="mt-2 h-[1px] rounded-full"
          style={{ background: accentColor.replace("0.18", "0.25") }}
          animate={{ scaleX: hovered ? 1 : 0.3, originX: 0 }}
          transition={{ duration: 0.4, ease: premiumEase }}
        />
      </div>
    </motion.article>
  );
});

export default GalleryCard;
