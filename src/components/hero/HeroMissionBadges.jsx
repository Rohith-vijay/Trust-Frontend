import { memo } from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import HandshakeIcon from "@mui/icons-material/Handshake";
import EmojiPeopleIcon from "@mui/icons-material/EmojiPeople";

const HeroMissionBadges = memo(function HeroMissionBadges({ variants }) {
  const badges = [
    { icon: <VolunteerActivismIcon className="text-amber-500" />, label: "Support", sublabel: "Communities" },
    { icon: <MenuBookIcon className="text-amber-500" />, label: "Promote", sublabel: "Education" },
    { icon: <HandshakeIcon className="text-amber-500" />, label: "Inspire", sublabel: "Change" },
    { icon: <EmojiPeopleIcon className="text-amber-500" />, label: "Empower", sublabel: "Lives" },
  ];

  return (
    <motion.div 
      variants={variants} 
      className="hero__mission-badges mt-8"
    >
      {badges.map((badge, index) => (
        <div key={index} className="hero__mission-badge">
          <div className="hero__mission-badge-icon-wrapper">
            {badge.icon}
          </div>
          <div className="hero__mission-badge-text">
            <span className="hero__mission-badge-label">{badge.label}</span>
            <span className="hero__mission-badge-sublabel">{badge.sublabel}</span>
          </div>
        </div>
      ))}
    </motion.div>
  );
});

HeroMissionBadges.propTypes = {
  variants: PropTypes.object,
};

export default HeroMissionBadges;
