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
      className="py-20 bg-warmBg"
    >

      {/* Trust Story */}
      <section className="max-w-5xl mx-auto px-6 text-center mb-20 bg-white rounded-xl shadow-md border border-logoBrown/20 py-12">

        <h1 className="text-5xl font-bold mb-6 text-primary">
          Our Story
        </h1>

        <p className="text-lg text-gray-700 leading-relaxed max-w-3xl mx-auto">
          Our trust was founded with a mission to bring hope, education,
          and essential resources to communities in need. Through collective
          effort and compassion, we strive to create lasting positive impact
          in society.
        </p>

      </section>

      {/* Team Members — uses TeamSection with flip cards */}
      <section className="max-w-6xl mx-auto px-6">
        <TeamSection />
      </section>

    </motion.div>
  );
}

export default About;
