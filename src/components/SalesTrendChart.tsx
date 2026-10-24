/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Neemba AI NewGen: Retail Copilot - Interactive Glassmorphic Sales Trend Chart
 */

import React, { useState } from 'react';
import { TrendingUp, BarChart2, Layers } from 'lucide-react';
import { DashboardMetrics } from '../types/retail.ts';

interface SalesTrendChartProps {
  metrics: DashboardMetrics | null;
  darkMode: boolean;
  selectedDays: number;
}

export const SalesTrendChart: React.FC<SalesTrendChartProps> = ({
  metrics,
  darkMode,
  selectedDays,
}) => {
  const [activeMetric, setActiveMetric] = useState<'revenue' | 'margin' | 'units'>('revenue');
  const [hoveredPoint, setHoveredPoint] = useState<{
    date: string;
    revenue: number;
    margin: number;
    units: number;
    x: number;
    y: number;
  } | null>(null);

  if (!metrics || !metrics.chartSeries || metrics.chartSeries.length === 0) {
    return (
      <div
        className={`h-72 rounded-2xl p-6 flex items-center justify-center animate-pulse ${
          darkMode ? 'glass-panel-dark' : 'glass-panel-light'
        }`}
      >
        <span className="text-slate-400 text-sm">Aggregating 90-day retail trend data...</span>
      </div>
    );
  }

  const series = metrics.chartSeries;
  const values = series.map((s) => s[activeMetric]);
  const maxValue = Math.max(...values, 100);
  const minValue = 0;

  // SVG Chart Dimensions
  const svgWidth = 800;
  const svgHeight = 220;
  const paddingX = 35;
  const paddingY = 25;
  const graphWidth = svgWidth - paddingX * 2;
  const graphHeight = svgHeight - paddingY * 2;

  // Calculate coordinates
  const points = series.map((item, index) => {
    const x = paddingX + (index / (series.length - 1 || 1)) * graphWidth;
    const y = svgHeight - paddingY - ((item[activeMetric] - minValue) / (maxValue - minValue || 1)) * graphHeight;
    return { x, y, item };
  });

  // Create SVG path
  const pathD = points.reduce((acc, curr, idx, arr) => {
    if (idx === 0) return `M ${curr.x} ${curr.y}`;
    const prev = arr[idx - 1];
    const cpX1 = prev.x + (curr.x - prev.x) / 2;
    const cpY1 = prev.y;
    const cpX2 = prev.x + (curr.x - prev.x) / 2;
    const cpY2 = curr.y;
    return `${acc} C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${curr.x} ${curr.y}`;
  }, '');

  const areaD = `${pathD} L ${points[points.length - 1].x} ${svgHeight - paddingY} L ${points[0].x} ${svgHeight - paddingY} Z`;

  // Colors based on active metric
  const colorMap = {
    revenue: {
      line: '#10b981', // emerald
      gradientStart: 'rgba(16, 185, 129, 0.35)',
      gradientEnd: 'rgba(16, 185, 129, 0.0)',
      accent: 'text-emerald-400',
    },
    margin: {
      line: '#14b8a6', // teal
      gradientStart: 'rgba(20, 184, 166, 0.35)',
      gradientEnd: 'rgba(20, 184, 166, 0.0)',
      accent: 'text-teal-400',
    },
    units: {
      line: '#06b6d4', // cyan
      gradientStart: 'rgba(6, 182, 212, 0.35)',
      gradientEnd: 'rgba(6, 182, 212, 0.0)',
      accent: 'text-cyan-400',
    },
  };

  const currentColor = colorMap[activeMetric];

  return (
    <div
      className={`rounded-2xl p-5 transition-all ${
        darkMode ? 'glass-panel-dark text-slate-100' : 'glass-panel-light text-slate-800'
      }`}
    >
      {/* Chart Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <h2 className="text-base font-bold tracking-tight">Retail Velocity & Sales Trajectory</h2>
            <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
              {series.length} Days Window
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5 font-medium">
            Daily historical volume, revenue, and gross profit margins across active stores
          </p>
        </div>

        {/* Metric Selector Pills */}
        <div
          className={`flex items-center p-1 rounded-xl border text-xs font-semibold self-start sm:self-auto ${
            darkMode ? 'bg-slate-900/70 border-slate-700/60' : 'bg-white/80 border-slate-200'
          }`}
        >
          <button
            onClick={() => setActiveMetric('revenue')}
            className={`px-3 py-1 rounded-lg transition-all ${
              activeMetric === 'revenue'
                ? 'bg-emerald-500 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Revenue ($)
          </button>
          <button
            onClick={() => setActiveMetric('margin')}
            className={`px-3 py-1 rounded-lg transition-all ${
              activeMetric === 'margin'
                ? 'bg-teal-500 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Gross Margin ($)
          </button>
          <button
            onClick={() => setActiveMetric('units')}
            className={`px-3 py-1 rounded-lg transition-all ${
              activeMetric === 'units'
                ? 'bg-cyan-500 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Units Sold
          </button>
        </div>
      </div>

      {/* SVG Interactive Chart Canvas */}
      <div className="relative w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-56 sm:h-64 overflow-visible"
          onMouseLeave={() => setHoveredPoint(null)}
        >
          <defs>
            <linearGradient id={`chart-grad-${activeMetric}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={currentColor.gradientStart} />
              <stop offset="100%" stopColor={currentColor.gradientEnd} />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
            const y = svgHeight - paddingY - ratio * graphHeight;
            const labelVal = Math.round(minValue + ratio * (maxValue - minValue));
            return (
              <g key={ratio}>
                <line
                  x1={paddingX}
                  y1={y}
                  x2={svgWidth - paddingX}
                  y2={y}
                  stroke={darkMode ? 'rgba(255, 255, 255, 0.07)' : 'rgba(0, 0, 0, 0.06)'}
                  strokeDasharray="4 4"
                />
                <text
                  x={paddingX - 6}
                  y={y + 4}
                  textAnchor="end"
                  className="text-[10px] fill-slate-500 font-mono"
                >
                  {activeMetric === 'units' ? labelVal : `$${(labelVal / 1000).toFixed(0)}k`}
                </text>
              </g>
            );
          })}

          {/* Filled Area */}
          <path d={areaD} fill={`url(#chart-grad-${activeMetric})`} />

          {/* Stroke Line */}
          <path
            d={pathD}
            fill="none"
            stroke={currentColor.line}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Interactive Data Nodes */}
          {points.map((pt, idx) => (
            <g
              key={idx}
              className="cursor-pointer"
              onMouseEnter={() =>
                setHoveredPoint({
                  date: pt.item.date,
                  revenue: pt.item.revenue,
                  margin: pt.item.margin,
                  units: pt.item.units,
                  x: pt.x,
                  y: pt.y,
                })
              }
            >
              <circle
                cx={pt.x}
                cy={pt.y}
                r={hoveredPoint?.date === pt.item.date ? 5.5 : 2.5}
                fill={currentColor.line}
                stroke={darkMode ? '#0f172a' : '#ffffff'}
                strokeWidth={hoveredPoint?.date === pt.item.date ? 2 : 1}
                className="transition-all"
              />
            </g>
          ))}
        </svg>

        {/* Hover Tooltip Overlay */}
        {hoveredPoint && (
          <div
            className={`absolute pointer-events-none p-3 rounded-xl border text-xs shadow-xl backdrop-blur-md transition-all z-20 ${
              darkMode
                ? 'bg-slate-900/90 border-slate-700 text-slate-100 shadow-slate-950/50'
                : 'bg-white/95 border-slate-200 text-slate-800 shadow-slate-300/50'
            }`}
            style={{
              left: `${Math.min(75, Math.max(15, (hoveredPoint.x / svgWidth) * 100))}%`,
              top: '12%',
              transform: 'translateX(-50%)',
            }}
          >
            <div className="font-bold text-slate-300 font-mono text-[11px] border-b border-slate-700/40 pb-1 mb-1.5 flex items-center justify-between gap-4">
              <span>{hoveredPoint.date}</span>
              <span className="text-emerald-400 font-semibold">Retail Day</span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Revenue</span>
                <p className="font-bold font-mono text-emerald-400">
                  ${hoveredPoint.revenue.toLocaleString()}
                </p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Margin</span>
                <p className="font-bold font-mono text-teal-400">
                  ${hoveredPoint.margin.toLocaleString()}
                </p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Units</span>
                <p className="font-bold font-mono text-cyan-400">
                  {hoveredPoint.units.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Category Performance Breakdown Bar */}
      <div className="mt-4 pt-3 border-t border-slate-200/50 dark:border-slate-800/80">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-2 font-medium">
          <span className="flex items-center gap-1.5 font-semibold text-slate-300">
            <Layers className="w-3.5 h-3.5 text-teal-400" />
            Category Revenue Share
          </span>
          <span>5 Product Categories Across 40 SKUs</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {metrics.categoryBreakdown.map((cat) => (
            <div
              key={cat.category}
              className={`p-2.5 rounded-xl border text-xs transition-all ${
                darkMode
                  ? 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
                  : 'bg-white/50 border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="truncate font-semibold text-slate-200">{cat.category}</div>
              <div className="flex items-baseline justify-between mt-1">
                <span className="font-mono font-bold text-emerald-400">
                  ${cat.revenue.toLocaleString()}
                </span>
                <span className="text-[10px] text-slate-400">
                  {cat.units.toLocaleString()} sold
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
