import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { pageVariants, pageTransition } from "../constants/motionVariants";
import databaseService from "../services/databaseService";
import NotFound from "./NotFound";

function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    databaseService
      .getEventById(id)
      .then((data) => setEvent(data))
      .catch((err) => {
        console.error("Failed to load event:", err);
        setNotFound(true);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        Loading event...
      </div>
    );
  }

  if (notFound || !event) {
    return <NotFound />;
  }

  // Resolve image/photos from backend media array
  const photos =
    event.media
      ?.filter((m) => m.mediaType === "IMAGE")
      .map((m) => m.mediaUrl) ||
    event.photos ||
    [];

  const videos =
    event.media
      ?.filter((m) => m.mediaType === "VIDEO")
      .map((m) => m.mediaUrl) ||
    event.videos ||
    [];

  const headerImage = event.image || photos[0] || null;

  const displayDate = event.eventDate
    ? new Date(event.eventDate).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : event.date || "";

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={pageTransition}
      className="bg-white"
    >
      {/* header image */}
      <div className="relative h-64 md:h-96">
        {headerImage && (
          <img
            src={headerImage}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-black bg-opacity-40" />
        <div className="absolute bottom-4 left-4 text-white">
          <h1 className="text-3xl md:text-5xl font-bold">
            {event.title}
          </h1>
          <p className="text-sm mt-1">{displayDate}</p>
          {event.location && (
            <p className="text-sm mt-0.5 opacity-80">📍 {event.location}</p>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        <p className="text-lg text-gray-700 mb-6">{event.description}</p>

        {event.metrics && (
          <div className="mb-8 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {Object.entries(event.metrics).map(([key, val]) => (
              <div key={key}>
                <p className="text-2xl font-bold text-primary">{val}</p>
                <p className="text-sm text-gray-600 capitalize">
                  {key.replace(/_/g, " ")}
                </p>
              </div>
            ))}
          </div>
        )}

        {photos.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-primary">Photos</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {photos.map((url, i) => (
                <img
                  key={i}
                  src={url}
                  className="w-full h-48 object-cover rounded-lg"
                  loading="lazy"
                  alt={`Photo ${i + 1}`}
                />
              ))}
            </div>
          </div>
        )}

        {videos.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-primary">Videos</h2>
            <div className="space-y-6">
              {videos.map((vid, i) => (
                <div
                  key={i}
                  className="relative w-full"
                  style={{ paddingTop: "56.25%" }}
                >
                  <iframe
                    src={vid}
                    title={`Video ${i + 1}`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute top-0 left-0 w-full h-full rounded-lg"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={() => navigate("/events")}
          className="mt-8 text-primary underline"
        >
          &larr; Back to events
        </button>
      </div>
    </motion.div>
  );
}

export default EventDetails;
