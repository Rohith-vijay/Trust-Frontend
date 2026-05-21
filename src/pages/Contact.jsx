import React, { useState } from "react";
import { motion } from "framer-motion";
import { pageVariants, pageTransition } from "../constants/motionVariants";
import { submitMessage } from "../services/messageService";
import { Typography, TextField, Button, Card, IconButton, CircularProgress } from "@mui/material";
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import SendIcon from '@mui/icons-material/Send';
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = "Enter a valid email";
    if (!form.message.trim()) newErrors.message = "Message is required";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setSending(true);
    try {
      await submitMessage(form);
      setSent(true);
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      console.error("Failed to send message:", err);
    } finally {
      setSending(false);
    }
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={pageTransition}
      className="min-h-screen py-24 px-6 md:px-16 lg:px-24 bg-gray-50/50"
    >
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center mb-16">
          <Typography variant="h2" component="h1" sx={{ fontWeight: 800, color: 'primary.main', mb: 2, fontSize: { xs: '2.5rem', md: '3.5rem' } }}>
            Get in Touch
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
            We'd love to hear from you. Whether you have a question about our programs, volunteering, or anything else, our team is ready to answer all your questions.
          </Typography>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-12">
          {/* Contact Info Panel */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="lg:col-span-2 space-y-8">
            <Card elevation={0} sx={{ borderRadius: 6, p: 4, bgcolor: 'primary.main', color: 'white', boxShadow: '0 20px 40px rgba(176, 122, 63, 0.2)' }}>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 4 }}>Contact Information</Typography>
              
              <div className="space-y-6 mb-12">
                <a href="mailto:trust@example.com" className="flex items-center space-x-4 group hover:opacity-80 transition-opacity">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                    <EmailOutlinedIcon />
                  </div>
                  <div>
                    <Typography variant="caption" sx={{ color: 'white', opacity: 0.8 }}>Email Us</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600, color: 'white' }}>trust@example.com</Typography>
                  </div>
                </a>
                
                <a href="tel:+919390564417" className="flex items-center space-x-4 group hover:opacity-80 transition-opacity">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                    <PhoneOutlinedIcon />
                  </div>
                  <div>
                    <Typography variant="caption" sx={{ color: 'white', opacity: 0.8 }}>Call Us</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600, color: 'white' }}>+91 93905 64417</Typography>
                  </div>
                </a>
              </div>

              <div>
                <Typography variant="caption" sx={{ color: 'white', opacity: 0.8, display: 'block', mb: 2 }}>Follow Us</Typography>
                <div className="flex space-x-2">
                  <IconButton sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.1)', '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' } }}>
                    <FacebookIcon />
                  </IconButton>
                  <IconButton sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.1)', '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' } }}>
                    <TwitterIcon />
                  </IconButton>
                  <IconButton sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.1)', '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' } }}>
                    <InstagramIcon />
                  </IconButton>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Form Panel */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.4 }} className="lg:col-span-3">
            <Card elevation={0} sx={{ borderRadius: 6, p: { xs: 4, md: 6 }, boxShadow: '0 20px 40px rgba(0,0,0,0.05)', border: '1px solid rgba(0,0,0,0.03)' }}>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 4, color: 'text.primary' }}>Send Us a Message</Typography>
              
              {sent ? (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-10">
                  <CheckCircleOutlinedIcon color="success" sx={{ fontSize: 64, mb: 2 }} />
                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>Message Sent Successfully!</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>We'll get back to you soon. Thank you for reaching out.</Typography>
                  <Button variant="outlined" color="primary" onClick={() => setSent(false)} sx={{ borderRadius: 4, textTransform: 'none' }}>
                    Send another message
                  </Button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <TextField
                      fullWidth label="Your Name" variant="outlined" name="name"
                      value={form.name} onChange={handleChange} error={!!errors.name} helperText={errors.name}
                      InputProps={{ sx: { borderRadius: 3 } }}
                    />
                    <TextField
                      fullWidth label="Your Email" variant="outlined" type="email" name="email"
                      value={form.email} onChange={handleChange} error={!!errors.email} helperText={errors.email}
                      InputProps={{ sx: { borderRadius: 3 } }}
                    />
                  </div>
                  <TextField
                    fullWidth label="Your Message" variant="outlined" name="message" multiline rows={6}
                    value={form.message} onChange={handleChange} error={!!errors.message} helperText={errors.message}
                    InputProps={{ sx: { borderRadius: 3 } }}
                  />
                  <Button
                    variant="contained" color="primary" size="large" type="submit" disabled={sending}
                    endIcon={sending ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
                    sx={{ px: 6, py: 1.5, borderRadius: 3, fontWeight: 700, textTransform: 'none', fontSize: '1rem', boxShadow: '0 8px 16px rgba(0,0,0,0.1)' }}
                  >
                    {sending ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              )}
            </Card>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

export default Contact;
