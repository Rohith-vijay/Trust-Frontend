import React from "react";
import Counter from "../components/Counter";
import SiteContainer from "../components/SiteContainer";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { motion } from "framer-motion";
import { pageVariants, pageTransition, sectionVariants } from "../constants/motionVariants";
import { useNavigate } from "react-router-dom";

import databaseService from "../services/databaseService";
import { AppContext } from "../context/AppContext";

// additional sections
import TeamSection from "../components/TeamSection";
import DonationCTA from "../components/DonationCTA";
import HeroSection from "../components/HeroSection";

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
              caption: ev.description?.slice(0, 60) || ev.title,
            });
          });
      }
    });
    return slides;
  }, [events]);

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={pageTransition}
    >
      {/* HERO SECTION — 3D tilt on scroll */}
      <HeroSection />

      <SiteContainer>

        {/* IMPACT COUNTERS — 2×2 grid */}
        <section className="py-24 bg-white">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-primary">
            Our Impact
          </h2>
          <p className="text-center text-gray-500 mb-12 max-w-lg mx-auto">
            Numbers that tell the story of our journey
          </p>

          <div className="grid grid-cols-2 gap-6 md:gap-8 max-w-2xl mx-auto">
            {impactData.map((item, i) => (
              <Counter
                key={item.id}
                end={item.currentValue}
                label={item.category}
                icon={item.icon}
                delay={i * 0.15}
              />
            ))}
          </div>
        </section>

        {/* TEAM SECTION */}
        <TeamSection />

        {/* SUCCESS STORIES */}
        <motion.section
          className="py-24 bg-warmBg rounded-2xl"
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-primary">
            Success Stories
          </h2>

          <div className="grid md:grid-cols-3 gap-10 px-6">
            {stories.map((story) => (
              <div
                key={story.id}
                className="bg-white rounded-xl shadow-md p-8 hover:shadow-xl transition duration-300"
              >
                {story.imageUrl && (
                  <img
                    src={story.imageUrl}
                    alt={story.title}
                    className="w-full h-40 object-cover rounded-lg mb-4"
                    loading="lazy"
                  />
                )}
                <h3 className="text-xl font-semibold mb-3">
                  {story.title}
                </h3>
                <p className="text-gray-600">{story.description}</p>
                {story.category && (
                  <span className="inline-block mt-3 text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-full">
                    {story.category}
                  </span>
                )}
              </div>
            ))}
          </div>
        </motion.section>

        {/* EVENT HIGHLIGHTS — from backend */}
        {eventSlides.length > 0 && (
          <motion.section
            className="py-24 bg-neutralLight"
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-dark">
              Event Highlights
            </h2>

            <div className="max-w-4xl mx-auto">
              <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                navigation
                pagination={{ clickable: true }}
                autoplay={{ delay: 3500, disableOnInteraction: false }}
                spaceBetween={30}
                slidesPerView={1}
                loop={eventSlides.length > 1}
              >
                {eventSlides.map((slide, i) => (
                  <SwiperSlide key={i}>
                    <div className="relative w-full h-[400px] rounded-2xl overflow-hidden shadow-lg group">
                      <img
                        src={slide.src}
                        alt={slide.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent px-6 py-5">
                        <h3 className="text-white text-xl font-bold">{slide.title}</h3>
                        <p className="text-white/80 text-sm italic">"{slide.caption}"</p>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </motion.section>
        )}

        {/* DONATION CALL TO ACTION */}
        <div className="bg-accent bg-opacity-20">
          <DonationCTA />
        </div>

      </SiteContainer>
    </motion.div>
  );
}

export default Home;
