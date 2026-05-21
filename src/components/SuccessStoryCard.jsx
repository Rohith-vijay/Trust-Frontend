import React, { useState, useRef, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent, Typography, Chip, Box } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import StarIcon from "@mui/icons-material/Star";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const SuccessStoryCard = React.memo(({ story }) => {
  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(300);
  const [sliderPosition, setSliderPosition] = useState(50);

  // ResizeObserver to track container width for perfect Before/After image alignment
  useEffect(() => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.getBoundingClientRect().width);
      const resizeObserver = new ResizeObserver((entries) => {
        for (let entry of entries) {
          setContainerWidth(entry.contentRect.width);
        }
      });
      resizeObserver.observe(containerRef.current);
      return () => resizeObserver.disconnect();
    }
  }, []);

  const handleSliderChange = (e) => {
    setSliderPosition(Number(e.target.value));
  };

  const hasBeforeAfter = story.beforeImageUrl && story.afterImageUrl;
  const cardImage = story.beforeImageUrl || story.imageUrl;

  // Retrieve first impact metric to showcase on the card badge
  const primaryMetric = useMemo(() => {
    if (story.metrics && story.metrics.length > 0) {
      return `${story.metrics[0].value} ${story.metrics[0].label}`;
    }
    return null;
  }, [story.metrics]);

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.015 }}
      transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
      className="h-full"
    >
      <Card
        elevation={0}
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          borderRadius: 5,
          border: "1px solid rgba(0,0,0,0.05)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)",
          overflow: "hidden",
          transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            boxShadow: "0 20px 35px rgba(176, 122, 63, 0.08), 0 4px 15px rgba(0,0,0,0.04)",
            borderColor: "rgba(176, 122, 63, 0.15)",
          },
        }}
      >
        {/* ─── MEDIA TOP SECTION ─── */}
        {hasBeforeAfter ? (
          <div 
            ref={containerRef}
            className="relative w-full h-[220px] overflow-hidden select-none shrink-0"
          >
            {/* Before Image (Background) */}
            <img
              src={story.beforeImageUrl}
              alt="Before"
              className="absolute inset-0 w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-[2px] text-white text-[10px] font-extrabold px-2 py-0.5 rounded shadow z-10 pointer-events-none tracking-wider">
              BEFORE
            </div>

            {/* After Image (Clipping Overlay) */}
            <div
              className="absolute inset-y-0 left-0 overflow-hidden"
              style={{ width: `${sliderPosition}%` }}
            >
              <img
                src={story.afterImageUrl}
                alt="After"
                style={{ 
                  width: `${containerWidth}px`, 
                  height: "220px", 
                  objectFit: "cover",
                  maxWidth: "none"
                }}
                className="absolute inset-0"
              />
              <div className="absolute bottom-3 right-3 bg-primary/90 backdrop-blur-[2px] text-white text-[10px] font-extrabold px-2 py-0.5 rounded shadow z-10 pointer-events-none tracking-wider">
                AFTER
              </div>
            </div>

            {/* Draggable Divider Handle */}
            <div
              className="absolute inset-y-0 w-1 bg-white cursor-ew-resize flex items-center justify-center z-10"
              style={{ left: `${sliderPosition}%`, transform: "translateX(-50%)" }}
            >
              <div className="w-6 h-6 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center text-[10px] font-black text-amber-600">
                ↔
              </div>
            </div>

            {/* Range Input overlay covering the element for seamless touch/mouse dragging */}
            <input
              type="range"
              min="0"
              max="100"
              value={sliderPosition}
              onChange={handleSliderChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
            />
          </div>
        ) : cardImage ? (
          <div className="relative overflow-hidden group h-[220px] shrink-0">
            <img
              src={cardImage}
              alt={story.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>
        ) : null}

        {/* ─── CARD BODY ─── */}
        <CardContent sx={{ p: 3, flexGrow: 1, display: "flex", flexDirection: "column" }}>
          
          {/* Taxonomy, Location, & Stats Row */}
          <div className="flex flex-wrap gap-1.5 mb-2.5 items-center">
            {story.category && (
              <Chip
                label={story.category.toUpperCase()}
                size="small"
                sx={{
                  fontWeight: 700,
                  fontSize: "0.62rem",
                  bgcolor: "rgba(176,122,63,0.1)",
                  color: "primary.main",
                  letterSpacing: "0.5px",
                }}
              />
            )}

            {story.location && (
              <Chip
                icon={<LocationOnIcon style={{ fontSize: 11, color: "#B07A3F" }} />}
                label={story.location}
                size="small"
                variant="outlined"
                sx={{
                  fontWeight: 600,
                  fontSize: "0.62rem",
                  borderColor: "rgba(176,122,63,0.15)",
                  color: "text.secondary",
                }}
              />
            )}

            {primaryMetric && (
              <Chip
                icon={<StarIcon style={{ fontSize: 11, color: "#F59E0B" }} />}
                label={primaryMetric}
                size="small"
                sx={{
                  fontWeight: 700,
                  fontSize: "0.62rem",
                  bgcolor: "#FFFBEB",
                  color: "#B45309",
                  border: "1px solid rgba(245,158,11,0.15)",
                }}
              />
            )}
          </div>

          {/* Title */}
          <Typography
            variant="h6"
            component="h3"
            sx={{
              fontWeight: 800,
              mb: 1.5,
              color: "text.primary",
              lineHeight: 1.35,
            }}
          >
            {story.title}
          </Typography>

          {/* Clean Description */}
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              lineHeight: 1.65,
              mb: story.testimonialQuote ? 2 : 2.5,
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {story.description}
          </Typography>

          {/* Emotional Block-Quote Section */}
          {story.testimonialQuote && (
            <Box
              sx={{
                mb: 2.5,
                p: 2,
                borderRadius: 3,
                bgcolor: "rgba(176,122,63,0.05)",
                position: "relative",
                borderLeft: "4px solid",
                borderColor: "primary.main",
              }}
            >
              <FormatQuoteIcon
                sx={{
                  position: "absolute",
                  top: 2,
                  right: 4,
                  opacity: 0.1,
                  fontSize: 24,
                  color: "primary.main",
                }}
              />
              <Typography
                variant="body2"
                sx={{
                  fontStyle: "italic",
                  color: "primary.900",
                  lineHeight: 1.6,
                  fontWeight: 500,
                  fontSize: "0.8rem",
                  pr: 1.5,
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                "{story.testimonialQuote}"
              </Typography>
            </Box>
          )}

          {/* Interactive CTA to full story details */}
          <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
            <Link
              to={`/stories/${story.id}`}
              className="inline-flex items-center text-sm font-bold text-brand-navy-dark hover:text-brand-gold transition-colors duration-300"
            >
              Read Full Story
              <ArrowForwardIcon className="ml-1" style={{ fontSize: 16 }} />
            </Link>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
});

export default SuccessStoryCard;
