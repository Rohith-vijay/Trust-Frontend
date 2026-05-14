import React from "react";
import { motion } from "framer-motion";
import { sectionVariants } from "../constants/motionVariants";
import { useNavigate } from "react-router-dom";

const DonationCTA = () => {
  const navigate = useNavigate();

  return (
    <motion.section
    className="relative py-24"
    variants={sectionVariants}
    initial="hidden"
    animate="visible"
  >
    <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-80" />
    <div className="relative max-w-3xl mx-auto text-center text-white p-12 rounded-2xl shadow-lg">
      <h2 className="text-4xl font-bold mb-6">Support Our Cause</h2>
      <p className="mb-8">
        Your donation helps us continue our work creating sustainable change around the world.
      </p>
      <button
        onClick={() => navigate("/donation")}
        className="bg-white text-primary px-8 py-3 rounded-lg font-semibold shadow-md hover:brightness-90 transition"
      >
        Donate Now
      </button>
      <div className="mt-6 flex justify-center space-x-4">
        {/* trust badges placeholder */}
        <img src="/badge1.png" alt="Trust Badge" className="h-12" />
        <img src="/badge2.png" alt="Trust Badge" className="h-12" />
      </div>
    </div>
  </motion.section>
  );
};
export default DonationCTA;