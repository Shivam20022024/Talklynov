'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, PhoneCall, Mic, LayoutDashboard, Headset, Link as LinkIcon, Users, CreditCard } from 'lucide-react';
import Link from 'next/link';

export const PricingSection = () => {
  const [isAnnual, setIsAnnual] = useState(false);

  return (
    <section id="pricing" className="py-24 relative overflow-hidden bg-slate-50 dark:bg-background">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-theme-100/40 via-transparent to-transparent dark:from-brand-primary/10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-theme-50 dark:bg-brand-primary/10 border border-theme-100 dark:border-brand-primary/20 text-theme-600 dark:text-brand-primary text-sm font-semibold mb-6"
          >
            <CreditCard size={16} />
            <span>Pricing Options</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 dark:text-white mb-6"
          >
            Simple, Flexible Pricing
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-600 dark:text-slate-400"
          >
            Pay only for what you use, or choose a plan that fits your business.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="flex items-center justify-center mt-10 gap-4"
          >
            <span className={`text-sm font-medium ${!isAnnual ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}>Monthly</span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className="relative inline-flex h-6 w-11 items-center rounded-full bg-theme-600 dark:bg-brand-primary transition-colors focus:outline-none"
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isAnnual ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
            <span className={`text-sm font-medium ${isAnnual ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}>
              Annual <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full ml-1 font-bold">Save 20%</span>
            </span>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">

          {/* Pay As You Go */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="card p-8 bg-white dark:bg-bg-dark-light border border-slate-200 dark:border-white/10 rounded-3xl flex flex-col h-full shadow-lg"
          >
            <div className="mb-6">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Pay As You Go</h3>
              <p className="text-sm text-slate-500">Perfect for getting started. Add credits and use as needed.</p>
            </div>
            <div className="mb-6">
              <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1">Top Up</div>
              <p className="text-sm text-slate-500">Wallet balance never expires.</p>
            </div>

            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-300">
                <Check className="w-5 h-5 text-theme-500 shrink-0" />
                <span>₹12/min Outbound AI Calling</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-300">
                <Check className="w-5 h-5 text-theme-500 shrink-0" />
                <span>₹11/min Inbound AI Calling</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-300">
                <Check className="w-5 h-5 text-theme-500 shrink-0" />
                <span>1 AI Voice Agent</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-300">
                <Check className="w-5 h-5 text-theme-500 shrink-0" />
                <span>Standard Voice Models</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-300">
                <Check className="w-5 h-5 text-theme-500 shrink-0" />
                <span>Wallet balance never expires</span>
              </li>
            </ul>

            <Link
              href="/login?redirect=/billing&intent=buy_credits&amount=1000"
              className="w-full py-3 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-900 dark:text-white text-sm font-semibold rounded-xl text-center transition-colors"
            >
              Buy Credits
            </Link>
          </motion.div>

          {/* Starter Plan */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="card p-8 bg-white dark:bg-bg-dark-light border border-slate-200 dark:border-white/10 rounded-3xl flex flex-col h-full shadow-lg"
          >
            <div className="mb-6">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Starter</h3>
              <p className="text-sm text-slate-500">For small teams building voice experiences.</p>
            </div>
            <div className="mb-6">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold text-slate-900 dark:text-white">₹{isAnnual ? '799' : '999'}</span>
                <span className="text-sm text-slate-500">/mo</span>
              </div>
              {isAnnual && <p className="text-xs text-green-600 mt-1">Billed ₹9,588 yearly</p>}
            </div>

            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-300">
                <Check className="w-5 h-5 text-theme-500 shrink-0" />
                <span><span className="font-bold text-slate-900 dark:text-white">500</span> included minutes</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-300">
                <Check className="w-5 h-5 text-theme-500 shrink-0" />
                <span>1 AI Voice Agent</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-300">
                <Check className="w-5 h-5 text-theme-500 shrink-0" />
                <span>Basic Analytics</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-300">
                <Check className="w-5 h-5 text-theme-500 shrink-0" />
                <span>Standard Integrations</span>
              </li>
            </ul>

            <Link
              href="/login?redirect=/billing&intent=subscribe&plan=starter"
              className="w-full py-3 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-900 dark:text-white text-sm font-semibold rounded-xl text-center transition-colors"
            >
              Choose Starter
            </Link>
          </motion.div>

          {/* Professional Plan (Highlighted) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="card p-8 bg-gradient-to-br from-theme-600 to-theme-800 dark:from-brand-primary dark:to-indigo-600 border border-theme-500 dark:border-brand-primary/50 rounded-3xl flex flex-col h-full shadow-2xl relative transform scale-105 z-10"
          >
            <div className="absolute top-0 right-8 -translate-y-1/2">
              <span className="bg-gradient-to-r from-orange-400 to-rose-400 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">
                Most Popular
              </span>
            </div>
            <div className="mb-6">
              <h3 className="text-xl font-bold text-white mb-2">Professional</h3>
              <p className="text-sm text-white/80">Everything you need to scale operations.</p>
            </div>
            <div className="mb-6">
              <div className="flex items-baseline gap-1 text-white">
                <span className="text-4xl font-bold">₹{isAnnual ? '2,399' : '2,999'}</span>
                <span className="text-sm text-white/80">/mo</span>
              </div>
              {isAnnual && <p className="text-xs text-white/90 mt-1">Billed ₹28,788 yearly</p>}
            </div>

            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-start gap-3 text-sm text-white/90">
                <Check className="w-5 h-5 text-white shrink-0" />
                <span><span className="font-bold text-white">2,000</span> included minutes</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-white/90">
                <Check className="w-5 h-5 text-white shrink-0" />
                <span>1 AI Voice Agent</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-white/90">
                <Check className="w-5 h-5 text-white shrink-0" />
                <span>Advanced Analytics</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-white/90">
                <Check className="w-5 h-5 text-white shrink-0" />
                <span>Premium Voice Models</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-white/90">
                <Check className="w-5 h-5 text-white shrink-0" />
                <span>CRM Integrations</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-white/90">
                <Check className="w-5 h-5 text-white shrink-0" />
                <span>Higher usage limits</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-white/90">
                <Check className="w-5 h-5 text-white shrink-0" />
                <span>Priority Support</span>
              </li>
            </ul>

            <Link
              href="/login?redirect=/billing&intent=subscribe&plan=professional"
              className="w-full py-3 px-4 bg-white text-theme-700 dark:text-brand-primary text-sm font-bold rounded-xl text-center hover:bg-slate-50 transition-colors shadow-lg"
            >
              Choose Professional
            </Link>
          </motion.div>

          {/* Enterprise Plan */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="card p-8 bg-white dark:bg-bg-dark-light border border-slate-200 dark:border-white/10 rounded-3xl flex flex-col h-full shadow-lg"
          >
            <div className="mb-6">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Enterprise</h3>
              <p className="text-sm text-slate-500">Custom volume and dedicated support.</p>
            </div>
            <div className="mb-6">
              <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1">Custom</div>
              <p className="text-sm text-slate-500">Contact us for pricing</p>
            </div>

            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-300">
                <Check className="w-5 h-5 text-slate-400 shrink-0" />
                <span>Custom Usage Volume</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-300">
                <Check className="w-5 h-5 text-slate-400 shrink-0" />
                <span>Multiple AI Agents</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-300">
                <Check className="w-5 h-5 text-slate-400 shrink-0" />
                <span>Multiple Users</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-300">
                <Check className="w-5 h-5 text-slate-400 shrink-0" />
                <span>Advanced Integrations</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-300">
                <Check className="w-5 h-5 text-slate-400 shrink-0" />
                <span>Custom Workflows</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-300">
                <Check className="w-5 h-5 text-slate-400 shrink-0" />
                <span>Dedicated Support & SLA</span>
              </li>
            </ul>

            <Link
              href="mailto:sales@talkly.ai"
              className="w-full py-3 px-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-semibold rounded-xl text-center hover:opacity-90 transition-opacity"
            >
              Contact Sales
            </Link>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
