import { memo } from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";
import GroupIcon from "@mui/icons-material/Group";
import AssignmentIcon from "@mui/icons-material/Assignment";
import SchoolIcon from "@mui/icons-material/School";
import PublicIcon from "@mui/icons-material/Public";

const HeroStats = memo(function HeroStats({ 
  lives = "1000+", 
  projects = "50+", 
  education = "For a Better Future", 
  vision = "Stronger Together", 
  variants 
}) {
  return (
    <motion.div 
      className="hero__stats-bar" 
      variants={variants}
    >
      <div className="hero__stats-inner">
        {/* Lives Impacted */}
        <div className="hero__stat-item">
          <GroupIcon className="hero__stat-icon text-amber-500" />
          <div className="hero__stat-text-wrap">
            <span className="hero__stat-num">{lives}</span>
            <span className="hero__stat-label">Lives Impacted</span>
          </div>
        </div>

        {/* Projects */}
        <div className="hero__stat-item">
          <AssignmentIcon className="hero__stat-icon text-amber-500" />
          <div className="hero__stat-text-wrap">
            <span className="hero__stat-num">{projects}</span>
            <span className="hero__stat-label">Projects</span>
          </div>
        </div>

        {/* Education */}
        <div className="hero__stat-item">
          <SchoolIcon className="hero__stat-icon text-amber-500" />
          <div className="hero__stat-text-wrap">
            <span className="hero__stat-num">Education</span>
            <span className="hero__stat-label">{education}</span>
          </div>
        </div>

        {/* Vision */}
        <div className="hero__stat-item">
          <PublicIcon className="hero__stat-icon text-amber-500" />
          <div className="hero__stat-text-wrap">
            <span className="hero__stat-num">1 Vision</span>
            <span className="hero__stat-label">{vision}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

HeroStats.propTypes = {
  lives: PropTypes.string,
  projects: PropTypes.string,
  education: PropTypes.string,
  vision: PropTypes.string,
  variants: PropTypes.object,
};

export default HeroStats;
