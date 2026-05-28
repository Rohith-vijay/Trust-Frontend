import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { pageVariants, pageTransition } from "../constants/motionVariants";
import NotFound from "./NotFound";
import databaseService from "../services/databaseService";
import { DetailSkeleton } from "../components/SkeletonLoader";
import MasonryGallery from "../components/MasonryGallery";
import MediaEmbed from "../components/MediaEmbed";
import { Typography, Button, CircularProgress, Card, CardContent, Chip } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PlaceIcon from '@mui/icons-material/Place';
import InfoIcon from '@mui/icons-material/Info';
import InstagramIcon from '@mui/icons-material/Instagram';
import YouTubeIcon from '@mui/icons-material/YouTube';
import FacebookIcon from '@mui/icons-material/Facebook';
import LanguageIcon from '@mui/icons-material/Language';
import HelpOutlineIcon from '@mui/icons-material/HelpOutlineOutlined';
import ImageSearchIcon from '@mui/icons-material/ImageSearch';
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const highlightsRef = useRef(null);

  useEffect(() => {
    let ignore = false;
    databaseService
      .getEventById(id)
      .then((data) => { if (!ignore) setEvent(data); })
      .catch((err) => {
        if (!ignore) {
          console.error("Failed to load event:", err);
          setNotFound(true);
        }
      })
      .finally(() => { if (!ignore) setLoading(false); });
    return () => { ignore = true; };
  }, [id]);

  if (loading) {
    return <DetailSkeleton />;
  }

  if (notFound || !event) {
    return <NotFound />;
  }

  const allBannerImages = event.bannerUrl ? event.bannerUrl.split(',').map(s => s.trim()).filter(Boolean) : [];
  const photos = event.media?.filter((m) => m.mediaType === "IMAGE").map((m) => m.mediaUrl) || event.photos || [];
  const videos = event.media?.filter((m) => m.mediaType === "VIDEO").map((m) => m.mediaUrl) || event.videos || [];
  
  // Use cover/hero or banner image
  const headerImage = event.heroImageUrl || allBannerImages[0] || event.image || photos[0] || null;
  const extraImages = [...allBannerImages.slice(1), ...photos];

  // Map into structured assets for Masonry Gallery
  const masonryAssets = [
    ...(event.media?.map((m, idx) => ({
      id: `m-${idx}`,
      url: m.mediaUrl,
      mediaType: m.mediaType,
      caption: event.title + " Media Showcase",
      aspectRatio: m.mediaType === "VIDEO" ? 1.77 : 1.33
    })) || []),
    ...allBannerImages.slice(1).map((url, idx) => ({
      id: `b-${idx}`,
      url: url,
      mediaType: "IMAGE",
      caption: event.title + " Gallery View",
      aspectRatio: 1.33
    }))
  ].filter((item, index, self) => self.findIndex(t => t.url === item.url) === index);

  const displayDate = (() => {
    if (!event.eventDate) return event.date || "";
    const d = new Date(event.eventDate);
    if (isNaN(d.getTime())) return event.date || "";
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
  })();

  const status = (event.status || 'UPCOMING').toUpperCase();

  const scrollToHighlights = () => {
    if (highlightsRef.current) {
      highlightsRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={pageTransition}
      className="bg-warmBg min-h-screen pb-20 font-body text-gray-800"
    >
      {/* Header Image Cinematic Overlay */}
      <div className="relative h-[380px] md:h-[480px] overflow-hidden">
        {headerImage ? (
          <motion.img
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 10, ease: "easeOut" }}
            src={headerImage}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-brand-navy-dark" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-navy-dark via-brand-navy-dark/45 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 max-w-7xl mx-auto px-6 pb-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="flex flex-wrap gap-2 items-center mb-3">
              {event.category && (
                <Chip
                  label={event.category.toUpperCase()}
                  size="small"
                  sx={{
                    fontWeight: 800,
                    fontSize: '0.65rem',
                    bgcolor: 'primary.main',
                    color: 'white',
                    letterSpacing: '1px',
                    boxShadow: '0 4px 12px rgba(176, 122, 63, 0.3)'
                  }}
                />
              )}
              <Chip
                label={status}
                size="small"
                variant="outlined"
                sx={{
                  fontWeight: 800,
                  fontSize: '0.65rem',
                  borderColor: status === 'COMPLETED' ? 'gray' : status === 'ONGOING' ? '#3B82F6' : '#F59E0B',
                  color: status === 'COMPLETED' ? '#E2E8F0' : status === 'ONGOING' ? '#93C5FD' : '#FDE68A',
                  letterSpacing: '0.5px'
                }}
              />
            </div>
            <Typography variant="h2" component="h1" sx={{ color: 'white', fontWeight: 900, mb: 1.5, fontSize: { xs: '2rem', md: '3.2rem' }, textShadow: '0 4px 12px rgba(0,0,0,0.4)', lineHeight: 1.25 }}>
              {event.title}
            </Typography>
            {event.subtitle && (
              <p className="text-white/80 font-light text-lg md:text-xl max-w-3xl leading-relaxed">
                {event.subtitle}
              </p>
            )}
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-10 relative z-10">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* ─── LEFT COLUMN: MAIN DESCRIPTION (2/3) ─── */}
          <div className="w-full lg:w-2/3 space-y-8">
            
            {/* Description & Narrative */}
            <Card sx={{ borderRadius: 6, boxShadow: '0 10px 30px rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.03)', p: { xs: 3, md: 5 } }}>
              <CardContent sx={{ p: 0 }} className="space-y-6">
                <Typography variant="h5" sx={{ fontWeight: 800, mb: 3, color: 'text.primary', position: 'relative', pb: 1, '&::after': { content: '""', position: 'absolute', bottom: 0, left: 0, width: 45, height: 3, bgcolor: 'primary.main', borderRadius: 2 } }}>
                  About This Initiative
                </Typography>
                <Typography variant="body1" sx={{ fontSize: '1.05rem', lineHeight: 1.85, color: 'text.secondary', whiteSpace: 'pre-line' }}>
                  {event.description}
                </Typography>
              </CardContent>
            </Card>

            {/* Event Highlights Showcase Section */}
            {event.highlights && event.highlights.length > 0 && (
              <div ref={highlightsRef} className="scroll-mt-24">
                <Card sx={{ borderRadius: 6, boxShadow: '0 10px 30px rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.03)', p: { xs: 3, md: 5 } }}>
                  <CardContent sx={{ p: 0 }}>
                    <Typography variant="h5" sx={{ fontWeight: 800, mb: 3, color: 'text.primary', position: 'relative', pb: 1, '&::after': { content: '""', position: 'absolute', bottom: 0, left: 0, width: 45, height: 3, bgcolor: 'primary.main', borderRadius: 2 } }}>
                      Initiative Highlights & Impact Showcase
                    </Typography>
                    
                    <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-100 mt-6 bg-gray-50">
                      <Swiper
                        modules={[Navigation, Pagination, Autoplay]}
                        navigation
                        pagination={{ clickable: true }}
                        autoplay={{ delay: 3500, disableOnInteraction: false }}
                        spaceBetween={15}
                        slidesPerView={1}
                        className="h-[320px] md:h-[380px]"
                      >
                        {event.highlights.map((url, i) => (
                          <SwiperSlide key={i}>
                            <img src={url} className="w-full h-full object-cover" loading="lazy" alt={`Highlight ${i + 1}`} onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/800x600?text=Media+Unavailable'; }} />
                          </SwiperSlide>
                        ))}
                      </Swiper>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Campaign/Initiative Photo Gallery */}
            {masonryAssets.length > 0 && (
              <Card sx={{ borderRadius: 6, boxShadow: '0 10px 30px rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.03)', p: { xs: 3, md: 5 } }}>
                <CardContent sx={{ p: 0 }}>
                  <Typography variant="h5" sx={{ fontWeight: 800, mb: 3, color: 'text.primary', position: 'relative', pb: 1, '&::after': { content: '""', position: 'absolute', bottom: 0, left: 0, width: 45, height: 3, bgcolor: 'primary.main', borderRadius: 2 } }}>
                    Initiative Gallery
                  </Typography>
                  <div className="mt-6">
                    <MasonryGallery assets={masonryAssets} />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Dynamic Relational FAQs - MOVED TO BOTTOM */}
            {event.faqs && event.faqs.length > 0 && (
              <Card sx={{ borderRadius: 6, boxShadow: '0 10px 30px rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.03)', p: { xs: 3, md: 5 } }}>
                <CardContent sx={{ p: 0 }}>
                  <Typography variant="h5" sx={{ fontWeight: 800, mb: 3, color: 'text.primary', position: 'relative', pb: 1, '&::after': { content: '""', position: 'absolute', bottom: 0, left: 0, width: 45, height: 3, bgcolor: 'primary.main', borderRadius: 2 } }}>
                    Frequently Asked Questions
                  </Typography>
                  
                  <div className="space-y-4 mt-6">
                    {event.faqs.map((faq, idx) => (
                      <div key={faq.id || idx} className="p-5 rounded-2xl bg-white border border-gray-100 shadow-xs hover:border-brand-gold/20 transition-all duration-300">
                        <Typography variant="subtitle1" sx={{ fontWeight: 800, color: 'text.primary', mb: 1, display: 'flex', gap: 1, alignItems: 'center' }}>
                          <HelpOutlineIcon className="text-brand-gold" fontSize="small" /> {faq.question}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6, pl: 4 }}>
                          {faq.answer}
                        </Typography>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* ─── RIGHT COLUMN: STICKY INFO PANEL (1/3) ─── */}
          <div className="w-full lg:w-1/3 lg:sticky lg:top-24 space-y-6">
            
            <Card sx={{ borderRadius: 6, border: '1px solid rgba(176,122,63,0.1)', boxShadow: '0 20px 40px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
              <div className={`h-2 ${status === 'COMPLETED' ? 'bg-gray-400' : status === 'ONGOING' ? 'bg-brand-blue-600' : 'bg-brand-gold'}`} />
              <CardContent sx={{ p: 4 }} className="flex flex-col gap-6">
                <Typography variant="h6" sx={{ fontWeight: 850, color: 'text.primary', borderBottom: '1px solid #f3f4f6', pb: 2 }}>
                  Initiative Summary
                </Typography>
                
                {/* Meta list */}
                <div className="space-y-4">
                  {displayDate && (
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center shrink-0 border border-amber-100">
                        <CalendarMonthIcon sx={{ fontSize: 16, color: 'primary.main' }} />
                      </div>
                      <div>
                        <Typography variant="caption" color="text.disabled" sx={{ fontWeight: 800, letterSpacing: 0.5, fontSize: '0.65rem' }}>DATE SCHEDULE</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 800, color: 'text.primary' }}>{displayDate}</Typography>
                      </div>
                    </div>
                  )}

                  {event.location && (
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center shrink-0 border border-amber-100">
                        <PlaceIcon sx={{ fontSize: 16, color: 'primary.main' }} />
                      </div>
                      <div>
                        <Typography variant="caption" color="text.disabled" sx={{ fontWeight: 800, letterSpacing: 0.5, fontSize: '0.65rem' }}>INITIATIVE VENUE</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 800, color: 'text.primary' }}>{event.location}</Typography>
                      </div>
                    </div>
                  )}

                  {event.registrationDeadline && status !== 'COMPLETED' && (
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-xl bg-rose-50 flex items-center justify-center shrink-0 border border-rose-100">
                        <InfoIcon sx={{ fontSize: 16, color: 'error.main' }} />
                      </div>
                      <div>
                        <Typography variant="caption" color="text.disabled" sx={{ fontWeight: 800, letterSpacing: 0.5, fontSize: '0.65rem' }}>APPLICATION DEADLINE</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 800, color: 'error.main' }}>
                          {event.registrationDeadline && !isNaN(new Date(event.registrationDeadline).getTime())
                            ? new Date(event.registrationDeadline).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })
                            : "—"}
                        </Typography>
                      </div>
                    </div>
                  )}
                </div>

                {/* Progress bar */}
                {event.maxVolunteers && event.maxVolunteers > 0 && status !== 'COMPLETED' && (
                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <div className="flex justify-between text-xs text-gray-500 mb-1.5 font-bold">
                      <span>Occupied Seats</span>
                      <span>{event.currentVolunteerCount || 0} / {event.maxVolunteers}</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-500 rounded-full ${status === 'ONGOING' ? 'bg-brand-blue-600' : 'bg-brand-gold'}`} 
                        style={{ width: `${Math.min(100, ((event.currentVolunteerCount || 0) / event.maxVolunteers) * 100)}%` }}
                      />
                    </div>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1, fontSize: '0.7rem', fontStyle: 'italic' }}>
                      {Math.max(0, event.maxVolunteers - (event.currentVolunteerCount || 0))} slots remaining before roster lock.
                    </Typography>
                  </div>
                )}

                {/* Dynamic Sidebar CTA Action */}
                {status === "COMPLETED" ? (
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={scrollToHighlights}
                    sx={{ 
                      py: 1.5, 
                      borderRadius: 3, 
                      fontWeight: 800,
                      bgcolor: '#F3F4F6',
                      color: '#374151',
                      border: '1px solid #E5E7EB',
                      boxShadow: 'none',
                      textTransform: 'none',
                      '&:hover': {
                        bgcolor: '#E5E7EB'
                      }
                    }}
                  >
                    View Highlights & Gallery
                  </Button>
                ) : status === "ONGOING" ? (
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={() => navigate(`/volunteer?eventId=${event.id}`)}
                    sx={{ 
                      py: 1.6, 
                      borderRadius: 3, 
                      fontWeight: 800, 
                      fontSize: '0.92rem',
                      textTransform: 'none',
                      background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
                      boxShadow: '0 6px 20px rgba(37, 99, 235, 0.25)',
                      transition: 'all 0.3s',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 10px 25px rgba(37, 99, 235, 0.35)',
                        background: 'linear-gradient(135deg, #1D4ED8 0%, #1E40AF 100%)'
                      }
                    }}
                  >
                    Join Initiative Now
                  </Button>
                ) : (
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={() => navigate(`/volunteer?eventId=${event.id}`)}
                    sx={{ 
                      py: 1.6, 
                      borderRadius: 3, 
                      fontWeight: 850, 
                      fontSize: '0.92rem',
                      textTransform: 'none',
                      bgcolor: 'primary.main',
                      boxShadow: '0 6px 20px rgba(176, 122, 63, 0.25)',
                      transition: 'all 0.3s',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 10px 25px rgba(176, 122, 63, 0.35)',
                        bgcolor: 'brand-navy-dark'
                      }
                    }}
                  >
                    Apply as a Volunteer
                  </Button>
                )}

                <div className="text-[10px] text-gray-400 text-center flex justify-center items-center gap-1.5 pt-2">
                  <span>🔒 Verified secure application portal</span>
                </div>
              </CardContent>
            </Card>

            {/* Social Media & External Embed Integrations */}
            {(event.instagramUrl || event.youtubeUrl || event.facebookUrl || event.externalMediaUrl) && (
              <Card sx={{ borderRadius: 6, boxShadow: '0 10px 30px rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.03)', p: 3.5 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 850, color: 'text.secondary', mb: 2.5, textTransform: 'uppercase', letterSpacing: 0.5, fontSize: '0.72rem' }}>
                  External Media Integrations
                </Typography>
                <div className="grid grid-cols-2 gap-3">
                  {event.instagramUrl && (
                    <a href={event.instagramUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center p-3 rounded-xl border border-gray-150 hover:bg-gray-50 text-pink-600 transition-colors gap-2 text-xs font-bold shadow-xs bg-white">
                      <InstagramIcon fontSize="small" /> Instagram
                    </a>
                  )}
                  {event.youtubeUrl && (
                    <a href={event.youtubeUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center p-3 rounded-xl border border-gray-150 hover:bg-gray-50 text-red-600 transition-colors gap-2 text-xs font-bold shadow-xs bg-white">
                      <YouTubeIcon fontSize="small" /> YouTube
                    </a>
                  )}
                  {event.facebookUrl && (
                    <a href={event.facebookUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center p-3 rounded-xl border border-gray-150 hover:bg-gray-50 text-blue-600 transition-colors gap-2 text-xs font-bold shadow-xs bg-white">
                      <FacebookIcon fontSize="small" /> Facebook
                    </a>
                  )}
                  {event.externalMediaUrl && (
                    <a href={event.externalMediaUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center p-3 rounded-xl border border-gray-150 hover:bg-gray-50 text-brand-navy-dark transition-colors gap-2 text-xs font-bold shadow-xs bg-white">
                      <LanguageIcon fontSize="small" /> Media Link
                    </a>
                  )}
                </div>
              </Card>
            )}

            {/* Quick Share Link */}
            <div className="flex justify-between items-center p-4 bg-white rounded-2xl border border-gray-100 shadow-sm text-xs font-semibold text-gray-500">
              <span>Spread the word!</span>
              <Button 
                size="small"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  window.dispatchEvent(new CustomEvent("app-toast", { detail: { message: "Link copied to clipboard!", severity: "success" } }));
                }}
                sx={{ textTransform: 'none', fontWeight: 800, borderRadius: 2 }}
              >
                Copy Page Link
              </Button>
            </div>

          </div>

        </div>

        {/* Cinematic Video Embed Updates */}
        {videos.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-16 mb-12">
            <Typography variant="h4" sx={{ fontWeight: 800, mb: 4, color: 'text.primary', fontHeading: true }}>Campaign Video Updates</Typography>
            <div className="space-y-8">
              {videos.map((vid, i) => (
                <MediaEmbed
                  key={i}
                  url={vid}
                  posterUrl={headerImage}
                  caption={`${event.title} - Video Update #${i + 1}`}
                  aspectRatio="16/9"
                />
              ))}
            </div>
          </motion.div>
        )}

        <Button
          onClick={() => navigate("/events")}
          startIcon={<ArrowBackIcon />}
          sx={{ mt: 6, fontWeight: 800, textTransform: 'none', fontSize: '0.9rem' }}
          color="primary"
        >
          Back to Initiatives
        </Button>
      </div>
    </motion.div>
  );
}

export default EventDetails;
