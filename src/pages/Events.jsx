import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import EventCard from "../components/EventCard";
import { pageVariants, pageTransition } from "../constants/motionVariants";
import databaseService from "../services/databaseService";

function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    databaseService
      .getEvents(0, 50)
      .then((page) => {
        // Spring Page object: { content: [...], totalPages, ... }
        setEvents(page.content || page);
      })
      .catch((err) => console.error("Failed to load events:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={pageTransition}
      className="py-20 px-6 max-w-5xl mx-auto bg-neutralLight text-dark"
    >
      <h1 className="text-4xl font-bold mb-10 text-center text-primary">
        Events &amp; Updates
      </h1>

      {loading ? (
        <div className="text-center py-16 text-gray-400">Loading events...</div>
      ) : events.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          No events available yet. Check back soon!
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </motion.div>
  );
}

export default Events;
