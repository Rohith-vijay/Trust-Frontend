import React from "react";
import { motion } from "framer-motion";
import { pageVariants, pageTransition } from "../constants/motionVariants";
import { Typography, Card, Box, Divider } from "@mui/material";
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';

function PrivacyPolicy() {
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
            <ShieldOutlinedIcon sx={{ fontSize: 36 }} />
          </div>
          <Typography 
            variant="h3" 
            component="h1" 
            sx={{ fontWeight: 800, color: 'primary.main', mb: 2, fontSize: { xs: '2rem', md: '3rem' } }}
          >
            Privacy Policy
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
            Effective Date: August 11, 2026. This policy outlines how K.V.G. Shanmuka Sai Charitable Trust collects, uses, and safeguards your information.
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
                1. Introduction
              </Typography>
              <Typography variant="body2" color="text.secondary" className="mb-2">
                K.V.G. Shanmuka Sai Charitable Trust ("we", "us", "our") is dedicated to protecting the privacy of our website visitors, donors, volunteers, and assistance applicants. This Privacy Policy details our practices concerning the collection, usage, processing, and protection of your personal and technical data.
              </Typography>
            </div>

            <Divider />

            {/* Section 2 */}
            <div>
              <Typography variant="h6" className="text-slate-800 font-bold mb-3">
                2. Information We Collect
              </Typography>
              <Typography variant="body2" color="text.secondary" className="mb-4">
                We collect personal information that you voluntarily provide to us when using our platform. This collection is categorized as follows:
              </Typography>
              <ul className="list-disc pl-6 space-y-2 text-xs md:text-sm text-slate-600">
                <li>
                  <strong className="text-slate-800">Donor Information:</strong> We collect your full name, email address, physical address, and contact number when you make a contribution.
                </li>
                <li>
                  <strong className="text-slate-800">Volunteer Information:</strong> We collect your name, email, phone number, areas of skill, availability preferences, and dashboard volunteer application details.
                </li>
                <li>
                  <strong className="text-slate-800">Assistance Applicant Information:</strong> We collect details submitted via our assistance case forms, including applicant name, email, physical address, mobile number, preferred contact method, and verification documents (case details and milestones).
                </li>
                <li>
                  <strong className="text-slate-800">Technical, Device, and Session Information:</strong> We log technical identifiers such as IP addresses, web browser versions, operating systems, session timestamps, and navigation logs.
                </li>
              </ul>
            </div>

            <Divider />

            {/* Section 3 */}
            <div>
              <Typography variant="h6" className="text-slate-800 font-bold mb-3">
                3. How Personal Information is Used
              </Typography>
              <Typography variant="body2" color="text.secondary" className="mb-2">
                Your personal details are processed solely to facilitate platform operations:
              </Typography>
              <ul className="list-disc pl-6 space-y-2 text-xs md:text-sm text-slate-600">
                <li>Managing, verifying, and logging donations and issuing official receipts.</li>
                <li>Reviewing, processing, and checking in/out volunteer applications for active trust campaigns.</li>
                <li>Evaluating case eligibility, managing document attachments, and establishing communication channels with assistance applicants.</li>
                <li>Securing the website against unauthorized access, malicious events, and spam checkouts.</li>
              </ul>
            </div>

            <Divider />

            {/* Section 4 */}
            <div>
              <Typography variant="h6" className="text-slate-800 font-bold mb-3">
                4. Donation and Payment Information
              </Typography>
              <Typography variant="body2" color="text.secondary" className="mb-2">
                All donations are processed securely through our verified payment gateway provider. The website does not store or process card numbers, CVVs, expiration dates, or bank login credentials on its local servers. Payment tokens and signature verifications are processed using secure cryptographic verification handshakes.
              </Typography>
            </div>

            <Divider />

            {/* Section 5 */}
            <div>
              <Typography variant="h6" className="text-slate-800 font-bold mb-3">
                5. Permanent Account Number (PAN) Information
              </Typography>
              <Typography variant="body2" color="text.secondary" className="mb-2">
                When provided by donors, Permanent Account Number (PAN) details are treated as sensitive financial information. PAN details are encrypted at rest using industry-standard AES-GCM encryption algorithms before being committed to the database. We restrict access to PAN data and utilize log redaction filters to sanitize log outputs, preventing any exposure in system activity logs. The collected PAN will be utilized solely for filing official tax returns (Form 10BD) with the Income Tax Department if and when the Trust's registrations are finalized and approved.
              </Typography>
            </div>

            <Divider />

            {/* Section 6 */}
            <div>
              <Typography variant="h6" className="text-slate-800 font-bold mb-3">
                6. Cookies and Authentication
              </Typography>
              <Typography variant="body2" color="text.secondary" className="mb-2">
                Our platform uses local storage and cookies strictly to manage secure user sessions. We issue JSON Web Tokens (JWT) to authorize logged-in sessions. These identifiers do not collect or monitor your external internet activities.
              </Typography>
            </div>

            <Divider />

            {/* Section 7 */}
            <div>
              <Typography variant="h6" className="text-slate-800 font-bold mb-3">
                7. Third-Party Service Providers
              </Typography>
              <Typography variant="body2" color="text.secondary" className="mb-2">
                We coordinate with the following verified service providers to run our operations safely:
              </Typography>
              <ul className="list-disc pl-6 space-y-2 text-xs md:text-sm text-slate-600">
                <li>
                  <strong className="text-slate-800">Razorpay Software Private Limited:</strong> Handles secure donation processing and orders. Cryptographic payment signatures are validated using HMAC-SHA256.
                </li>
                <li>
                  <strong className="text-slate-800">Cloudinary:</strong> Stores uploaded case documents and volunteer profiles. All media uploads are scanned with magic-bytes signatures to verify actual file extensions.
                </li>
                <li>
                  <strong className="text-slate-800">SMTP Client:</strong> Dispatches secure transactional notifications, account verification links, and password recovery tokens.
                </li>
                <li>
                  <strong className="text-slate-800">Cloudflare Turnstile:</strong> Checks traffic legitimacy and prevents automated bot attacks on forms.
                </li>
              </ul>
            </div>

            <Divider />

            {/* Section 8 */}
            <div>
              <Typography variant="h6" className="text-slate-800 font-bold mb-3">
                8. Photographs and Media
              </Typography>
              <Typography variant="body2" color="text.secondary" className="mb-2">
                Any photographs, campaign updates, or impact stories displayed on the website are published in accordance with trust media guidelines. If you are featured in a campaign photo and wish to request its removal, please submit a request to our contact email.
              </Typography>
            </div>

            <Divider />

            {/* Section 9 */}
            <div>
              <Typography variant="h6" className="text-slate-800 font-bold mb-3">
                9. Data Security & Retention
              </Typography>
              <Typography variant="body2" color="text.secondary" className="mb-2">
                We implement robust security controls, including encrypted transport layers, database-level encryption, access controls, and log redactions. Personal information is retained only as long as necessary to complete campaign operations, fulfill legal obligations, and resolve outstanding disputes.
              </Typography>
            </div>

            <Divider />

            {/* Section 10 */}
            <div>
              <Typography variant="h6" className="text-slate-800 font-bold mb-3">
                10. Children's Privacy
              </Typography>
              <Typography variant="body2" color="text.secondary" className="mb-2">
                We do not knowingly collect or request personal information from children under the age of 13. If we discover that we have inadvertently collected data from a child under 13, it will be deleted immediately from our databases.
              </Typography>
            </div>

            <Divider />

            {/* Section 11 */}
            <div>
              <Typography variant="h6" className="text-slate-800 font-bold mb-3">
                11. User Rights and Requests
              </Typography>
              <Typography variant="body2" color="text.secondary" className="mb-2">
                You may request access, corrections, or deletions of your personal data by contacting us. In cases of legal requirements (such as active audit histories or transaction verifications), some records must be retained.
              </Typography>
            </div>

            <Divider />

            {/* Section 12 */}
            <div>
              <Typography variant="h6" className="text-slate-800 font-bold mb-3">
                12. Security Incidents and Data Breaches
              </Typography>
              <Typography variant="body2" color="text.secondary" className="mb-2">
                In the unlikely event of a security incident or data breach affecting your information, we will notify affected parties and regulatory authorities where legally required, detailing the breach scope and remediation plan.
              </Typography>
            </div>

            <Divider />

            {/* Section 13 */}
            <div>
              <Typography variant="h6" className="text-slate-800 font-bold mb-3">
                13. Policy Updates
              </Typography>
              <Typography variant="body2" color="text.secondary" className="mb-2">
                We reserve the right to modify this Privacy Policy at any time. Any changes will be updated on this page with a revised effective date.
              </Typography>
            </div>

            <Divider />

            {/* Section 14 */}
            <div>
              <Typography variant="h6" className="text-slate-800 font-bold mb-3">
                14. Contact Us
              </Typography>
              <Typography variant="body2" color="text.secondary" className="mb-2">
                For questions regarding this policy or to request updates to your records, please contact us at:
              </Typography>
              <div className="bg-slate-50 mt-4 p-5 rounded-2xl border border-slate-100 text-xs md:text-sm text-slate-600 space-y-1 font-medium">
                <p className="text-slate-800 font-bold">K.V.G. Shanmuka Sai Charitable Trust</p>
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

export default PrivacyPolicy;
