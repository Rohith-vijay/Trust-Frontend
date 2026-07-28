import { memo } from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";
import { Button } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const HeroButtons = memo(function HeroButtons({
  primaryText = "Support Our Mission",
  secondaryText = "Join Us In Making A Difference",
  onPrimaryClick,
  onSecondaryClick,
  variants,
}) {
  return (
    <motion.div variants={variants} className="hero__buttons-container">
      {/* Primary CTA: Support Our Mission */}
      {primaryText && (
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={onPrimaryClick}
          startIcon={<FavoriteIcon />}
          aria-label={primaryText}
          sx={{
            borderRadius: "50px",
            px: { xs: 3, md: 4 },
            height: { xs: "48px", md: "54px" },
            fontSize: { xs: "0.85rem", md: "0.95rem" },
            fontWeight: 700,
            textTransform: "none",
            whiteSpace: "nowrap",
            boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
            "&:hover": {
              transform: "translateY(-2px)",
              boxShadow: "0 15px 35px rgba(0,0,0,0.4)",
            },
            transition: "all 0.3s ease",
          }}
        >
          {primaryText}
        </Button>
      )}

      {/* Secondary CTA: Join Us */}
      {secondaryText && (
        <Button
          variant="outlined"
          size="large"
          onClick={onSecondaryClick}
          endIcon={<ArrowForwardIcon />}
          aria-label={secondaryText}
          sx={{
            borderRadius: "50px",
            px: { xs: 3, md: 4 },
            height: { xs: "48px", md: "54px" },
            fontSize: { xs: "0.85rem", md: "0.95rem" },
            fontWeight: 700,
            textTransform: "none",
            whiteSpace: "nowrap",
            color: "#ffffff",
            borderColor: "rgba(255, 255, 255, 0.4)",
            borderWidth: "2px",
            background: "rgba(255, 255, 255, 0.05)",
            backdropFilter: "blur(4px)",
            "&:hover": {
              borderColor: "#ffffff",
              borderWidth: "2px",
              background: "rgba(255, 255, 255, 0.15)",
              transform: "translateY(-2px)",
              boxShadow: "0 10px 20px rgba(0,0,0,0.2)",
            },
            transition: "all 0.3s ease",
          }}
        >
          {secondaryText}
        </Button>
      )}
    </motion.div>
  );
});

HeroButtons.propTypes = {
  primaryText: PropTypes.string,
  secondaryText: PropTypes.string,
  onPrimaryClick: PropTypes.func.isRequired,
  onSecondaryClick: PropTypes.func.isRequired,
  variants: PropTypes.object,
};

export default HeroButtons;
