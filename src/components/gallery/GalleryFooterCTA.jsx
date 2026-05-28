import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { premiumEase } from "../../constants/motionVariants";
import { Link } from "react-router-dom";

/**
 * GalleryFooterCTA
 * -----------------------------------------------------------------------------
 * A premium horizontal call-to-action section at the bottom of the showcase page.
 */
function GalleryFooterCTA({ config }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const subtitle = config?.subtitle || "Be Part of the Story";
  const title = config?.title || "Every donation rewrites a story.";
  const description = config?.description || "The images you just experienced represent real people, real struggles, and real transformations. Your contribution adds another chapter to this ongoing story of hope.";
  const btnText = config?.btnText || "Donate Now";
  const btnLink = config?.btnLink || "/donation";

  return (
    <section
      ref={ref}
      className="relative py-32 px-6 overflow-hidden"
      aria-label="Join our mission call to action"
    >
      {/* Background orb */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        aria-hidden="true"
        style={{
          width: 700,
          height: 700,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(176,122,63,0.08) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      {/* Top divider */}
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{ background: "linear-gradient(to right, transparent, rgba(255,255,255,0.08), transparent)" }}
      />

      <div className="max-w-3xl mx-auto text-center relative z-10">
        {/* Eyebrow */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: premiumEase }}
          className="text-xs font-bold uppercase tracking-[0.35em] mb-6"
          style={{ color: "rgba(245,158,11,0.7)" }}
        >
          {subtitle}
        </motion.p>

        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.1, ease: premiumEase }}
          className="text-4xl sm:text-5xl md:text-6xl font-black leading-tight mb-6"
          style={{
            background: "linear-gradient(135deg, #ffffff 0%, rgba(255,255,255,0.7) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          {title}
        </motion.h2>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2, ease: premiumEase }}
          className="text-base sm:text-lg leading-relaxed mb-12"
          style={{ color: "rgba(255,255,255,0.45)" }}
        >
          {description}
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.35, ease: premiumEase }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            to={btnLink}
            id="gallery-cta-donate"
            className="group relative inline-flex items-center justify-center px-8 py-4 rounded-full font-bold text-sm uppercase tracking-widest overflow-hidden transition-all duration-300"
            style={{
              background: "linear-gradient(135deg, #B07A3F, #F59E0B)",
              color: "#000",
              boxShadow: "0 0 40px rgba(176,122,63,0.25)",
            }}
          >
            <span className="relative z-10">{btnText}</span>
            <span
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ background: "linear-gradient(135deg, #F59E0B, #B07A3F)" }}
            />
          </Link>

          <Link
            to="/volunteer"
            id="gallery-cta-volunteer"
            className="inline-flex items-center justify-center px-8 py-4 rounded-full font-bold text-sm uppercase tracking-widest border transition-all duration-300 hover:bg-white/5"
            style={{
              border: "1px solid rgba(255,255,255,0.15)",
              color: "rgba(255,255,255,0.7)",
            }}
          >
            Become a Volunteer
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

export default GalleryFooterCTA;
