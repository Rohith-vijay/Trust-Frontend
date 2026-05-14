import React from "react";
import CountUp from "react-countup";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

/**
 * Counter — a single animated counter card with icon and counting animation.
 * Triggers when scrolled into view.
 */
function Counter({ end, label, icon, delay = 0 }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.3 });

  return (
    <motion.div
      ref={ref}
      className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 flex flex-col items-center justify-center hover:shadow-lg transition-shadow duration-300"
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
    >
      {/* Icon */}
      <motion.span
        className="text-5xl mb-3 block"
        initial={{ scale: 0 }}
        animate={inView ? { scale: 1 } : {}}
        transition={{ duration: 0.5, delay: delay + 0.2, type: "spring", stiffness: 200 }}
      >
        {icon}
      </motion.span>

      {/* Number */}
      <h2 className="text-4xl md:text-5xl font-bold text-primary tabular-nums">
        {inView ? (
          <CountUp
            end={end}
            duration={2.5}
            separator=","
            useEasing={true}
            suffix="+"
          />
        ) : (
          "0"
        )}
      </h2>

      {/* Label */}
      <p className="mt-2 text-sm md:text-base font-medium text-gray-600 text-center">
        {label}
      </p>
    </motion.div>
  );
}

export default Counter;
