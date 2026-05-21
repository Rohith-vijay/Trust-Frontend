import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, Typography, IconButton } from "@mui/material";
import TouchAppIcon from '@mui/icons-material/TouchApp';

const MemberCard = React.memo(({ member }) => {
  const [flipped, setFlipped] = useState(false);

  const colors = [
    "from-amber-500 to-yellow-600",
    "from-blue-500 to-cyan-600",
    "from-emerald-500 to-teal-600",
    "from-purple-500 to-indigo-600",
    "from-rose-500 to-orange-600",
  ];
  const bgGradient = colors[(member.id - 1) % colors.length];

  return (
    <div
      className="cursor-pointer group"
      style={{ perspective: "1000px", height: "100%" }}
      onClick={() => setFlipped(!flipped)}
    >
      <motion.div
        className="relative w-full h-full"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
      >
        {/* ─── FRONT ─── */}
        <Card
          elevation={0}
          className="absolute inset-0 w-full h-full bg-white flex flex-col"
          sx={{
            backfaceVisibility: "hidden",
            borderRadius: 4,
            border: "1px solid rgba(0,0,0,0.05)",
            boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
            transition: "all 0.3s ease",
            "&:hover": {
              boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
              transform: "translateY(-4px)"
            }
          }}
        >
          <div className={`h-48 bg-gradient-to-br ${bgGradient} flex items-center justify-center relative overflow-hidden shrink-0`}>
            {member.photo ? (
              <img
                src={member.photo}
                alt={member.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
            ) : (
              <>
                <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/20 blur-md" />
                <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full bg-white/20 blur-md" />
                <span className="text-5xl font-bold text-white tracking-wider select-none relative z-10 drop-shadow-md">
                  {member.initials}
                </span>
              </>
            )}
            <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>

          <div className="p-5 text-center flex flex-col flex-grow">
            <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.primary', mb: 0.5 }}>
              {member.name}
            </Typography>
            <Typography variant="subtitle2" sx={{ color: 'primary.main', fontWeight: 600, mb: 1.5, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
              {member.role}
            </Typography>
            {member.tagline && (
              <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', flexGrow: 1 }}>
                "{member.tagline}"
              </Typography>
            )}
            <div className="mt-4 flex items-center justify-center text-xs text-gray-400 space-x-1 opacity-70 group-hover:opacity-100 transition-opacity">
              <TouchAppIcon fontSize="small" className="animate-bounce" />
              <span>Tap to know more</span>
            </div>
          </div>
        </Card>

        {/* ─── BACK ─── */}
        <Card
          elevation={0}
          className="absolute inset-0 w-full h-full bg-white flex flex-col p-6"
          sx={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            borderRadius: 4,
            border: "1px solid rgba(0,0,0,0.05)",
            boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
          }}
        >
          <div className="flex items-center space-x-4 mb-4 pb-4 border-b border-gray-100 shrink-0">
            <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${bgGradient} flex items-center justify-center shadow-inner`}>
              <span className="text-sm font-bold text-white">{member.initials}</span>
            </div>
            <div>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, lineHeight: 1.2 }}>{member.name}</Typography>
              <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 600 }}>{member.role}</Typography>
            </div>
          </div>

          <div className="overflow-y-auto pr-2 custom-scrollbar flex-grow">
            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7, mb: 3 }}>
              {member.bio || "No biography available."}
            </Typography>

            {member.achievements && member.achievements.length > 0 && (
              <div>
                <Typography variant="overline" sx={{ fontWeight: 700, color: 'text.disabled', letterSpacing: 1 }}>
                  Key Contributions
                </Typography>
                <ul className="space-y-2 mt-2">
                  {member.achievements.map((item, i) => (
                    <li key={i} className="flex items-start text-sm text-gray-700">
                      <span className="text-primary mr-2 mt-0.5">•</span>
                      <span className="leading-tight">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <Typography variant="caption" sx={{ textAlign: 'center', color: 'text.disabled', mt: 3, pt: 2, borderTop: '1px solid #f0f0f0' }}>
            Tap anywhere to flip back
          </Typography>
        </Card>
      </motion.div>
    </div>
  );
});

export default MemberCard;