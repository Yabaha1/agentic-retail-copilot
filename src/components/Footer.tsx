/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Neemba AI NewGen: Retail Copilot - Footer with Exact Required Attribution
 */

import React from 'react';
import { Sparkles, Mail, Phone, Heart, ShieldCheck, Cpu } from 'lucide-react';

interface FooterProps {
  darkMode: boolean;
}

export const Footer: React.FC<FooterProps> = ({ darkMode }) => {
  return (
    <footer
      className={`w-full border-t transition-colors mt-12 ${
        darkMode ? 'border-slate-800/80 bg-slate-950/70 text-slate-400' : 'border-slate-200/80 bg-slate-50/70 text-slate-600'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          {/* Brand Tagline */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-sm tracking-tight text-slate-200 block">
                Agentic Retail Copilot: Concept Prototype
              </span>
              <p className="text-xs text-slate-400 font-medium">
                Next-Gen Agentic Assistant for Modern Retail & Supply Chain Operations
              </p>
            </div>
          </div>

          {/* System Indicators */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Gemini 3.8 Multi-Tool Agent
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
              <Cpu className="w-3.5 h-3.5 text-teal-400" />
              40 Products • 5 Stores • 90 Days
            </span>
          </div>
        </div>

        {/* User's Exact Attribution Requirement */}
        <div className="mt-6 pt-6 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <div>
            © 2026 Developed by{' '}
            <strong className="text-slate-200 font-semibold">BAMBA Yabaha</strong>{' '}
            ( <a href="tel:+2250777614711" className="text-teal-400 hover:underline font-mono">+225 07 77 61 47 11</a> ) ,{' '}
            email id :{' '}
            <a
              href="mailto:bambayabahasolomarius@gmail.com"
              className="text-teal-400 hover:underline font-mono"
            >
              bambayabahasolomarius@gmail.com
            </a>
          </div>

          <div className="text-[11px] text-slate-500 flex items-center gap-1 font-mono">
            <span>Enterprise Retail AI Operations</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
