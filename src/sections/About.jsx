import React from 'react';
import { motion } from 'framer-motion';
import {
  Cpu,
  Layers,
  Code2,
  FolderGit2,
  Award,
  Clock,
  Sparkles,
  Download,
  GraduationCap
} from 'lucide-react';
import SectionHeading from '../components/SectionHeading';

const PILLAR_STYLES = [
  { icon: Cpu, gradient: 'from-cyan-500 to-blue-500' },
  { icon: Layers, gradient: 'from-blue-500 to-indigo-500' },
  { icon: Sparkles, gradient: 'from-emerald-500 to-teal-500' },
  { icon: Code2, gradient: 'from-violet-500 to-purple-500' },
  { icon: Award, gradient: 'from-amber-500 to-orange-500' },
  { icon: FolderGit2, gradient: 'from-rose-500 to-pink-500' }
];

const DEFAULT_PILLARS = [
  {
    title: 'IoT & Embedded Engineering',
    desc: 'Passionate about integrating microcontrollers, sensor telemetry, and hardware protocols with cloud dashboards for real-time monitoring.'
  },
  {
    title: 'Modern Full-Stack Web Architecture',
    desc: 'Crafting responsive, high-performance web applications using React, modern JavaScript, Tailwind CSS, and scalable cloud architectures.'
  },
  {
    title: 'Data Structures & Algorithms',
    desc: 'Writing optimized algorithms in Python, Java, and C with a disciplined approach to time-space complexity and object-oriented patterns.'
  }
];

export default function About({ profile }) {
  const stats = [
    {
      label: 'Projects Built',
      value: profile?.stats?.projectsCount || '10+',
      icon: FolderGit2,
      desc: 'IoT, AI & web systems'
    },
    {
      label: 'Technologies',
      value: profile?.stats?.techStackCount || '12+',
      icon: Code2,
      desc: 'Languages, frameworks & cloud'
    },
    {
      label: 'Years Learning',
      value: profile?.stats?.yearsLearning || '2+',
      icon: Clock,
      desc: 'B.Tech academic journey'
    },
    {
      label: 'DSA Solved',
      value: profile?.stats?.dsaSolved || '150+',
      icon: Award,
      desc: 'Algorithmic challenges'
    }
  ];

  // Map dynamic pillars or fallback to defaults
  const userPillars = Array.isArray(profile?.pillars)
    ? profile.pillars
    : DEFAULT_PILLARS;

  const activePillars = userPillars.map((pillar, idx) => {
    const style = PILLAR_STYLES[idx % PILLAR_STYLES.length];
    return {
      title: pillar.title || 'Engineering Focus',
      desc: pillar.desc || '',
      icon: style.icon,
      gradient: style.gradient
    };
  });

  return (
    <section id="about" className="py-24 relative overflow-hidden transition-colors duration-300">
      {/* Dynamic Animated Ambient Glow */}
      <div className="absolute top-1/3 -left-32 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none animate-pulse-slow" />
      <div className="absolute bottom-10 -right-32 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none animate-pulse-slow" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <SectionHeading
          badge="Background &amp; Philosophy"
          title={profile?.aboutHeading || "About My Engineering Journey"}
          subtitle={profile?.aboutSubtitle || "Combining academic rigor with hands-on systems development to build purposeful technology."}
        />

        {/* Bio Card + Quick Pillars */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-16">
          
          {/* Main Bio Card with Animated Glow and Hover Lift */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="lg:col-span-7 rounded-3xl p-6 sm:p-8 bg-white/90 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700/80 hover:border-cyan-500/40 backdrop-blur-xl shadow-xl hover:shadow-2xl flex flex-col justify-between transition-all duration-300 relative group overflow-hidden"
          >
            {/* Subtle card top accent line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 via-sky-500 to-emerald-400 opacity-80" />

            <div className="space-y-4">
              <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400 font-mono text-xs uppercase tracking-wider font-semibold">
                <GraduationCap className="w-4 h-4 animate-bounce-slow" />
                <span>{profile?.aboutBadge || "Career Objective & Aspirations"}</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 dark:text-white leading-tight">
                {profile?.aboutTitle || profile?.title || "B.Tech Student in CSE (IoT Specialization)"}
              </h3>

              <p className="text-slate-700 dark:text-slate-300 font-sans leading-relaxed text-base sm:text-lg">
                {profile?.bio ||
                  'Motivated, detail-oriented B.Tech student in Computer Science & Engineering with IoT Specialization at Bakhtiyarpur College of Engineering, Patna. Actively seeking an internship or entry-level software/IoT developer role to engineer real-world systems, learn from industry leaders, and contribute impactful solutions.'}
              </p>

              <p className="text-slate-600 dark:text-slate-400 font-sans leading-relaxed text-sm">
                {profile?.aboutBio2 ||
                  'Currently in my 2nd year (2023–2027), I focus on writing clean, modular code, designing hardware telemetry pipelines, and building accessible full-stack apps. Whether managing crowd flows in stadiums or building empathetic AI companions, I thrive on turning complex problems into elegant software solutions.'}
              </p>
            </div>

            <div className="pt-6 mt-6 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-600 dark:text-cyan-400 group-hover:scale-105 transition-transform">
                  <Cpu className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400" />
                </div>
                <div>
                  <p className="text-xs font-mono text-slate-500 dark:text-slate-400">Current Affiliation</p>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    {profile?.affiliation || profile?.college || "Bakhtiyarpur College of Engg., Patna"}
                  </p>
                </div>
              </div>

              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href={profile?.resumeUrl || '/resume.pdf'}
                download="Dhiraj_Kumar_Resume.pdf"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 via-sky-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 shadow-glow-cyan/40 transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download CV</span>
              </motion.a>
            </div>
          </motion.div>

          {/* Pillars Column with Interactive Staggered Floating Cards */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-4">
            {activePillars.map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <motion.div
                  key={pillar.title + idx}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-30px' }}
                  whileHover={{ y: -6, scale: 1.02 }}
                  transition={{ duration: 0.45, delay: idx * 0.12 }}
                  className="rounded-2xl p-5 bg-white/90 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-700/60 backdrop-blur-md hover:border-cyan-500/50 hover:shadow-lg transition-all group cursor-default"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`p-3 rounded-xl bg-gradient-to-br ${pillar.gradient} text-white shadow-md flex-shrink-0 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-base font-display font-semibold text-slate-900 dark:text-white mb-1 group-hover:text-cyan-500 dark:group-hover:text-cyan-400 transition-colors">
                        {pillar.title}
                      </h4>
                      <p className="text-slate-600 dark:text-slate-400 text-xs font-sans leading-relaxed">
                        {pillar.desc}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

        </div>

        {/* Dynamic Metric Stat Counters */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((st, i) => {
            const Icon = st.icon;
            return (
              <motion.div
                key={st.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -6, scale: 1.03 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="p-5 sm:p-6 rounded-2xl bg-white/80 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 hover:border-cyan-500/40 backdrop-blur-md text-center group transition-all shadow-sm hover:shadow-md"
              >
                <div className="w-10 h-10 mx-auto mb-3 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center group-hover:scale-110 group-hover:bg-cyan-500/20 transition-all">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="text-2xl sm:text-3xl font-display font-bold text-slate-900 dark:text-white mb-1 group-hover:text-cyan-500 dark:group-hover:text-cyan-400 transition-colors">
                  {st.value}
                </div>
                <div className="text-xs font-mono font-medium text-slate-700 dark:text-slate-300 mb-0.5">
                  {st.label}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 font-sans">
                  {st.desc}
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
