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

        <div className="text-lg text-gray-700 leading-relaxed max-w-3xl mx-auto space-y-6 text-left md:text-center">
          <p>
            K V G Shanmukh Sai Trust was established in the cherished memory of Mr. K.V.G. Shanmukh Sai to honor his compassion, selflessness, and vision of helping people in need and creating a better society. Even at a very young age, he supported those in need with whatever he had, regularly donated blood, and inspired many through his kindness and generosity.
          </p>
          <p>
            His belief that even a single individual can create meaningful change became the inspiration behind this trust. With the collective efforts of dedicated people, the organization now focuses on Education, Healthcare, Environment, and Animal Welfare to create a positive and lasting impact on society.
          </p>
          <p>
            This trust stands as a continuation of his thoughts, values, and pure soul, ensuring that his legacy of kindness and service lives on forever.
          </p>
        </div>

      </section>

      {/* Team Members — uses TeamSection with flip cards */}
      <section className="max-w-6xl mx-auto px-6">
        <TeamSection />
      </section>

    </motion.div>
  );
}

export default About;
