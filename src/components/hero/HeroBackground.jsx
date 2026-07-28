import { memo } from "react";
import PropTypes from "prop-types";

const HeroBackground = memo(function HeroBackground({ src, alt = "Charity Mission Collage" }) {
  // Use high quality image, eager loading for LCP element
  return (
    <div className="hero__background-container">
      <img
        src={src}
        alt={alt}
        className="hero__background-image"
        loading="eager"
        fetchPriority="high"
        decoding="async"
        draggable={false}
      />
    </div>
  );
});

HeroBackground.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string,
};

export default HeroBackground;
