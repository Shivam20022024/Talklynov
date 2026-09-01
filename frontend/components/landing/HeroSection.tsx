'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { SparklesCore } from '../sparkles';
import { BorderBeam } from '../ui/border-beam';

const SparklesComponent = React.memo(() => (
  <SparklesCore
    background="transparent"
    minSize={0.4}
    maxSize={2}
    particleDensity={80}
    className="w-[80%] md:w-[50%] h-[300px] md:h-[600px] absolute bottom-0 left-1/2 -translate-x-1/2 -z-10 [mask-image:linear-gradient(to_bottom,white,transparent)]"
    particleColor="#3b82f6"
    direction="top"
    speed={1}
  />
));
SparklesComponent.displayName = 'SparklesComponent';

export const HeroSection = ({ onStart }: { onStart?: () => void }) => {
  return (
    <section className="relative pt-24 sm:pt-32 md:pt-36 lg:pt-40 pb-16 sm:pb-20 md:pb-32 px-4 md:px-8 md:min-h-screen flex flex-col items-center bg-gradient-to-b from-white via-theme-50/30 to-gray-50 dark:from-bg-dark-base dark:via-bg-dark-surface dark:to-bg-dark-elevated">

      {/* Side PNG decorations */}
      <div className="absolute inset-0 w-full pointer-events-none z-10">
        <div className="absolute -bottom-16 md:-bottom-32 left-0 w-[40vw] md:w-[50vw] max-w-[800px] h-[300px] sm:h-[400px] md:h-[600px] lg:h-[800px]">
          <Image src="/left.png" alt="Left Decoration" fill sizes="(max-width: 768px) 40vw, 50vw" className="object-contain object-left-bottom opacity-20 dark:opacity-60 md:dark:opacity-80" priority unoptimized />
        </div>
        <div className="absolute -bottom-16 md:-bottom-32 right-0 w-[40vw] md:w-[50vw] max-w-[800px] h-[300px] sm:h-[400px] md:h-[600px] lg:h-[800px]">
          <Image src="/right.png" alt="Right Decoration" fill sizes="(max-width: 768px) 40vw, 50vw" className="object-contain object-right-bottom opacity-20 dark:opacity-60 md:dark:opacity-80" priority unoptimized />
        </div>
      </div>

      {/* Animated side SVGs */}
      <div className="absolute inset-0 max-w-[1400px] mx-auto pointer-events-none flex justify-between z-0 overflow-hidden">
        {/* Left SVG */}
        <motion.svg
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          width="317" height="1021" viewBox="0 0 317 1021" fill="none" xmlns="http://www.w3.org/2000/svg"
          className="h-full w-auto opacity-60 dark:opacity-40 md:dark:opacity-70"
          style={{ overflow: 'visible' }}
        >
          <g>
            <mask id="mask0_1_193" style={{ maskType: 'luminance' }} maskUnits="userSpaceOnUse" x="-8" y="0" width="333" height="1021">
              <path d="M324.079 0H-7.27905V1020.88H324.079V0Z" fill="white" />
            </mask>
            <g mask="url(#mask0_1_193)">
              {/* Light mode: transparent fill, only stroke shows */}
              <path d="M315.939 1020.88C336.242 574.987 108.919 154.504 -7.27905 0V1020.88H315.939Z" fill="none" className="dark:hidden" />
              {/* Dark mode: original dark fill */}
              <path d="M315.939 1020.88C336.242 574.987 108.919 154.504 -7.27905 0V1020.88H315.939Z" fill="url(#svgFillLeft)" className="hidden dark:block" />
              {/* Light mode stroke: soft violet */}
              <path d="M315.939 1020.88C336.242 574.987 108.919 154.504 -7.27905 0" stroke="#93c5fd" strokeWidth="1.5" className="dark:hidden" />
              {/* Dark mode stroke */}
              <path d="M315.939 1020.88C336.242 574.987 108.919 154.504 -7.27905 0" stroke="var(--bg-dark-card)" strokeWidth="0.957683" className="hidden dark:block" />
              {/* Animated glow stroke – both modes */}
              <path d="M315.939 1020.88C336.242 574.987 108.919 154.504 -7.27905 0" stroke="url(#paint1_linear_1_193)" strokeWidth="2" />
            </g>
          </g>
          <defs>
            <linearGradient id="paint0_linear_1_193_light" x1="154.967" y1="0" x2="154.967" y2="1020.88" gradientUnits="userSpaceOnUse">
              <stop stopColor="#eff6ff" />
              <stop offset="0.5" stopColor="#dbeafe" />
              <stop offset="1" stopColor="#f3f4f6" />
            </linearGradient>
            <linearGradient id="svgFillLeftLight" x1="154.967" y1="0" x2="154.967" y2="1020.88" gradientUnits="userSpaceOnUse">
              <stop stopColor="#f8fafc" /><stop offset="0.5" stopColor="#e0f2fe" /><stop offset="1" stopColor="#bae6fd" />
            </linearGradient>
            <linearGradient id="svgFillLeft" x1="154.967" y1="0" x2="154.967" y2="1020.88" gradientUnits="userSpaceOnUse">
              <stop stopColor="var(--bg-dark-base)" />
              <stop offset="0.5" stopColor="var(--bg-dark-surface)" />
              <stop offset="1" stopColor="var(--bg-dark-elevated)" />
            </linearGradient>
            <linearGradient id="paint1_linear_1_193" x1="93.6826" y1="259.413" x2="241.704" y2="780.051" gradientUnits="userSpaceOnUse">
              <stop stopColor="var(--bg-dark-card)" stopOpacity="0" />
              <stop offset="0.01" stopColor="var(--brand-muted)" stopOpacity="0.5" />
              <stop offset="0.03" stopColor="var(--brand-primary)" />
              <stop offset="0.51" stopColor="var(--brand-muted)" />
              <stop offset="1" stopColor="var(--bg-dark-card)" />
              <animateTransform attributeName="gradientTransform" type="translate" values="-161 -510; 322 1020" dur="2s" repeatCount="indefinite" />
            </linearGradient>
          </defs>
        </motion.svg>

        {/* Right SVG */}
        <motion.svg
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          width="317" height="1021" viewBox="0 0 317 1021" fill="none" xmlns="http://www.w3.org/2000/svg"
          className="h-full w-auto opacity-60 dark:opacity-40 md:dark:opacity-70"
          style={{ overflow: 'visible' }}
        >
          <g>
            <mask id="mask0_1_169" style={{ maskType: 'luminance' }} maskUnits="userSpaceOnUse" x="-9" y="0" width="335" height="1021">
              <path d="M325.037 0H-8.23669V1020.88H325.037V0Z" fill="white" />
            </mask>
            <g mask="url(#mask0_1_169)">
              {/* Light mode: transparent fill, only stroke shows */}
              <path d="M-2.6535 1020.88C-22.9564 574.987 204.366 154.504 320.564 0V1020.88H-2.6535Z" fill="none" className="dark:hidden" />
              {/* Dark mode: original dark fill */}
              <path d="M-2.6535 1020.88C-22.9564 574.987 204.366 154.504 320.564 0V1020.88H-2.6535Z" fill="url(#svgFillRight)" className="hidden dark:block" />
              {/* Light mode stroke: soft violet */}
              <path d="M-2.17371 1018.01C-22.4766 572.114 204.846 151.631 321.044 -2.87305" stroke="#93c5fd" strokeWidth="1.5" className="dark:hidden" />
              {/* Dark mode stroke */}
              <path d="M-2.17371 1018.01C-22.4766 572.114 204.846 151.631 321.044 -2.87305" stroke="var(--bg-dark-card)" strokeWidth="0.957683" className="hidden dark:block" />
              {/* Animated glow stroke – both modes */}
              <path d="M-2.17371 1018.01C-22.4766 572.114 204.846 151.631 321.044 -2.87305" stroke="url(#paint1_linear_1_169)" strokeWidth="2" />
            </g>
          </g>
          <defs>
            <linearGradient id="paint0_linear_1_169_light" x1="158.319" y1="0" x2="158.319" y2="1020.88" gradientUnits="userSpaceOnUse">
              <stop stopColor="#eff6ff" />
              <stop offset="0.5" stopColor="#dbeafe" />
              <stop offset="1" stopColor="#f3f4f6" />
            </linearGradient>
            <linearGradient id="svgFillRightLight" x1="158.319" y1="0" x2="158.319" y2="1020.88" gradientUnits="userSpaceOnUse">
              <stop stopColor="#f8fafc" /><stop offset="0.5" stopColor="#e0f2fe" /><stop offset="1" stopColor="#bae6fd" />
            </linearGradient>
            <linearGradient id="svgFillRight" x1="158.319" y1="0" x2="158.319" y2="1020.88" gradientUnits="userSpaceOnUse">
              <stop stopColor="var(--bg-dark-base)" />
              <stop offset="0.5" stopColor="var(--bg-dark-surface)" />
              <stop offset="1" stopColor="var(--bg-dark-elevated)" />
            </linearGradient>
            <linearGradient id="paint1_linear_1_169" x1="209.046" y1="259.076" x2="29.346" y2="780.076" gradientUnits="userSpaceOnUse">
              <stop stopColor="var(--bg-dark-card)" stopOpacity="0" />
              <stop offset="0.01" stopColor="var(--brand-muted)" stopOpacity="0.5" />
              <stop offset="0.03" stopColor="var(--brand-primary)" />
              <stop offset="0.51" stopColor="var(--brand-muted)" />
              <stop offset="1" stopColor="var(--bg-dark-card)" />
              <animateTransform attributeName="gradientTransform" type="translate" values="161 -510; -323 1020" dur="2s" repeatCount="indefinite" />
            </linearGradient>
          </defs>
        </motion.svg>
      </div>

      {/* Main content */}
      <div className="max-w-[1200px] mx-auto text-center relative z-10 w-full flex flex-col items-center mt-0 md:-mt-36">

        {/* Brand orb + logo card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative w-full max-w-[500px] md:max-w-[800px] h-48 sm:h-60 md:h-78 flex justify-center items-center mb-4 md:mb-6"
        >
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <Image src="/hero/hero-float.png" alt="Background decoration" fill sizes="(max-width: 768px) 100vw, 800px" className="object-contain opacity-40 dark:opacity-80" priority unoptimized />
          </div>

          {/* Logo Card */}
          <div className="absolute bottom-10 sm:bottom-12 md:bottom-12 translate-y-1/2">
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-50 rounded-3xl" />
            <div className="relative flex items-center gap-3">
              <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-2xl md:rounded-3xl bg-gradient-to-tr from-white to-white flex items-center justify-center shadow-lg shadow-theme-500/20">
                <Image
                  src="/logo-color.png"
                  alt="Logo"
                  width={550}
                  height={453}
                  className="h-10 sm:h-11 md:h-14 w-auto flex-shrink-0 object-contain"
                  priority
                  unoptimized
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-3xl sm:text-4xl md:text-4xl lg:text-6xl font-semibold tracking-tight text-gray-900 dark:text-white mb-3 md:mb-4"
        >
          Revenue Intelligence <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-grad-1 to-brand-grad-2 dark:from-brand-primary dark:to-brand-grad-3">
            For Every Sales Call
          </span>
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-xs sm:text-sm md:text-base text-gray-500 dark:text-gray-400 max-w-lg md:max-w-xl mx-auto mb-6 sm:mb-8 md:mb-10 leading-relaxed px-2"
        >
          TalklyAI transforms unstructured customer conversations into actionable sales intelligence. Detect buyer intent, automate lead scoring, and coach agents at scale.
        </motion.p>

        {/* Waitlist Form */}
        {/* <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="w-full max-w-sm sm:max-w-md mx-auto relative px-2 sm:px-0"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-brand-primary to-brand-muted blur-2xl opacity-10 dark:opacity-20 rounded-full" />
          <form className="relative flex flex-col sm:flex-row items-center p-1.5 rounded-2xl sm:rounded-full bg-white/80 dark:bg-bg-dark-card/80 border border-gray-200 dark:border-white/10 backdrop-blur-xl shadow-xl dark:shadow-2xl">
            <input
              type="email"
              placeholder="Enter your work email"
              className="w-full px-4 py-2.5 bg-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none text-sm sm:text-base"
              required
            />
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-2.5 sm:py-3 rounded-xl sm:rounded-full bg-gradient-to-r from-brand-primary to-brand-muted text-white dark:text-bg-dark-card font-bold hover:opacity-90 transition-opacity flex-shrink-0 text-sm sm:text-base"
            >
              Join Waitlist
            </button>
          </form>
        </motion.div> */}

        {/* Sparkles */}
        <SparklesComponent />

        {/* Dashboard preview image */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="w-full max-w-[1200px] mx-auto relative z-20 -mb-40 sm:-mb-60 md:-mb-80 lg:-mb-90"
        >
          <div className="p-2 sm:p-3 md:p-5 rounded-xl sm:rounded-2xl md:rounded-[32px] bg-white/60 dark:bg-[#ffffff05] border border-gray-200/80 dark:border-white/10 backdrop-blur-md shadow-2xl relative z-10">
            <BorderBeam
              size={180}
              duration={3}
              initialOffset={50}
              className="from-transparent via-brand-primary to-transparent"
            />
            <div
              className="relative w-full min-h-[220px] sm:min-h-[320px] md:min-h-[420px] rounded-lg sm:rounded-xl overflow-hidden border border-gray-200 dark:border-white/10 bg-gray-100 dark:bg-bg-dark-base shadow-[0_0_40px_rgba(59,130,246,0.15)]"
              style={{ aspectRatio: '16 / 9' }}
            >
              <Image
                src="/hero/Dashboard.png"
                alt="TalklyAI Dashboard Preview"
                width={1200}
                height={675}
                className="w-full h-full object-cover absolute top-0 left-0 transition-opacity duration-300 opacity-100 dark:opacity-0"
                priority
                unoptimized
              />
              <Image
                src="/hero/dashboard-dark.png"
                alt="TalklyAI Dashboard Preview"
                width={1200}
                height={675}
                className="w-full h-full object-cover absolute top-0 left-0 transition-opacity duration-300 opacity-0 dark:opacity-100"
                priority
                unoptimized
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
