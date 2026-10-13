import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Preloader({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            setDone(true);
            if (onComplete) onComplete();
          }, 300);
          return 100;
        }
        return prev + Math.floor(Math.random() * 20 + 15);
      });
    }, 80);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background-darker text-white"
        >
          {/* Subtle glowing orb */}
          <div className="absolute w-72 h-72 rounded-full bg-cyan-500/15 blur-3xl animate-pulse pointer-events-none" />

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="relative flex flex-col items-center"
          >
            {/* Glowing Logo Badge */}
            <div className="relative w-20 h-20 mb-6 flex items-center justify-center rounded-2xl bg-slate-900 border border-cyan-500/30 shadow-glow-cyan">
              <span className="text-2xl font-display font-extrabold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">
                DK
              </span>
              <div className="absolute -inset-1 rounded-2xl border border-cyan-400/20 animate-spin-slow pointer-events-none" />
            </div>

            <div className="text-center space-y-2">
              <h2 className="text-lg font-display font-semibold tracking-wide text-white">
                Dhiraj Kumar
              </h2>
              <p className="text-xs font-mono text-cyan-400/80 tracking-widest uppercase">
                IoT &bull; Full-Stack &bull; BCE Patna
              </p>
            </div>

            {/* Progress bar */}
            <div className="w-56 h-1.5 bg-slate-800 rounded-full mt-6 overflow-hidden border border-slate-700/50">
              <motion.div
                className="h-full bg-gradient-to-r from-cyan-400 via-sky-500 to-emerald-400"
                style={{ width: `${Math.min(progress, 100)}%` }}
                transition={{ ease: 'easeOut', duration: 0.1 }}
              />
            </div>

            <span className="text-[11px] font-mono text-slate-500 mt-2">
              {Math.min(progress, 100)}%
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
