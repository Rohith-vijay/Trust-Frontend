import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { premiumEase } from "../../constants/motionVariants";

/**
 * GalleryStats
 * -----------------------------------------------------------------------------
 * Horizontal stats bar dynamically driven by config.
 */
function GalleryStats({ config }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const statsItems = config?.items || [
    { value: "12,400+", label: "Children Educated" },
    { value: "80+",     label: "Villages Reached"  },
    { value: "38,000+", label: "Patients Treated"  },
    { value: "200+",    label: "Communities"       },
    { value: "5,200+",  label: "Women Empowered"   },
  ];

  return (
    <section
      ref={ref}
      className="relative py-20 overflow-hidden"
      aria-label="Trust impact statistics"
    >
      {/* Background line divider */}
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{ background: "linear-gradient(to right, transparent, rgba(255,255,255,0.08), transparent)" }}
      />
      <div
        className="absolute inset-x-0 bottom-0 h-px"
        style={{ background: "linear-gradient(to right, transparent, rgba(255,255,255,0.08), transparent)" }}
      />

      <div className="max-w-7xl mx-auto px-6">
        {/* Section label */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: premiumEase }}
          className="text-center text-[10px] font-bold uppercase tracking-[0.4em] mb-12"
          style={{ color: "rgba(245,158,11,0.6)" }}
        >
          Numbers that speak
        </motion.p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-4 justify-center">
          {statsItems.map((stat, i) => (
            <motion.div
              key={stat.id || stat.label}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.65, delay: i * 0.1, ease: premiumEase }}
              className="flex flex-col items-center text-center gap-2 group"
            >
              <span
                className="text-3xl sm:text-4xl font-black"
                style={{
                  background: "linear-gradient(135deg, #fff 30%, rgba(245,158,11,0.8) 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {stat.value}
              </span>
              <span
                className="text-[10px] uppercase tracking-[0.22em] font-semibold"
                style={{ color: "rgba(255,255,255,0.35)" }}
              >
                {stat.label}
              </span>
              {/* Animated underline */}
              <motion.div
                className="h-px rounded-full"
                style={{ background: "rgba(245,158,11,0.4)" }}
                animate={inView ? { width: "40px" } : { width: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 + 0.3, ease: premiumEase }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default GalleryStats;
