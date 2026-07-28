import { memo } from "react";
import PropTypes from "prop-types";

const HeroOverlay = memo(function HeroOverlay({ opacity = 0.4 }) {
  return (
    <>
      <div 
        className="hero__overlay" 
        style={{ opacity }} 
        aria-hidden="true" 
      />
      <div className="hero__vignette" aria-hidden="true" />
    </>
  );
});

HeroOverlay.propTypes = {
  opacity: PropTypes.number,
};

export default HeroOverlay;
