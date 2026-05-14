import React from "react";
import { motion } from "framer-motion";
import { pageVariants, pageTransition, sectionVariants } from "../constants/motionVariants";

function Donation() {
  const [method, setMethod] = React.useState("upi");

  // allocation percentages for transparency
  const allocation = [
    { category: "Education", percent: 40 },
    { category: "Food & Nutrition", percent: 25 },
    { category: "Medical Assistance", percent: 20 },
    { category: "Operations & Admin", percent: 10 },
    { category: "Audit & Compliance", percent: 5 },
  ];

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={pageTransition}
      className="py-20 min-h-screen bg-gradient-to-b from-primary to-accent text-neutral-900"
    >
      <section className="max-w-4xl mx-auto bg-white bg-opacity-90 p-10 rounded-xl shadow-lg">
        <h1 className="text-5xl font-bold text-center mb-6 text-primary">
          Make a Difference Today
        </h1>

        <p className="text-center mb-10">
          Your donation helps provide clean water, education, and essential
          support to communities in need.
        </p>

        {/* payment method tabs */}
        <div className="flex justify-center mb-8">
          {[
            { key: "upi", label: "UPI" },
            { key: "card", label: "Card" },
            { key: "netbank", label: "Net Banking" },
          ].map((opt) => (
            <button
              key={opt.key}
              className={`px-6 py-2 font-semibold rounded-t-lg border-b-2 transition-colors duration-300 ${
                method === opt.key
                  ? "bg-primary text-white border-primary"
                  : "bg-neutralLight text-dark/70 border-transparent hover:text-dark"
              }`}
              onClick={() => setMethod(opt.key)}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <div className="mb-12">
          {method === "upi" && (
            <div className="text-center">
              <div className="inline-block bg-neutralLight p-10 rounded-lg">
                <p className="mb-4 font-medium">[UPI QR Placeholder]</p>
                <p className="text-sm">scan the QR or enter UPI ID</p>
              </div>
            </div>
          )}
          {method === "card" && (
            <form className="space-y-4 max-w-md mx-auto">
              <input
                type="text"
                placeholder="Name on Card"
                className="w-full border p-3 rounded"
              />
              <input
                type="text"
                placeholder="Card Number"
                className="w-full border p-3 rounded"
              />
              <div className="flex space-x-4">
                <input
                  type="text"
                  placeholder="MM/YY"
                  className="w-1/2 border p-3 rounded"
                />
                <input
                  type="text"
                  placeholder="CVV"
                  className="w-1/2 border p-3 rounded"
                />
              </div>
            </form>
          )}
          {method === "netbank" && (
            <div className="max-w-md mx-auto">
              <p>Select your bank (UI only)</p>
              <select className="w-full border p-3 rounded mt-2">
                <option>Bank A</option>
                <option>Bank B</option>
                <option>Bank C</option>
              </select>
            </div>
          )}
        </div>

        <div className="text-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-primary text-white px-8 py-3 rounded-lg font-semibold shadow-md hover:brightness-90 transition"
          >
            Donate Now
          </motion.button>
        </div>
      </section>

      {/* Allocation transparency */}
      <motion.section
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        className="max-w-4xl mx-auto mt-16 bg-white p-10 rounded-xl shadow-md"
      >
        <h2 className="text-3xl font-bold text-center mb-10 text-primary">
          Financial Allocation Breakdown
        </h2>
        <table className="w-full text-left table-fixed">
          <thead>
            <tr className="border-b">
              <th className="py-2">Category</th>
              <th className="py-2">Percentage</th>
            </tr>
          </thead>
          <tbody>
            {allocation.map((a) => (
              <tr key={a.category} className="border-b">
                <td className="py-2">{a.category}</td>
                <td className="py-2">{a.percent}%</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-6 text-sm text-gray-700">
          Example: a ₹10,000 donation is typically split as ₹4,000 education, ₹2,500 food, ₹2,000 medical, ₹1,000 operations and ₹500 audit.
        </p>
      </motion.section>
    </motion.div>
  );
}

export default Donation;
