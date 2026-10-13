import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, ExternalLink, Calendar, CheckCircle2, ShieldCheck, Eye, X } from 'lucide-react';
import SectionHeading from '../components/SectionHeading';

export default function Certificates({ certificates = [] }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [previewCert, setPreviewCert] = useState(null);

  // Extract categories
  const categories = ['All', ...new Set(certificates.map((c) => c.category || 'General'))];

  // Filtered certificates
  const filtered = selectedCategory === 'All'
    ? certificates
    : certificates.filter((c) => c.category === selectedCategory);

  return (
    <section id="certificates" className="py-24 sm:py-32 relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeading
          eyebrow="Accreditation & Badges"
          title="Certificates & Credentials"
          subtitle="Verified academic coursework, technical specializations, and industry competencies in IoT and software systems."
        />

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-mono transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-cyan-400 to-emerald-400 text-slate-950 font-bold shadow-glow-cyan/40 shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-900/80 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Certificate Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filtered.map((cert, index) => (
            <motion.div
              key={cert.id || index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className="group relative rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 hover:border-cyan-500/40 dark:hover:border-cyan-500/40 p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:-translate-y-1.5"
            >
              {/* Card Header & Preview Image */}
              <div>
                <div className="relative h-44 w-full rounded-2xl overflow-hidden bg-slate-950/90 border border-slate-200 dark:border-slate-800/80 mb-5 group/img">
                  <img
                    src={cert.image || "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80"}
                    alt={cert.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-105"
                    onError={(e) => {
                      e.target.src = "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                  
                  {/* Category Pill */}
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg text-[10px] font-mono uppercase tracking-wider bg-black/60 backdrop-blur-md text-cyan-300 border border-cyan-400/30">
                    {cert.category || 'Certification'}
                  </span>

                  {/* Preview Icon overlay button */}
                  <button
                    onClick={() => setPreviewCert(cert)}
                    className="absolute bottom-3 right-3 p-2 rounded-xl bg-black/70 hover:bg-black/90 text-cyan-300 hover:text-white border border-white/10 backdrop-blur-md transition-all cursor-pointer"
                    title="Inspect Certificate"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>

                {/* Organization & Date */}
                <div className="flex items-center justify-between text-xs font-mono text-slate-500 dark:text-slate-400 mb-2">
                  <span className="flex items-center gap-1.5 text-cyan-600 dark:text-cyan-400 font-medium">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                    {cert.issuer}
                  </span>
                  {cert.issueDate && (
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {cert.issueDate}
                    </span>
                  )}
                </div>

                {/* Title */}
                <h3 className="text-base sm:text-lg font-display font-bold text-slate-900 dark:text-white mb-2 leading-snug line-clamp-2">
                  {cert.title}
                </h3>

                {/* Credential ID */}
                {cert.credentialId && (
                  <p className="text-[11px] font-mono text-slate-400 dark:text-slate-500 mb-3 truncate">
                    ID: {cert.credentialId}
                  </p>
                )}

                {/* Skills tags */}
                {cert.skills && cert.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {cert.skills.map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className="px-2 py-0.5 rounded-md text-[11px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/60"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Card Footer Actions */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-3">
                <button
                  onClick={() => setPreviewCert(cert)}
                  className="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-slate-600 dark:text-slate-400 hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Details</span>
                </button>

                {cert.credentialUrl && (
                  <a
                    href={cert.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-900 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 shadow-sm transition-all transform hover:-translate-y-0.5"
                  >
                    <span>Verify</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Certificate Lightbox Preview Modal */}
      <AnimatePresence>
        {previewCert && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setPreviewCert(null)}
              className="fixed inset-0 bg-black/85 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden z-10 text-white max-h-[90vh] flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80 flex-shrink-0">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-mono text-cyan-400 font-semibold uppercase">
                    {previewCert.issuer}
                  </span>
                </div>
                <button
                  onClick={() => setPreviewCert(null)}
                  className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 overflow-y-auto space-y-4">
                <div className="w-full rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 flex items-center justify-center">
                  <img
                    src={previewCert.image || "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80"}
                    alt={previewCert.title}
                    className="w-full max-h-[380px] object-contain"
                  />
                </div>

                <div>
                  <h3 className="text-xl font-bold font-display text-white mb-1">
                    {previewCert.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-slate-400">
                    <span>Issued: {previewCert.issueDate}</span>
                    {previewCert.credentialId && <span>ID: {previewCert.credentialId}</span>}
                  </div>
                </div>

                {previewCert.skills && previewCert.skills.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {previewCert.skills.map((s, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg text-xs font-mono bg-slate-800 text-cyan-300 border border-slate-700"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-6 py-3.5 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-3 flex-shrink-0">
                {previewCert.credentialUrl ? (
                  <a
                    href={previewCert.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300"
                  >
                    <span>Open Verification Link</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                ) : <div />}

                <button
                  onClick={() => setPreviewCert(null)}
                  className="px-4 py-2 rounded-xl text-xs font-mono text-slate-400 hover:text-white"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
