import React from "react";
import { motion } from "framer-motion";
import { sectionVariants } from "../constants/motionVariants";
import { useNavigate } from "react-router-dom";

const DonationCTA = () => {
  const navigate = useNavigate();

  return (
    <motion.section
    className="relative py-10 md:py-24"
    variants={sectionVariants}
    initial="hidden"
    animate="visible"
  >
    <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-80" />
    <div className="relative max-w-3xl mx-auto text-center text-white px-4 sm:px-8 md:px-12 py-8 sm:py-10 md:py-12 rounded-2xl shadow-lg">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 overflow-wrap-anywhere break-words">Support Our Cause</h2>
      <p className="mb-6 sm:mb-8 text-sm sm:text-base">
        Your donation helps us continue our work creating sustainable change around the world.
      </p>
      <button
        onClick={() => navigate("/donation")}
        className="bg-white text-primary w-full sm:w-auto px-8 py-3 rounded-lg font-semibold shadow-md hover:brightness-90 transition min-h-[44px]"
      >
        Donate Now
      </button>
        {/* Trust badges removed as per user request */}
    </div>
  </motion.section>
  );
};
export default DonationCTA;