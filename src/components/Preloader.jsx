import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';

export default function Preloader({ profile, onComplete }) {
  const [index, setIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  const name = profile?.name || 'Dhiraj Kumar';
  const role = profile?.roles?.[0] || profile?.title || 'IoT & Full-Stack Engineer';

  const greetings = [
    { text: 'नमस्ते 🙏', sub: 'Namaste • Warmest Greetings', lang: 'Hindi' },
    { text: 'Namaste', sub: 'Welcome to my digital space', lang: 'Indian Culture' },
    { text: 'Welcome', sub: 'Explore Hardware & Web Systems', lang: 'Global' },
    { text: name, sub: role, lang: 'Portfolio' }
  ];

  useEffect(() => {
    // Disable scrolling during intro
    document.body.style.overflow = 'hidden';

    // Cycle through greetings every 600ms
    const greetingInterval = setInterval(() => {
      setIndex((prev) => (prev < greetings.length - 1 ? prev + 1 : prev));
    }, 600);

    // Smooth counter from 0 to 100%
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          clearInterval(greetingInterval);
          setTimeout(() => {
            setDone(true);
            document.body.style.overflow = '';
            if (onComplete) onComplete();
          }, 400);
          return 100;
        }
        return prev + 2;
      });
    }, 45);

    return () => {
      clearInterval(greetingInterval);
      clearInterval(progressInterval);
      document.body.style.overflow = '';
    };
  }, [onComplete]);

  const handleSkip = () => {
    setDone(true);
    document.body.style.overflow = '';
    if (onComplete) onComplete();
  };

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          initial={{ y: 0 }}
          exit={{ y: '-100%' }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[100] flex flex-col justify-between p-6 sm:p-10 bg-[#070c10] text-white overflow-hidden select-none"
        >
          {/* Subtle Ambient Radial Glows */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

          {/* Top Bar: Minimalist system telemetry & Skip */}
          <div className="relative z-10 flex items-center justify-between w-full max-w-6xl mx-auto">
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-slate-400 tracking-wider">PORTFOLIO.SYS</span>
              <span className="text-slate-600">//</span>
              <span className="text-slate-300 font-semibold">{greetings[index].lang}</span>
            </div>

            <button
              onClick={handleSkip}
              className="group flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 text-xs font-mono text-slate-300 hover:text-white transition-all cursor-pointer"
            >
              <span>Skip Intro</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform text-cyan-400" />
            </button>
          </div>

          {/* Center Stage: Animated Greeting Transitions */}
          <div className="relative z-10 my-auto text-center max-w-3xl mx-auto px-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -24, filter: 'blur(8px)' }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-4"
              >
                {/* Cultural / Modern Greeting Heading */}
                <h1 className="text-4xl sm:text-6xl md:text-7xl font-display font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-cyan-300">
                  {greetings[index].text}
                </h1>

                {/* Subtitle / Meaning */}
                <p className="text-sm sm:text-base md:text-lg font-sans text-slate-400 flex items-center justify-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-400 flex-shrink-0 animate-pulse" />
                  <span>{greetings[index].sub}</span>
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Bottom Bar: Clean Progress Bar & Percentage */}
          <div className="relative z-10 w-full max-w-xl mx-auto space-y-3 pb-2">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span className="text-slate-500 uppercase tracking-widest text-[11px]">System Initializing</span>
              <span className="font-semibold text-cyan-400">{Math.min(progress, 100)}%</span>
            </div>

            {/* Glowing progress line */}
            <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
              <motion.div
                className="h-full bg-gradient-to-r from-cyan-400 via-sky-400 to-emerald-400 shadow-glow-cyan"
                style={{ width: `${Math.min(progress, 100)}%` }}
                transition={{ ease: 'easeOut', duration: 0.05 }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
