import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import databaseService from "../services/databaseService";
import { DetailSkeleton } from "../components/SkeletonLoader";
import MasonryGallery from "../components/MasonryGallery";
import MediaEmbed from "../components/MediaEmbed";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import StarIcon from "@mui/icons-material/Star";
import ShareIcon from "@mui/icons-material/Share";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutlineOutlined";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import CloseIcon from "@mui/icons-material/Close";

export default function StoryDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isResizing, setIsResizing] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [showShareToast, setShowShareToast] = useState(false);

  useEffect(() => {
    let ignore = false;
    async function fetchStory() {
      try {
        setLoading(true);
        const data = await databaseService.getStoryById(id);
        if (!ignore) setStory(data);
      } catch (err) {
        if (!ignore) {
          console.error("Error fetching success story:", err);
          setError("Failed to load this success story. It may have been removed.");
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    fetchStory();
    return () => { ignore = true; };
  }, [id]);

  if (loading) return <DetailSkeleton />;

  if (error || !story) {
    return (
      <div className="min-h-screen bg-warmBg flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-3xl font-bold text-brand-navy-dark mb-4">Story Not Found</h2>
        <p className="text-gray-600 mb-8 max-w-md">{error || "The story you are looking for does not exist."}</p>
        <Link
          to="/"
          className="inline-flex items-center px-6 py-3 bg-brand-gold text-white font-medium rounded-full shadow-lg hover:bg-opacity-90 transition-all duration-300"
        >
          <ArrowBackIcon className="mr-2" /> Back to Home
        </Link>
      </div>
    );
  }

  // Handle Before/After image comparison slider dragging
  const handleMove = (clientX, rect) => {
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  const handleTouchMove = (e) => {
    const container = e.currentTarget.getBoundingClientRect();
    if (e.touches[0]) {
      handleMove(e.touches[0].clientX, container);
    }
  };

  const handleMouseMove = (e) => {
    if (e.buttons === 1 || isResizing) {
      const container = e.currentTarget.getBoundingClientRect();
      handleMove(e.clientX, container);
    }
  };

  // Video embed helper
  const getEmbedUrl = (url) => {
    if (!url) return null;
    if (url.includes("youtube.com/watch")) {
      const videoId = new URL(url).searchParams.get("v");
      return `https://www.youtube.com/embed/${videoId}`;
    }
    if (url.includes("youtu.be/")) {
      const videoId = url.split("youtu.be/")[1]?.split("?")[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    return url;
  };

  const videoEmbed = getEmbedUrl(story.videoUrl);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setShowShareToast(true);
    setTimeout(() => setShowShareToast(false), 3000);
  };

  const openLightbox = (index) => {
    setGalleryIndex(index);
    setSelectedImage(story.gallery[index]?.url);
  };

  const nextLightboxImage = () => {
    const nextIdx = (galleryIndex + 1) % story.gallery.length;
    setGalleryIndex(nextIdx);
    setSelectedImage(story.gallery[nextIdx]?.url);
  };

  const prevLightboxImage = () => {
    const prevIdx = (galleryIndex - 1 + story.gallery.length) % story.gallery.length;
    setGalleryIndex(prevIdx);
    setSelectedImage(story.gallery[prevIdx]?.url);
  };

  return (
    <div className="min-h-screen bg-warmBg pb-16 font-body text-gray-800">
      {/* Cinematic Hero Section */}
      <div className="relative h-[65vh] w-full overflow-hidden bg-black">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-70 transform scale-105 transition-transform duration-[10s] ease-out"
          style={{ backgroundImage: `url(${story.imageUrl})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-navy-dark via-brand-navy-dark/40 to-transparent" />
        
        {/* Floating Top Nav */}
        <div className="absolute top-6 left-6 z-20">
          <Link
            to="/"
            className="inline-flex items-center justify-center p-3 rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-all border border-white/10"
          >
            <ArrowBackIcon />
          </Link>
        </div>

        {/* Hero Title Container */}
        <div className="absolute inset-x-0 bottom-0 max-w-6xl mx-auto px-6 pb-12 z-10 text-white flex flex-col justify-end">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {story.category && (
              <span className="px-3 py-1 bg-brand-gold text-white text-xs font-bold uppercase tracking-wider rounded-full mb-4 inline-block shadow-md">
                {story.category}
              </span>
            )}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading mb-3 tracking-tight leading-tight max-w-4xl text-white">
              {story.title}
            </h1>
            {story.subtitle && (
              <p className="text-xl text-yellow-100/90 font-light max-w-2xl mb-4 leading-relaxed">
                {story.subtitle}
              </p>
            )}
            
            <div className="flex flex-wrap gap-4 items-center text-sm text-gray-300">
              {story.location && (
                <div className="flex items-center bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm border border-white/5">
                  <LocationOnIcon className="text-brand-gold mr-1" fontSize="small" />
                  <span>{story.location}</span>
                </div>
              )}
              {story.featured && (
                <div className="flex items-center bg-brand-gold/20 text-brand-gold px-3 py-1 rounded-full border border-brand-gold/30">
                  <StarIcon className="mr-1" fontSize="small" />
                  <span>Featured Impact</span>
                </div>
              )}
              <button
                onClick={handleShare}
                className="flex items-center bg-white/10 hover:bg-white/20 px-4 py-1 rounded-full transition-all border border-white/10"
              >
                <ShareIcon className="mr-1.5" fontSize="small" /> Share Story
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left 2 Columns: Main Content */}
        <div className="lg:col-span-2 space-y-12">
          {/* Main Story Text */}
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-6"
          >
            <div className="first-letter:text-6xl first-letter:font-bold first-letter:text-brand-gold first-letter:mr-3 first-letter:float-left text-lg leading-relaxed font-light text-gray-600 border-l-4 border-brand-gold pl-4 py-1 italic mb-6">
              {story.description.substring(0, Math.min(story.description.length, 120))}...
            </div>
            <p className="whitespace-pre-line text-gray-700">
              {story.description.substring(Math.min(story.description.length, 120))}
            </p>
          </motion.section>

          {/* Before/After Interactive Slider */}
          {story.beforeImageUrl && story.afterImageUrl && (
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <h3 className="text-2xl font-bold text-brand-navy-dark font-heading">The Transformation</h3>
              <div 
                className="relative h-[450px] w-full rounded-2xl overflow-hidden shadow-2xl select-none cursor-ew-resize border border-gray-200"
                onTouchMove={handleTouchMove}
                onMouseMove={handleMouseMove}
                onMouseDown={() => setIsResizing(true)}
                onMouseUp={() => setIsResizing(false)}
                onMouseLeave={() => setIsResizing(false)}
              >
                {/* After Image (Background) */}
                  <img
                    src={story.afterImageUrl}
                    alt="Transformation After"
                    className="absolute inset-0 h-full w-full object-cover"
                    draggable="false"
                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/800x450?text=Image+Unavailable'; }}
                  />
                <div className="absolute bottom-4 right-4 bg-brand-navy-dark/80 text-white text-xs font-bold uppercase tracking-widest px-3 py-1 rounded backdrop-blur">
                  After Impact
                </div>

                {/* Before Image (Foreground) */}
                <div
                  className="absolute inset-0 overflow-hidden"
                  style={{ width: `${sliderPosition}%` }}
                >
                    <img
                      src={story.beforeImageUrl}
                      alt="Transformation Before"
                      className="absolute inset-0 h-[450px] w-full object-cover max-w-none"
                      style={{ width: "100%" }}
                      draggable="false"
                      onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/800x450?text=Image+Unavailable'; }}
                    />
                  <div className="absolute bottom-4 left-4 bg-brand-gold/90 text-white text-xs font-bold uppercase tracking-widest px-3 py-1 rounded backdrop-blur">
                    Before Impact
                  </div>
                </div>

                {/* Slider Handle */}
                <div
                  className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize flex items-center justify-center shadow-lg"
                  style={{ left: `${sliderPosition}%` }}
                >
                  <div className="w-8 h-8 rounded-full bg-brand-gold border-2 border-white flex items-center justify-center text-white text-xs shadow-lg">
                    ↔
                  </div>
                </div>
              </div>
              <p className="text-sm text-center text-gray-500 italic">Drag the slider horizontally to compare before (left) and after (right) states.</p>
            </motion.section>
          )}

          {/* Cinematic Video Section */}
          {story.videoUrl && (
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <h3 className="text-2xl font-bold text-brand-navy-dark font-heading flex items-center">
                <PlayCircleOutlineIcon className="text-brand-gold mr-2" fontSize="large" /> Journey Video
              </h3>
              <MediaEmbed
                url={story.videoUrl}
                posterUrl={story.imageUrl}
                caption={`${story.title} - Journey Highlight`}
                aspectRatio="16/9"
              />
            </motion.section>
          )}

          {/* Milestones / Story Timeline */}
          {story.timeline && story.timeline.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h3 className="text-2xl font-bold text-brand-navy-dark font-heading">Key Milestones</h3>
              <div className="relative pl-6 border-l-2 border-brand-gold/30 space-y-10 py-2 ml-4">
                {story.timeline.map((milestone, idx) => (
                  <div key={milestone.id || idx} className="relative group">
                    {/* Circle Node */}
                    <div className="absolute -left-[33px] top-1.5 w-4 h-4 rounded-full bg-brand-gold border-4 border-warmBg group-hover:scale-125 transition-transform duration-300 shadow-md" />
                    
                    <div className="glass-panel p-6 rounded-xl hover:shadow-lg transition-all border border-brand-gold/15 bg-white/60">
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                        <span className="text-sm font-bold text-brand-gold bg-brand-gold/10 px-3 py-1 rounded-full flex items-center">
                          <AccessTimeIcon className="mr-1" fontSize="inherit" /> {milestone.date}
                        </span>
                      </div>
                      <h4 className="text-xl font-bold text-brand-navy-dark font-heading mb-2">{milestone.title}</h4>
                      <p className="text-gray-600 leading-relaxed">{milestone.description}</p>
                      
                      {milestone.imageUrl && (
                        <div className="mt-4 rounded-lg overflow-hidden max-h-[250px] border border-gray-100">
                          <img src={milestone.imageUrl} alt={milestone.title} className="w-full h-full object-cover" onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/400x250?text=Milestone+Image+Missing'; }} />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>
          )}
        </div>

        {/* Right Sidebar Column: Impact Summary & Gallery */}
        <div className="space-y-8">
          {/* Key Impact Stats Card */}
          {story.metrics && story.metrics.length > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="glass-panel-gold p-8 rounded-2xl shadow-xl text-center flex flex-col items-center border border-brand-gold/30"
            >
              <h3 className="text-2xl font-bold text-brand-navy-dark font-heading mb-6 border-b border-brand-gold/20 pb-4 w-full">
                Impact Metrics
              </h3>
              <div className="space-y-6 w-full">
                {story.metrics.map((metric, idx) => (
                  <div 
                    key={metric.id || idx}
                    className="flex flex-col items-center bg-white/40 p-4 rounded-xl border border-brand-gold/10"
                  >
                    <span className="text-3xl font-extrabold text-brand-navy-dark font-heading mb-1 block">
                      {metric.value}
                    </span>
                    <span className="text-sm font-semibold text-brand-gold uppercase tracking-wider">
                      {metric.label}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Testimonial Panel */}
          {story.testimonialQuote && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass-panel p-6 rounded-2xl shadow-md border-l-4 border-l-brand-gold relative overflow-hidden bg-white/80"
            >
              <FormatQuoteIcon className="absolute right-4 top-4 text-brand-gold/10 transform rotate-180" style={{ fontSize: "80px" }} />
              <p className="text-lg italic text-gray-700 leading-relaxed mb-4 relative z-10">
                "{story.testimonialQuote}"
              </p>
              {story.testimonialAuthor && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-brand-navy-dark flex items-center justify-center text-white font-bold shadow-md">
                    {story.testimonialAuthor.charAt(0)}
                  </div>
                  <div>
                    <h5 className="font-bold text-brand-navy-dark text-sm">{story.testimonialAuthor}</h5>
                    <p className="text-xs text-gray-500">Beneficiary / Partner</p>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Image Gallery */}
          {story.gallery && story.gallery.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <h3 className="text-2xl font-bold text-brand-navy-dark font-heading">Gallery</h3>
              <MasonryGallery 
                assets={story.gallery.map(g => ({
                  id: g.id,
                  url: g.url,
                  thumbnailUrl: g.thumbnailUrl || g.url,
                  mediaType: g.mediaType || "IMAGE",
                  caption: g.caption || `${story.title} - Gallery Detail`,
                  aspectRatio: g.aspectRatio || 1.33
                }))} 
              />
            </motion.div>
          )}
        </div>
      </div>

      {/* Floating Share Success Toast */}
      <AnimatePresence>
        {showShareToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 bg-brand-navy-dark text-white px-6 py-3 rounded-full flex items-center shadow-2xl border border-brand-gold/30"
          >
            <CheckCircleIcon className="text-brand-gold mr-2" /> Link copied to clipboard!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
