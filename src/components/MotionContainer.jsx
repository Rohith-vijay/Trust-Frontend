import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { premiumEase } from "../constants/motionVariants";

/**
 * ScrollStagger component: Animates a list of children sequentially
 * when the container enters the viewport.
 */
export const ScrollStagger = React.memo(({ children, className = "", delay = 0, staggerInterval = 0.08, margin = "-80px" }) => {
  const shouldReduceMotion = useReducedMotion();

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : staggerInterval,
        delayChildren: delay,
      },
    },
  };

  const childVariants = {
    hidden: { 
      opacity: 0, 
      y: shouldReduceMotion ? 0 : 16 
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.55,
        ease: premiumEase,
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin }}
      className={className}
    >
      {React.Children.map(children, (child) => {
        if (!child) return null;
        return (
          <motion.div variants={childVariants} className="h-full">
            {child}
          </motion.div>
        );
      })}
    </motion.div>
  );
});

/**
 * FadeInUp component: Smoothly glides a single element up on viewport entrance
 */
export const FadeInUp = React.memo(({ children, className = "", delay = 0, duration = 0.6, margin = "-60px" }) => {
  const shouldReduceMotion = useReducedMotion();

  const variants = {
    hidden: { 
      opacity: 0, 
      y: shouldReduceMotion ? 0 : 16 
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay,
        duration,
        ease: premiumEase,
      },
    },
  };

  return (
    <motion.div
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin }}
      className={className}
    >
      {children}
    </motion.div>
  );
});
