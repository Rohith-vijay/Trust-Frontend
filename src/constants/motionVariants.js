// centralized motion variants used throughout the site

export const premiumEase = [0.25, 1, 0.5, 1]; // Premium SaaS cubic-bezier curve

export const pageVariants = {
  initial: { opacity: 0, y: 8, scale: 0.99 },
  animate: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: {
      duration: 0.45,
      ease: premiumEase,
    }
  },
  exit: { 
    opacity: 0, 
    y: -8, 
    scale: 0.99,
    transition: {
      duration: 0.3,
      ease: [0.25, 0, 0.3, 1],
    }
  },
};

export const pageTransition = {
  duration: 0.45,
  ease: premiumEase,
};

export const sectionVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: premiumEase },
  },
};

export const springTransition = {
  type: "spring",
  stiffness: 260,
  damping: 20,
};

export const cardHover = {
  y: -8,
  scale: 1.02,
  transition: springTransition,
};

export const glowHover = {
  boxShadow: "0 20px 30px rgba(176, 122, 63, 0.15), 0 4px 15px rgba(0,0,0,0.03)",
  borderColor: "rgba(176, 122, 63, 0.35)",
  transition: { duration: 0.3, ease: premiumEase }
};

export const sectionEntrance = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: premiumEase }
  }
};

export const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08
    }
  }
};

