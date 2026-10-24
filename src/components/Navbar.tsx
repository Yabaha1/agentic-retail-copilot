/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Neemba AI NewGen: Retail Copilot - Glassmorphic Navbar
 */

import React from 'react';
import {
  Sparkles,
  Store as StoreIcon,
  Calendar,
  Moon,
  Sun,
  Activity,
  Zap,
} from 'lucide-react';
import { Store } from '../types/retail.ts';

interface NavbarProps {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  selectedStore: string;
  setSelectedStore: (val: string) => void;
  stores: Store[];
  selectedDays: number;
  setSelectedDays: (days: number) => void;
  activityCount: number;
  onOpenActivityFeed: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  darkMode,
  setDarkMode,
  selectedStore,
  setSelectedStore,
  stores,
  selectedDays,
  setSelectedDays,
  activityCount,
  onOpenActivityFeed,
}) => {
  return (
    <header
      className={`sticky top-0 z-40 w-full transition-colors duration-300 ${
        darkMode ? 'glass-nav-dark text-slate-100' : 'glass-nav-light text-slate-800'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand & Identity */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-400 p-0.5 shadow-lg shadow-teal-500/25">
            <div className="w-full h-full bg-slate-950/80 rounded-[14px] flex items-center justify-center backdrop-blur-sm">
              <Sparkles className="w-6 h-6 text-cyan-300" />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-slate-900 animate-pulse" />
          </div>

          <div>
            <span className="font-extrabold text-base sm:text-lg tracking-tight bg-gradient-to-r from-teal-400 via-emerald-400 to-cyan-300 bg-clip-text text-transparent whitespace-nowrap">
              Agentic Retail Copilot: Concept Prototype
            </span>
            <p className="text-xs text-slate-400 font-medium hidden md:block">
              Agentic Operations & Autonomous Inventory Decisioning
            </p>
          </div>
        </div>

        {/* Global Controls & Filters */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Store Filter */}
          <div className="relative flex items-center">
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${
              darkMode
                ? 'bg-slate-900/60 border-slate-700/60 text-slate-200'
                : 'bg-white/70 border-slate-200 text-slate-700'
            }`}>
              <StoreIcon className="w-3.5 h-3.5 text-teal-400 shrink-0" />
              <select
                value={selectedStore}
                onChange={(e) => setSelectedStore(e.target.value)}
                className="bg-transparent border-none outline-none cursor-pointer pr-1 text-xs font-semibold"
                aria-label="Select Store"
              >
                <option value="ALL" className={darkMode ? 'bg-slate-900 text-slate-100' : 'bg-white text-slate-800'}>
                  All 5 Stores
                </option>
                {stores.map((st) => (
                  <option
                    key={st.id}
                    value={st.id}
                    className={darkMode ? 'bg-slate-900 text-slate-100' : 'bg-white text-slate-800'}
                  >
                    {st.name} ({st.code})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Time Range Pills */}
          <div className={`hidden lg:flex items-center p-1 rounded-xl border text-xs font-medium ${
            darkMode ? 'bg-slate-900/60 border-slate-700/60' : 'bg-white/70 border-slate-200'
          }`}>
            <Calendar className="w-3.5 h-3.5 mx-1.5 text-slate-400" />
            {[
              { label: '7D', value: 7 },
              { label: '30D', value: 30 },
              { label: '90D', value: 90 },
            ].map((t) => (
              <button
                key={t.value}
                onClick={() => setSelectedDays(t.value)}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  selectedDays === t.value
                    ? 'bg-emerald-500 text-white font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Process Automation Feed Button */}
          <button
            onClick={onOpenActivityFeed}
            className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] ${
              darkMode
                ? 'bg-slate-900/70 border-slate-700/80 text-slate-200 hover:border-teal-500/50'
                : 'bg-white/80 border-slate-200 text-slate-700 hover:border-teal-400'
            }`}
            title="Open Process Automation Activity Feed"
          >
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Audit Feed</span>
            {activityCount > 0 && (
              <span className="flex items-center justify-center px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-teal-500 text-slate-950">
                {activityCount}
              </span>
            )}
          </button>

          {/* Dark Mode Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2 rounded-xl border transition-all ${
              darkMode
                ? 'bg-slate-900/70 border-slate-700/80 text-amber-300 hover:bg-slate-800'
                : 'bg-white/80 border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle theme"
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};
