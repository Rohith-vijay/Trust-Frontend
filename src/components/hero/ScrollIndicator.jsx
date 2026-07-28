import { memo } from "react";
import { motion } from "framer-motion";

const ScrollIndicator = memo(function ScrollIndicator() {
  return (
    <motion.div
      className="hero__scroll-hint flex flex-col items-center absolute text-white/70"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.5, duration: 1, repeat: Infinity, repeatType: "reverse" }}
    >
      <span className="text-[10px] uppercase tracking-widest mb-2 font-medium">Scroll to explore</span>
      <div className="hero__scroll-line" />
    </motion.div>
  );
});

export default ScrollIndicator;
