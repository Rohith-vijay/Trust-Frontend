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

        <div className="text-lg text-gray-700 leading-relaxed max-w-3xl mx-auto space-y-6 text-left md:text-center">
          <p>
            K V G Shanmukh Sai Trust was established...
          </p>
          <p>
            His belief that even a single individual can create meaningful change...
          </p>
          <p>
            This trust stands as a continuation of his thoughts...
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
