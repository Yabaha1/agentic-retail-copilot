/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Neemba AI NewGen: Retail Copilot - Agentic Chat Panel with Reasoning Steps & Recommendation Card
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  Bot,
  User,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Loader2,
  Wrench,
  DollarSign,
  TrendingUp,
  Tag,
  Package,
  Clock,
  RotateCcw,
} from 'lucide-react';
import { AgentChatMessage, RecommendationAction } from '../types/retail.ts';

interface AgentChatPanelProps {
  darkMode: boolean;
  selectedStore: string;
  messages: AgentChatMessage[];
  onSendMessage: (query: string) => Promise<void>;
  isLoading: boolean;
  onApproveAction: (action: RecommendationAction) => Promise<void>;
  onResetChat: () => void;
}

export const AgentChatPanel: React.FC<AgentChatPanelProps> = ({
  darkMode,
  selectedStore,
  messages,
  onSendMessage,
  isLoading,
  onApproveAction,
  onResetChat,
}) => {
  const [input, setInput] = useState('');
  const [expandedReasoningMap, setExpandedReasoningMap] = useState<Record<string, boolean>>({});
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    const query = input;
    setInput('');
    onSendMessage(query);
  };

  const handleQuickPrompt = (prompt: string) => {
    if (isLoading) return;
    onSendMessage(prompt);
  };

  const toggleReasoning = (msgId: string) => {
    setExpandedReasoningMap((prev) => ({
      ...prev,
      [msgId]: !prev[msgId],
    }));
  };

  const handleApprove = async (action: RecommendationAction) => {
    setApprovingId(action.id);
    try {
      await onApproveAction(action);
    } finally {
      setApprovingId(null);
    }
  };

  const quickPrompts = [
    { label: '🚨 Stockout Forecast', prompt: 'Which products will stock out next week?' },
    { label: '🏷️ Markdown Recommendations', prompt: 'Which items should get a discount?' },
    { label: '📈 30-Day Sales Velocity', prompt: 'What is our 30-day sales velocity and margin trend?' },
    { label: '⚡ Dynamic Price Calibration', prompt: 'Suggest price optimization to lift gross margin across high-demand items' },
  ];

  return (
    <div
      className={`rounded-2xl border flex flex-col h-[740px] transition-all overflow-hidden ${
        darkMode ? 'glass-panel-dark text-slate-100' : 'glass-panel-light text-slate-800'
      }`}
    >
      {/* Copilot Header */}
      <div
        className={`px-5 py-4 border-b flex items-center justify-between transition-colors ${
          darkMode ? 'border-slate-800 bg-slate-900/40' : 'border-slate-200 bg-white/40'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-400 p-0.5 shadow-md shadow-teal-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-cyan-300" />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-slate-900 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm tracking-tight">Retail Agentic Copilot</h3>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Gemini 3.8
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Active Scope: {selectedStore === 'ALL' ? 'Chain-wide (All 5 Stores)' : selectedStore}
            </p>
          </div>
        </div>

        <button
          onClick={onResetChat}
          className={`p-1.5 rounded-lg border text-xs text-slate-400 hover:text-slate-200 transition-all ${
            darkMode ? 'border-slate-800 hover:bg-slate-800' : 'border-slate-200 hover:bg-slate-100'
          }`}
          title="Reset Conversation"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Suggested Quick Prompts */}
      <div
        className={`px-4 py-2 border-b flex items-center gap-2 overflow-x-auto text-xs ${
          darkMode ? 'border-slate-800/80 bg-slate-950/20' : 'border-slate-200/80 bg-slate-50/50'
        }`}
      >
        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider shrink-0 flex items-center gap-1">
          <Wrench className="w-3 h-3 text-teal-400" />
          Tools:
        </span>
        {quickPrompts.map((qp, idx) => (
          <button
            key={idx}
            onClick={() => handleQuickPrompt(qp.prompt)}
            disabled={isLoading}
            className={`shrink-0 px-2.5 py-1 rounded-lg border text-[11px] font-semibold transition-all hover:scale-105 active:scale-95 disabled:opacity-50 ${
              darkMode
                ? 'bg-slate-900/60 border-slate-700/60 text-slate-300 hover:border-teal-500/50 hover:text-white'
                : 'bg-white border-slate-200 text-slate-700 hover:border-teal-400 hover:text-slate-900'
            }`}
          >
            {qp.label}
          </button>
        ))}
      </div>

      {/* Message Stream */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5">
        {messages.map((msg) => {
          const isAgent = msg.sender === 'agent';
          const isReasoningOpen = expandedReasoningMap[msg.id] ?? true; // default open to showcase agentic steps!

          return (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-full ${isAgent ? 'justify-start' : 'justify-end'}`}
            >
              {isAgent && (
                <div className="shrink-0 w-8 h-8 rounded-xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-400 mt-1">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div className={`space-y-3 max-w-[90%] sm:max-w-[85%]`}>
                {/* Agent Reasoning Steps Dropdown / Accordion */}
                {isAgent && msg.reasoningSteps && msg.reasoningSteps.length > 0 && (
                  <div
                    className={`rounded-xl border overflow-hidden transition-all text-xs ${
                      darkMode
                        ? 'bg-slate-950/60 border-slate-800'
                        : 'bg-slate-50/80 border-slate-200'
                    }`}
                  >
                    <button
                      onClick={() => toggleReasoning(msg.id)}
                      className={`w-full px-3 py-2 flex items-center justify-between text-left font-semibold ${
                        darkMode ? 'hover:bg-slate-900/50 text-slate-300' : 'hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="flex h-2 w-2 relative">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75" />
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500" />
                        </span>
                        <span className="font-mono text-[11px] text-teal-400">
                          Agentic Reasoning Trace ({msg.reasoningSteps.length} Tool Calls)
                        </span>
                      </div>
                      {isReasoningOpen ? (
                        <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                      )}
                    </button>

                    {isReasoningOpen && (
                      <div
                        className={`p-3 space-y-2 border-t ${
                          darkMode ? 'border-slate-800/80 bg-slate-950/40' : 'border-slate-200 bg-white/60'
                        }`}
                      >
                        {msg.reasoningSteps.map((step, sIdx) => (
                          <div
                            key={sIdx}
                            className={`p-2.5 rounded-lg border font-mono text-[11px] space-y-1.5 ${
                              darkMode
                                ? 'bg-slate-900/80 border-slate-800/80 text-slate-300'
                                : 'bg-slate-50 border-slate-200 text-slate-800'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-bold text-teal-400 flex items-center gap-1.5">
                                <span className="w-4 h-4 rounded-full bg-teal-500/20 text-teal-300 flex items-center justify-center text-[10px]">
                                  {step.step}
                                </span>
                                Tool: {step.toolName}
                              </span>
                              <span className="text-[10px] text-slate-400">
                                {new Date(step.timestamp).toLocaleTimeString()}
                              </span>
                            </div>
                            <div className="text-[10px] text-slate-400 bg-slate-950/30 p-1.5 rounded overflow-x-auto">
                              Args: {JSON.stringify(step.args)}
                            </div>
                            <p className="text-slate-200 text-xs font-sans font-medium">
                              ↳ {step.resultSummary}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Message Bubble Content */}
                <div
                  className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    isAgent
                      ? darkMode
                        ? 'bg-slate-900/70 border border-slate-800 text-slate-200'
                        : 'bg-white/90 border border-slate-200 text-slate-800 shadow-sm'
                      : 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-medium ml-auto shadow-md shadow-teal-900/20'
                  }`}
                >
                  <div className="whitespace-pre-wrap space-y-2">
                    {msg.content.split('\n\n').map((paragraph, pIdx) => {
                      if (paragraph.startsWith('### ')) {
                        return (
                          <h4 key={pIdx} className="font-bold text-base text-teal-400 mt-2 mb-1">
                            {paragraph.replace('### ', '')}
                          </h4>
                        );
                      }
                      if (paragraph.startsWith('- ')) {
                        return (
                          <ul key={pIdx} className="list-disc pl-4 space-y-1 text-xs">
                            {paragraph.split('\n').map((li, lIdx) => (
                              <li key={lIdx}>{li.replace('- ', '')}</li>
                            ))}
                          </ul>
                        );
                      }
                      return <p key={pIdx}>{paragraph}</p>;
                    })}
                  </div>
                  <div className="mt-2 text-[10px] text-slate-400 flex justify-end">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>

                {/* Actionable Recommendation Card with Estimated Impact in $ */}
                {isAgent && msg.recommendation && (
                  <div
                    className={`rounded-2xl border p-4 sm:p-5 transition-all shadow-lg ${
                      msg.recommendation.status === 'EXECUTED'
                        ? darkMode
                          ? 'bg-emerald-950/20 border-emerald-500/30'
                          : 'bg-emerald-50/70 border-emerald-300'
                        : darkMode
                        ? 'glass-panel-dark border-teal-500/40 shadow-teal-950/30'
                        : 'glass-panel-light border-teal-300 shadow-teal-100'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              msg.recommendation.urgency === 'HIGH'
                                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                                : 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                            }`}
                          >
                            {msg.recommendation.urgency} Urgency • {msg.recommendation.type}
                          </span>
                          <span className="text-xs text-slate-400 font-medium">
                            {msg.recommendation.storeName}
                          </span>
                        </div>
                        <h4 className="font-extrabold text-sm sm:text-base text-slate-100 dark:text-slate-100 light:text-slate-900">
                          {msg.recommendation.title}
                        </h4>
                      </div>

                      {/* Estimated Impact in $ Badge */}
                      <div className="text-right shrink-0">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">
                          Estimated Impact
                        </span>
                        <div className="text-lg sm:text-xl font-extrabold font-mono text-emerald-400 flex items-center justify-end gap-0.5">
                          +${msg.recommendation.impactDollars.toLocaleString()}
                        </div>
                        <span className="text-[10px] font-semibold text-teal-300">
                          {msg.recommendation.impactType.replace('_', ' ')}
                        </span>
                      </div>
                    </div>

                    <p className="mt-3 text-xs text-slate-300 dark:text-slate-300 light:text-slate-600 leading-relaxed font-medium">
                      {msg.recommendation.rationale}
                    </p>

                    {/* Action Execution Button (Process Automation) */}
                    <div className="mt-4 pt-3 border-t border-slate-700/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                        <Package className="w-3.5 h-3.5 text-teal-400" />
                        <span>Target: {msg.recommendation.productName}</span>
                      </div>

                      {msg.recommendation.status === 'EXECUTED' ? (
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold self-end sm:self-auto">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span>Action Approved & Executed</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleApprove(msg.recommendation!)}
                          disabled={approvingId === msg.recommendation.id}
                          className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-slate-950 flex items-center justify-center gap-1.5 shadow-md shadow-teal-500/25 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 cursor-pointer"
                        >
                          {approvingId === msg.recommendation.id ? (
                            <>
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              <span>Executing in Retail ERP...</span>
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5 text-slate-950" />
                              <span>Approve Action & Automate</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {!isAgent && (
                <div className="shrink-0 w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-300 mt-1">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {/* Loading Spinner with Agentic Steps Preview */}
        {isLoading && (
          <div className="flex gap-3 justify-start items-start">
            <div className="shrink-0 w-8 h-8 rounded-xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-400">
              <Bot className="w-4 h-4" />
            </div>
            <div
              className={`p-4 rounded-2xl border text-xs space-y-2 max-w-sm ${
                darkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'
              }`}
            >
              <div className="flex items-center gap-2 text-teal-400 font-bold">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Neemba Copilot Reasoning...</span>
              </div>
              <p className="text-slate-400 text-[11px]">
                Invoking retail tools (get_sales_trend, forecast_stockout, suggest_price, generate_offer) and synthesizing optimal decision...
              </p>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form
        onSubmit={handleSubmit}
        className={`p-3 sm:p-4 border-t flex items-center gap-2 ${
          darkMode ? 'border-slate-800 bg-slate-900/60' : 'border-slate-200 bg-white/70'
        }`}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask Retail Copilot (e.g., Which items should get a discount?)..."
          className={`flex-1 px-4 py-2.5 rounded-xl border text-xs sm:text-sm outline-none transition-all ${
            darkMode
              ? 'bg-slate-950/80 border-slate-700/80 text-slate-100 placeholder-slate-500 focus:border-teal-400'
              : 'bg-white border-slate-300 text-slate-800 placeholder-slate-400 focus:border-teal-500'
          }`}
          disabled={isLoading}
        />

        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-md shadow-teal-500/25 transition-all hover:scale-105 active:scale-95 disabled:opacity-40 disabled:hover:scale-100 cursor-pointer"
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          <span className="hidden sm:inline">Ask</span>
        </button>
      </form>
    </div>
  );
};
