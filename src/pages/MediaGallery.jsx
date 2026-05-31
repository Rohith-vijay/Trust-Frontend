import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { pageVariants, pageTransition, sectionVariants } from "../constants/motionVariants";
import { Typography, IconButton, Box, Chip } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import SiteContainer from "../components/SiteContainer";
import databaseService from "../services/databaseService";

function MediaGallery() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const [lightboxIndex, setLightboxIndex] = useState(-1);

  const categories = ["ALL", "EDUCATION", "WATER RELIEF", "GREEN CAMPS", "HEALTHCARE"];

  useEffect(() => {
    databaseService.getMediaAssets("ALL")
      .then(res => {
        const galleryCategories = ["GENERAL", "EDUCATION", "WATER RELIEF", "GREEN CAMPS", "HEALTHCARE"];
        const filtered = (res || []).filter(asset => 
          galleryCategories.includes((asset.ownerType || "").toUpperCase())
        );
        const mapped = filtered.map(asset => ({
          id: asset.id,
          category: asset.ownerType || "GENERAL",
          title: asset.caption || "NGO Platform Highlight",
          src: asset.url,
          fullSrc: asset.url
        }));
        setItems(mapped);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load gallery items:", err);
        setLoading(false);
      });
  }, []);

  const filteredItems = React.useMemo(() => {
    if (filter === "ALL") return items;
    return items.filter((i) => i.category.toUpperCase() === filter);
  }, [filter, items]);

  const handlePrev = (e) => {
    e.stopPropagation();
    setLightboxIndex((prev) => (prev === 0 ? filteredItems.length - 1 : prev - 1));
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setLightboxIndex((prev) => (prev === filteredItems.length - 1 ? 0 : prev + 1));
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={pageTransition}
      className="bg-gray-50/50 min-h-screen py-24"
    >
      <SiteContainer>
        {/* Title */}
        <motion.section
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
          className="text-center max-w-4xl mx-auto px-6 mb-12"
        >
          <Typography
            variant="h2"
            component="h1"
            sx={{
              fontWeight: 800,
              color: "primary.main",
              mb: 3,
              fontSize: { xs: "2.5rem", md: "3.5rem" },
            }}
          >
            Media & Campaign Gallery
          </Typography>
          <Typography
            variant="subtitle1"
            color="text.secondary"
            sx={{ fontSize: "1.15rem", maxWidth: 700, mx: "auto", lineHeight: 1.6 }}
          >
            A visual overview of our field deployments, smiling beneficiaries, and green relief campaigns.
          </Typography>
        </motion.section>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <Chip
              key={cat}
              label={cat}
              onClick={() => setFilter(cat)}
              color={filter === cat ? "primary" : "default"}
              sx={{
                fontWeight: 750,
                fontSize: "0.72rem",
                px: 1.5,
                py: 2,
                borderRadius: 3,
                boxShadow: filter === cat ? "0 4px 12px rgba(176,122,63,0.25)" : "none",
                cursor: "pointer",
                transition: "all 0.25s",
              }}
            />
          ))}
        </div>

        {/* Responsive Masonry Layout using CSS Columns */}
        {loading ? (
          <div className="text-center py-24 bg-white/65 backdrop-blur shadow-sm border rounded-3xl max-w-lg mx-auto">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <Typography variant="body1" sx={{ fontWeight: 700, color: "text.secondary" }}>
              Loading campaign media...
            </Typography>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-20 bg-white/65 backdrop-blur shadow-sm border rounded-3xl max-w-lg mx-auto">
            <span className="text-5xl block mb-4">🖼️</span>
            <Typography variant="h6" sx={{ fontWeight: 800, color: "text.primary" }}>
              No Media Found
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1, px: 4 }}>
              There are no uploaded assets in the {filter !== "ALL" ? filter.toLowerCase() : ""} campaign category yet. Check back later!
            </Typography>
          </div>
        ) : (
          <motion.div
            layout
            className="columns-1 sm:columns-2 md:columns-3 gap-6 max-w-7xl mx-auto px-4 space-y-6"
          >
            {filteredItems.map((item, idx) => (
              <motion.div
                layout
                key={item.id}
                onClick={() => setLightboxIndex(idx)}
                whileHover={{ scale: 1.02, y: -4 }}
                transition={{ duration: 0.3 }}
                className="break-inside-avoid relative overflow-hidden rounded-3xl shadow-sm border border-gray-100 cursor-pointer group bg-white"
              >
                <img
                  src={item.src}
                  alt={item.title}
                  className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 p-6 flex flex-col justify-end">
                  <Chip
                    label={item.category.toUpperCase()}
                    size="small"
                    sx={{
                      alignSelf: "flex-start",
                      mb: 1.5,
                      bgcolor: "primary.main",
                      color: "white",
                      fontWeight: 700,
                      fontSize: "0.6rem",
                    }}
                  />
                  <Typography variant="subtitle1" sx={{ color: "white", fontWeight: 800 }}>
                    {item.title}
                  </Typography>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Interactive Lightbox Overlay */}
        <AnimatePresence>
          {lightboxIndex > -1 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setLightboxIndex(-1)}
              className="fixed inset-0 bg-black/95 z-[999] flex items-center justify-center select-none"
            >
              <IconButton
                onClick={() => setLightboxIndex(-1)}
                sx={{ position: "absolute", top: 20, right: 20, color: "white", bgcolor: "white/10" }}
              >
                <CloseIcon />
              </IconButton>

              <IconButton
                onClick={handlePrev}
                sx={{ position: "absolute", left: 20, color: "white", bgcolor: "white/10" }}
              >
                <ChevronLeftIcon fontSize="large" />
              </IconButton>

              <div 
                className="relative max-w-5xl max-h-[80vh] px-4 flex flex-col items-center justify-center"
                onClick={(e) => e.stopPropagation()}
              >
                <motion.img
                  key={lightboxIndex}
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.35 }}
                  src={filteredItems[lightboxIndex].fullSrc}
                  alt={filteredItems[lightboxIndex].title}
                  className="max-w-full max-h-[75vh] object-contain rounded-2xl shadow-2xl"
                />
                <div className="text-center mt-4">
                  <Typography variant="subtitle1" sx={{ color: "white", fontWeight: 700 }}>
                    {filteredItems[lightboxIndex].title}
                  </Typography>
                  <Typography variant="caption" sx={{ color: "white/60", mt: 0.5 }}>
                    Category: {filteredItems[lightboxIndex].category}
                  </Typography>
                </div>
              </div>

              <IconButton
                onClick={handleNext}
                sx={{ position: "absolute", right: 20, color: "white", bgcolor: "white/10" }}
              >
                <ChevronRightIcon fontSize="large" />
              </IconButton>
            </motion.div>
          )}
        </AnimatePresence>
      </SiteContainer>
    </motion.div>
  );
}

export default MediaGallery;
