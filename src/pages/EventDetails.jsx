import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { pageVariants, pageTransition } from "../constants/motionVariants";
import databaseService from "../services/databaseService";
import NotFound from "./NotFound";
import { Typography, Button, CircularProgress, Card, CardContent, Chip } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PlaceIcon from '@mui/icons-material/Place';
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

  useEffect(() => {
    databaseService
      .getEventById(id)
      .then((data) => setEvent(data))
      .catch((err) => {
        console.error("Failed to load event:", err);
        setNotFound(true);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-gray-400">
        <CircularProgress size={48} thickness={4} />
        <Typography sx={{ mt: 3 }}>Loading event details...</Typography>
      </div>
    );
  }

  if (notFound || !event) {
    return <NotFound />;
  }

  const allBannerImages = event.bannerUrl ? event.bannerUrl.split(',').map(s => s.trim()).filter(Boolean) : [];
  const photos = event.media?.filter((m) => m.mediaType === "IMAGE").map((m) => m.mediaUrl) || event.photos || [];
  const videos = event.media?.filter((m) => m.mediaType === "VIDEO").map((m) => m.mediaUrl) || event.videos || [];
  
  const headerImage = allBannerImages[0] || event.image || photos[0] || null;
  const extraImages = [...allBannerImages.slice(1), ...photos];

  const displayDate = event.eventDate
    ? new Date(event.eventDate).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })
    : event.date || "";

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={pageTransition}
      className="bg-gray-50 min-h-screen pb-20"
    >
      {/* Header Image Parallax */}
      <div className="relative h-[350px] md:h-[450px] overflow-hidden">
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
          <div className="w-full h-full bg-primary/20" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 max-w-7xl mx-auto px-6 pb-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {event.category && (
              <Chip
                label={event.category.toUpperCase()}
                size="small"
                sx={{
                  fontWeight: 750,
                  fontSize: '0.7rem',
                  bgcolor: 'primary.main',
                  color: 'white',
                  letterSpacing: '1px',
                  mb: 2,
                  boxShadow: '0 4px 12px rgba(176, 122, 63, 0.3)'
                }}
              />
            )}
            <Typography variant="h2" component="h1" sx={{ color: 'white', fontWeight: 900, mb: 2, fontSize: { xs: '2.2rem', md: '3.2rem' }, textShadow: '0 4px 10px rgba(0,0,0,0.35)', lineHeight: 1.2 }}>
              {event.title}
            </Typography>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-10 relative z-10">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* ─── LEFT COLUMN: MAIN CONTENT (2/3) ─── */}
          <div className="w-full lg:w-2/3 space-y-8">
            
            {/* Description & Media Slider */}
            <Card sx={{ borderRadius: 5, boxShadow: '0 10px 30px rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.04)', p: { xs: 3, md: 5 } }}>
              <CardContent sx={{ p: 0 }} className="space-y-8">
                <div>
                  <Typography variant="h5" sx={{ fontWeight: 800, mb: 3, color: 'text.primary', position: 'relative', pb: 1, '&::after': { content: '""', position: 'absolute', bottom: 0, left: 0, width: 40, height: 3, bgcolor: 'primary.main', borderRadius: 2 } }}>
                    About This Campaign
                  </Typography>
                  <Typography variant="body1" sx={{ fontSize: '1.08rem', lineHeight: 1.8, color: 'text.secondary', whiteSpace: 'pre-line' }}>
                    {event.description}
                  </Typography>
                </div>

                {/* Extra Media Carousel (Swiper) */}
                {extraImages.length > 0 && (
                  <div className="pt-4">
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 2.5, color: 'text.primary' }}>
                      Campaign Gallery
                    </Typography>
                    <div className="rounded-2xl overflow-hidden shadow-md border border-gray-100">
                      <Swiper
                        modules={[Navigation, Pagination, Autoplay]}
                        navigation
                        pagination={{ clickable: true }}
                        autoplay={{ delay: 4000, disableOnInteraction: false }}
                        spaceBetween={10}
                        slidesPerView={extraImages.length > 1 ? 2 : 1}
                        breakpoints={{
                          320: { slidesPerView: 1 },
                          768: { slidesPerView: extraImages.length > 1 ? 2 : 1 }
                        }}
                        className="h-[240px]"
                      >
                        {extraImages.map((url, i) => (
                          <SwiperSlide key={i}>
                            <img src={url} className="w-full h-full object-cover" loading="lazy" alt={`Gallery ${i + 1}`} />
                          </SwiperSlide>
                        ))}
                      </Swiper>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Localized FAQ Accordion */}
            <Card sx={{ borderRadius: 5, boxShadow: '0 10px 30px rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.04)', p: { xs: 3, md: 5 } }}>
              <CardContent sx={{ p: 0 }}>
                <Typography variant="h5" sx={{ fontWeight: 800, mb: 3, color: 'text.primary', position: 'relative', pb: 1, '&::after': { content: '""', position: 'absolute', bottom: 0, left: 0, width: 40, height: 3, bgcolor: 'primary.main', borderRadius: 2 } }}>
                  Frequently Asked Questions
                </Typography>
                
                <div className="space-y-4">
                  {[
                    {
                      q: "What are the primary responsibilities for volunteers in this event?",
                      a: "Responsibilities vary based on your selected skills during registration, ranging from logistics and hospitality to medical first-aid and community leadership. Details will be briefed 24 hours prior to the event."
                    },
                    {
                      q: "Are refreshments or transport provided by the NGO?",
                      a: "Yes! High-quality meals, hydration kits, and basic community travel allowances/shuttles are fully provided for all approved volunteers during the active event window."
                    },
                    {
                      q: "Can I get a certificate of contribution after the campaign?",
                      a: "Absolutely. A verified digital Certificate of Volunteering with logged contribution hours is issued instantly into your Volunteer Dashboard upon event completion."
                    }
                  ].map((faq, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-gray-50 border border-gray-100 hover:border-amber-100 transition-colors">
                      <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'text.primary', mb: 1, display: 'flex', gap: 1, alignItems: 'center' }}>
                        <span className="text-amber-600">Q.</span> {faq.q}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6, pl: 4 }}>
                        {faq.a}
                      </Typography>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Campaign Schedule Timeline */}
            <Card sx={{ borderRadius: 5, boxShadow: '0 10px 30px rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.04)', p: { xs: 3, md: 5 } }}>
              <CardContent sx={{ p: 0 }}>
                <Typography variant="h5" sx={{ fontWeight: 800, mb: 4, color: 'text.primary', position: 'relative', pb: 1, '&::after': { content: '""', position: 'absolute', bottom: 0, left: 0, width: 40, height: 3, bgcolor: 'primary.main', borderRadius: 2 } }}>
                  Event Timeline & Itinerary
                </Typography>
                
                <div className="relative pl-6 border-l-2 border-dashed border-amber-200 space-y-8 ml-4">
                  {[
                    { time: "08:30 AM", title: "Volunteers Arrival & Briefing", desc: "Report at the venue, claim your volunteer kit, and receive role-specific briefings." },
                    { time: "09:30 AM", title: "Campaign Launch & Kickoff", desc: "Welcome address from administrators and distribution of tasks." },
                    { time: "01:00 PM", title: "Community Lunch & Networking", desc: "A catered lunch break where community leaders and volunteers connect." },
                    { time: "04:30 PM", title: "Feedback, Certificate Handout & Cleanup", desc: "Reviewing metrics achieved, certificate distribution, and standard wraps." }
                  ].map((step, idx) => (
                    <div key={idx} className="relative">
                      {/* Timeline dot */}
                      <div className="absolute -left-[35px] top-1.5 w-4 h-4 rounded-full bg-amber-500 border-4 border-white shadow-md" />
                      <div className="bg-white border border-gray-100 p-4 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                        <Typography variant="caption" sx={{ fontWeight: 800, color: 'primary.main', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                          {step.time}
                        </Typography>
                        <Typography variant="subtitle1" sx={{ fontWeight: 800, mt: 0.5, mb: 1, color: 'text.primary' }}>
                          {step.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.5 }}>
                          {step.desc}
                        </Typography>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* ─── RIGHT COLUMN: STICKY INFO SIDEBAR (1/3) ─── */}
          <div className="w-full lg:w-1/3 lg:sticky lg:top-24 space-y-6">
            
            <Card sx={{ borderRadius: 5, border: '1px solid rgba(176,122,63,0.1)', boxShadow: '0 20px 40px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
              <div className="h-2 bg-gradient-to-r from-amber-500 to-amber-600" />
              <CardContent sx={{ p: 4, spaceY: 6 }} className="flex flex-col gap-5">
                <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.primary', borderBottom: '1px solid #f0f0f0', pb: 2 }}>
                  Registration Overview
                </Typography>
                
                {/* Meta details list */}
                <div className="space-y-4">
                  {displayDate && (
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center shrink-0">
                        <CalendarMonthIcon sx={{ fontSize: 16, color: 'primary.main' }} />
                      </div>
                      <div>
                        <Typography variant="caption" color="text.disabled" sx={{ fontWeight: 700, letterSpacing: 0.5 }}>DATE & SCHEDULE</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary' }}>{displayDate}</Typography>
                      </div>
                    </div>
                  )}

                  {event.location && (
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center shrink-0">
                        <PlaceIcon sx={{ fontSize: 16, color: 'primary.main' }} />
                      </div>
                      <div>
                        <Typography variant="caption" color="text.disabled" sx={{ fontWeight: 700, letterSpacing: 0.5 }}>CAMPAIGN VENUE</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary' }}>{event.location}</Typography>
                      </div>
                    </div>
                  )}

                  {event.registrationDeadline && (
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center shrink-0">
                        <CalendarMonthIcon sx={{ fontSize: 16, color: 'error.main' }} />
                      </div>
                      <div>
                        <Typography variant="caption" color="text.disabled" sx={{ fontWeight: 700, letterSpacing: 0.5 }}>DEADLINE</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 750, color: 'error.main' }}>
                          {new Date(event.registrationDeadline).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                        </Typography>
                      </div>
                    </div>
                  )}
                </div>

                {/* Progress bar for volunteer spots */}
                {event.maxVolunteers && event.maxVolunteers > 0 && (
                  <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-100">
                    <div className="flex justify-between text-xs text-gray-500 mb-1.5 font-bold">
                      <span>Occupied Seats</span>
                      <span>{event.currentVolunteerCount || 0} / {event.maxVolunteers}</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-amber-500 to-amber-600 transition-all duration-500 rounded-full" 
                        style={{ width: `${Math.min(100, ((event.currentVolunteerCount || 0) / event.maxVolunteers) * 100)}%` }}
                      />
                    </div>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1, fontSize: '0.72rem', fontStyle: 'italic' }}>
                      {event.maxVolunteers - (event.currentVolunteerCount || 0)} slots remaining before closing.
                    </Typography>
                  </div>
                )}

                {/* CTA Action button */}
                {event.status === "COMPLETED" ? (
                  <Button
                    fullWidth
                    disabled
                    variant="contained"
                    sx={{ py: 1.5, borderRadius: 3, fontWeight: 700 }}
                  >
                    Campaign Completed
                  </Button>
                ) : (
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    onClick={() => navigate(`/volunteer?eventId=${event.id}`)}
                    sx={{ 
                      py: 1.5, 
                      borderRadius: 3, 
                      fontWeight: 750, 
                      fontSize: '0.98rem',
                      textTransform: 'none',
                      boxShadow: '0 6px 20px rgba(176, 122, 63, 0.25)',
                      transition: 'all 0.3s',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 10px 25px rgba(176, 122, 63, 0.35)'
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

            {/* Localized metrics if available */}
            {event.metrics && Object.keys(event.metrics).length > 0 && (
              <Card sx={{ borderRadius: 5, boxShadow: '0 10px 30px rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.04)', p: 3 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'text.secondary', mb: 2, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  Targeted Outcomes
                </Typography>
                <div className="space-y-3">
                  {Object.entries(event.metrics).map(([key, val]) => (
                    <div key={key} className="flex justify-between items-center p-2 bg-gray-50 rounded-xl border border-gray-100">
                      <span className="text-xs text-gray-500 font-medium capitalize">{key.replace(/_/g, " ")}</span>
                      <span className="text-sm font-bold text-amber-700">{val}</span>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Quick Share option */}
            <div className="flex justify-between items-center p-4 bg-white rounded-3xl border border-gray-100 shadow-sm text-xs font-semibold text-gray-500">
              <span>Spread the word!</span>
              <Button 
                size="small"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  window.dispatchEvent(new CustomEvent("app-toast", { detail: { message: "Link copied to clipboard!", severity: "success" } }));
                }}
                sx={{ textTransform: 'none', fontWeight: 700, borderRadius: 2 }}
              >
                Copy Page Link
              </Button>
            </div>

          </div>

        </div>

        {videos.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-12 mb-12">
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 4, color: 'text.primary' }}>Campaign Video Updates</Typography>
            <div className="space-y-8">
              {videos.map((vid, i) => (
                <div key={i} className="relative w-full overflow-hidden rounded-3xl shadow-lg" style={{ paddingTop: "56.25%" }}>
                  <iframe
                    src={vid}
                    title={`Event Video ${i + 1}`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute top-0 left-0 w-full h-full"
                  />
                </div>
              ))}
            </div>
          </motion.div>
        )}

        <Button
          onClick={() => navigate("/events")}
          startIcon={<ArrowBackIcon />}
          sx={{ mt: 6, fontWeight: 700, textTransform: 'none', fontSize: '0.95rem' }}
          color="primary"
        >
          Back to Events Roster
        </Button>
      </div>
    </motion.div>
  );
}

export default EventDetails;
