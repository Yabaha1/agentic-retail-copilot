/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Neemba AI NewGen: Retail Copilot - Glassmorphic Hero KPI Cards
 */

import React from 'react';
import {
  TrendingUp,
  AlertTriangle,
  DollarSign,
  PackageCheck,
  ArrowUpRight,
  ShieldAlert,
  Zap,
  Sparkles,
} from 'lucide-react';
import { DashboardMetrics } from '../types/retail.ts';

interface KPICardsProps {
  metrics: DashboardMetrics | null;
  darkMode: boolean;
  selectedDays: number;
  onAskCopilot: (prompt: string) => void;
}

export const KPICards: React.FC<KPICardsProps> = ({
  metrics,
  darkMode,
  selectedDays,
  onAskCopilot,
}) => {
  if (!metrics) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`h-32 rounded-2xl ${darkMode ? 'bg-slate-800/40' : 'bg-slate-200/60'}`}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* 4 Primary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Total Revenue */}
        <div
          className={`relative overflow-hidden rounded-2xl p-5 transition-all hover:scale-[1.01] ${
            darkMode ? 'glass-panel-dark text-slate-100' : 'glass-panel-light text-slate-800'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Total Revenue ({selectedDays}D)
            </span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold tracking-tight font-mono">
              ${metrics.totalRevenue.toLocaleString()}
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs">
            <span className="flex items-center gap-1 font-semibold text-emerald-400">
              <ArrowUpRight className="w-3.5 h-3.5" />
              +8.7% vs last cycle
            </span>
            <span className="text-slate-400 font-medium">
              {metrics.totalUnits.toLocaleString()} units sold
            </span>
          </div>
          <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-emerald-500/5 rounded-full blur-xl pointer-events-none" />
        </div>

        {/* KPI 2: Gross Margin */}
        <div
          className={`relative overflow-hidden rounded-2xl p-5 transition-all hover:scale-[1.01] ${
            darkMode ? 'glass-panel-dark text-slate-100' : 'glass-panel-light text-slate-800'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Gross Margin ({metrics.grossMarginPercent}%)
            </span>
            <div className="p-2 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold tracking-tight font-mono">
              ${metrics.totalGrossMargin.toLocaleString()}
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs">
            <span className="text-slate-400 font-medium">
              Cost of Goods: ${metrics.totalCost.toLocaleString()}
            </span>
            <span className="font-semibold text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded-full border border-teal-500/20">
              Healthy Target
            </span>
          </div>
          <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-teal-500/5 rounded-full blur-xl pointer-events-none" />
        </div>

        {/* KPI 3: Stockout Risk (Crucial Retail KPI) */}
        <div
          className={`relative overflow-hidden rounded-2xl p-5 transition-all hover:scale-[1.01] border ${
            metrics.criticalStockoutCount > 0
              ? darkMode
                ? 'glass-panel-dark border-rose-500/40 text-slate-100 shadow-rose-950/20 shadow-lg'
                : 'glass-panel-light border-rose-300 text-slate-800 shadow-rose-100 shadow-lg'
              : darkMode
              ? 'glass-panel-dark text-slate-100'
              : 'glass-panel-light text-slate-800'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500" />
              </span>
              Stockout Vulnerability
            </span>
            <div className="p-2 rounded-xl bg-rose-500/15 text-rose-400 border border-rose-500/30">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-rose-500 font-mono">
              {metrics.criticalStockoutCount} Items Critical
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs">
            <span className="text-amber-400 font-medium">
              +{metrics.warningStockoutCount} approaching safety threshold
            </span>
            <button
              onClick={() => onAskCopilot('Which products will stock out next week?')}
              className="text-[11px] font-bold text-rose-400 hover:text-rose-300 underline underline-offset-2 flex items-center gap-0.5"
            >
              Analyze <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
          <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-rose-500/10 rounded-full blur-xl pointer-events-none" />
        </div>

        {/* KPI 4: Inventory Working Capital & Total Units */}
        <div
          className={`relative overflow-hidden rounded-2xl p-5 transition-all hover:scale-[1.01] ${
            darkMode ? 'glass-panel-dark text-slate-100' : 'glass-panel-light text-slate-800'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Inventory Working Capital
            </span>
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <PackageCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold tracking-tight font-mono">
              ${metrics.totalInventoryValue.toLocaleString()}
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs">
            <span className="text-slate-400 font-medium">
              {metrics.totalInventoryUnits.toLocaleString()} units across 5 stores
            </span>
            <span className="font-semibold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">
              {metrics.overstockedCount} Overstocked
            </span>
          </div>
          <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-cyan-500/5 rounded-full blur-xl pointer-events-none" />
        </div>
      </div>

      {/* Autonomous Agent Quick Action Bar */}
      <div
        className={`flex flex-wrap items-center justify-between gap-3 p-3 sm:p-4 rounded-2xl border transition-all ${
          darkMode
            ? 'bg-gradient-to-r from-slate-900/80 via-teal-950/20 to-slate-900/80 border-teal-500/30'
            : 'bg-gradient-to-r from-teal-50/80 via-emerald-50/50 to-white/90 border-teal-200'
        }`}
      >
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-teal-500/20 text-teal-300 border border-teal-500/30">
            <Zap className="w-4 h-4 text-teal-400" />
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-teal-400 flex items-center gap-1.5">
              Autonomous Copilot Operations
            </div>
            <p className="text-xs text-slate-400 font-medium">
              Click any agent trigger to initiate real-time function calling & automated decision analysis:
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onAskCopilot('Which products will stock out next week?')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95 ${
              darkMode
                ? 'bg-rose-500/15 border-rose-500/40 text-rose-300 hover:bg-rose-500/25'
                : 'bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
            Stockout Forecast
          </button>

          <button
            onClick={() => onAskCopilot('Which items should get a discount?')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95 ${
              darkMode
                ? 'bg-amber-500/15 border-amber-500/40 text-amber-300 hover:bg-amber-500/25'
                : 'bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Markdown Opportunities
          </button>

          <button
            onClick={() => onAskCopilot('Analyze price optimization and gross margin uplift across top electronics')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95 ${
              darkMode
                ? 'bg-teal-500/15 border-teal-500/40 text-teal-300 hover:bg-teal-500/25'
                : 'bg-teal-50 border-teal-200 text-teal-700 hover:bg-teal-100'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5 text-teal-400" />
            Margin Calibration
          </button>
        </div>
      </div>
    </div>
  );
};
