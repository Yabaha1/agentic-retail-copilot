/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Neemba AI NewGen: Retail Copilot - 40 Product Catalog & Inventory Health Table
 */

import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  AlertTriangle,
  CheckCircle,
  Clock,
  Sparkles,
  ArrowUpDown,
  TrendingUp,
  Tag,
} from 'lucide-react';
import { Product } from '../types/retail.ts';

interface ProductCatalogTableProps {
  products: Product[];
  darkMode: boolean;
  selectedStore: string;
  onAskCopilot: (prompt: string) => void;
}

export const ProductCatalogTable: React.FC<ProductCatalogTableProps> = ({
  products,
  darkMode,
  selectedStore,
  onAskCopilot,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [riskFilter, setRiskFilter] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'margin' | 'stock' | 'days'>('days');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const categories = useMemo(() => {
    const set = new Set(products.map((p) => p.category));
    return ['ALL', ...Array.from(set)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        const matchesSearch =
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.supplierName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'ALL' || p.category === selectedCategory;
        const matchesRisk = riskFilter === 'ALL' || p.stockoutRisk === riskFilter;
        return matchesSearch && matchesCategory && matchesRisk;
      })
      .sort((a, b) => {
        let valA: any = a.name;
        let valB: any = b.name;

        if (sortBy === 'price') {
          valA = a.price;
          valB = b.price;
        } else if (sortBy === 'margin') {
          valA = a.marginRate;
          valB = b.marginRate;
        } else if (sortBy === 'stock') {
          valA = a.totalStock || 0;
          valB = b.totalStock || 0;
        } else if (sortBy === 'days') {
          valA = a.daysOfSupply || 999;
          valB = b.daysOfSupply || 999;
        }

        if (sortOrder === 'asc') return valA > valB ? 1 : -1;
        return valA < valB ? 1 : -1;
      });
  }, [products, searchTerm, selectedCategory, riskFilter, sortBy, sortOrder]);

  const toggleSort = (col: 'name' | 'price' | 'margin' | 'stock' | 'days') => {
    if (sortBy === col) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(col);
      setSortOrder('asc');
    }
  };

  return (
    <div
      className={`rounded-2xl border p-5 transition-all overflow-hidden ${
        darkMode ? 'glass-panel-dark text-slate-100' : 'glass-panel-light text-slate-800'
      }`}
    >
      {/* Table Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-teal-400" />
            <h3 className="font-bold text-base tracking-tight">40-Product Retail Catalog & Stock Velocity</h3>
            <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-teal-500/10 text-teal-300 border border-teal-500/20">
              {filteredProducts.length} Showing
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5 font-medium">
            Live supply-chain health across 5 retail stores with supplier lead-time thresholds
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Search Bar */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search SKU, item, supplier..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`pl-8 pr-3 py-1.5 rounded-xl border text-xs outline-none transition-all w-48 sm:w-56 ${
                darkMode
                  ? 'bg-slate-900/80 border-slate-700/80 text-slate-100 placeholder-slate-500 focus:border-teal-400'
                  : 'bg-white border-slate-300 text-slate-800 placeholder-slate-400 focus:border-teal-500'
              }`}
            />
          </div>

          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-medium cursor-pointer outline-none ${
              darkMode ? 'bg-slate-900/80 border-slate-700/80 text-slate-200' : 'bg-white border-slate-300 text-slate-700'
            }`}
          >
            {categories.map((c) => (
              <option key={c} value={c} className={darkMode ? 'bg-slate-900' : 'bg-white'}>
                {c === 'ALL' ? 'All Categories' : c}
              </option>
            ))}
          </select>

          {/* Risk Filter */}
          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold cursor-pointer outline-none ${
              darkMode ? 'bg-slate-900/80 border-slate-700/80 text-slate-200' : 'bg-white border-slate-300 text-slate-700'
            }`}
          >
            <option value="ALL" className={darkMode ? 'bg-slate-900' : 'bg-white'}>All Risk Levels</option>
            <option value="CRITICAL" className={darkMode ? 'bg-slate-900 text-rose-400' : 'bg-white text-rose-600'}>Critical Stockout</option>
            <option value="WARNING" className={darkMode ? 'bg-slate-900 text-amber-400' : 'bg-white text-amber-600'}>Warning Alert</option>
            <option value="HEALTHY" className={darkMode ? 'bg-slate-900 text-emerald-400' : 'bg-white text-emerald-600'}>Healthy Stock</option>
            <option value="OVERSTOCKED" className={darkMode ? 'bg-slate-900 text-cyan-400' : 'bg-white text-cyan-600'}>Overstocked</option>
          </select>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto rounded-xl border border-slate-200/60 dark:border-slate-800/80">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr
              className={`border-b font-semibold uppercase tracking-wider text-[11px] ${
                darkMode ? 'border-slate-800 bg-slate-900/60 text-slate-400' : 'border-slate-200 bg-slate-50 text-slate-600'
              }`}
            >
              <th className="py-3 px-3 cursor-pointer" onClick={() => toggleSort('name')}>
                <div className="flex items-center gap-1">
                  Product / SKU
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3 px-3">Category</th>
              <th className="py-3 px-3 cursor-pointer" onClick={() => toggleSort('price')}>
                <div className="flex items-center gap-1">
                  Retail Price / Cost
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3 px-3 cursor-pointer" onClick={() => toggleSort('margin')}>
                <div className="flex items-center gap-1">
                  Gross Margin
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3 px-3 cursor-pointer" onClick={() => toggleSort('stock')}>
                <div className="flex items-center gap-1">
                  Available Stock
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3 px-3 cursor-pointer" onClick={() => toggleSort('days')}>
                <div className="flex items-center gap-1">
                  Days of Supply vs Lead Time
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3 px-3">Risk Status</th>
              <th className="py-3 px-3 text-right">Copilot Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200/50 dark:divide-slate-800/60 font-medium">
            {filteredProducts.map((p) => {
              const marginPct = Math.round(p.marginRate * 100);
              const days = p.daysOfSupply || 0;
              const isCritical = p.stockoutRisk === 'CRITICAL';
              const isWarning = p.stockoutRisk === 'WARNING';
              const isOverstocked = p.stockoutRisk === 'OVERSTOCKED';

              return (
                <tr
                  key={p.id}
                  className={`transition-colors ${
                    darkMode ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50/80'
                  }`}
                >
                  {/* Name & SKU */}
                  <td className="py-3 px-3">
                    <div className="font-bold text-slate-100 dark:text-slate-100 light:text-slate-900">
                      {p.name}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono flex items-center gap-2 mt-0.5">
                      <span>{p.sku}</span>
                      <span>•</span>
                      <span>Supplier: {p.supplierName}</span>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-500/10 text-slate-300 border border-slate-500/20">
                      {p.category}
                    </span>
                  </td>

                  {/* Price & Unit Cost */}
                  <td className="py-3 px-3 font-mono">
                    <div className="font-bold text-slate-100 dark:text-slate-100 light:text-slate-900">
                      ${p.price}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Cost: ${p.unitCost}
                    </div>
                  </td>

                  {/* Gross Margin */}
                  <td className="py-3 px-3">
                    <div className="font-bold text-emerald-400 font-mono">
                      {marginPct}%
                    </div>
                    <div className="text-[10px] text-slate-400">
                      +${(p.price - p.unitCost).toFixed(1)}/unit
                    </div>
                  </td>

                  {/* Total Stock */}
                  <td className="py-3 px-3 font-mono">
                    <div className="font-bold">
                      {p.totalStock?.toLocaleString()} units
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Run-rate: {p.avgDailySales}/day
                    </div>
                  </td>

                  {/* Days of Supply vs Lead Time */}
                  <td className="py-3 px-3 font-mono">
                    <div className={`font-bold flex items-center gap-1.5 ${
                      isCritical ? 'text-rose-400' : isWarning ? 'text-amber-400' : 'text-slate-200'
                    }`}>
                      <Clock className="w-3 h-3 shrink-0" />
                      {days} Days Supply
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Lead Time: {p.supplierLeadTimeDays}d
                    </div>
                  </td>

                  {/* Risk Badge */}
                  <td className="py-3 px-3">
                    {isCritical ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/15 text-rose-400 border border-rose-500/30">
                        <AlertTriangle className="w-3 h-3" />
                        Critical ({days}d &lt; {p.supplierLeadTimeDays}d)
                      </span>
                    ) : isWarning ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                        Warning Risk
                      </span>
                    ) : isOverstocked ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
                        Overstocked ({days}d)
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                        <CheckCircle className="w-3 h-3" />
                        Healthy
                      </span>
                    )}
                  </td>

                  {/* Ask Copilot Button */}
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => {
                        if (isCritical) {
                          onAskCopilot(`Evaluate stockout and generate replenishment PO for ${p.name}`);
                        } else if (isOverstocked) {
                          onAskCopilot(`Generate markdown promotional offer for overstocked product ${p.name}`);
                        } else {
                          onAskCopilot(`Analyze price elasticity and suggest margin optimization for ${p.name}`);
                        }
                      }}
                      className={`px-2.5 py-1 rounded-lg border text-[11px] font-semibold flex items-center gap-1 ml-auto transition-all hover:scale-105 active:scale-95 ${
                        darkMode
                          ? 'bg-slate-800 hover:bg-slate-700 text-teal-300 border-teal-500/30'
                          : 'bg-white hover:bg-slate-100 text-teal-700 border-teal-300 shadow-sm'
                      }`}
                      title="Analyze SKU with Neemba Retail Copilot"
                    >
                      <Sparkles className="w-3 h-3 text-teal-400" />
                      <span>Copilot</span>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
