import React from "react";
import { motion } from "framer-motion";
import { pageVariants, pageTransition } from "../constants/motionVariants";
import { Typography, Card, Box, Divider } from "@mui/material";
import PaidOutlinedIcon from '@mui/icons-material/PaidOutlined';

function RefundPolicy() {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={pageTransition}
      className="min-h-screen py-12 md:py-24 px-4 md:px-12 lg:px-24 bg-gray-50/50"
    >
      <div className="max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.6 }} 
          className="text-center mb-12"
        >
          <div className="w-16 h-16 mx-auto mb-4 bg-amber-500/10 rounded-full flex items-center justify-center text-primary">
            <PaidOutlinedIcon sx={{ fontSize: 36 }} />
          </div>
          <Typography 
            variant="h3" 
            component="h1" 
            sx={{ fontWeight: 800, color: 'primary.main', mb: 2, fontSize: { xs: '2rem', md: '3rem' } }}
          >
            Donation & Refund Policy
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
            Effective Date: August 11, 2026. This policy outlines our terms regarding voluntary contributions and refund guidelines.
          </Typography>
        </motion.div>

        <Card 
          elevation={0} 
          className="p-6 md:p-10 border border-gray-100" 
          sx={{ borderRadius: 6, boxShadow: '0 20px 40px rgba(0,0,0,0.02)' }}
        >
          <div className="space-y-8 text-slate-700 leading-relaxed text-sm md:text-base">
            
            {/* Section 1 */}
            <div>
              <Typography variant="h6" className="text-slate-800 font-bold mb-3">
                1. Voluntary Contributions
              </Typography>
              <Typography variant="body2" color="text.secondary" className="mb-2">
                All donations made to K.V.G. Shanmukha Sai Charitable Trust are voluntary and non-refundable, except under specific, verified conditions outlined in this policy. Contributions are utilized directly to fund our charitable projects, including education support, medical clinics, and clean water campaigns.
              </Typography>
            </div>

            <Divider />

            {/* Section 2 */}
            <div>
              <Typography variant="h6" className="text-slate-800 font-bold mb-3">
                2. Guest and Authenticated Contributions
              </Typography>
              <Typography variant="body2" color="text.secondary" className="mb-2">
                We accept contributions from both registered members and guest donors. Transaction receipts are automatically generated and sent to the email address specified during checkout. Please verify your contact email address prior to payment.
              </Typography>
            </div>

            <Divider />

            {/* Section 3 */}
            <div>
              <Typography variant="h6" className="text-slate-800 font-bold mb-3">
                3. Payment Status & Confirmations
              </Typography>
              <Typography variant="body2" color="text.secondary" className="mb-2">
                A donation is considered complete and logged in our system only after successful payment authorization by the payment gateway and signature verification.
              </Typography>
              <ul className="list-disc pl-6 space-y-2 text-xs md:text-sm text-slate-600">
                <li><strong className="text-slate-800">Failed Payments:</strong> If a payment fails during checkout, the amount is usually not debited. If funds are deducted, they are typically returned automatically by your bank.</li>
                <li><strong className="text-slate-800">Pending Transactions:</strong> Transactions marked as pending will be reconciled automatically once the gateway receives confirmations.</li>
              </ul>
            </div>

            <Divider />

            {/* Section 4 */}
            <div>
              <Typography variant="h6" className="text-slate-800 font-bold mb-3">
                4. Duplicate and Erroneous Payments
              </Typography>
              <Typography variant="body2" color="text.secondary" className="mb-2">
                If you accidentally make a duplicate contribution (two identical donations within a short time) or are charged an incorrect amount due to technical issues, we will review the transaction. Refunds for verified duplicate payments will be initiated upon validation.
              </Typography>
            </div>

            <Divider />

            {/* Section 5 */}
            <div>
              <Typography variant="h6" className="text-slate-800 font-bold mb-3">
                5. Unauthorized or Fraudulent Transactions
              </Typography>
              <Typography variant="body2" color="text.secondary" className="mb-2">
                If you suspect your card or account was used fraudulently on our platform, please report it immediately to your bank and to our support email. We will cooperate with payment gateways and legal authorities to trace and resolve the issue.
              </Typography>
            </div>

            <Divider />

            {/* Section 6 */}
            <div>
              <Typography variant="h6" className="text-slate-800 font-bold mb-3">
                6. Refund Request Procedure
              </Typography>
              <Typography variant="body2" color="text.secondary" className="mb-4">
                To request a refund for duplicate or erroneous transactions, please contact us by email within 7 days of the payment. Your request must include the following information:
              </Typography>
              <ul className="list-decimal pl-6 space-y-2 text-xs md:text-sm text-slate-600">
                <li>Donor Name & email address used for checkout.</li>
                <li>Transaction Date and exact Amount.</li>
                <li>Payment ID / Transaction ID (from your bank/gateway notification).</li>
                <li>A brief description of the issue (e.g., duplicate charge).</li>
              </ul>
            </div>

            <Divider />

            {/* Section 7 */}
            <div>
              <Typography variant="h6" className="text-slate-800 font-bold mb-3">
                7. Refund Verification & Processing
              </Typography>
              <Typography variant="body2" color="text.secondary" className="mb-2">
                All refund requests are subject to verification. If approved, the refund will be processed back to the original payment method used during checkout (such as the same credit card, bank account, or UPI handle).
              </Typography>
              <Typography variant="body2" color="text.secondary" className="mb-2">
                Please note: Gateway processing fees or bank transaction fees may be deducted from the refund amount where applicable. Refund timelines depend on gateway and banking partner clearing cycles.
              </Typography>
            </div>

            <Divider />

            {/* Section 8 */}
            <div>
              <Typography variant="h6" className="text-slate-800 font-bold mb-3">
                8. Donation Receipt Handling
              </Typography>
              <Typography variant="body2" color="text.secondary" className="mb-2">
                In the event of an approved refund, the originally issued donation receipt is automatically cancelled and marked as void. Donors agree not to utilize cancelled receipts for any financial or accounting claims.
              </Typography>
            </div>

            <Divider />

            {/* Section 9 */}
            <div className="bg-amber-500/5 border border-amber-500/10 rounded-2xl p-5">
              <Typography variant="h6" className="text-amber-800 font-extrabold mb-3">
                9. Tax Exemption Disclaimer
              </Typography>
              <Typography variant="body2" className="text-slate-600 font-medium leading-relaxed">
                As detailed in our Terms & Conditions, the Trust's charitable tax registrations and approvals are currently pending with the Income Tax Department. At this stage, no contributions qualify for tax deductions under Section 80G. Receipts issued are transaction acknowledgements only and do not guarantee or represent tax-exempt status.
              </Typography>
            </div>

            <Divider />

            {/* Section 10 */}
            <div>
              <Typography variant="h6" className="text-slate-800 font-bold mb-3">
                10. Contact Us
              </Typography>
              <Typography variant="body2" color="text.secondary" className="mb-2">
                For any queries regarding this policy or to request a refund, please contact us at:
              </Typography>
              <div className="bg-slate-50 mt-4 p-5 rounded-2xl border border-slate-100 text-xs md:text-sm text-slate-600 space-y-1 font-medium">
                <p className="text-slate-800 font-bold">K.V.G. Shanmukha Sai Charitable Trust</p>
                <p><strong>Address:</strong> 49a, Harischandrapuram, Thullur mandal, Guntur district, Andhra pradesh, India</p>
                <p><strong>Email:</strong> kvgshanmukhsaitrust@gmail.com</p>
                <p><strong>Phone:</strong> 8919493436, 9121603777, 9390564417</p>
              </div>
            </div>

          </div>
        </Card>
      </div>
    </motion.div>
  );
}

export default RefundPolicy;
