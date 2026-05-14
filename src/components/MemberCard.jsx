import React, { useState } from "react";
import { motion } from "framer-motion";

/**
 * MemberCard — 3D flip card
 * Front: avatar/photo + name + role
 * Back:  bio + achievements (click to flip back)
 */
const MemberCard = React.memo(({ member }) => {
  const [flipped, setFlipped] = useState(false);

  // Color palette for initials backgrounds (based on member id)
  const colors = [
    "from-amber-600 to-yellow-500",
    "from-blue-600 to-cyan-500",
    "from-emerald-600 to-teal-500",
    "from-purple-600 to-pink-500",
    "from-rose-600 to-orange-500",
  ];
  const bgGradient = colors[(member.id - 1) % colors.length];

  return (
    <div
      className="cursor-pointer"
      style={{ perspective: "1000px" }}
      onClick={() => setFlipped(!flipped)}
    >
      <motion.div
        className="relative w-full"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
      >
        {/* ─── FRONT ─── */}
        <div
          className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
          style={{ backfaceVisibility: "hidden" }}
        >
          {/* Photo or initials avatar */}
          <div className={`h-48 bg-gradient-to-br ${bgGradient} flex items-center justify-center relative overflow-hidden`}>
            {member.photo ? (
              <img
                src={member.photo}
                alt={member.name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            ) : (
              <>
                {/* Decorative circles */}
                <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/10" />
                <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full bg-white/10" />
                <span className="text-5xl font-bold text-white/90 tracking-wider select-none relative z-10">
                  {member.initials}
                </span>
              </>
            )}
          </div>

          {/* Info */}
          <div className="p-5 text-center">
            <h3 className="text-lg font-bold text-gray-800">{member.name}</h3>
            <p className="text-primary text-sm font-medium mt-1">{member.role}</p>
            <p className="text-gray-400 text-xs mt-2 italic">{member.tagline}</p>
            <div className="mt-4 flex items-center justify-center text-xs text-primary/70 space-x-1">
              <span>Tap to know more</span>
              <svg className="w-3 h-3 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </div>
          </div>
        </div>

        {/* ─── BACK ─── */}
        <div
          className="absolute inset-0 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden p-6 flex flex-col"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          {/* Back header */}
          <div className="flex items-center space-x-3 mb-4 pb-3 border-b border-gray-100">
            <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${bgGradient} flex items-center justify-center flex-shrink-0`}>
              <span className="text-sm font-bold text-white">{member.initials}</span>
            </div>
            <div>
              <h4 className="font-bold text-gray-800 text-sm">{member.name}</h4>
              <p className="text-primary text-xs font-medium">{member.role}</p>
            </div>
          </div>

          {/* Bio */}
          <p className="text-gray-600 text-sm leading-relaxed mb-4 flex-grow">
            {member.bio}
          </p>

          {/* Achievements */}
          {member.achievements && member.achievements.length > 0 && (
            <div>
              <h5 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Key Contributions</h5>
              <ul className="space-y-1.5">
                {member.achievements.map((item, i) => (
                  <li key={i} className="flex items-start text-xs text-gray-600">
                    <span className="text-primary mr-2 mt-0.5 flex-shrink-0">✦</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <p className="text-center text-xs text-gray-400 mt-4">Tap to flip back</p>
        </div>
      </motion.div>
    </div>
  );
});

export default MemberCard;