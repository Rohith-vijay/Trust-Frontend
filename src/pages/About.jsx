import { motion } from "framer-motion";
import { pageVariants, pageTransition } from "../constants/motionVariants";
import TeamSection from "../components/TeamSection";

function About() {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={pageTransition}
      className="py-10 md:py-20 bg-warmBg"
    >

      {/* Trust Story */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 text-center mb-10 md:mb-20 bg-white rounded-xl shadow-md border border-logoBrown/20 py-8 md:py-12">

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-primary">
          Our Story
        </h1>
        <p className="text-gray-500 italic max-w-xl mx-auto mb-8">
          Continuing a legacy of compassion, service, and meaningful change.
        </p>

        <div className="text-lg text-gray-700 leading-relaxed max-w-3xl mx-auto space-y-6 text-left md:text-center">
          <p>
            KVG Shanmuka Sai Charitable Trust was founded in the loving memory of my brother, Mr. KVG Shanmuka Sai, who left us far too soon. He was a kind, compassionate, and thoughtful person who always cared deeply for others and had a genuine desire to help people in need and make society a better place. Though his life was short, his values and dreams continue to inspire us. Through this charitable trust, we strive to carry forward his kindness, compassion, and spirit of service by working for the betterment of communities and creating a positive and lasting social impact.
          </p>
          <p>
            Our work focuses on Education, Environmental Conservation, Animal Welfare, and Health & Community Welfare. We currently provide free education and tuition support to nearly 50 children in Harischandrapuram, Guntur district, have planted over 100 trees while ensuring their survival, and are working to make clean drinking water more accessible to the village at half the regular price, contributing nearly 1 lakh litres of water to date. We have also conducted food donation and community support initiatives for people in need.
          </p>
          <p>
            We believe that meaningful community development and social change begin with small acts of kindness. Every child given an opportunity to learn, every tree nurtured, every person given access to clean water, and every helping hand extended brings us closer to the society Shanmuka Sai dreamed of. Through this trust, we hope to keep his spirit alive—not just in memory, but through the lives we touch and the communities we serve.
          </p>
        </div>

      </section>

      {/* Team Members */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <TeamSection />
      </section>

    </motion.div>
  );
}

export default About;
