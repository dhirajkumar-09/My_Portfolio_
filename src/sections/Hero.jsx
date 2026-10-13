import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Download,
  Mail,
  Cpu,
  Radio,
  Sparkles,
  MapPin,
  ExternalLink,
  Code2,
  GitFork,
  Star
} from 'lucide-react';
import { Github, Linkedin } from '../components/SocialIcons';
import ParticleMorph from '../components/ParticleMorph';
import IoTScene3D from '../components/IoTScene3D';
import { fetchGitHubProfile, fetchRepoDetails } from '../services/githubService';

export default function Hero({ profile }) {
  const roles = profile?.roles || [
    'CSE Student',
    'IoT Enthusiast',
    'Full-Stack Developer',
    'Problem Solver'
  ];

  // Typing effect state
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [activeVisual, setActiveVisual] = useState('morph'); // 'morph' (default) or 'globe'

  // Live GitHub telemetry state
  const [gitData, setGitData] = useState({
    repos: 5,
    stars: 1,
    url: 'https://github.com/dhirajkumar-09/My_Portfolio_'
  });

  const email = profile?.email || 'dhirajku00021@gmail.com';
  const github = profile?.github || 'https://github.com/dhirajkumar-09/My_Portfolio_';
  const linkedin = profile?.linkedin || 'https://linkedin.com';

  useEffect(() => {
    fetchRepoDetails().then((data) => {
      if (data) {
        setGitData((prev) => ({
          ...prev,
          stars: data.stars,
          url: data.htmlUrl
        }));
      }
    });

    fetchGitHubProfile().then((data) => {
      if (data) {
        setGitData((prev) => ({
          ...prev,
          repos: data.publicRepos
        }));
      }
    });
  }, []);

  useEffect(() => {
    const fullText = roles[currentRoleIndex];
    const typingSpeed = isDeleting ? 45 : 95;

    const timer = setTimeout(() => {
      if (!isDeleting && currentText === fullText) {
        setTimeout(() => setIsDeleting(true), 1500);
      } else if (isDeleting && currentText === '') {
        setIsDeleting(false);
        setCurrentRoleIndex((prev) => (prev + 1) % roles.length);
      } else {
        const nextText = isDeleting
          ? fullText.substring(0, currentText.length - 1)
          : fullText.substring(0, currentText.length + 1);
        setCurrentText(nextText);
      }
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, currentRoleIndex, roles]);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="hero"
      className="relative min-h-[92vh] flex items-center justify-center pt-28 pb-20 overflow-hidden transition-colors duration-300"
    >
      {/* Ambient gradient orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-gradient-to-tr from-cyan-500/15 via-blue-600/10 to-emerald-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-20 right-10 w-72 h-72 bg-cyan-400/10 rounded-full blur-2xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Headline, Bio & Actions */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Status Pill */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-medium bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-200 dark:border-cyan-500/30 text-cyan-700 dark:text-cyan-400 shadow-sm backdrop-blur-md"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>Bakhtiyarpur College of Engineering, Patna &bull; 2nd Year</span>
            </motion.div>

            {/* Name & Title */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="space-y-3"
            >
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.1]">
                Hi, I'm{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 via-sky-500 to-emerald-500 dark:from-cyan-400 dark:via-sky-400 dark:to-emerald-400">
                  {profile?.name || 'Dhiraj Kumar'}
                </span>
              </h1>

              {/* Typing role line */}
              <div className="h-10 flex items-center justify-center lg:justify-start">
                <span className="text-xl sm:text-2xl font-mono font-semibold text-slate-800 dark:text-slate-300">
                  &gt; I am a{' '}
                  <span className="text-cyan-600 dark:text-cyan-400 underline decoration-cyan-500/40 decoration-2 underline-offset-4">
                    {currentText}
                  </span>
                  <span className="inline-block w-2.5 h-6 ml-1 bg-cyan-500 dark:bg-cyan-400 animate-pulse align-middle" />
                </span>
              </div>
            </motion.div>

            {/* Value Statement */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-base sm:text-lg text-slate-600 dark:text-slate-300 font-sans max-w-2xl leading-relaxed mx-auto lg:mx-0"
            >
              {profile?.tagline ||
                'Engineering intelligent IoT ecosystems and scalable web architectures that bridge physical hardware with modern cloud intelligence.'}
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2"
            >
              <button
                onClick={() => scrollTo('projects')}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm text-slate-950 bg-gradient-to-r from-cyan-400 via-sky-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 shadow-glow-cyan/50 hover:shadow-glow-cyan transition-all transform hover:-translate-y-0.5 cursor-pointer"
              >
                <span>View Projects</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href={profile?.resumeUrl || '/resume.pdf'}
                download="Dhiraj_Kumar_Resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm text-slate-800 dark:text-white bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700/80 border border-slate-300 dark:border-slate-700 transition-all transform hover:-translate-y-0.5 shadow-sm"
              >
                <Download className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                <span>Download Resume</span>
              </a>

              <button
                onClick={() => scrollTo('contact')}
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl font-semibold text-sm text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-slate-200/50 dark:hover:bg-slate-500/10 transition-all cursor-pointer"
              >
                <Mail className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Contact Me</span>
              </button>
            </motion.div>

            {/* Social Icons, GitHub Telemetry & Location */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-4 text-slate-500 dark:text-slate-400 text-sm"
            >
              <div className="flex items-center gap-2">
                <a
                  href={github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub repository"
                  className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-cyan-500 dark:hover:text-cyan-400 hover:border-cyan-500/40 transition-colors shadow-sm"
                >
                  <Github className="w-4 h-4" />
                </a>
                <a
                  href={linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn profile"
                  className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-cyan-500 dark:hover:text-cyan-400 hover:border-cyan-500/40 transition-colors shadow-sm"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
                <a
                  href={`mailto:${email}`}
                  aria-label="Direct Email"
                  className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-cyan-500 dark:hover:text-cyan-400 hover:border-cyan-500/40 transition-colors shadow-sm"
                >
                  <Mail className="w-4 h-4" />
                </a>
              </div>

              {/* Real GitHub Repo Pill */}
              <a
                href={gitData.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-700 dark:text-slate-300 hover:border-cyan-500/40 transition-colors shadow-sm"
              >
                <Github className="w-3.5 h-3.5 text-cyan-500" />
                <span className="font-semibold text-slate-900 dark:text-white">dhirajkumar-09</span>
                <span className="text-slate-400">/</span>
                <span className="text-cyan-600 dark:text-cyan-400">My_Portfolio_</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-1" />
              </a>

              <div className="flex items-center gap-1.5 text-xs font-mono text-slate-600 dark:text-slate-400">
                <MapPin className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
                <span>Patna, India</span>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Holographic 3D IoT Centerpiece Card */}
          <div className="lg:col-span-5 flex justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="w-full max-w-md"
            >
              <div className="relative rounded-3xl">
                {/* Outer dynamic ambient blur glow */}
                <div className="absolute -inset-2 bg-gradient-to-r from-cyan-500/30 via-sky-600/20 to-emerald-500/30 rounded-3xl blur-xl opacity-60 animate-pulse-slow pointer-events-none" />

                {/* Main Glass Housing */}
                <div className="relative rounded-3xl bg-white/95 dark:bg-slate-900/95 border border-slate-200/90 dark:border-slate-700/80 backdrop-blur-2xl p-5 sm:p-6 shadow-2xl space-y-4">
                  
                  {/* Console Header Bar */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block shadow-sm" />
                      <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block shadow-sm" />
                      <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block shadow-sm" />
                    </div>

                    {/* Mode Toggle Pills */}
                    <div className="flex items-center gap-1 p-0.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-mono">
                      <button
                        onClick={() => setActiveVisual('morph')}
                        className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                          activeVisual === 'morph'
                            ? 'bg-emerald-500/25 text-emerald-400 font-bold border border-emerald-500/40 shadow-sm'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        ● 3D Morph
                      </button>
                      <button
                        onClick={() => setActiveVisual('globe')}
                        className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                          activeVisual === 'globe'
                            ? 'bg-cyan-500/25 text-cyan-400 font-bold border border-cyan-500/40 shadow-sm'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        Earth 3D
                      </button>
                    </div>
                  </div>

                  {/* 3D Visual Showcase Container */}
                  <div className="rounded-2xl overflow-hidden bg-[#070c10] border border-emerald-500/25 relative shadow-inner h-[460px] sm:h-[500px]">
                    {activeVisual === 'morph' ? (
                      <ParticleMorph
                        count={640}
                        colors={{
                          primary: '#22ff99',
                          highlight: '#eafff4',
                          glow: 'rgba(34, 255, 153, 0.12)'
                        }}
                        holdTime={2500}
                        morphTime={1500}
                        shapes={['SPHERE', 'CUBE', 'TORUS', 'DOUBLE HELIX']}
                      />
                    ) : (
                      <IoTScene3D />
                    )}
                  </div>

                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
