import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Eye, Sparkles, Layers, ArrowUpRight } from 'lucide-react';
import { Github } from '../components/SocialIcons';
import SectionHeading from '../components/SectionHeading';
import ProjectModal from '../components/ProjectModal';
import TiltCard from '../components/TiltCard';

export default function Projects({ projects, loading }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeModalProject, setActiveModalProject] = useState(null);

  const categories = ['All', 'IoT & Systems', 'AI & Web', 'Full-Stack'];

  const filteredProjects =
    selectedCategory === 'All'
      ? projects
      : projects.filter((p) => p.category === selectedCategory);

  return (
    <section id="projects" className="py-24 relative overflow-hidden bg-slate-100/40 dark:bg-slate-950/30 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <SectionHeading
          badge="Featured Engineering"
          title="Projects &amp; Architectures"
          subtitle="Real-world software systems, IoT telemetry pipelines, and AI applications built with modern tools."
        />

        {/* Filter Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-medium transition-all ${
                selectedCategory === cat
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-glow-cyan/50'
                  : 'bg-white dark:bg-slate-900/80 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800 shadow-sm'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        {loading ? (
          /* Skeleton Loader */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="rounded-2xl bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 p-4 space-y-4 animate-pulse shadow-sm"
              >
                <div className="h-48 bg-slate-200 dark:bg-slate-800 rounded-xl" />
                <div className="h-6 w-3/4 bg-slate-200 dark:bg-slate-800 rounded" />
                <div className="h-4 w-full bg-slate-200 dark:bg-slate-800 rounded" />
                <div className="h-4 w-5/6 bg-slate-200 dark:bg-slate-800 rounded" />
                <div className="h-8 w-1/2 bg-slate-200 dark:bg-slate-800 rounded" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence>
              {filteredProjects.map((project, idx) => (
                <motion.div
                  key={project.id || idx}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  className="h-full"
                >
                  <TiltCard
                    maxTilt={6}
                    perspective={1200}
                    className="h-full rounded-2xl bg-white/95 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800/80 backdrop-blur-xl overflow-hidden hover:border-cyan-500/40 transition-colors shadow-lg flex flex-col group"
                  >
                    {/* Card Thumbnail */}
                    <div className="relative h-52 w-full overflow-hidden bg-slate-950">
                    <img
                      src={project.image || "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80"}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.target.src = "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />

                    {/* Category pill */}
                    <div className="absolute top-3 left-3">
                      <span className="px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider bg-slate-900/90 text-cyan-400 border border-cyan-500/30 backdrop-blur-md">
                        {project.category}
                      </span>
                    </div>

                    {/* Overlay quick view button */}
                    <button
                      onClick={() => setActiveModalProject(project)}
                      className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/40 backdrop-blur-[2px] transition-opacity duration-300 gap-2 text-white font-medium text-xs font-mono"
                    >
                      <span className="px-3 py-1.5 rounded-lg bg-cyan-500 text-slate-950 font-semibold flex items-center gap-1.5 shadow-glow-cyan">
                        <Eye className="w-4 h-4" />
                        Quick View
                      </span>
                    </button>
                  </div>

                  {/* Card Content */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-display font-bold text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                          {project.title}
                        </h3>
                        {project.featured && (
                          <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            Featured
                          </span>
                        )}
                      </div>

                      <p className="text-sm text-slate-600 dark:text-slate-400 font-sans line-clamp-3 leading-relaxed">
                        {project.shortDescription || project.description}
                      </p>
                    </div>

                    {/* Tech Chips */}
                    <div className="pt-2">
                      <div className="flex flex-wrap gap-1.5">
                        {(project.techStack || []).slice(0, 4).map((tech, tIdx) => (
                          <span
                            key={tIdx}
                            className="px-2.5 py-1 rounded-md text-[11px] font-mono bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/60"
                          >
                            {tech}
                          </span>
                        ))}
                        {(project.techStack || []).length > 4 && (
                          <span className="px-2 py-1 rounded-md text-[10px] font-mono text-slate-500 dark:text-slate-400">
                            +{project.techStack.length - 4} more
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action Links */}
                    <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {project.liveUrl && (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-xl bg-cyan-50 dark:bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 hover:bg-cyan-500 hover:text-slate-950 dark:hover:text-slate-950 border border-cyan-200 dark:border-cyan-500/20 transition-all text-xs font-semibold flex items-center gap-1 shadow-sm"
                            title="Live Demo"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>Demo</span>
                          </a>
                        )}

                        {project.githubUrl && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-all text-xs flex items-center gap-1 shadow-sm"
                            title="GitHub Source"
                          >
                            <Github className="w-3.5 h-3.5" />
                            <span>Code</span>
                          </a>
                        )}
                      </div>

                      <button
                        onClick={() => setActiveModalProject(project)}
                        className="text-xs font-mono text-cyan-600 dark:text-cyan-400 hover:text-cyan-500 dark:hover:text-cyan-300 flex items-center gap-1 group/btn"
                      >
                        <span>Details</span>
                        <ArrowUpRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                      </button>
                    </div>

                  </div>
                </TiltCard>
              </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

      </div>

      {/* Detail Modal */}
      <ProjectModal
        project={activeModalProject}
        isOpen={Boolean(activeModalProject)}
        onClose={() => setActiveModalProject(null)}
      />
    </section>
  );
}
