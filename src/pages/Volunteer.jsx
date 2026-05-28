import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { pageVariants, pageTransition, sectionVariants } from "../constants/motionVariants";
import { submitVolunteerApplication } from "../services/messageService";
import databaseService from "../services/databaseService";
import { useAuth } from "../hooks/useAuth";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Typography, Card, CardContent, Button, TextField, MenuItem, CircularProgress, Alert } from "@mui/material";
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';

function Volunteer() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [events, setEvents] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [selectedEventId, setSelectedEventId] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const qEventId = searchParams.get("eventId");
    if (qEventId) {
      setSelectedEventId(qEventId);
    }
  }, [searchParams]);

  useEffect(() => {
    let ignore = false;
    databaseService
      .getEvents(0, 50)
      .then((page) => {
        if (ignore) return;
        const evs = Array.isArray(page.content || page) ? (page.content || page) : [];
        setEvents(evs.filter(e => e.status === "UPCOMING" || e.status === "ONGOING"));
      })
      .catch((err) => { if (!ignore) console.error("Failed to load events:", err); })
      .finally(() => { if (!ignore) setEventsLoading(false); });
    return () => { ignore = true; };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!isAuthenticated) return navigate("/login");
    if (!selectedEventId) return setError("Please select an event to volunteer for.");

    setSubmitting(true);
    try {
      await submitVolunteerApplication(Number(selectedEventId), message);
      setSubmitted(true);
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || "Failed to submit application.");
    } finally {
      setSubmitting(false);
    }
  };

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={pageTransition} className="py-24 bg-gray-50/50 min-h-screen">
      <motion.section variants={sectionVariants} initial="hidden" animate="visible" className="text-center max-w-4xl mx-auto px-6 mb-20">
        <Typography variant="h2" component="h1" sx={{ fontWeight: 800, color: 'primary.main', mb: 3, fontSize: { xs: '2.5rem', md: '3.5rem' } }}>
          Volunteer with Us
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" sx={{ fontSize: '1.2rem', maxWidth: 800, mx: 'auto', lineHeight: 1.6 }}>
          Join a community of changemakers. Contribute your skills, grow as a leader, and help create measurable impact in education, health, and the environment.
        </Typography>
      </motion.section>

      <motion.section variants={containerVariants} initial="hidden" animate="visible" className="max-w-6xl mx-auto px-6 mb-20 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { title: "Education", outcome: "Reach 2,000+ students", icon: "📚" },
          { title: "Food", outcome: "Distribute 15,000 meals", icon: "🍲" },
          { title: "Health", outcome: "Support 3,000 patients", icon: "⚕️" },
          { title: "Environment", outcome: "Plant 5,000 trees", icon: "🌱" },
        ].map((item, idx) => (
          <motion.div key={item.title} variants={itemVariants} whileHover={{ y: -8 }}>
            <Card elevation={0} sx={{ p: 4, textAlign: 'center', borderRadius: 4, border: '1px solid rgba(0,0,0,0.04)', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
              <div className="text-4xl mb-4">{item.icon}</div>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>{item.title}</Typography>
              <Typography variant="body2" color="text.secondary">{item.outcome}</Typography>
            </Card>
          </motion.div>
        ))}
      </motion.section>

      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-start">
        <motion.section variants={sectionVariants} initial="hidden" animate="visible" className="space-y-6">
          <Typography variant="h4" sx={{ fontWeight: 800, color: 'text.primary', mb: 4 }}>
            Grow Skills & Leadership
          </Typography>
          {[
            "Leadership and team coordination training",
            "Project management certification",
            "Community outreach and communication skills"
          ].map((skill, i) => (
            <div key={i} className="flex items-center space-x-4 p-4 rounded-2xl bg-white border border-gray-100 shadow-sm">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <AutoAwesomeIcon color="primary" fontSize="small" />
              </div>
              <Typography variant="body1" sx={{ fontWeight: 500, color: 'text.secondary' }}>{skill}</Typography>
            </div>
          ))}
        </motion.section>

        <motion.section variants={sectionVariants} initial="hidden" animate="visible">
          <Card elevation={0} sx={{ borderRadius: 6, p: { xs: 4, md: 5 }, boxShadow: '0 20px 40px rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.05)' }}>
            <Typography variant="h5" sx={{ fontWeight: 800, mb: 4, textAlign: 'center' }}>Apply to Volunteer</Typography>

            {!isAuthenticated ? (
              <div className="text-center py-8">
                <Alert severity="warning" sx={{ mb: 4, borderRadius: 3, justifyContent: 'center' }}>
                  You need to be logged in to apply as a volunteer.
                </Alert>
                <Button variant="contained" color="primary" onClick={() => navigate("/login")} sx={{ borderRadius: 4, px: 4, textTransform: 'none', fontWeight: 600 }}>
                  Login to Continue
                </Button>
              </div>
            ) : submitted ? (
              <div className="text-center py-6">
                <CheckCircleOutlinedIcon color="success" sx={{ fontSize: 64, mb: 2 }} />
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>Application Submitted!</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>We'll review your application and get back to you soon.</Typography>
                <Button variant="outlined" onClick={() => { setSubmitted(false); setSelectedEventId(""); setMessage(""); }} sx={{ borderRadius: 4, textTransform: 'none' }}>
                  Submit another application
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && <Alert severity="error" sx={{ borderRadius: 2 }}>{error}</Alert>}
                
                {eventsLoading ? (
                  <CircularProgress size={24} />
                ) : events.length === 0 ? (
                  <Alert severity="info" sx={{ borderRadius: 2 }}>No upcoming events available right now.</Alert>
                ) : (
                  <TextField select fullWidth label="Select Event to Volunteer For *" value={selectedEventId} onChange={(e) => setSelectedEventId(e.target.value)} disabled={submitting} InputProps={{ sx: { borderRadius: 3 } }}>
                    {events.map((ev) => (
                      <MenuItem key={ev.id} value={ev.id}>
                        {ev.title} {ev.eventDate && !isNaN(new Date(ev.eventDate).getTime()) ? `— ${new Date(ev.eventDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}` : ""}
                      </MenuItem>
                    ))}
                  </TextField>
                )}

                <TextField fullWidth multiline rows={4} label="Message (optional)" placeholder="Tell us why you'd like to volunteer..." value={message} onChange={(e) => setMessage(e.target.value)} disabled={submitting} InputProps={{ sx: { borderRadius: 3 } }} />

                <Button fullWidth variant="contained" color="primary" size="large" type="submit" disabled={submitting || events.length === 0} sx={{ py: 1.5, borderRadius: 3, fontWeight: 700, textTransform: 'none' }}>
                  {submitting ? <CircularProgress size={24} color="inherit" /> : "Submit Application"}
                </Button>
              </form>
            )}
          </Card>
        </motion.section>
      </div>
    </motion.div>
  );
}

export default Volunteer;
