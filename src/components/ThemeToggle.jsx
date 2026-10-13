import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function ThemeToggle({ className = '' }) {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={`relative p-2.5 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 ${
        isDark
          ? 'bg-slate-800/80 text-amber-400 hover:bg-slate-700/80 border border-slate-700/70 shadow-glow-blue/20'
          : 'bg-slate-100 text-slate-800 hover:bg-slate-200 border border-slate-200 shadow-sm'
      } ${className}`}
    >
      <div className="relative w-5 h-5 flex items-center justify-center">
        {isDark ? (
          <Sun className="w-5 h-5 transition-transform duration-500 rotate-0 hover:rotate-45" />
        ) : (
          <Moon className="w-5 h-5 transition-transform duration-500 rotate-0 hover:-rotate-12 text-slate-700" />
        )}
      </div>
    </button>
  );
}
