import { memo } from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import ParkIcon from "@mui/icons-material/Park";
import SchoolIcon from "@mui/icons-material/School";
import RestaurantIcon from "@mui/icons-material/Restaurant";

const HeroImpactCards = memo(function HeroImpactCards({ items, variants, className = "" }) {
  if (!items || items.length === 0) return null;

  const renderIcon = (iconName, colorClass) => {
    switch (iconName?.toLowerCase()) {
      case "water":
      case "water_drop":
      case "💧":
        return <WaterDropIcon className={`hero__impact-card-icon ${colorClass || "text-blue-500"}`} />;
      case "trees":
      case "forest":
      case "park":
      case "🌲":
      case "🌳":
        return <ParkIcon className={`hero__impact-card-icon ${colorClass || "text-green-500"}`} />;
      case "students":
      case "school":
      case "education":
      case "🎓":
        return <SchoolIcon className={`hero__impact-card-icon ${colorClass || "text-amber-500"}`} />;
      case "carriages":
      case "restaurant":
      case "food":
      case "🍱":
      case "🍔":
        return <RestaurantIcon className={`hero__impact-card-icon ${colorClass || "text-red-500"}`} />;
      default:
        return <SchoolIcon className={`hero__impact-card-icon ${colorClass || "text-gray-400"}`} />;
    }
  };

  return (
    <motion.div 
      variants={variants} 
      className={`hero__impact-cards-grid ${className}`}
    >
      {items.map((item, idx) => (
        <div key={idx} className={`hero__impact-card hero__impact-card--${item.key}`}>
          <div className="hero__impact-card-icon-wrapper">
            {renderIcon(item.icon, item.iconColorClass)}
          </div>
          <div className="hero__impact-card-content">
            <h4 className="hero__impact-card-value">{item.value}</h4>
            <span className="hero__impact-card-unit">{item.label}</span>
            <p className="hero__impact-card-desc">{item.description}</p>
          </div>
        </div>
      ))}
    </motion.div>
  );
});

HeroImpactCards.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      icon: PropTypes.string,
      iconColorClass: PropTypes.string,
    })
  ).isRequired,
  variants: PropTypes.object,
  className: PropTypes.string,
};

export default HeroImpactCards;
