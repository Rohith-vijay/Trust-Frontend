import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { pageVariants, pageTransition, sectionVariants } from "../constants/motionVariants";
import { Typography, IconButton, Box, Chip } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import SiteContainer from "../components/SiteContainer";

const galleryItems = [
  {
    id: 1,
    category: "Education",
    title: "Primary Digital Literacy Camp",
    src: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&w=600&q=80",
    fullSrc: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 2,
    category: "Water Relief",
    title: "Borewell Setup in Rural Outskirts",
    src: "https://images.unsplash.com/photo-1541913496-527181cf800f?auto=format&fit=crop&w=600&q=80",
    fullSrc: "https://images.unsplash.com/photo-1541913496-527181cf800f?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 3,
    category: "Green Camps",
    title: "Community Afforestation Drive",
    src: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=600&q=80",
    fullSrc: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 4,
    category: "Healthcare",
    title: "Mobile Health Clinic Camp",
    src: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=600&q=80",
    fullSrc: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 5,
    category: "Education",
    title: "Study Material Distribution",
    src: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=600&q=80",
    fullSrc: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 6,
    category: "Water Relief",
    title: "School Water Filtration Audit",
    src: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=600&q=80",
    fullSrc: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 7,
    category: "Green Camps",
    title: "Urban Seed Sowing",
    src: "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=600&q=80",
    fullSrc: "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=1200&q=80",
  },
];

function MediaGallery() {
  const [filter, setFilter] = useState("ALL");
  const [lightboxIndex, setLightboxIndex] = useState(-1);

  const categories = ["ALL", "EDUCATION", "WATER RELIEF", "GREEN CAMPS", "HEALTHCARE"];

  const filteredItems = React.useMemo(() => {
    if (filter === "ALL") return galleryItems;
    return galleryItems.filter((i) => i.category.toUpperCase() === filter);
  }, [filter]);

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
