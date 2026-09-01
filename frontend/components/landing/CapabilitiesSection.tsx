'use client';

import React from 'react';
import { motion, Variants } from 'framer-motion';
import { Mic, Target, Activity, Clock, Workflow, Lock } from 'lucide-react';
import { SectionBadge } from './SectionBadge';

export const CapabilitiesSection = () => {
  const capabilities = [
    { icon: Mic, title: 'Voice Intelligence', desc: 'Industry-leading transcription and entity extraction for complex sales cycles.' },
    { icon: Target, title: 'Lead Intelligence', desc: 'Dynamic lead scoring that adapts to conversation context and intent markers.' },
    { icon: Activity, title: 'Agent Performance', desc: 'Real-time benchmarking against top performers with automated feedback loops.' },
    { icon: Clock, title: 'Live Monitoring', desc: 'Real-time oversight for managers to assist in high-stakes deal negotiations.' },
    { icon: Workflow, title: 'Workflow Automation', desc: 'Seamlessly push extracted requirements and scores directly into your CRM.' },
    { icon: Lock, title: 'Enterprise Security', desc: 'Enterprise-grade security with role-based access and end-to-end encryption.' },
  ];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  return (
    <section id="features" className="relative py-24 sm:py-32 md:py-20 px-4 md:px-8 bg-gray-50 dark:bg-bg-dark-elevated overflow-hidden">
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full bg-theme-200/20 dark:bg-brand-primary/[0.02] blur-[100px] pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }}
          variants={containerVariants}
          className="text-center max-w-2xl mx-auto mb-14 md:mb-20"
        >
          <motion.div variants={itemVariants}><SectionBadge label="Capabilities" className="mb-6" /></motion.div>
          <motion.h2 variants={itemVariants} className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-gray-900 dark:text-white leading-tight mb-5">
            Your Complete{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-grad-1 to-brand-grad-2 dark:from-brand-primary dark:to-brand-grad-3">
              Conversation Intelligence
            </span>{' '}Stack
          </motion.h2>
          <motion.p variants={itemVariants} className="text-sm sm:text-base text-gray-500 dark:text-gray-400 leading-relaxed">
            Voice intelligence, lead scoring, agent coaching, live monitoring, and AI-powered insights—all in one platform.
          </motion.p>
        </motion.div>

        {/* Grid */}
        <motion.div
          variants={containerVariants} initial="hidden" whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="max-w-5xl mx-auto bg-white dark:bg-transparent rounded-2xl border border-gray-200 dark:border-transparent shadow-sm dark:shadow-none overflow-hidden"
        >
          {/* Row 1 */}
          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-gray-100 dark:divide-white/[0.06]">
            {capabilities.slice(0, 3).map((item, i) => (
              <motion.div
                key={i} variants={itemVariants}
                className="p-6 sm:p-8 group cursor-default hover:bg-theme-50/50 dark:hover:bg-white/[0.02] transition-all duration-300"
              >
                <p className="text-sm sm:text-[15px] leading-relaxed">
                  <item.icon
                    size={15} strokeWidth={1.8}
                    className="inline-block mr-2 -mt-0.5 text-theme-400 dark:text-brand-primary/50 group-hover:text-theme-600 dark:group-hover:text-brand-primary transition-colors duration-300"
                  />
                  <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-grad-1 to-brand-grad-2 dark:from-brand-primary dark:to-brand-grad-3">
                    {item.title}.
                  </span>{' '}
                  <span className="text-gray-500 font-medium group-hover:text-gray-600 dark:group-hover:text-gray-400 transition-colors duration-300">{item.desc}</span>
                </p>
              </motion.div>
            ))}
          </div>

          <div className="h-px bg-gray-100 dark:bg-white/[0.06]" />

          {/* Row 2 */}
          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-gray-100 dark:divide-white/[0.06]">
            {capabilities.slice(3, 6).map((item, i) => (
              <motion.div
                key={i + 3} variants={itemVariants}
                className="p-6 sm:p-8 group cursor-default hover:bg-theme-50/50 dark:hover:bg-white/[0.02] transition-all duration-300"
              >
                <p className="text-sm sm:text-[15px] leading-relaxed">
                  <item.icon
                    size={15} strokeWidth={1.8}
                    className="inline-block mr-2 -mt-0.5 text-theme-400 dark:text-brand-primary/50 group-hover:text-theme-600 dark:group-hover:text-brand-primary transition-colors duration-300"
                  />
                  <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-brand-grad-1 to-brand-grad-2 dark:from-brand-primary dark:to-brand-grad-3">
                    {item.title}.
                  </span>{' '}
                  <span className="text-gray-500 font-medium group-hover:text-gray-600 dark:group-hover:text-gray-400 transition-colors duration-300">{item.desc}</span>
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

