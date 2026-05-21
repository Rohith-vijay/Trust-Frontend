import React from "react";
import { motion } from "framer-motion";
import { pageVariants, pageTransition, sectionVariants } from "../constants/motionVariants";
import { Typography, Card, CardContent, Grid, Box } from "@mui/material";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import SecurityIcon from "@mui/icons-material/Security";
import SiteContainer from "../components/SiteContainer";

function FinancialTransparency() {
  // Financial breakdown values
  const financialData = [
    { title: "Direct Relief & Campaigns", value: 85, color: "#B07A3F", desc: "Clean water borewells, school books distributions, tree plantations, mobile medical clinic operations." },
    { title: "Operational & Compliance Support", value: 10, color: "#1E293B", desc: "Database servers hosting, payment security audits, mandatory legal registrations, staff coordination." },
    { title: "Fundraising & Advocacy Outreach", value: 5, color: "#F59E0B", desc: "Advocacy campaigns creation, dynamic newsletters dispatch, community events awareness campaigns." },
  ];

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={pageTransition}
      className="bg-gray-50/50 min-h-screen py-24"
    >
      <SiteContainer>
        {/* Title */}
        <motion.section
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
          className="text-center max-w-4xl mx-auto px-6 mb-16"
        >
          <Typography
            variant="h2"
            component="h1"
            sx={{
              fontWeight: 800,
              color: "primary.main",
              mb: 3,
              fontSize: { xs: "2.5rem", md: "3.5rem" },
            }}
          >
            Financial Transparency
          </Typography>
          <Typography
            variant="subtitle1"
            color="text.secondary"
            sx={{ fontSize: "1.15rem", maxWidth: 700, mx: "auto", lineHeight: 1.6 }}
          >
            Every penny counts. We enforce 100% financial visibility so you can trace precisely how your altruistic contributions empower the community.
          </Typography>
        </motion.section>

        {/* Audit Compliance Seals Ribbon */}
        <Grid container spacing={3} sx={{ maxW: "6xl", mx: "auto", px: 3, mb: 12 }}>
          {[
            { icon: <VerifiedUserIcon sx={{ fontSize: 32, color: "#B07A3F" }} />, title: "80G Compliant Receipts", desc: "All local donations receive instant 80G tax deductions receipts under Section 80G of IT guidelines." },
            { icon: <AccountBalanceWalletIcon sx={{ fontSize: 32, color: "#F59E0B" }} />, title: "Annual Independent Audits", desc: "Our financial books are audited annually by certified Chartered Accountants, published publically." },
            { icon: <SecurityIcon sx={{ fontSize: 32, color: "#1E293B" }} />, title: "Razorpay Secure Processing", desc: "Zero financial card credentials are saved on our servers. Transactions are gated by Razorpay secure checkout." },
          ].map((seal, i) => (
            <Grid item xs={12} md={4} key={i}>
              <motion.div whileHover={{ y: -6 }} className="h-full">
                <Card
                  elevation={0}
                  sx={{
                    height: "100%",
                    p: 4,
                    borderRadius: 4,
                    border: "1px solid rgba(0,0,0,0.04)",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.02)",
                    textAlign: "center",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: "white",
                  }}
                >
                  <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mb-4 border border-gray-100 shadow-inner">
                    {seal.icon}
                  </div>
                  <Typography variant="h6" sx={{ fontWeight: 800, mb: 1.5, color: "text.primary" }}>
                    {seal.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                    {seal.desc}
                  </Typography>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {/* Charts & Fund Allocations Breakdown */}
        <Grid container spacing={6} sx={{ maxW: "7xl", mx: "auto", px: 3, alignItems: "center" }}>
          
          {/* Chart Left column: Responsive SVG Donut Chart */}
          <Grid item xs={12} md={6}>
            <Card
              elevation={0}
              sx={{
                p: 5,
                borderRadius: 5,
                border: "1px solid rgba(0,0,0,0.04)",
                boxShadow: "0 10px 40px rgba(0,0,0,0.04)",
                bgcolor: "white",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography variant="h5" sx={{ fontWeight: 800, mb: 4, color: "text.primary" }}>
                Fund Allocations Blueprint
              </Typography>

              {/* Elegant SVG Donut Chart */}
              <div className="relative w-64 h-64 flex items-center justify-center">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  {/* Segment 1: Relief (85%) -> Circumference = 2 * PI * r = 2 * 3.14 * 35 = 220 */}
                  {/* Stroke-dasharray: percent*220/100, 220 */}
                  <circle
                    cx="50"
                    cy="50"
                    r="35"
                    fill="transparent"
                    stroke="#B07A3F"
                    strokeWidth="10"
                    strokeDasharray={`${85 * 2.2} 220`}
                    className="transition-all duration-1000"
                  />
                  {/* Segment 2: Operations (10%) -> Offset by 85*2.2 */}
                  <circle
                    cx="50"
                    cy="50"
                    r="35"
                    fill="transparent"
                    stroke="#1E293B"
                    strokeWidth="10"
                    strokeDasharray={`${10 * 2.2} 220`}
                    strokeDashoffset={`${-85 * 2.2}`}
                    className="transition-all duration-1000"
                  />
                  {/* Segment 3: Fundraising (5%) -> Offset by 95*2.2 */}
                  <circle
                    cx="50"
                    cy="50"
                    r="35"
                    fill="transparent"
                    stroke="#F59E0B"
                    strokeWidth="10"
                    strokeDasharray={`${5 * 2.2} 220`}
                    strokeDashoffset={`${-95 * 2.2}`}
                    className="transition-all duration-1000"
                  />
                </svg>

                {/* Center text overlay */}
                <div className="absolute flex flex-col items-center justify-center bg-white w-44 h-44 rounded-full shadow-inner border border-gray-50">
                  <span className="text-4xl font-extrabold text-amber-700">85%</span>
                  <span className="text-[10px] text-gray-400 font-extrabold tracking-wider mt-1">DIRECT COMMUNITY AID</span>
                </div>
              </div>

              {/* Legends */}
              <div className="flex flex-wrap gap-4 mt-6 justify-center">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-600">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#B07A3F" }} />
                  <span>Relief Aid (85%)</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-600">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#1E293B" }} />
                  <span>Operations (10%)</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-600">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#F59E0B" }} />
                  <span>Advocacy (5%)</span>
                </div>
              </div>
            </Card>
          </Grid>

          {/* Allocation Details Right column */}
          <Grid item xs={12} md={6} className="space-y-6">
            {financialData.map((data, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.15 }}
                viewport={{ once: true }}
              >
                <div className="p-5 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-center mb-3">
                    <Typography variant="subtitle1" sx={{ fontWeight: 800, color: "text.primary" }}>
                      {data.title}
                    </Typography>
                    <span 
                      className="text-lg font-black px-2.5 py-0.5 rounded-lg text-white" 
                      style={{ backgroundColor: data.color }}
                    >
                      {data.value}%
                    </span>
                  </div>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                    {data.desc}
                  </Typography>
                </div>
              </motion.div>
            ))}
          </Grid>

        </Grid>
      </SiteContainer>
    </motion.div>
  );
}

export default FinancialTransparency;
