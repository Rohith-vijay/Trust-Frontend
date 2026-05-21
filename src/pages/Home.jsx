import React from "react";
import Counter from "../components/Counter";
import SiteContainer from "../components/SiteContainer";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectFade } from "swiper/modules";
import 'swiper/css/effect-fade';
import { motion } from "framer-motion";
import { pageVariants, pageTransition, sectionVariants } from "../constants/motionVariants";
import { useNavigate } from "react-router-dom";
import { Card, CardMedia, CardContent, Typography, Chip, Button } from "@mui/material";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

import databaseService from "../services/databaseService";
import { AppContext } from "../context/AppContext";

// additional sections
import TeamSection from "../components/TeamSection";
import DonationCTA from "../components/DonationCTA";
import HeroSection from "../components/HeroSection";
import SuccessStoryCard from "../components/SuccessStoryCard";

function Home() {
  const [impactData, setImpactData] = React.useState([]);
  const [stories, setStories] = React.useState([]);
  const [events, setEvents] = React.useState([]);
  const { globalLoading, setGlobalLoading } = React.useContext(AppContext);
  const navigate = useNavigate();

  React.useEffect(() => {
    const fetchData = async () => {
      setGlobalLoading(true);
      try {
        const [impacts, success, eventsPage] = await Promise.all([
          databaseService.getImpactData(),
          databaseService.getSuccessStories(),
          databaseService.getEvents(0, 20),
        ]);
        setImpactData(impacts);
        setStories(success);
        setEvents(eventsPage.content || eventsPage);
      } catch (err) {
        console.error("Error fetching home data:", err);
      } finally {
        setGlobalLoading(false);
      }
    };

    fetchData();
  }, [setGlobalLoading]);

  // Build carousel slides from backend events + their media
  const eventSlides = React.useMemo(() => {
    const slides = [];
    events.forEach((ev) => {
      if (ev.media && ev.media.length > 0) {
        ev.media
          .filter((m) => m.mediaType === "IMAGE")
          .forEach((m) => {
            slides.push({
              src: m.mediaUrl,
              title: ev.title,
              caption: ev.description?.slice(0, 80) + "..." || ev.title,
              id: ev.id
            });
          });
      }
    });
    return slides;
  }, [events]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={pageTransition}
    >
      <HeroSection />

      <SiteContainer>
        {/* IMPACT COUNTERS */}
        <section className="py-24 bg-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-gray-50/50 to-white -z-10" />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <Typography variant="h3" component="h2" align="center" sx={{ fontWeight: 800, color: 'primary.main', mb: 2 }}>
              Our Impact
            </Typography>
            <Typography variant="subtitle1" align="center" color="text.secondary" sx={{ mb: 8, maxWidth: 600, mx: 'auto' }}>
              Numbers that tell the story of our journey and the lives we've touched together.
            </Typography>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto px-4">
            {impactData.map((item, i) => (
              <Counter
                key={item.id}
                end={item.currentValue}
                label={item.category}
                icon={item.icon}
                delay={i * 0.1}
              />
            ))}
          </div>
        </section>

        {/* TEAM SECTION */}
        <TeamSection />

        {/* SUCCESS STORIES */}
        <motion.section
          className="py-24 bg-gradient-to-b from-warmBg to-white rounded-3xl"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <Typography variant="h3" component="h2" align="center" sx={{ fontWeight: 800, color: 'primary.main', mb: 8 }}>
            Success Stories
          </Typography>

          <motion.div 
            className="grid md:grid-cols-3 gap-8 px-8 max-w-7xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {stories.map((story) => (
              <SuccessStoryCard key={story.id} story={story} />
            ))}
          </motion.div>
        </motion.section>

        {/* EVENT HIGHLIGHTS */}
        {eventSlides.length > 0 && (
          <motion.section
            className="py-24"
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <Typography variant="h3" component="h2" align="center" sx={{ fontWeight: 800, color: 'text.primary', mb: 8 }}>
              Event Highlights
            </Typography>

            <div className="max-w-5xl mx-auto px-4">
              <Swiper
                modules={[Navigation, Pagination, Autoplay, EffectFade]}
                effect="fade"
                navigation
                pagination={{ clickable: true, dynamicBullets: true }}
                autoplay={{ delay: 5000, disableOnInteraction: false }}
                spaceBetween={0}
                slidesPerView={1}
                loop={eventSlides.length > 1}
                className="rounded-3xl shadow-2xl overflow-hidden"
              >
                {eventSlides.map((slide, i) => (
                  <SwiperSlide key={i}>
                    <div className="relative w-full h-[500px] group">
                      <img
                        src={slide.src}
                        alt={slide.title}
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-10 md:p-16">
                        <motion.h3 
                          initial={{ y: 20, opacity: 0 }}
                          whileInView={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.2 }}
                          className="text-white text-3xl md:text-5xl font-bold mb-4 drop-shadow-lg"
                        >
                          {slide.title}
                        </motion.h3>
                        <motion.p 
                          initial={{ y: 20, opacity: 0 }}
                          whileInView={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.3 }}
                          className="text-white/90 text-lg max-w-2xl mb-6 font-light"
                        >
                          {slide.caption}
                        </motion.p>
                        <motion.div
                          initial={{ y: 20, opacity: 0 }}
                          whileInView={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.4 }}
                        >
                          <Button 
                            variant="outlined" 
                            color="inherit" 
                            endIcon={<ArrowForwardIcon />}
                            onClick={() => navigate(`/events/${slide.id}`)}
                            sx={{ color: 'white', borderColor: 'white', '&:hover': { bgcolor: 'white', color: 'primary.main' } }}
                          >
                            View Event
                          </Button>
                        </motion.div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </motion.section>
        )}

        {/* DONATION CTA */}
        <div className="bg-accent/10 rounded-3xl overflow-hidden">
          <DonationCTA />
        </div>

      </SiteContainer>
    </motion.div>
  );
}

export default Home;
