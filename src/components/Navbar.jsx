import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Shield, ArrowUpRight, Terminal } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { useTheme } from '../context/ThemeContext';

const NAV_ITEMS = [
  { label: 'About', href: '#about' },
  { label: 'Education', href: '#education' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Certificates', href: '#certificates' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [scrolled, setScrolled] = useState(false);
  const { isDark } = useTheme();
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);

      if (!isHomePage) return;

      const sections = ['hero', 'about', 'education', 'skills', 'projects', 'certificates', 'contact'];
      const scrollPosition = window.scrollY + 200;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHomePage]);

  const scrollTo = (hash) => {
    setIsOpen(false);
    if (!isHomePage) return;
    const target = document.querySelector(hash);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? isDark
            ? 'glass-nav shadow-lg'
            : 'glass-nav-light shadow-md'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo / Brand */}
          <Link
            to="/"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-emerald-400 p-[1.5px] transition-transform duration-300 group-hover:scale-105 shadow-glow-cyan/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <span className="font-display font-extrabold text-sm text-cyan-400">
                  DK
                </span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-base tracking-tight text-slate-900 dark:text-white group-hover:text-cyan-400 transition-colors">
                Dhiraj Kumar
              </span>
              <span className="text-[11px] font-mono text-cyan-600 dark:text-cyan-400/80 -mt-1 tracking-wide">
                BCE Patna &bull; IoT CSE
              </span>
            </div>
          </Link>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {isHomePage &&
              NAV_ITEMS.map((item) => {
                const isActive = activeSection === item.href.replace('#', '');
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollTo(item.href);
                    }}
                    className={`relative px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? 'text-cyan-600 dark:text-cyan-400 font-semibold'
                        : 'text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-white'
                    }`}
                  >
                    {item.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-gradient-to-r from-cyan-500 to-emerald-400 rounded-full" />
                    )}
                  </a>
                );
              })}

            {!isHomePage && (
              <Link
                to="/"
                className="px-3.5 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-cyan-400 transition-colors"
              >
                &larr; Return to Portfolio
              </Link>
            )}
          </nav>

          {/* Right actions: ThemeToggle + Admin link + CTA */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />

            <Link
              to="/admin"
              title="Admin Portal"
              className="p-2.5 rounded-xl border border-slate-700/60 dark:bg-slate-800/80 bg-slate-100 text-slate-600 dark:text-slate-400 hover:text-cyan-400 hover:border-cyan-500/40 transition-all text-xs font-mono flex items-center gap-1.5"
            >
              <Terminal className="w-4 h-4" />
              <span>Admin</span>
            </Link>

            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                scrollTo('#contact');
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider text-slate-950 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 transition-all shadow-glow-cyan/50 transform hover:-translate-y-0.5"
            >
              <span>Connect</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Mobile menu trigger */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle navigation menu"
              className="p-2.5 rounded-xl border border-slate-700/70 bg-slate-800/80 text-slate-200 hover:text-white"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {isOpen && (
        <div className="md:hidden px-4 pt-2 pb-6 bg-white/95 dark:bg-slate-950/95 border-b border-slate-200 dark:border-slate-800 backdrop-blur-xl transition-colors duration-300">
          <div className="flex flex-col space-y-2 pt-2">
            {isHomePage ? (
              NAV_ITEMS.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollTo(item.href);
                  }}
                  className="px-4 py-3 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-slate-100 dark:hover:bg-slate-900 transition-all"
                >
                  {item.label}
                </a>
              ))
            ) : (
              <Link
                to="/"
                onClick={() => setIsOpen(false)}
                className="px-4 py-3 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-slate-100 dark:hover:bg-slate-900 transition-all"
              >
                &larr; Return to Portfolio
              </Link>
            )}

            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
              <Link
                to="/admin"
                onClick={() => setIsOpen(false)}
                className="flex-1 py-2.5 px-4 rounded-xl text-center text-xs font-mono border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400"
              >
                Admin Portal
              </Link>
              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo('#contact');
                }}
                className="flex-1 py-2.5 px-4 rounded-xl text-center text-xs font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 to-emerald-400"
              >
                Connect Now
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
