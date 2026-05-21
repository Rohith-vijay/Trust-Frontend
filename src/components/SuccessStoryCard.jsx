import React, { useState, useRef, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, Typography, Chip, Box } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import StarIcon from "@mui/icons-material/Star";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";

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

  // Parse Metadata from description text dynamically
  const parsedData = useMemo(() => {
    let cleanDesc = story.description || "";
    const metadata = {
      location: "",
      stat: "",
      quote: "",
      beforeImg: "",
      afterImg: "",
    };

    // Parse [Location: ...]
    const locMatch = cleanDesc.match(/\[Location:\s*(.*?)\]/i);
    if (locMatch) {
      metadata.location = locMatch[1];
      cleanDesc = cleanDesc.replace(locMatch[0], "");
    }

    // Parse [Stat: ...]
    const statMatch = cleanDesc.match(/\[Stat:\s*(.*?)\]/i);
    if (statMatch) {
      metadata.stat = statMatch[1];
      cleanDesc = cleanDesc.replace(statMatch[0], "");
    }

    // Parse [Quote: ...]
    const quoteMatch = cleanDesc.match(/\[Quote:\s*(.*?)\]/i);
    if (quoteMatch) {
      metadata.quote = quoteMatch[1];
      cleanDesc = cleanDesc.replace(quoteMatch[0], "");
    }

    // Parse [BeforeImg: ...]
    const beforeMatch = cleanDesc.match(/\[BeforeImg:\s*(.*?)\]/i);
    if (beforeMatch) {
      metadata.beforeImg = beforeMatch[1];
      cleanDesc = cleanDesc.replace(beforeMatch[0], "");
    }

    // Parse [AfterImg: ...]
    const afterMatch = cleanDesc.match(/\[AfterImg:\s*(.*?)\]/i);
    if (afterMatch) {
      metadata.afterImg = afterMatch[1];
      cleanDesc = cleanDesc.replace(afterMatch[0], "");
    }

    // Comma-separated fallback in story.imageUrl
    const imageUrls = story.imageUrl ? story.imageUrl.split(",").map(u => u.trim()).filter(Boolean) : [];
    if (imageUrls.length >= 2) {
      metadata.beforeImg = imageUrls[0];
      metadata.afterImg = imageUrls[1];
    } else if (imageUrls.length === 1 && !metadata.beforeImg) {
      metadata.beforeImg = imageUrls[0];
    }

    return {
      description: cleanDesc.trim(),
      metadata,
    };
  }, [story.description, story.imageUrl]);

  const hasBeforeAfter = parsedData.metadata.beforeImg && parsedData.metadata.afterImg;

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
              src={parsedData.metadata.beforeImg}
              alt="Before"
              className="absolute inset-0 w-full h-full object-cover"
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
                src={parsedData.metadata.afterImg}
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
        ) : parsedData.metadata.beforeImg ? (
          <div className="relative overflow-hidden group h-[220px] shrink-0">
            <img
              src={parsedData.metadata.beforeImg}
              alt={story.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
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
                  bgcolor: "primary.50",
                  color: "primary.main",
                  letterSpacing: "0.5px",
                }}
              />
            )}

            {parsedData.metadata.location && (
              <Chip
                icon={<LocationOnIcon style={{ fontSize: 11, color: "#B07A3F" }} />}
                label={parsedData.metadata.location}
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

            {parsedData.metadata.stat && (
              <Chip
                icon={<StarIcon style={{ fontSize: 11, color: "#F59E0B" }} />}
                label={parsedData.metadata.stat}
                size="small"
                sx={{
                  fontWeight: 700,
                  fontSize: "0.62rem",
                  bgcolor: "amber.50",
                  color: "amber.800",
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
              flexGrow: 1,
              lineHeight: 1.65,
              mb: parsedData.metadata.quote ? 2.5 : 0,
            }}
          >
            {parsedData.description}
          </Typography>

          {/* Emotional Block-Quote Section */}
          {parsedData.metadata.quote && (
            <Box
              sx={{
                mt: "auto",
                p: 2,
                borderRadius: 3,
                bgcolor: "primary.50",
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
                  opacity: 0.15,
                  fontSize: 28,
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
                  fontSize: "0.85rem",
                  pr: 1.5,
                }}
              >
                "{parsedData.metadata.quote}"
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
});

export default SuccessStoryCard;
