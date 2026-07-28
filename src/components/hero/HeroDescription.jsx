import { memo } from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";

const HeroDescription = memo(function HeroDescription({ text, variants }) {
  return (
    <motion.p 
      className="hero__subtitle text-lg md:text-2xl mt-4 font-light text-white/90 max-w-2xl mx-auto drop-shadow-md" 
      variants={variants}
    >
      {text}
    </motion.p>
  );
});

HeroDescription.propTypes = {
  text: PropTypes.string.isRequired,
  variants: PropTypes.object,
};

export default HeroDescription;
