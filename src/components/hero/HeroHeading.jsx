import { memo } from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";

const HeroHeading = memo(function HeroHeading({ text, variants }) {
  // Split title if we want premium styling or highlight
  // For backwards compatibility, just render the headline text.
  return (
    <motion.h1 
      className="hero__headline font-bold drop-shadow-lg leading-tight text-white" 
      variants={variants}
    >
      {text}
    </motion.h1>
  );
});

HeroHeading.propTypes = {
  text: PropTypes.string.isRequired,
  variants: PropTypes.object,
};

export default HeroHeading;
