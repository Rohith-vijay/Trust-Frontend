import React from "react";
import { motion } from "framer-motion";
import { pageVariants, pageTransition } from "../constants/motionVariants";
import { Typography, Card, Box, Divider } from "@mui/material";
import GavelOutlinedIcon from '@mui/icons-material/GavelOutlined';

function TermsConditions() {
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
            <GavelOutlinedIcon sx={{ fontSize: 36 }} />
          </div>
          <Typography 
            variant="h3" 
            component="h1" 
            sx={{ fontWeight: 800, color: 'primary.main', mb: 2, fontSize: { xs: '2rem', md: '3rem' } }}
          >
            Terms & Conditions
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
            Effective Date: August 11, 2026. Please read these terms carefully before using our platform.
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
                1. Acceptance of Terms
              </Typography>
              <Typography variant="body2" color="text.secondary" className="mb-2">
                By accessing or using the website of K.V.G. Shanmukha Sai Charitable Trust ("we", "us", "our"), you agree to be bound by these Terms & Conditions. If you do not agree to these terms, please do not access or use the platform.
              </Typography>
            </div>

            <Divider />

            {/* Section 2 */}
            <div>
              <Typography variant="h6" className="text-slate-800 font-bold mb-3">
                2. Website Purpose & Eligibility
              </Typography>
              <Typography variant="body2" color="text.secondary" className="mb-2">
                Our platform is designed to promote charitable objectives, accept secure online donations, accept volunteer applications, and coordinate assistance cases for underprivileged individuals. To use this website, you must be at least 18 years of age or accessing under the supervision of a parent or guardian.
              </Typography>
            </div>

            <Divider />

            {/* Section 3 */}
            <div>
              <Typography variant="h6" className="text-slate-800 font-bold mb-3">
                3. User Account Responsibilities
              </Typography>
              <Typography variant="body2" color="text.secondary" className="mb-2">
                When creating an account (as a donor, volunteer, or applicant), you agree to provide accurate, current, and complete information. You are solely responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your credentials.
              </Typography>
            </div>

            <Divider />

            {/* Section 4 */}
            <div>
              <Typography variant="h6" className="text-slate-800 font-bold mb-3">
                4. Prohibited Activities
              </Typography>
              <Typography variant="body2" color="text.secondary" className="mb-2">
                Users are strictly prohibited from:
              </Typography>
              <ul className="list-disc pl-6 space-y-2 text-xs md:text-sm text-slate-600">
                <li>Submitting fraudulent, misleading, or falsified details or verification documents.</li>
                <li>Attempting to bypass security systems, rate limiters, or bot prevention controls (Turnstile checks).</li>
                <li>Engaging in payment manipulation or sending mock verification requests outside authorized developer sandbox profiles.</li>
                <li>Using the platform to distribute malware, span, or offensive content.</li>
              </ul>
            </div>

            <Divider />

            {/* Section 5 */}
            <div>
              <Typography variant="h6" className="text-slate-800 font-bold mb-3">
                5. Donations & Payments
              </Typography>
              <Typography variant="body2" color="text.secondary" className="mb-2">
                Donations can be processed through our online gateway. Please note the following operational terms:
              </Typography>
              <ul className="list-disc pl-6 space-y-2 text-xs md:text-sm text-slate-600">
                <li>
                  <strong className="text-slate-800">Guest Donations:</strong> Donors can make contributions as guest checkouts. Making a guest donation does not automatically generate a platform user account.
                </li>
                <li>
                  <strong className="text-slate-800">Authenticated Donations:</strong> Registered users can track their donation histories and access dynamic transaction dashboards.
                </li>
                <li>
                  <strong className="text-slate-800">Payment Confirmation:</strong> A transaction is officially confirmed only after successful payment gateway verification and digital signature confirmation. Unverified orders do not qualify for official receipts.
                </li>
              </ul>
            </div>

            <Divider />

            {/* Section 6 */}
            <div className="bg-amber-500/5 border border-amber-500/10 rounded-2xl p-5">
              <Typography variant="h6" className="text-amber-800 font-extrabold mb-3">
                6. IMPORTANT TAX STATUS NOTICE
              </Typography>
              <Typography variant="body2" className="text-slate-600 font-medium leading-relaxed">
                K.V.G. Shanmukha Sai Charitable Trust has filed the necessary applications for charitable tax registrations and approvals (including the registrations relevant to donor tax deduction benefits). These applications are currently pending review with the Income Tax Department. At this stage, the Trust does not represent, warrant, or promise that any contributions made through this website qualify for deduction under Section 80G or any other tax-exempt status. No tax benefit is guaranteed to donors at this stage. Any future eligibility will be communicated only after official registration is granted by the authorities.
              </Typography>
            </div>

            <Divider />

            {/* Section 7 */}
            <div>
              <Typography variant="h6" className="text-slate-800 font-bold mb-3">
                7. Applications and Claims
              </Typography>
              <Typography variant="body2" color="text.secondary" className="mb-2">
                Our platform provides interfaces to apply for volunteer campaigns and request charitable assistance. Please note:
              </Typography>
              <ul className="list-disc pl-6 space-y-2 text-xs md:text-sm text-slate-600">
                <li>
                  <strong className="text-slate-800">Volunteer Applications:</strong> Submitting an application does not guarantee selection, placement, or certification. Volunteer roles are approved based on campaign capacities.
                </li>
                <li>
                  <strong className="text-slate-800">Assistance Applications:</strong> Registering an assistance case does not guarantee that funding or resources will be provided. All cases are evaluated on a need-basis.
                </li>
              </ul>
            </div>

            <Divider />

            {/* Section 8 */}
            <div>
              <Typography variant="h6" className="text-slate-800 font-bold mb-3">
                8. User-Submitted Content & Documents
              </Typography>
              <Typography variant="body2" color="text.secondary" className="mb-2">
                Users are solely responsible for documents, descriptions, or information uploaded in connection with case applications. You warrant that you have the right to upload such documents and that they are accurate. We reserve the right to remove any content that violates these terms.
              </Typography>
            </div>

            <Divider />

            {/* Section 9 */}
            <div>
              <Typography variant="h6" className="text-slate-800 font-bold mb-3">
                9. Intellectual Property
              </Typography>
              <Typography variant="body2" color="text.secondary" className="mb-2">
                All software, platform code, text, logos, layout structures, and graphics are the intellectual property of K.V.G. Shanmukha Sai Charitable Trust. You may not copy, modify, distribute, or reuse any design elements or content without our prior written consent.
              </Typography>
            </div>

            <Divider />

            {/* Section 10 */}
            <div>
              <Typography variant="h6" className="text-slate-800 font-bold mb-3">
                10. Website Availability & Limitation of Liability
              </Typography>
              <Typography variant="body2" color="text.secondary" className="mb-2">
                The website is provided on an "as is" and "as available" basis. We do not warrant that the website will run uninterrupted or error-free. To the maximum extent permitted by law, K.V.G. Shanmukha Sai Charitable Trust will not be liable for any direct, indirect, incidental, or consequential damages resulting from your use or inability to use this platform.
              </Typography>
            </div>

            <Divider />

            {/* Section 11 */}
            <div>
              <Typography variant="h6" className="text-slate-800 font-bold mb-3">
                11. Governing Law
              </Typography>
              <Typography variant="body2" color="text.secondary" className="mb-2">
                These Terms & Conditions are governed by and construed in accordance with the laws of India. Any disputes arising out of these terms shall be subject to the exclusive jurisdiction of the courts located in Andhra Pradesh, India.
              </Typography>
            </div>

            <Divider />

            {/* Section 12 */}
            <div>
              <Typography variant="h6" className="text-slate-800 font-bold mb-3">
                12. Contact Information
              </Typography>
              <Typography variant="body2" color="text.secondary" className="mb-2">
                For queries or clarifications regarding these terms, please contact us at:
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

export default TermsConditions;
