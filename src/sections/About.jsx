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

  const pillars = [
    {
      title: 'IoT & Embedded Engineering',
      desc: 'Passionate about integrating microcontrollers, sensor telemetry, and hardware protocols with cloud dashboards for real-time monitoring.',
      icon: Cpu,
      gradient: 'from-cyan-500 to-blue-500'
    },
    {
      title: 'Modern Full-Stack Web',
      desc: 'Crafting responsive, high-performance web applications using React, modern JavaScript, Tailwind CSS, and Firebase backend services.',
      icon: Layers,
      gradient: 'from-blue-500 to-indigo-500'
    },
    {
      title: 'Data Structures & Algorithms',
      desc: 'Writing optimized algorithms in Python, Java, and C with a disciplined approach to time-space complexity and object-oriented patterns.',
      icon: Sparkles,
      gradient: 'from-emerald-500 to-teal-500'
    }
  ];

  return (
    <section id="about" className="py-24 relative overflow-hidden transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <SectionHeading
          badge="Background &amp; Philosophy"
          title="About My Engineering Journey"
          subtitle="Combining academic rigor with hands-on systems development to build purposeful technology."
        />

        {/* Bio Card + Quick Pillars */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-16">
          
          {/* Main Bio Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 rounded-2xl p-6 sm:p-8 bg-white/90 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-700/80 backdrop-blur-xl shadow-xl flex flex-col justify-between transition-colors duration-300"
          >
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400 font-mono text-xs uppercase tracking-wider font-semibold">
                <GraduationCap className="w-4 h-4" />
                <span>Career Objective &amp; Aspirations</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 dark:text-white">
                B.Tech Student in CSE (IoT Specialization)
              </h3>

              <p className="text-slate-700 dark:text-slate-300 font-sans leading-relaxed text-base sm:text-lg">
                {profile?.bio ||
                  'Motivated, detail-oriented B.Tech student in Computer Science & Engineering with IoT Specialization at Bakhtiyarpur College of Engineering, Patna. Actively seeking an internship or entry-level software/IoT developer role to engineer real-world systems, learn from industry leaders, and contribute impactful solutions.'}
              </p>

              <p className="text-slate-600 dark:text-slate-400 font-sans leading-relaxed text-sm">
                Currently in my 2nd year (2023–2027), I focus on writing clean, modular code,
                designing hardware telemetry pipelines, and building accessible full-stack apps.
                Whether managing crowd flows in stadiums or building empathetic AI companions,
                I thrive on turning complex problems into elegant software solutions.
              </p>
            </div>

            <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-600 dark:text-cyan-400">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-mono text-slate-500 dark:text-slate-400">Current Affiliation</p>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">Bakhtiyarpur College of Engg., Patna</p>
                </div>
              </div>

              <a
                href={profile?.resumeUrl || '/resume.pdf'}
                download="Dhiraj_Kumar_Resume.pdf"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 transition-colors shadow-glow-cyan/30"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download CV</span>
              </a>
            </div>
          </motion.div>

          {/* Pillars Column */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-4">
            {pillars.map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <motion.div
                  key={pillar.title}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.15 }}
                  className="rounded-2xl p-5 bg-white/90 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/60 backdrop-blur-md hover:border-cyan-500/40 transition-all shadow-sm group"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`p-3 rounded-xl bg-gradient-to-br ${pillar.gradient} text-white shadow-md flex-shrink-0 group-hover:scale-110 transition-transform`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-base font-display font-semibold text-slate-900 dark:text-white group-hover:text-cyan-500 dark:group-hover:text-cyan-400 transition-colors">
                        {pillar.title}
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                        {pillar.desc}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

        </div>

        {/* Animated Quick Stats Counters */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="p-5 sm:p-6 rounded-2xl bg-white/90 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800/80 backdrop-blur-md text-center hover:border-cyan-500/30 transition-all hover:-translate-y-1 shadow-sm"
              >
                <div className="inline-flex p-3 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 mb-3">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="text-3xl sm:text-4xl font-display font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 via-sky-500 to-emerald-500 dark:from-cyan-400 dark:to-emerald-400">
                  {stat.value}
                </div>
                <div className="text-sm font-semibold text-slate-900 dark:text-white mt-1">
                  {stat.label}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                  {stat.desc}
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
