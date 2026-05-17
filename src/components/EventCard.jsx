import React from "react";
import { motion } from "framer-motion";
import { cardHover } from "../constants/motionVariants";
import { useNavigate } from "react-router-dom";

/**
 * EventCard — works with both legacy eventsData shape AND backend EventResponse.
 *
 * Backend EventResponse fields:
 *   id, title, description, location, eventDate, status, media[]
 *
 * Legacy fields (kept for backward compat):
 *   id, title, summary, caption, date, image, instagramLink
 */
const EventCard = React.memo(({ event }) => {
  const nav = useNavigate();
  const navigate = React.useCallback(() => {
    nav(`/events/${event.id}`);
  }, [nav, event.id]);

  // Resolve image — backend media array or legacy `image` field
  const imageUrl =
    event.bannerUrl || event.image || event.media?.[0]?.mediaUrl || null;

  // Resolve date — backend ISO string or legacy date string
  const displayDate = event.eventDate
    ? new Date(event.eventDate).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : event.date || "";

  // Resolve summary text
  const summaryText = event.summary || event.description || "";

  // Location badge
  const location = event.location || "";

  return (
    <motion.div
      className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer transform-gpu relative group"
      whileHover={cardHover}
      transition={{ duration: 0.4 }}
      onClick={navigate}
    >
      {imageUrl && (
        <div className="relative overflow-hidden">
          <motion.img
            src={imageUrl}
            alt={event.title}
            className="w-full h-52 object-cover transition-all duration-500 group-hover:brightness-105 group-hover:scale-105"
            loading="lazy"
          />
          {/* Caption badge */}
          {event.caption && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-4 py-3">
              <p className="text-white text-sm font-medium italic">
                "{event.caption}"
              </p>
            </div>
          )}
        </div>
      )}
      <div className="p-5">
        <h2 className="text-xl font-bold mb-1 text-primary">
          {event.title}
        </h2>
        <p className="text-gray-500 text-sm mb-2">
          {displayDate}
          {location && ` • ${location}`}
        </p>
        <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
          {summaryText}
        </p>

        {/* Status badge for backend events */}
        {event.status && (
          <span
            className={`inline-block mt-3 text-xs px-2.5 py-1 rounded-full font-medium ${
              event.status === "UPCOMING"
                ? "bg-blue-100 text-blue-700"
                : event.status === "COMPLETED"
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {event.status}
          </span>
        )}

        {/* Instagram link (legacy) */}
        {event.instagramLink && (
          <a
            href={event.instagramLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center space-x-1.5 mt-3 text-sm font-semibold text-pink-600 hover:text-pink-700 transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
            </svg>
            <span>View on Instagram</span>
          </a>
        )}
      </div>
    </motion.div>
  );
});

export default EventCard;
