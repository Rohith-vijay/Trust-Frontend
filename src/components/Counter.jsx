import React from "react";
import CountUp from "react-countup";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Paper, Typography } from "@mui/material";

function Counter({ end, label, icon, delay = 0 }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.3 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -8, scale: 1.02 }}
    >
      <Paper
        elevation={0}
        sx={{
          borderRadius: 5,
          p: { xs: 2, sm: 3, md: 4 },
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          border: "1px solid rgba(0,0,0,0.04)",
          boxShadow: "0 10px 30px rgba(0,0,0,0.03)",
          background: "linear-gradient(145deg, #ffffff 0%, #fafafa 100%)",
          transition: "box-shadow 0.3s ease",
          overflow: "hidden",
          maxWidth: "100%",
          "&:hover": {
            boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
          }
        }}
      >
        <motion.div
          className="text-3xl sm:text-5xl mb-2 sm:mb-4 text-primary"
          initial={{ scale: 0, rotate: -15 }}
          animate={inView ? { scale: 1, rotate: 0 } : {}}
          transition={{ duration: 0.6, delay: delay + 0.2, type: "spring", stiffness: 200 }}
        >
          {icon}
        </motion.div>

        <Typography
          variant="h3"
          component="h2"
          sx={{
            fontWeight: 800,
            color: 'primary.main',
            mb: { xs: 0.5, sm: 1 },
            fontFamily: 'inherit',
            fontSize: { xs: '1.4rem', sm: '1.875rem', md: '2.125rem' },
            lineHeight: 1.1,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            maxWidth: '100%',
          }}
        >
          {inView ? (
            <CountUp
              end={end}
              duration={2.5}
              separator=","
              useEasing={true}
              suffix="+"
            />
          ) : (
            "0"
          )}
        </Typography>

        <Typography
          variant="subtitle1"
          color="text.secondary"
          sx={{
            fontWeight: 600,
            textAlign: 'center',
            letterSpacing: '0.5px',
            fontSize: { xs: '0.7rem', sm: '0.875rem', md: '1rem' },
            lineHeight: 1.3,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {label}
        </Typography>
      </Paper>
    </motion.div>
  );
}

export default Counter;
