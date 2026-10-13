import React, { useState } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  Mail,
  Send,
  MapPin,
  GraduationCap,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Github, Linkedin } from '../components/SocialIcons';
import SectionHeading from '../components/SectionHeading';
import { sendContactMessage } from '../services/portfolioService';
import { sendNotificationEmail } from '../services/emailService';

export default function Contact({ profile, onToast }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    honeypot: '' // spam trap
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  const contactEmail = profile?.email || 'dhirajku00021@gmail.com';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Honeypot check
    if (formData.honeypot) {
      console.warn('Bot detected via honeypot');
      return;
    }

    // 2. Client-side validations
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setStatus({ type: 'error', message: 'Please fill in all required fields.' });
      if (onToast) onToast({ type: 'error', title: 'Missing fields', message: 'Please enter your name, email, and message.' });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      setStatus({ type: 'error', message: 'Please provide a valid email address.' });
      if (onToast) onToast({ type: 'error', title: 'Invalid Email', message: 'Please enter a valid email format.' });
      return;
    }

    // 3. Rate limiting check (cooldown: 45 seconds between messages)
    const lastSent = localStorage.getItem('dhiraj_last_message_timestamp');
    const now = Date.now();
    if (lastSent && now - parseInt(lastSent, 10) < 45000) {
      const waitSec = Math.ceil((45000 - (now - parseInt(lastSent, 10))) / 1000);
      setStatus({
        type: 'error',
        message: `Please wait ${waitSec}s before sending another message to prevent spam.`
      });
      if (onToast) onToast({
        type: 'error',
        title: 'Rate Limit',
        message: `Please wait ${waitSec} seconds before submitting again.`
      });
      return;
    }

    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      // Step A: Save message to Firestore 'messages' collection
      await sendContactMessage({
        name: formData.name.trim(),
        email: formData.email.trim(),
        subject: formData.subject.trim() || 'Portfolio Contact',
        message: formData.message.trim()
      });

      // Step B: Send email notification to dhirajku00021@gmail.com
      await sendNotificationEmail({
        name: formData.name.trim(),
        email: formData.email.trim(),
        subject: formData.subject.trim(),
        message: formData.message.trim()
      });

      // Save rate-limit timestamp
      localStorage.setItem('dhiraj_last_message_timestamp', now.toString());

      // Trigger celebratory confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.8 },
        colors: ['#38bdf8', '#06b6d4', '#10b981', '#ffffff']
      });

      setStatus({
        type: 'success',
        message: "Message sent successfully! Thanks for reaching out; I'll get back to you soon."
      });

      if (onToast) {
        onToast({
          type: 'success',
          title: 'Message Delivered!',
          message: `Saved to inbox & notification dispatched to ${contactEmail}.`
        });
      }

      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        honeypot: ''
      });
    } catch (err) {
      console.error('Contact submit error:', err);
      setStatus({
        type: 'error',
        message: `Could not send message right now. Please email directly at ${contactEmail}.`
      });
      if (onToast) {
        onToast({
          type: 'error',
          title: 'Submission Issue',
          message: `An error occurred. Please email ${contactEmail} directly.`
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-24 relative overflow-hidden transition-colors duration-300">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <SectionHeading
          badge="Direct Collaboration"
          title="Get In Touch"
          subtitle="Interested in hiring me for an internship, collaborating on IoT hardware, or discussing software engineering? Let's connect!"
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          
          {/* Left Column: Direct Contact Info & Socials */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 p-6 sm:p-8 rounded-2xl bg-white/90 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700/80 backdrop-blur-xl shadow-xl flex flex-col justify-between space-y-6 transition-colors duration-300"
          >
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-display font-bold text-slate-900 dark:text-white">
                  Let's Discuss Projects
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm mt-2 font-sans leading-relaxed">
                  I'm actively seeking opportunities to contribute to dynamic software engineering
                  and IoT teams. Feel free to send a message or contact me directly.
                </p>
              </div>

              {/* Direct Info List */}
              <div className="space-y-4">
                <a
                  href={`mailto:${contactEmail}`}
                  className="flex items-center gap-4 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 hover:border-cyan-500/40 transition-all group shadow-sm"
                >
                  <div className="p-3 rounded-lg bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 group-hover:scale-110 transition-transform">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-mono text-slate-500 dark:text-slate-400">Direct Email</p>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-cyan-500 dark:group-hover:text-cyan-400 transition-colors break-all">
                      {contactEmail}
                    </p>
                  </div>
                </a>

                <div className="flex items-center gap-4 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 shadow-sm">
                  <div className="p-3 rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-mono text-slate-500 dark:text-slate-400">Current Base</p>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                      Patna, Bihar, India
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 shadow-sm">
                  <div className="p-3 rounded-lg bg-blue-500/15 text-blue-600 dark:text-blue-400">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-mono text-slate-500 dark:text-slate-400">College Campus</p>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                      Bakhtiyarpur College of Engineering
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick status pill */}
            <div className="p-4 rounded-xl bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-500/20 space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono text-cyan-700 dark:text-cyan-300 font-semibold">
                <Sparkles className="w-4 h-4 text-cyan-500 dark:text-cyan-400" />
                <span>Response Commitment</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Messages sent via this form trigger an immediate inbox dispatch to{' '}
                <span className="text-cyan-600 dark:text-cyan-400 font-mono font-medium">{contactEmail}</span>. Typically replied to within 24 hours.
              </p>
            </div>
          </motion.div>

          {/* Right Column: Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 p-6 sm:p-8 rounded-2xl bg-white/90 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700/80 backdrop-blur-xl shadow-xl transition-colors duration-300"
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Honeypot field for anti-spam */}
              <div style={{ display: 'none' }} aria-hidden="true">
                <input
                  type="text"
                  name="honeypot"
                  tabIndex={-1}
                  autoComplete="off"
                  value={formData.honeypot}
                  onChange={handleChange}
                />
              </div>

              {/* Status Alert if any */}
              {status.message && (
                <div
                  className={`p-4 rounded-xl text-sm flex items-start gap-3 ${
                    status.type === 'success'
                      ? 'bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-500/40 text-emerald-800 dark:text-emerald-200'
                      : 'bg-rose-50 dark:bg-rose-950/70 border border-rose-300 dark:border-rose-500/40 text-rose-800 dark:text-rose-200'
                  }`}
                >
                  {status.type === 'success' ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-rose-500 dark:text-rose-400 flex-shrink-0 mt-0.5" />
                  )}
                  <span>{status.message}</span>
                </div>
              )}

              {/* Name & Email Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="name" className="text-xs font-mono text-slate-700 dark:text-slate-300">
                    Your Name *
                  </label>
                  <input
                    id="name"
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Alex Sharma"
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-cyan-500 dark:focus:border-cyan-400 focus:bg-white dark:focus:bg-slate-950 focus:ring-1 focus:ring-cyan-400 text-sm transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="email" className="text-xs font-mono text-slate-700 dark:text-slate-300">
                    Your Email *
                  </label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="alex@example.com"
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-cyan-500 dark:focus:border-cyan-400 focus:bg-white dark:focus:bg-slate-950 focus:ring-1 focus:ring-cyan-400 text-sm transition-all"
                  />
                </div>
              </div>

              {/* Subject */}
              <div className="space-y-1.5">
                <label htmlFor="subject" className="text-xs font-mono text-slate-700 dark:text-slate-300">
                  Subject
                </label>
                <input
                  id="subject"
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Internship opportunity / Project query"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-cyan-500 dark:focus:border-cyan-400 focus:bg-white dark:focus:bg-slate-950 focus:ring-1 focus:ring-cyan-400 text-sm transition-all"
                />
              </div>

              {/* Message */}
              <div className="space-y-1.5">
                <label htmlFor="message" className="text-xs font-mono text-slate-700 dark:text-slate-300">
                  Your Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  required
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Hi Dhiraj, I reviewed your Stadium Controller and Darpan AI projects and would love to connect..."
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-cyan-500 dark:focus:border-cyan-400 focus:bg-white dark:focus:bg-slate-950 focus:ring-1 focus:ring-cyan-400 text-sm transition-all resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-6 rounded-xl font-semibold text-sm text-slate-950 bg-gradient-to-r from-cyan-400 via-sky-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 transition-all shadow-glow-cyan/50 hover:shadow-glow-cyan flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    <span>Transmitting Message...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Message Directly</span>
                  </>
                )}
              </button>

              <p className="text-[11px] font-mono text-slate-500 text-center pt-1">
                Protected with spam honeypot &bull; Saves to Firestore &bull; Notifies Dhiraj
              </p>
            </form>
          </motion.div>

        </div>

      </div>
    </section>
  );
}
