'use client';

import React from 'react';
import { motion, Variants } from 'framer-motion';
import { AlertTriangle, BarChart3, Brain, Mic } from 'lucide-react';
import { SectionBadge } from './SectionBadge';

export const ValuePropSection = () => {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  const stats = [
    { value: '80%', label: 'of sales data is lost in unrecorded calls' },
    { value: '2%', label: 'of total call volume gets reviewed by managers' },
    { value: '67%', label: 'of leads are prioritized on gut-feeling alone' },
  ];

  const cards = [
    { icon: <Brain className="w-5 h-5" />, title: 'Buyer Intent', desc: 'Surface high-intent signals from every conversation to prioritize deals that are ready to close.' },
    { icon: <AlertTriangle className="w-5 h-5" />, title: 'Objection Mapping', desc: 'Automatically track pricing concerns, trust blockers, and competitive mentions across all calls.' },
    { icon: <BarChart3 className="w-5 h-5" />, title: 'Sentiment Analysis', desc: 'Monitor the emotional pulse of every deal to spot risks before they become lost revenue.' },
    { icon: <Mic className="w-5 h-5" />, title: 'Voice Intelligence', desc: 'AI-powered analysis of client voice notes transformed into actionable, coachable insights.' },
  ];

  return (
    <section id="solutions" className="relative pt-52 sm:pt-52 md:pt-76 lg:pt-[20rem] pb-24 sm:pb-32 md:pb-20 px-4 md:px-8 bg-gray-50 dark:bg-bg-dark-elevated overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] md:w-[900px] md:h-[900px] rounded-full bg-theme-200/20 dark:bg-brand-primary/[0.03] blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }}
          variants={containerVariants}
          className="text-center max-w-2xl mx-auto mb-16 md:mb-20"
        >
          <motion.div variants={itemVariants}><SectionBadge label="The Problem" className="mb-6" /></motion.div>
          <motion.h2 variants={itemVariants} className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-gray-900 dark:text-white leading-tight mb-5">
            Your Conversations are{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-grad-1 to-brand-grad-2 dark:from-brand-primary dark:to-brand-grad-3">
              Unstructured Revenue Data
            </span>
          </motion.h2>
          <motion.p variants={itemVariants} className="text-sm sm:text-base text-gray-500 dark:text-gray-400 leading-relaxed">
            Most sales teams only capture 20% of what happens in a call. The remaining 80%—the intent, the objections, the sentiment—is lost forever. TalklyAI builds the bridge between conversation and conversion.
          </motion.p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }}
          variants={containerVariants}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-16 md:mb-10"
        >
          {stats.map((stat, i) => (
            <motion.div
              variants={itemVariants} key={i}
              className="relative text-center py-6 sm:py-8 px-6 rounded-2xl bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.06] shadow-sm dark:shadow-none backdrop-blur-sm"
            >
              <span className="block text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-brand-grad-1 to-brand-muted dark:from-brand-primary dark:to-brand-muted mb-2">
                {stat.value}
              </span>
              <p className="text-xs sm:text-sm text-gray-500 font-medium leading-snug">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Feature Cards */}
        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }}
          variants={containerVariants}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5"
        >
          {cards.map((item, i) => (
            <motion.div
              variants={itemVariants} key={i}
              className="group relative p-6 sm:p-7 rounded-2xl bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.06] shadow-sm dark:shadow-none backdrop-blur-sm transition-all duration-300 hover:bg-gray-50 dark:hover:bg-white/[0.06] hover:border-theme-200 dark:hover:border-brand-primary/20 hover:shadow-md dark:hover:shadow-[0_0_40px_rgba(59,130,246,0.06)]"
            >
              <div className="w-10 h-10 rounded-xl bg-theme-50 dark:bg-gradient-to-br dark:from-brand-primary/15 dark:to-brand-muted/10 border border-theme-100 dark:border-brand-primary/10 flex items-center justify-center text-theme-600 dark:text-brand-primary mb-5 transition-all duration-300 group-hover:bg-theme-100 dark:group-hover:from-brand-primary/25 dark:group-hover:to-brand-muted/15 dark:group-hover:border-brand-primary/20">
                {item.icon}
              </div>
              <h4 className="text-base font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-theme-700 dark:group-hover:text-brand-primary transition-colors duration-300">
                {item.title}
              </h4>
              <p className="text-sm text-gray-500 dark:text-gray-500 leading-relaxed font-medium">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

