import React from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Cpu,
  Code2,
  FolderGit2,
  Award,
  ArrowUpRight,
  MapPin,
  CheckCircle2,
  Layers,
  Zap,
  Radio
} from 'lucide-react';
import TiltCard from './TiltCard';

export default function HeroShowcaseCard({ profile }) {
  const name = profile?.name || 'Dhiraj Kumar';
  const title = profile?.title || 'B.Tech CSE (IoT Specialization)';
  const college = profile?.college || 'Bakhtiyarpur College of Engineering, Patna';
  const year = profile?.year || '2023 - 2027';
  const location = profile?.location || 'Patna, Bihar, India';

  // Stats from profile
  const projectsCount = profile?.stats?.projectsCount || '10+';
  const techStackCount = profile?.stats?.techStackCount || '12+';
  const dsaSolved = profile?.stats?.dsaSolved || '150+';

  const skills = [
    { label: 'React 19', color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30' },
    { label: 'ESP32 & IoT', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' },
    { label: 'Tailwind CSS', color: 'text-sky-400 bg-sky-500/10 border-sky-500/30' },
    { label: 'Firebase Cloud', color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' },
    { label: 'MQTT & FreeRTOS', color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30' },
    { label: 'Node.js', color: 'text-teal-400 bg-teal-500/10 border-teal-500/30' }
  ];

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <TiltCard
      maxTilt={6}
      perspective={1200}
      glowColor="rgba(6, 182, 212, 0.18)"
      className="w-full max-w-md mx-auto"
    >
      <div className="relative rounded-3xl p-1">
        
        {/* Subtle Ambient Glow Border */}
        <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-cyan-500/30 via-sky-500/20 to-emerald-500/30 blur-xl opacity-75 animate-pulse-slow pointer-events-none" />

        {/* Main Card Surface */}
        <div className="relative rounded-3xl bg-white/95 dark:bg-slate-900/90 backdrop-blur-2xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-7 shadow-2xl space-y-6 transition-all duration-300">
          
          {/* Header Status Bar */}
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-xs font-medium text-emerald-600 dark:text-emerald-400 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
              <span>Available for Opportunities</span>
            </div>

            <span className="text-xs font-mono text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700/60">
              {year}
            </span>
          </div>

          {/* Avatar & Identity Showcase */}
          <div className="flex items-center gap-4 pt-1">
            
            {/* Animated Glowing Monogram Shield */}
            <div className="relative flex-shrink-0">
              <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-gradient-to-tr from-cyan-500 via-sky-500 to-emerald-400 p-0.5 shadow-lg shadow-cyan-500/20">
                <div className="w-full h-full rounded-[14px] bg-slate-950 flex flex-col items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/20 to-transparent pointer-events-none" />
                  <span className="text-xl sm:text-2xl font-display font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-300 tracking-tight">
                    DK
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping absolute bottom-2 right-2" />
                </div>
              </div>

              {/* Verified Badge */}
              <div className="absolute -bottom-1 -right-1 bg-white dark:bg-slate-900 rounded-full p-0.5 shadow">
                <CheckCircle2 className="w-4 h-4 text-cyan-500 fill-cyan-500/20" />
              </div>
            </div>

            {/* Profile Identity Details */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <h3 className="text-lg sm:text-xl font-display font-bold text-slate-900 dark:text-white truncate">
                  {name}
                </h3>
                <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0 animate-pulse" />
              </div>

              <p className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 truncate mt-0.5">
                {title}
              </p>

              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5 flex items-center gap-1">
                <span className="truncate">{college}</span>
              </p>
            </div>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-3 gap-2.5 pt-1">
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 text-center hover:border-cyan-500/40 transition-colors">
              <span className="block text-lg font-bold text-slate-900 dark:text-white">
                {projectsCount}
              </span>
              <span className="block text-[10px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-0.5">
                Projects
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 text-center hover:border-emerald-500/40 transition-colors">
              <span className="block text-lg font-bold text-slate-900 dark:text-white">
                {techStackCount}
              </span>
              <span className="block text-[10px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-0.5">
                Tech Stack
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 text-center hover:border-sky-500/40 transition-colors">
              <span className="block text-lg font-bold text-slate-900 dark:text-white">
                {dsaSolved}
              </span>
              <span className="block text-[10px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-0.5">
                DSA Solved
              </span>
            </div>
          </div>

          {/* Tech Stack Pills */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span className="font-medium flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                Featured Technologies
              </span>
              <span className="text-[11px] font-mono text-cyan-600 dark:text-cyan-400">Full-Stack &amp; IoT</span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {skills.map((skill) => (
                <span
                  key={skill.label}
                  className={`px-2.5 py-1 rounded-xl text-xs font-medium border ${skill.color} transition-transform hover:scale-105 cursor-default shadow-sm`}
                >
                  {skill.label}
                </span>
              ))}
            </div>
          </div>

          {/* Current Focus Card */}
          <div className="p-3 rounded-2xl bg-gradient-to-r from-cyan-500/10 via-sky-500/5 to-emerald-500/10 border border-cyan-500/20 flex items-start gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex-shrink-0 mt-0.5">
              <Radio className="w-4 h-4 animate-pulse" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-200">
                Current Focus
              </h4>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed mt-0.5">
                Engineering smart IoT sensor pipelines &amp; scalable full-stack web applications.
              </p>
            </div>
          </div>

          {/* Interactive Action Row */}
          <div className="pt-2 flex items-center gap-3">
            <button
              onClick={() => scrollTo('contact')}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs text-slate-950 bg-gradient-to-r from-cyan-400 via-sky-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 transition-all shadow-md hover:shadow-cyan-500/20 cursor-pointer"
            >
              <span>Get In Touch</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => scrollTo('projects')}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700/80 border border-slate-300 dark:border-slate-700 transition-all cursor-pointer shadow-sm"
            >
              <span>Explore Work</span>
            </button>
          </div>

        </div>
      </div>
    </TiltCard>
  );
}
