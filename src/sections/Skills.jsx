import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Code2,
  Terminal,
  Coffee,
  FileCode,
  Atom,
  Layout,
  Palette,
  Flame,
  Database,
  GitBranch,
  Cpu,
  Layers,
  Radio,
  Box,
  CheckCircle,
  MessageSquare,
  Users,
  Award,
  Clock,
  Sparkles
} from 'lucide-react';
import { Github } from '../components/SocialIcons';
import SectionHeading from '../components/SectionHeading';

// Icon mapper
const ICON_MAP = {
  Code2,
  Terminal,
  Coffee,
  FileCode,
  Atom,
  Layout,
  Palette,
  Flame,
  Database,
  GitBranch,
  Github,
  Cpu,
  Layers,
  Radio,
  Box,
  CheckCircle,
  MessageSquare,
  Users,
  Award,
  Clock,
  Sparkles
};

export default function Skills({ skillsList }) {
  const categories = skillsList || [];
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredCategories =
    activeCategory === 'All'
      ? categories
      : categories.filter((c) => c.category === activeCategory);

  return (
    <section id="skills" className="py-24 relative overflow-hidden transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <SectionHeading
          badge="Technical Competencies"
          title="Skills &amp; Expertise"
          subtitle="Proficiency across programming languages, hardware IoT interfacing, web systems, and collaborative engineering."
        />

        {/* Category Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          <button
            onClick={() => setActiveCategory('All')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-medium transition-all ${
              activeCategory === 'All'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-glow-cyan/50'
                : 'bg-white dark:bg-slate-900/80 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800 shadow-sm'
            }`}
          >
            All Disciplines
          </button>
          {categories.map((cat) => (
            <button
              key={cat.category}
              onClick={() => setActiveCategory(cat.category)}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-medium transition-all ${
                activeCategory === cat.category
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-glow-cyan/50'
                  : 'bg-white dark:bg-slate-900/80 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800 shadow-sm'
              }`}
            >
              {cat.category}
            </button>
          ))}
        </div>

        {/* Skill Category Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map((group, gIdx) => (
            <motion.div
              key={group.category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: gIdx * 0.1 }}
              className="p-6 rounded-2xl bg-white/95 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800/80 backdrop-blur-xl hover:border-cyan-500/40 transition-all hover:shadow-xl group"
            >
              {/* Category Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 mb-5">
                <h3 className="font-display font-bold text-base text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-500 dark:text-cyan-400" />
                  {group.category}
                </h3>
                <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500">
                  {group.items.length} skills
                </span>
              </div>

              {/* Items in this category */}
              <div className="space-y-4">
                {group.items.map((skill, sIdx) => {
                  const Icon = ICON_MAP[skill.icon] || Code2;

                  return (
                    <div key={skill.name} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-medium">
                          <Icon className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                          <span>{skill.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {skill.tag && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                              {skill.tag}
                            </span>
                          )}
                          <span className="font-mono text-cyan-600 dark:text-cyan-400 font-semibold">
                            {skill.level}%
                          </span>
                        </div>
                      </div>

                      {/* Animated Progress Bar */}
                      <div className="h-2 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.level}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.8, delay: sIdx * 0.1 }}
                          className="h-full bg-gradient-to-r from-cyan-500 via-sky-400 to-emerald-400 rounded-full"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
