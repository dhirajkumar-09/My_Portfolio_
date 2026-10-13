import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Compass, Cpu } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background-dark text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 text-center max-w-md space-y-6">
        <div className="inline-flex p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 mb-2">
          <Compass className="w-12 h-12 animate-spin-slow" />
        </div>

        <div className="space-y-2">
          <span className="font-mono text-xs text-cyan-400 tracking-widest uppercase">
            Error 404 &bull; Node Desynchronized
          </span>
          <h1 className="text-4xl sm:text-5xl font-display font-extrabold text-white">
            Page Not Found
          </h1>
          <p className="text-slate-400 text-sm font-sans leading-relaxed">
            The endpoint or project route you are navigating to does not exist in Dhiraj Kumar's portfolio system.
          </p>
        </div>

        <div className="pt-2">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-slate-950 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 transition-all shadow-glow-cyan"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Portfolio</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
