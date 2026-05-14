import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { pageVariants, pageTransition, sectionVariants } from "../constants/motionVariants";
import { submitVolunteerApplication } from "../services/messageService";
import databaseService from "../services/databaseService";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

function Volunteer() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Events for the picker
  const [events, setEvents] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(true);

  // Form state — matches ApplyVolunteerRequest: { eventId, message }
  const [selectedEventId, setSelectedEventId] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  // Fetch available events on mount
  useEffect(() => {
    databaseService
      .getEvents(0, 50)
      .then((page) => {
        const list = page.content || page;
        setEvents(Array.isArray(list) ? list : []);
      })
      .catch((err) => console.error("Failed to load events:", err))
      .finally(() => setEventsLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (!selectedEventId) {
      setError("Please select an event to volunteer for.");
      return;
    }

    setSubmitting(true);
    try {
      await submitVolunteerApplication(Number(selectedEventId), message);
      setSubmitted(true);
    } catch (err) {
      const serverMsg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Failed to submit application. Please try again.";
      setError(serverMsg);
      console.error("Volunteer application error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={pageTransition}
      className="py-20 bg-neutralLight text-dark"
    >
      {/* Hero */}
      <motion.section
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        className="text-center max-w-3xl mx-auto px-6 mb-16"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary">
          Volunteer with Us
        </h1>
        <p className="text-lg md:text-xl text-gray-700">
          Join a community of changemakers. Contribute your skills, grow as a
          leader, and help create measurable impact in education, health, and
          the environment.
        </p>
      </motion.section>

      {/* Impact grid */}
      <motion.section
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        className="max-w-5xl mx-auto px-6 mb-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4"
      >
        {[
          { title: "Education", outcome: "Reach 2,000+ students" },
          { title: "Food", outcome: "Distribute 15,000 meals" },
          { title: "Health", outcome: "Support 3,000 patients" },
          { title: "Environment", outcome: "Plant 5,000 trees" },
        ].map((item) => (
          <div
            key={item.title}
            className="bg-white rounded-xl shadow-md p-6 text-center"
          >
            <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
            <p className="text-gray-600 text-sm">{item.outcome}</p>
          </div>
        ))}
      </motion.section>

      {/* Skill development */}
      <motion.section
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        className="max-w-4xl mx-auto px-6 mb-16"
      >
        <h2 className="text-3xl font-bold mb-6 text-center">
          Grow Skills & Leadership
        </h2>
        <ul className="list-disc list-inside space-y-4 text-gray-700">
          <li>Leadership and team coordination training</li>
          <li>Project management certification</li>
          <li>Community outreach and communication skills</li>
        </ul>
      </motion.section>

      {/* Volunteer Application Form */}
      <motion.section
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        className="max-w-3xl mx-auto px-6 mb-16"
      >
        <h2 className="text-2xl font-semibold mb-6 text-center">
          Apply to Volunteer
        </h2>

        {!isAuthenticated ? (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 text-center">
            <p className="text-amber-700 font-medium mb-3">
              You need to be logged in to apply as a volunteer.
            </p>
            <button
              onClick={() => navigate("/login")}
              className="bg-primary text-white px-6 py-2 rounded-lg hover:brightness-90 transition"
            >
              Login to Continue
            </button>
          </div>
        ) : submitted ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-50 border border-green-200 rounded-xl p-6 text-center"
          >
            <span className="text-3xl mb-2 block">✅</span>
            <p className="text-green-700 font-semibold text-lg">
              Application submitted successfully!
            </p>
            <p className="text-green-600 text-sm mt-1">
              We'll review your application and get back to you soon.
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                setSelectedEventId("");
                setMessage("");
              }}
              className="mt-4 text-primary underline text-sm"
            >
              Submit another application
            </button>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Event picker */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Select Event to Volunteer For *
              </label>
              {eventsLoading ? (
                <p className="text-gray-400 text-sm py-2">Loading events…</p>
              ) : events.length === 0 ? (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
                  <p className="text-gray-500 text-sm">
                    No upcoming events available right now. Please check back later!
                  </p>
                </div>
              ) : (
                <select
                  value={selectedEventId}
                  onChange={(e) => setSelectedEventId(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-3 text-sm bg-white focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
                >
                  <option value="">— Choose an event —</option>
                  {events.map((ev) => (
                    <option key={ev.id} value={ev.id}>
                      {ev.title}
                      {ev.eventDate
                        ? ` — ${new Date(ev.eventDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}`
                        : ""}
                      {ev.location ? ` (${ev.location})` : ""}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Message (optional)
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell us why you'd like to volunteer for this event…"
                className="w-full border border-gray-300 rounded-lg p-3 text-sm h-28 focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none resize-none"
              />
            </div>

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm"
              >
                {error}
              </motion.div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting || events.length === 0}
              className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:brightness-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? "Submitting…" : "Submit Application"}
            </button>
          </form>
        )}
      </motion.section>
    </motion.div>
  );
}

export default Volunteer;
