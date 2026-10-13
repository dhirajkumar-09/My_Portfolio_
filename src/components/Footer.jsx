import React from 'react';
import { ArrowUp, Mail, MapPin, Heart } from 'lucide-react';
import { Github, Linkedin } from './SocialIcons';

export default function Footer({ profile }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const email = profile?.email || 'dhirajku00021@gmail.com';
  const github = profile?.github || 'https://github.com/dhirajkumar-09/My_Portfolio_';
  const linkedin = profile?.linkedin || 'https://linkedin.com';

  return (
    <footer className="relative border-t border-slate-200 dark:border-slate-800 bg-slate-100/90 dark:bg-slate-950/80 text-slate-600 dark:text-slate-400 py-12 overflow-hidden transition-colors duration-300">
      {/* Background glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-36 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Col 1: Identity */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-emerald-400 p-[1.5px]">
                <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
                  <span className="font-display font-extrabold text-sm text-cyan-400">DK</span>
                </div>
              </div>
              <span className="font-display font-bold text-lg text-slate-900 dark:text-white">
                Dhiraj Kumar
              </span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md leading-relaxed font-sans">
              B.Tech Computer Science &amp; Engineering (IoT Specialization) student at{' '}
              <span className="text-cyan-600 dark:text-cyan-400 font-medium">
                Bakhtiyarpur College of Engineering, Patna
              </span>
              . Building intelligent IoT systems and resilient web software.
            </p>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-500 dark:text-slate-400">
              <MapPin className="w-3.5 h-3.5 text-cyan-500 dark:text-cyan-400" />
              <span>Patna, Bihar, India &bull; Open for Internships</span>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-900 dark:text-white mb-4">
              Explore
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#about" className="hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors">
                  About Journey
                </a>
              </li>
              <li>
                <a href="#education" className="hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors">
                  Education &amp; Academics
                </a>
              </li>
              <li>
                <a href="#skills" className="hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors">
                  Technical Stack
                </a>
              </li>
              <li>
                <a href="#projects" className="hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors">
                  Featured Projects
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors">
                  Get in Touch
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Connect */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-900 dark:text-white mb-4">
              Connect Directly
            </h4>
            <div className="flex flex-col space-y-3">
              <a
                href={`mailto:${email}`}
                className="flex items-center gap-2 text-sm hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors"
              >
                <Mail className="w-4 h-4 text-cyan-500 dark:text-cyan-400" />
                <span className="break-all">{email}</span>
              </a>
              <div className="flex items-center gap-3 pt-2">
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
                  aria-label="Email directly"
                  className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-cyan-500 dark:hover:text-cyan-400 hover:border-cyan-500/40 transition-colors shadow-sm"
                >
                  <Mail className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-slate-200 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            &copy; {new Date().getFullYear()} Dhiraj Kumar. Designed &amp; Engineered with
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
            in Patna, India.
          </p>

          <button
            onClick={scrollToTop}
            aria-label="Scroll back to top"
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-cyan-500 dark:hover:text-white hover:border-cyan-500/50 transition-all font-mono shadow-sm"
          >
            <span>Top of page</span>
            <ArrowUp className="w-3.5 h-3.5 text-cyan-500 dark:text-cyan-400" />
          </button>
        </div>
      </div>
    </footer>
  );
}
