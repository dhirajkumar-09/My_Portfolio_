import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, CheckCircle2, Cpu, BarChart3, Layers, Maximize2 } from 'lucide-react';
import { Github } from './SocialIcons';

export default function ProjectModal({ project, isOpen, onClose }) {
  const [imageExpanded, setImageExpanded] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (imageExpanded) setImageExpanded(false);
        else onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, imageExpanded, onClose]);

  if (!isOpen || !project) return null;

  const fallbackImage = "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80";

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-6 overflow-hidden">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity"
        />

        {/* Modal Window Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden z-10 text-slate-100 max-h-[92vh] flex flex-col"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800 bg-slate-950/80 backdrop-blur-sm z-20 flex-shrink-0">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
              <span className="ml-2 px-2.5 py-0.5 rounded-md text-[11px] font-mono font-medium tracking-wide uppercase bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                {project.category || "Project Quick View"}
              </span>
            </div>

            <button
              onClick={onClose}
              aria-label="Close modal"
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors border border-slate-700 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* 2-Column Responsive Body: Fits on screen with zero scrolling on desktop */}
          <div className="grid grid-cols-1 md:grid-cols-12 flex-1 overflow-y-auto divide-y md:divide-y-0 md:divide-x divide-slate-800">
            
            {/* Left Column (Visual Showcase + Action Buttons) */}
            <div className="md:col-span-5 p-5 sm:p-6 flex flex-col justify-between bg-slate-950/60 space-y-4">
              <div className="space-y-3">
                <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-md flex items-center justify-center group">
                  <img
                    src={project.image || fallbackImage}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => { e.target.src = fallbackImage; }}
                  />
                  {project.image && (
                    <button
                      onClick={() => setImageExpanded(!imageExpanded)}
                      className="absolute bottom-2.5 right-2.5 p-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-900 text-cyan-300 text-[10px] font-mono flex items-center gap-1 border border-slate-700 backdrop-blur-sm cursor-pointer opacity-90 hover:opacity-100 transition-opacity"
                      title="Inspect full image"
                    >
                      <Maximize2 className="w-3 h-3" />
                      <span>Full Image</span>
                    </button>
                  )}
                </div>

                {project.metrics && (
                  <div className="px-3.5 py-2 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-center gap-2 text-xs font-sans text-emerald-300">
                    <BarChart3 className="w-3.5 h-3.5 flex-shrink-0 text-emerald-400" />
                    <span className="font-medium text-[11px] sm:text-xs leading-tight">{project.metrics}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons right under image */}
              <div className="space-y-2 pt-2">
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-semibold text-xs sm:text-sm text-slate-950 bg-gradient-to-r from-cyan-400 via-sky-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 shadow-glow-cyan/50 hover:shadow-glow-cyan transition-all transform hover:-translate-y-0.5"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Launch Live Demo</span>
                  </a>
                )}
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-medium text-xs sm:text-sm text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 transition-all transform hover:-translate-y-0.5"
                  >
                    <Github className="w-3.5 h-3.5" />
                    <span>GitHub Repository</span>
                  </a>
                )}
              </div>
            </div>

            {/* Right Column (Complete Project Information - All visible at once) */}
            <div className="md:col-span-7 p-5 sm:p-6 space-y-4 flex flex-col justify-between">
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl sm:text-2xl font-display font-bold text-white mb-2 leading-tight">
                    {project.title}
                  </h3>
                  <p className="text-slate-300 font-sans leading-relaxed text-xs sm:text-sm">
                    {project.description || project.shortDescription}
                  </p>
                </div>

                {/* Key Features */}
                {project.keyFeatures && project.keyFeatures.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 flex items-center gap-1.5 font-semibold">
                      <Cpu className="w-3.5 h-3.5" />
                      Key Features &amp; Architecture
                    </h4>
                    <ul className="space-y-1.5">
                      {project.keyFeatures.slice(0, 4).map((feat, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2 p-2 rounded-lg bg-slate-800/40 border border-slate-800 text-xs text-slate-300"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Tech Stack Chips */}
                <div>
                  <h4 className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 flex items-center gap-1.5 mb-2 font-semibold">
                    <Layers className="w-3.5 h-3.5" />
                    Technologies &amp; Libraries
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {(project.techStack || []).map((tech, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-md text-[11px] font-mono bg-slate-800/80 text-cyan-200 border border-slate-700/60"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Close Button at bottom right */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-end">
                <button
                  onClick={onClose}
                  className="px-4 py-1.5 rounded-lg text-xs font-mono text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Close Window
                </button>
              </div>
            </div>

          </div>
        </motion.div>

        {/* Full Image Lightbox Overlay if requested */}
        {imageExpanded && (
          <div
            className="fixed inset-0 z-60 bg-black/90 flex items-center justify-center p-4 cursor-zoom-out"
            onClick={() => setImageExpanded(false)}
          >
            <img
              src={project.image || fallbackImage}
              alt={project.title}
              className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl"
            />
          </div>
        )}
      </div>
    </AnimatePresence>
  );
}
