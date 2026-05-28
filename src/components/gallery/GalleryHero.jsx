import React, { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

/**
 * GalleryHero
 * -----------------------------------------------------------------------------
 * Full-viewport cinematic hero section for the Impact Showcase page.
 */
function GalleryHero({ config }) {
  const ref = useRef(null);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const titleY = useTransform(scrollYProgress, [0, 1], ["0%", shouldReduceMotion ? "0%" : "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  // Floating particles config
  const particles = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 8 + 6,
    delay: Math.random() * 4,
    opacity: Math.random() * 0.4 + 0.1,
  }));

  const eyebrow = config?.eyebrow || "K.V.G. Shanmuka Sai Charitable Trust";
  const titlePart1 = config?.titlePart1 || "Impact";
  const titlePart2 = config?.titlePart2 || "Showcase";
  const description = config?.description || "Hover over each image to reveal the transformation behind it. Real stories. Real lives changed. Seen through our eyes.";
  const scrollLabel = config?.scrollLabel || "Scroll to explore";

  return (
    <section
      ref={ref}
      className="relative w-full overflow-hidden flex items-center justify-center"
      style={{ minHeight: "100vh" }}
      aria-label="Impact showcase hero"
    >
      {/* Deep cinematic dark background */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(135deg, #050508 0%, #0a0a12 40%, #060610 70%, #0d0810 100%)",
        }}
      />

      {/* Animated gradient orbs */}
      <motion.div
        className="absolute"
        style={{ top: "15%", left: "10%", width: 600, height: 600, borderRadius: "50%" }}
        animate={
          shouldReduceMotion
            ? {}
            : {
                scale: [1, 1.15, 1],
                opacity: [0.06, 0.1, 0.06],
              }
        }
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(176,122,63,0.3) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
      </motion.div>

      <motion.div
        className="absolute"
        style={{ bottom: "10%", right: "5%", width: 500, height: 500, borderRadius: "50%" }}
        animate={
          shouldReduceMotion
            ? {}
            : {
                scale: [1, 1.2, 1],
                opacity: [0.04, 0.08, 0.04],
              }
        }
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 3 }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(56,189,248,0.25) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />
      </motion.div>

      {/* Film-grain noise overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E")`,
          opacity: 0.35,
          mixBlendMode: "overlay",
        }}
        aria-hidden="true"
      />

      {/* Floating particles */}
      {!shouldReduceMotion &&
        particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full pointer-events-none"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
              background: "white",
              opacity: 0,
            }}
            animate={{
              opacity: [0, p.opacity, 0],
              y: [0, -40, -80],
              scale: [0.5, 1, 0.3],
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            aria-hidden="true"
          />
        ))}

      {/* Hero content */}
      <motion.div
        style={{ y: titleY, opacity }}
        className="relative z-10 flex flex-col items-center text-center px-6 max-w-5xl mx-auto"
      >
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 1, 0.5, 1] }}
          className="mb-6 flex items-center gap-3"
        >
          <div className="h-px w-12 bg-gradient-to-r from-transparent to-amber-500/60" />
          <span
            className="text-xs font-bold uppercase tracking-[0.35em]"
            style={{ color: "rgba(245,158,11,0.8)" }}
          >
            {eyebrow}
          </span>
          <div className="h-px w-12 bg-gradient-to-l from-transparent to-amber-500/60" />
        </motion.div>

        {/* Main headline */}
        <div className="overflow-hidden mb-4">
          <motion.h1
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.0, delay: 0.4, ease: [0.25, 1, 0.5, 1] }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-[1.05] tracking-tight"
            style={{
              background:
                "linear-gradient(135deg, #ffffff 0%, rgba(255,255,255,0.75) 50%, rgba(245,158,11,0.9) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            {titlePart1}
          </motion.h1>
        </div>

        <div className="overflow-hidden mb-8">
          <motion.h1
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.0, delay: 0.55, ease: [0.25, 1, 0.5, 1] }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-[1.05] tracking-tight"
            style={{
              background:
                "linear-gradient(135deg, rgba(245,158,11,0.6) 0%, rgba(255,255,255,0.9) 60%, #ffffff 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            {titlePart2}
          </motion.h1>
        </div>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8, ease: [0.25, 1, 0.5, 1] }}
          className="text-base sm:text-lg md:text-xl leading-relaxed max-w-2xl"
          style={{ color: "rgba(255,255,255,0.5)" }}
        >
          {description}
        </motion.p>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.8 }}
          className="mt-16 flex flex-col items-center gap-2"
        >
          <span
            className="text-[10px] uppercase tracking-[0.3em]"
            style={{ color: "rgba(255,255,255,0.3)" }}
          >
            {scrollLabel}
          </span>
          <motion.div
            className="w-px h-14"
            style={{
              background:
                "linear-gradient(to bottom, rgba(255,255,255,0.4), transparent)",
            }}
            animate={{ scaleY: [0.5, 1, 0.5], opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}

export default GalleryHero;
