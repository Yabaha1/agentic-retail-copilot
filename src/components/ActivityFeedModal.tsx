/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Neemba AI NewGen: Retail Copilot - Process Automation Activity Feed Modal
 */

import React from 'react';
import {
  X,
  Activity,
  CheckCircle2,
  PackageCheck,
  TrendingDown,
  TrendingUp,
  DollarSign,
  Clock,
  Sparkles,
  RotateCcw,
} from 'lucide-react';
import { RecommendationAction } from '../types/retail.ts';

interface ActivityFeedModalProps {
  isOpen: boolean;
  onClose: () => void;
  darkMode: boolean;
  activities: RecommendationAction[];
  onResetFeed: () => void;
}

export const ActivityFeedModal: React.FC<ActivityFeedModalProps> = ({
  isOpen,
  onClose,
  darkMode,
  activities,
  onResetFeed,
}) => {
  if (!isOpen) return null;

  const totalImpact = activities.reduce((acc, curr) => acc + (curr.impactDollars || 0), 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in">
      <div
        className={`w-full max-w-2xl rounded-2xl border p-6 flex flex-col max-h-[85vh] transition-all shadow-2xl ${
          darkMode ? 'glass-panel-dark text-slate-100' : 'glass-panel-light text-slate-800'
        }`}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-teal-500/20 text-teal-400 border border-teal-500/30">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-lg tracking-tight">Process Automation Audit Feed</h3>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  {activities.length} Actions
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">
                Autonomous agent decisions approved & executed in retail store ERP
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onResetFeed}
              className={`p-2 rounded-xl border text-xs text-slate-400 hover:text-slate-200 transition-all ${
                darkMode ? 'border-slate-800 hover:bg-slate-800' : 'border-slate-200 hover:bg-slate-100'
              }`}
              title="Reset Activity Log"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className={`p-2 rounded-xl border text-slate-400 hover:text-slate-200 transition-all ${
                darkMode ? 'border-slate-800 hover:bg-slate-800' : 'border-slate-200 hover:bg-slate-100'
              }`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Aggregated Total Automation Impact Banner */}
        <div
          className={`mt-4 p-4 rounded-xl border flex items-center justify-between ${
            darkMode
              ? 'bg-gradient-to-r from-emerald-950/40 via-teal-950/20 to-slate-900 border-teal-500/30'
              : 'bg-gradient-to-r from-emerald-50 via-teal-50 to-white border-teal-200'
          }`}
        >
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-teal-400">
              Total Quantified Operational Value
            </span>
            <p className="text-xs text-slate-400">
              Cumulative financial impact from autonomous reorders, margin lifts & markdowns
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-extrabold font-mono text-emerald-400">
              +${totalImpact.toLocaleString()}
            </div>
            <span className="text-[11px] font-semibold text-teal-300">Net Impact</span>
          </div>
        </div>

        {/* Activity Items List */}
        <div className="mt-4 flex-1 overflow-y-auto space-y-3 pr-1">
          {activities.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-sm">
              No actions approved yet. Ask the Copilot to analyze inventory and click "Approve Action"!
            </div>
          ) : (
            activities.map((act) => {
              const isRestock = act.type === 'RESTOCK';
              const isMarkdown = act.type === 'MARKDOWN';
              const isPrice = act.type === 'PRICE_INCREASE';

              return (
                <div
                  key={act.id}
                  className={`p-4 rounded-xl border transition-all ${
                    darkMode
                      ? 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700'
                      : 'bg-white/80 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div
                        className={`p-2 rounded-xl mt-0.5 ${
                          isRestock
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            : isMarkdown
                            ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                            : 'bg-teal-500/15 text-teal-400 border border-teal-500/30'
                        }`}
                      >
                        {isRestock ? (
                          <PackageCheck className="w-4 h-4" />
                        ) : isMarkdown ? (
                          <TrendingDown className="w-4 h-4" />
                        ) : (
                          <TrendingUp className="w-4 h-4" />
                        )}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                            {act.type}
                          </span>
                          <span className="text-xs text-slate-400 font-medium">{act.storeName}</span>
                        </div>
                        <h4 className="font-bold text-sm text-slate-100 dark:text-slate-100 light:text-slate-900 mt-1">
                          {act.title}
                        </h4>
                        <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                          {act.rationale}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-sm font-extrabold font-mono text-emerald-400">
                        +${act.impactDollars.toLocaleString()}
                      </span>
                      <div className="text-[10px] text-teal-400 font-medium">
                        {act.impactType.replace('_', ' ')}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono mt-1">
                        {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>

                  {act.actionPayload && (
                    <div className="mt-3 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                      <span>Payload: {JSON.stringify(act.actionPayload)}</span>
                      <span className="flex items-center gap-1 text-emerald-400 font-semibold font-sans">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        ERP Synced
                      </span>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
