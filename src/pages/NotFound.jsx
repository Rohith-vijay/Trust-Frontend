import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button, Typography, Container, Box } from "@mui/material";

import HelpOutlineIcon from "@mui/icons-material/HelpOutlined";
import { pageVariants, pageTransition } from "../constants/motionVariants";
import { updatePageSEO } from "../utils";

function NotFound() {
  useEffect(() => {
    // Set 404 page specific SEO parameters
    updatePageSEO("Page Not Found", "The requested page could not be found. Please check the URL or return to home.", "/404", true);
  }, []);

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={pageTransition}
      className="min-h-[70vh] flex items-center justify-center py-16 px-4 bg-gray-50/50"
    >
      <Container maxWidth="sm" className="text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Box className="flex justify-center mb-6">
            <div className="w-24 h-24 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-600">
              <HelpOutlineIcon sx={{ fontSize: 48 }} />
            </div>
          </Box>
          <Typography variant="h1" className="text-8xl font-black text-slate-800 tracking-tight mb-2">
            404
          </Typography>
          <Typography variant="h4" className="font-extrabold text-slate-700 mb-4">
            Page Not Found
          </Typography>
          <Typography variant="body1" className="text-slate-500 max-w-md mx-auto mb-8 leading-relaxed">
            The page you are looking for does not exist or has been moved to a new address. Please verify the URL or navigate back.
          </Typography>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              component={Link}
              to="/"
              variant="contained"
              color="primary"
              size="large"
              sx={{
                px: 5,
                py: 1.5,
                borderRadius: 4,
                fontWeight: 700,
                textTransform: "none",
                fontSize: "0.95rem",
                width: { xs: "100%", sm: "auto" },
              }}
            >
              Go Back Home
            </Button>
            <Button
              component={Link}
              to="/contact"
              variant="outlined"
              color="primary"
              size="large"
              sx={{
                px: 5,
                py: 1.5,
                borderRadius: 4,
                fontWeight: 750,
                textTransform: "none",
                fontSize: "0.95rem",
                width: { xs: "100%", sm: "auto" },
              }}
            >
              Contact Support
            </Button>
          </div>
          <p className="mt-12 text-[10px] text-gray-400 font-bold uppercase tracking-wider">
            K.V.G. Shanmuka Sai Charitable Trust
          </p>
        </motion.div>
      </Container>
    </motion.div>
  );
}

export default NotFound;
