import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Calendar, MapPin, Award, CheckCircle2 } from 'lucide-react';
import SectionHeading from '../components/SectionHeading';

export default function Education({ educationList }) {
  const items = educationList || [];

  return (
    <section id="education" className="py-24 relative overflow-hidden bg-slate-100/50 dark:bg-slate-950/40 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <SectionHeading
          badge="Academic Background"
          title="Education &amp; Credentials"
          subtitle="A consistent track record of scholastic achievement and applied technical education."
        />

        {/* Timeline Container */}
        <div className="relative max-w-4xl mx-auto">
          {/* Vertical central connector line */}
          <div className="absolute left-4 sm:left-1/2 top-4 bottom-4 w-0.5 bg-gradient-to-b from-cyan-400 via-sky-500 to-emerald-400 -translate-x-1/2 hidden sm:block" />
          <div className="absolute left-6 top-4 bottom-4 w-0.5 bg-gradient-to-b from-cyan-400 via-sky-500 to-emerald-400 block sm:hidden" />

          <div className="space-y-12">
            {items.map((item, idx) => {
              const isEven = idx % 2 === 0;

              return (
                <motion.div
                  key={item.id || idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.15 }}
                  className={`relative flex flex-col sm:flex-row items-start ${
                    isEven ? 'sm:flex-row-reverse' : ''
                  } gap-8`}
                >
                  {/* Timeline Node Badge in Center */}
                  <div className="absolute left-6 sm:left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white dark:bg-slate-900 border-2 border-cyan-500 dark:border-cyan-400 flex items-center justify-center z-10 shadow-glow-cyan/50">
                    {item.current ? (
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-ping" />
                    ) : (
                      <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 dark:bg-cyan-400" />
                    )}
                  </div>

                  {/* Empty spacer for alternating two-column desktop layout */}
                  <div className="hidden sm:block sm:w-1/2" />

                  {/* Content Card */}
                  <div className="w-full sm:w-1/2 pl-14 sm:pl-0 sm:px-6">
                    <div className="p-6 rounded-2xl bg-white/95 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700/80 backdrop-blur-xl shadow-lg hover:border-cyan-500/40 transition-all hover:-translate-y-1 group">
                      
                      {/* Top row: Status & Score */}
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                        <span className="inline-flex items-center gap-1.5 text-xs font-mono px-3 py-1 rounded-full bg-cyan-50 dark:bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-500/30">
                          <Calendar className="w-3.5 h-3.5" />
                          {item.period}
                        </span>

                        <span
                          className={`inline-flex items-center gap-1.5 text-xs font-mono font-semibold px-3 py-1 rounded-full ${
                            item.current
                              ? 'bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30'
                              : 'bg-cyan-50 dark:bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-500/30'
                          }`}
                        >
                          <Award className="w-3.5 h-3.5" />
                          {item.score}
                        </span>
                      </div>

                      {/* Degree Title */}
                      <h3 className="text-xl font-display font-bold text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                        {item.degree}
                      </h3>

                      {/* Institution & Location */}
                      <div className="mt-1 space-y-1">
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                          <GraduationCap className="w-4 h-4 text-cyan-600 dark:text-cyan-400 flex-shrink-0" />
                          {item.institution}
                        </p>
                        {item.location && (
                          <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 font-mono">
                            <MapPin className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 flex-shrink-0" />
                            {item.location} {item.affiliation ? `(${item.affiliation})` : ''}
                          </p>
                        )}
                      </div>

                      {/* Bullet Highlights */}
                      {item.details && item.details.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
                          {item.details.map((detail, dIdx) => (
                            <div key={dIdx} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
                              <span>{detail}</span>
                            </div>
                          ))}
                        </div>
                      )}

                    </div>
                  </div>

                </motion.div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
