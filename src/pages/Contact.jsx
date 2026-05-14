import React from "react";
import { motion } from "framer-motion";
import { pageVariants, pageTransition } from "../constants/motionVariants";
import { submitMessage } from "../services/messageService";

function Contact() {
  const [form, setForm] = React.useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = React.useState({});
  const [sent, setSent] = React.useState(false);
  const [sending, setSending] = React.useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) {
      setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      newErrors.email = "Enter a valid email";
    if (!form.message.trim()) newErrors.message = "Message is required";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setSending(true);
    try {
      // Backend: POST /api/messages
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
      className="min-h-screen w-full py-20 px-6 md:px-16 lg:px-24 mx-auto bg-white bg-[rgba(30,58,95,0.05)] text-dark"
    >
      <h1 className="text-4xl font-bold mb-10 text-center text-primary">
        Contact Us
      </h1>

      {/* Contact Info */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
        <div className="flex items-center space-x-4">
          <a
            href="mailto:trust@example.com"
            className="flex items-center space-x-2 text-dark hover:text-accent transition-transform duration-200 hover:scale-105"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M2.01 4.704L12 13.334l9.99-8.63A2 2 0 0019.99 4H4.01a2 2 0 00-2 0z" />
              <path d="M22 6.118l-10 8.667-10-8.667V18a2 2 0 002 2h16a2 2 0 002-2V6.118z" />
            </svg>
            <span>trust@example.com</span>
          </a>
        </div>
        <div className="flex items-center space-x-4 mt-2">
          <a
            href="tel:+919390564417"
            className="flex items-center space-x-2 text-dark hover:text-accent transition-transform duration-200 hover:scale-105"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 011.11-.21c1.21.49 2.53.76 3.88.76a1 1 0 011 1v3.5a1 1 0 01-1 1C7.61 21 3 16.39 3 10.5a1 1 0 011-1H7.5a1 1 0 011 1c0 1.35.26 2.67.76 3.88a1 1 0 01-.21 1.11l-2.43 2.3z" />
            </svg>
            <span>+91 93905 64417</span>
          </a>
        </div>
      </div>

      {/* Social Links */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Follow Us</h2>
        <div className="flex space-x-6">
          <a href="#" className="text-dark hover:text-accent transition-transform duration-200 hover:scale-105">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M7.75 2h8.5A5.75 5.75 0 0122 7.75v8.5A5.75 5.75 0 0116.25 22h-8.5A5.75 5.75 0 012 16.25v-8.5A5.75 5.75 0 017.75 2zm0 1.5A4.25 4.25 0 003.5 7.75v8.5A4.25 4.25 0 007.75 20.5h8.5a4.25 4.25 0 004.25-4.25v-8.5A4.25 4.25 0 0016.25 3.5h-8.5z" />
              <path d="M12 7a5 5 0 100 10 5 5 0 000-10zm0 1.5a3.5 3.5 0 11-.001 7.001A3.5 3.5 0 0112 8.5z" />
            </svg>
          </a>
          <a href="#" className="text-dark hover:text-accent transition-transform duration-200 hover:scale-105">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M4.98 3.5C3.34 3.5 2 4.84 2 6.48c0 1.64 1.34 2.98 2.98 2.98s2.98-1.34 2.98-2.98C7.96 4.84 6.62 3.5 4.98 3.5zM2 21h5.96V9H2v12zM9.24 9v12h5.96v-6.56c0-3.93-4.08-3.62-4.08 0V21h5.96v-6.32c0-4.78-5.44-4.6-5.44 0V21H9.24z" />
            </svg>
          </a>
        </div>
      </div>

      {/* Contact Form */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Send Us a Message</h2>

        {sent ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-50 border border-green-200 rounded-xl p-6 text-center"
          >
            <span className="text-3xl mb-2 block">✅</span>
            <p className="text-green-700 font-semibold text-lg">
              Message sent successfully!
            </p>
            <p className="text-green-600 text-sm mt-1">
              We'll get back to you soon. Thank you for reaching out.
            </p>
            <button
              onClick={() => setSent(false)}
              className="mt-4 text-primary underline text-sm"
            >
              Send another message
            </button>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Your Name"
                className={`w-full border p-3 rounded focus:outline-none focus:ring-2 focus:ring-primary/40 ${errors.name ? "border-red-400" : "border-gray-300"
                  }`}
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name}</p>
              )}
            </div>
            <div>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Your Email"
                className={`w-full border p-3 rounded focus:outline-none focus:ring-2 focus:ring-primary/40 ${errors.email ? "border-red-400" : "border-gray-300"
                  }`}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>
            <div>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder="Your Message"
                className={`w-full border p-3 rounded h-32 focus:outline-none focus:ring-2 focus:ring-primary/40 ${errors.message ? "border-red-400" : "border-gray-300"
                  }`}
              />
              {errors.message && (
                <p className="text-red-500 text-xs mt-1">{errors.message}</p>
              )}
            </div>
            <button
              type="submit"
              disabled={sending}
              className="bg-primary text-white px-6 py-2 rounded hover:brightness-90 transition disabled:opacity-50"
            >
              {sending ? "Sending..." : "Send Message"}
            </button>
          </form>
        )}
      </div>
    </motion.div>
  );
}

export default Contact;
