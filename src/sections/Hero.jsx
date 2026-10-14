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
  Star,
  Coins,
  TrendingUp
} from 'lucide-react';
import { Github, Linkedin } from '../components/SocialIcons';
import { fetchGitHubProfile, fetchRepoDetails } from '../services/githubService';

export default function Hero({ profile }) {
  const roles = profile?.roles && profile.roles.length > 0
    ? profile.roles
    : [
        'Business & Management Strategist',
        'FinTech & Systems Developer',
        'Product Operations Manager',
        'Quantitative Problem Solver'
      ];

  // Typing effect state
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

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
    if (!roles || roles.length === 0) {
      setCurrentText('');
      return;
    }

    const safeIndex = currentRoleIndex % roles.length;
    const fullText = roles[safeIndex] || '';
    const typingSpeed = isDeleting ? 45 : 95;

    const timer = setTimeout(() => {
      if (!isDeleting && currentText === fullText) {
        setTimeout(() => setIsDeleting(true), 1500);
      } else if (isDeleting && currentText === '') {
        setIsDeleting(false);
        setCurrentRoleIndex((prev) => (prev + 1) % roles.length);
      } else {
        const nextText = isDeleting
          ? fullText.substring(0, Math.max(0, currentText.length - 1))
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
      {/* Ambient multi-layer luxury glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[600px] bg-gradient-to-tr from-amber-500/15 via-emerald-500/12 to-yellow-500/10 rounded-full blur-3xl pointer-events-none animate-pulse-slow" />
      <div className="absolute top-24 right-1/4 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 left-1/4 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full text-center space-y-7">
        
        {/* Status Pill */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full text-xs font-mono font-medium bg-slate-900/90 dark:bg-slate-950/90 border border-amber-500/30 text-amber-200 shadow-xl shadow-amber-500/5 backdrop-blur-xl"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400"></span>
          </span>
          <span className="text-slate-300">
            {profile?.college || 'Bakhtiyarpur College of Engineering, Patna'}
          </span>
          <span className="text-amber-400/50">&bull;</span>
          <span className="text-amber-300 font-semibold">
            {profile?.year || '2nd Year Student'}
          </span>
        </motion.div>

        {/* Name & Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="space-y-4"
        >
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.1]">
            Hi, I'm{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-emerald-300 drop-shadow-[0_4px_24px_rgba(251,191,36,0.2)]">
              {profile?.name || 'Dhiraj Kumar'}
            </span>
          </h1>

          {/* Typing role line */}
          <div className="h-10 flex items-center justify-center">
            <span className="text-xl sm:text-2xl font-mono font-semibold text-slate-800 dark:text-slate-300">
              <span className="text-slate-400">
                {profile?.typingPrefix !== undefined ? profile.typingPrefix : '> I am a'}{' '}
              </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-300 to-emerald-400 font-bold underline decoration-amber-500/40 decoration-2 underline-offset-8">
                {currentText}
              </span>
              <span className="inline-block w-2.5 h-6 ml-1.5 bg-gradient-to-b from-amber-400 to-emerald-400 shadow-[0_0_12px_#fbbf24] animate-pulse align-middle" />
            </span>
          </div>
        </motion.div>

        {/* Value Statement */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-base sm:text-lg lg:text-xl text-slate-600 dark:text-slate-300 font-sans max-w-2xl leading-relaxed mx-auto font-normal"
        >
          {profile?.tagline ||
            'Bridging scalable software architecture with strategic business management, financial systems, and high-impact product operations.'}
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-4 pt-2"
        >
          <button
            onClick={() => scrollTo('projects')}
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm text-slate-950 bg-gradient-to-r from-amber-400 via-emerald-400 to-teal-400 hover:from-amber-300 hover:to-emerald-300 shadow-[0_10px_25px_-5px_rgba(245,158,11,0.4)] hover:shadow-[0_15px_30px_-5px_rgba(16,185,129,0.5)] transition-all transform hover:-translate-y-0.5 cursor-pointer"
          >
            <span>View Projects</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <a
            href={profile?.resumeUrl || '/resume.pdf'}
            download="Dhiraj_Kumar_Resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm text-amber-200 bg-slate-900/80 dark:bg-slate-900/90 hover:bg-slate-800 border border-amber-500/30 hover:border-amber-400/60 transition-all transform hover:-translate-y-0.5 shadow-md"
          >
            <Download className="w-4 h-4 text-amber-400" />
            <span>Download Resume</span>
          </a>

          <button
            onClick={() => scrollTo('contact')}
            className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl font-semibold text-sm text-slate-300 hover:text-emerald-300 bg-slate-900/40 hover:bg-emerald-500/10 border border-slate-800 hover:border-emerald-500/40 transition-all cursor-pointer"
          >
            <Mail className="w-4 h-4 text-emerald-400" />
            <span>Contact Me</span>
          </button>
        </motion.div>

        {/* Executive Quick Stats Strip */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="flex flex-wrap items-center justify-center gap-3 pt-1"
        >
          <div className="px-3.5 py-1.5 rounded-xl bg-slate-900/70 border border-amber-500/20 backdrop-blur-md text-xs font-mono text-slate-300 flex items-center gap-1.5">
            <Coins className="w-3.5 h-3.5 text-amber-400" />
            <span>10+ Projects Built</span>
          </div>

          <div className="px-3.5 py-1.5 rounded-xl bg-slate-900/70 border border-emerald-500/20 backdrop-blur-md text-xs font-mono text-emerald-300 flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            <span>+38.5% Strategic ROI</span>
          </div>

          <div className="px-3.5 py-1.5 rounded-xl bg-slate-900/70 border border-slate-700/60 backdrop-blur-md text-xs font-mono text-slate-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>FinTech & Systems</span>
          </div>
        </motion.div>

        {/* Social Icons, GitHub Telemetry & Location */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-4 pt-3 text-slate-500 dark:text-slate-400 text-sm"
        >
          <div className="flex items-center gap-2">
            <a
              href={github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub repository"
              className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-amber-400 hover:border-amber-400/40 transition-colors shadow-sm"
            >
              <Github className="w-4 h-4" />
            </a>
            <a
              href={linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn profile"
              className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-amber-400 hover:border-amber-400/40 transition-colors shadow-sm"
            >
              <Linkedin className="w-4 h-4" />
            </a>
            <a
              href={`mailto:${email}`}
              aria-label="Direct Email"
              className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-amber-400 hover:border-amber-400/40 transition-colors shadow-sm"
            >
              <Mail className="w-4 h-4" />
            </a>
          </div>

          {/* Real GitHub Repo Pill */}
          <a
            href={gitData.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-700 dark:text-slate-300 hover:border-amber-400/40 transition-colors shadow-sm"
          >
            <Github className="w-3.5 h-3.5 text-amber-500" />
            <span className="font-semibold text-slate-900 dark:text-white">dhirajkumar-09</span>
            <span className="text-slate-400">/</span>
            <span className="text-amber-600 dark:text-amber-400">My_Portfolio_</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-1" />
          </a>

          <div className="flex items-center gap-1.5 text-xs font-mono text-slate-600 dark:text-slate-400">
            <MapPin className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
            <span>{profile?.location || 'Patna, Bihar, India'}</span>
          </div>
        </motion.div>

        {/* Ambient Interactive Hint Badge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="pt-2"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-300 text-xs font-mono shadow-sm">
            <Coins className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
            <span>Move or hover your cursor anywhere across the screen for Currency Rain</span>
            <span className="text-emerald-400 font-bold">₹ $ € ₿ ¥</span>
          </div>
        </motion.div>

        {/* Animated Scroll Down Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="flex justify-center pt-8 sm:pt-12"
        >
          <button
            onClick={() => scrollTo('about')}
            className="flex flex-col items-center gap-2 group cursor-pointer text-slate-400 hover:text-cyan-400 transition-colors"
          >
            <span className="text-[10px] font-mono tracking-widest uppercase">Scroll to Explore</span>
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
              className="w-5 h-8 rounded-full border border-slate-300 dark:border-slate-700 group-hover:border-cyan-400 flex items-start justify-center p-1 transition-colors"
            >
              <div className="w-1 h-2 rounded-full bg-cyan-400" />
            </motion.div>
          </button>
        </motion.div>
      </div>
    </section>
  );
}
