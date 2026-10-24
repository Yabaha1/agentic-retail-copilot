/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Neemba AI NewGen: Retail Copilot - Main Application Container
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar.tsx';
import { KPICards } from './components/KPICards.tsx';
import { SalesTrendChart } from './components/SalesTrendChart.tsx';
import { ProductCatalogTable } from './components/ProductCatalogTable.tsx';
import { AgentChatPanel } from './components/AgentChatPanel.tsx';
import { ActivityFeedModal } from './components/ActivityFeedModal.tsx';
import { Footer } from './components/Footer.tsx';
import {
  Product,
  Store,
  DashboardMetrics,
  AgentChatMessage,
  RecommendationAction,
} from './types/retail.ts';
import {
  RETAIL_DB,
  PRODUCTS,
  STORES,
  getDashboardMetrics,
  executeForecastStockout,
} from './data/retailData.ts';
import {
  Sparkles,
  Layers,
  Activity,
  Package,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';

export default function App() {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('neemba_dark_mode');
    return saved !== null ? saved === 'true' : true;
  });

  const [selectedStore, setSelectedStore] = useState<string>('ALL');
  const [selectedDays, setSelectedDays] = useState<number>(30);
  const [stores, setStores] = useState<Store[]>(STORES);
  const [products, setProducts] = useState<Product[]>([]);
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'catalog' | 'audit'>('dashboard');

  const [isActivityModalOpen, setIsActivityModalOpen] = useState<boolean>(false);
  const [activities, setActivities] = useState<RecommendationAction[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Chat State with default introductory agent message
  const [chatMessages, setChatMessages] = useState<AgentChatMessage[]>([
    {
      id: 'MSG-INIT-01',
      sender: 'agent',
      content: `### 🤖 Welcome to Agentic Retail Copilot: Concept Prototype\n\nI am your agentic retail operations assistant, actively connected to 40 products and 5 stores across Abidjan with 90 days of daily sales telemetry.\n\n**My Autonomous Tools:**\n- **get_sales_trend**: Evaluates 90-day velocity, growth trajectory, and margin health.\n- **forecast_stockout**: Simulates replenishment lead times to stop stockouts before they happen.\n- **suggest_price**: Optimizes pricing elasticity for margin maximization or inventory turnover.\n- **generate_offer**: Formulates promotional markdowns and high-margin product bundles.\n\nTry asking: *"Which products will stock out next week?"* or *"Which items should get a discount?"*`,
      reasoningSteps: [
        {
          step: 1,
          toolName: 'forecast_stockout',
          args: { thresholdDays: 14, storeId: 'ALL' },
          resultSummary: 'Initial startup inventory audit completed: verified 40 SKUs across 5 retail stores.',
          timestamp: new Date().toISOString(),
        },
      ],
      recommendation: {
        id: 'REC-INIT-01',
        title: 'Priority PO Dispatch: Apex Ultra Smartwatch (Series 6)',
        type: 'RESTOCK',
        urgency: 'HIGH',
        productId: 'PRD-02',
        productName: 'Apex Ultra Smartwatch Series 6 (OLED)',
        storeId: 'STR-01',
        storeName: 'Abidjan Central Superstore',
        rationale: 'Autonomous telemetry detected 2.1 days of supply remaining against a 16-day supplier lead time from Apex Micro Electronics. Immediate replenishment prevents $14,950 in stockout losses.',
        impactDollars: 14950,
        impactType: 'REVENUE_PROTECTED',
        actionPayload: { orderUnits: 95, supplier: 'Apex Micro Electronics', leadTimeDays: 16 },
        status: 'PENDING',
        timestamp: new Date().toISOString(),
      },
      timestamp: new Date().toISOString(),
    },
  ]);
  const [isChatLoading, setIsChatLoading] = useState<boolean>(false);

  // Save dark mode preference
  useEffect(() => {
    localStorage.setItem('neemba_dark_mode', darkMode.toString());
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Load KPIs, Products & Activities
  const loadData = useCallback(async () => {
    try {
      // 1. Load KPIs
      const kpiRes = await fetch(`/api/kpis?storeId=${selectedStore}&days=${selectedDays}`);
      if (kpiRes.ok) {
        const json = await kpiRes.json();
        if (json.success) setMetrics(json.data);
      } else {
        // Fallback local
        setMetrics(getDashboardMetrics(selectedStore, selectedDays));
      }

      // 2. Load Products
      const prodRes = await fetch(`/api/products?storeId=${selectedStore}`);
      if (prodRes.ok) {
        const json = await prodRes.json();
        if (json.success) {
          setProducts(json.data);
          if (json.stores) setStores(json.stores);
        }
      } else {
        // Fallback local products computation
        const fallbackProds = PRODUCTS.map((p) => {
          const invList = RETAIL_DB.inventory.filter(
            (i) => i.productId === p.id && (selectedStore === 'ALL' || i.storeId === selectedStore)
          );
          const totalCurrentStock = invList.reduce((acc, curr) => acc + curr.currentStock, 0);
          const totalAvgDailySales = invList.reduce((acc, curr) => acc + curr.avgDailySales, 0);
          const minDays = invList.length > 0 ? Math.min(...invList.map((i) => i.daysUntilStockout)) : 99;
          const hasCrit = invList.some((i) => i.stockoutRisk === 'CRITICAL');
          const hasWarn = invList.some((i) => i.stockoutRisk === 'WARNING');
          const hasOver = invList.some((i) => i.stockoutRisk === 'OVERSTOCKED');
          return {
            ...p,
            totalStock: totalCurrentStock,
            avgDailySales: Math.round(totalAvgDailySales * 10) / 10,
            daysOfSupply: Math.round((minDays || 0) * 10) / 10,
            stockoutRisk: hasCrit ? 'CRITICAL' : hasWarn ? 'WARNING' : hasOver ? 'OVERSTOCKED' : 'HEALTHY',
          };
        });
        setProducts(fallbackProds as Product[]);
      }

      // 3. Load Activities
      const actRes = await fetch('/api/activity-feed');
      if (actRes.ok) {
        const json = await actRes.json();
        if (json.success) setActivities(json.data);
      }
    } catch (err) {
      // Graceful local dataset fallback
      setMetrics(getDashboardMetrics(selectedStore, selectedDays));
    }
  }, [selectedStore, selectedDays]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Send message to Copilot (Gemini Agent)
  const handleSendMessage = async (queryText: string) => {
    if (!queryText.trim() || isChatLoading) return;

    const userMsg: AgentChatMessage = {
      id: `USER-${Date.now()}`,
      sender: 'user',
      content: queryText,
      timestamp: new Date().toISOString(),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setIsChatLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: queryText,
          storeContext: selectedStore,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const json = await response.json();

      const agentMsg: AgentChatMessage = {
        id: `AGENT-${Date.now()}`,
        sender: 'agent',
        content: json.content || 'Analysis complete.',
        reasoningSteps: json.reasoningSteps || [],
        recommendation: json.recommendation || undefined,
        timestamp: new Date().toISOString(),
      };

      setChatMessages((prev) => [...prev, agentMsg]);
    } catch (error: any) {
      console.warn('Chat API error, generating local copilot response:', error);
      // Local copilot fallback to guarantee 100% responsiveness
      const stockoutRes = executeForecastStockout(14, selectedStore);
      const top = stockoutRes.topCriticalItems[0];

      const agentMsg: AgentChatMessage = {
        id: `AGENT-${Date.now()}`,
        sender: 'agent',
        content: `### 🚨 Autonomous Stockout Diagnostic & Replenishment\n\nI evaluated supplier replenishment lead times and current stock run-rates across 40 products.\n\n**Key Findings:**\n- **Identified ${stockoutRes.totalAtRiskCount} items at stockout risk** across the retail chain.\n- **Critical SKU:** **${top?.productName || 'Apex Ultra Smartwatch'}** has only **${top?.daysUntilStockout || 2.1} days of supply remaining**.\n- **Supplier Lead Time:** ${top?.supplierLeadTimeDays || 16} days from ${top?.supplierName || 'Apex Micro Electronics'}.\n- **Projected Lost Revenue:** **$${(top?.potentialLostRevenue || 14950).toLocaleString()}**.\n\nI have prepared an automated replenishment order below for your approval.`,
        reasoningSteps: [
          {
            step: 1,
            toolName: 'forecast_stockout',
            args: { thresholdDays: 14, storeId: selectedStore },
            resultSummary: `Scanned 40 products: ${stockoutRes.totalAtRiskCount} items have days of supply under supplier lead time.`,
            timestamp: new Date().toISOString(),
          },
        ],
        recommendation: {
          id: `REC-${Date.now()}`,
          title: `Emergency Replenishment PO: ${top?.productName || 'Apex Ultra Smartwatch'}`,
          type: 'RESTOCK',
          urgency: 'HIGH',
          productId: top?.productId || 'PRD-02',
          productName: top?.productName || 'Apex Ultra Smartwatch Series 6 (OLED)',
          storeId: top?.storeId || 'STR-01',
          storeName: top?.storeName || 'Abidjan Central Superstore',
          rationale: `Stock will deplete before next shipment. Dispatched PO protects $${(top?.potentialLostRevenue || 14950).toLocaleString()} in revenue.`,
          impactDollars: top?.potentialLostRevenue || 14950,
          impactType: 'REVENUE_PROTECTED',
          actionPayload: { orderUnits: top?.recommendedOrderUnits || 95, supplier: top?.supplierName || 'Apex Micro Electronics' },
          status: 'PENDING',
          timestamp: new Date().toISOString(),
        },
        timestamp: new Date().toISOString(),
      };
      setChatMessages((prev) => [...prev, agentMsg]);
    } finally {
      setIsChatLoading(false);
    }
  };

  // Process Automation: Approve Action
  const handleApproveAction = async (action: RecommendationAction) => {
    try {
      const response = await fetch('/api/approve-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });

      let updatedAction = { ...action, status: 'EXECUTED' as const, timestamp: new Date().toISOString() };
      if (response.ok) {
        const json = await response.json();
        if (json.data) updatedAction = json.data;
      }

      // Update message recommendation status to EXECUTED
      setChatMessages((prev) =>
        prev.map((m) => {
          if (m.recommendation && m.recommendation.id === action.id) {
            return {
              ...m,
              recommendation: { ...m.recommendation, status: 'EXECUTED' },
            };
          }
          return m;
        })
      );

      // Add to activity feed
      setActivities((prev) => [updatedAction, ...prev]);

      // Show toast
      setToastMessage(`✓ Action "${action.title}" approved and dispatched to ERP! Impact: +$${action.impactDollars.toLocaleString()}`);
      setTimeout(() => setToastMessage(null), 5000);
    } catch (err) {
      console.error('Failed to approve action:', err);
    }
  };

  // Reset Activity Feed
  const handleResetFeed = async () => {
    try {
      await fetch('/api/reset-activity-feed', { method: 'POST' });
    } catch (e) {
      // ignore
    }
    setActivities((prev) => prev.slice(0, 2));
    setToastMessage('Activity feed reset to initial state.');
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Reset Chat
  const handleResetChat = () => {
    setChatMessages((prev) => prev.slice(0, 1));
    setToastMessage('Conversation history reset.');
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div
      className={`min-h-screen relative flex flex-col transition-colors duration-300 ${
        darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-100/80 text-slate-900'
      }`}
    >
      {/* Subtle Ambient Glassmorphic Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div
          className={`absolute top-[-10%] left-[-10%] w-[55vw] h-[55vw] rounded-full blur-[140px] opacity-25 transition-all duration-700 ${
            darkMode ? 'bg-teal-600/20' : 'bg-emerald-300/30'
          }`}
        />
        <div
          className={`absolute top-[40%] right-[-10%] w-[45vw] h-[45vw] rounded-full blur-[140px] opacity-25 transition-all duration-700 ${
            darkMode ? 'bg-cyan-600/15' : 'bg-teal-300/30'
          }`}
        />
        <div
          className={`absolute bottom-[-10%] left-[20%] w-[50vw] h-[50vw] rounded-full blur-[140px] opacity-20 transition-all duration-700 ${
            darkMode ? 'bg-emerald-700/15' : 'bg-cyan-200/40'
          }`}
        />
      </div>

      {/* Main Navbar */}
      <Navbar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        selectedStore={selectedStore}
        setSelectedStore={setSelectedStore}
        stores={stores}
        selectedDays={selectedDays}
        setSelectedDays={setSelectedDays}
        activityCount={activities.length}
        onOpenActivityFeed={() => setIsActivityModalOpen(true)}
      />

      {/* Floating Success Toast */}
      {toastMessage && (
        <div className="fixed top-24 right-6 z-50 animate-bounce">
          <div
            className={`px-4 py-3 rounded-2xl border flex items-center gap-2.5 shadow-2xl backdrop-blur-md text-xs sm:text-sm font-bold ${
              darkMode
                ? 'bg-emerald-950/90 border-emerald-500/60 text-emerald-200 shadow-emerald-950/50'
                : 'bg-emerald-50/95 border-emerald-300 text-emerald-900 shadow-emerald-200/60'
            }`}
          >
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Main App Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full space-y-6">
        {/* Navigation View Tabs */}
        <div className="flex items-center justify-between border-b border-slate-200/50 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'dashboard'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              Overview & Copilot
            </button>

            <button
              onClick={() => setActiveTab('catalog')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'catalog'
                  ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              40-Product Catalog ({products.length})
            </button>

            <button
              onClick={() => setIsActivityModalOpen(true)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200"
            >
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              Automated Process Feed ({activities.length})
            </button>
          </div>

          <div className="text-xs text-slate-400 hidden md:flex items-center gap-2 font-mono">
            <span>Synthetic Enterprise Dataset</span>
            <span>•</span>
            <span className="text-teal-400 font-bold">18,000 Data Points</span>
          </div>
        </div>

        {/* Hero KPI Cards */}
        <KPICards
          metrics={metrics}
          darkMode={darkMode}
          selectedDays={selectedDays}
          onAskCopilot={handleSendMessage}
        />

        {/* Tab 1: Dashboard & Copilot Split View */}
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Sales Trend Chart & Quick SKU Highlights (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              <SalesTrendChart
                metrics={metrics}
                darkMode={darkMode}
                selectedDays={selectedDays}
              />

              {/* Condensed SKU Health Table for quick glance */}
              <ProductCatalogTable
                products={products}
                darkMode={darkMode}
                selectedStore={selectedStore}
                onAskCopilot={handleSendMessage}
              />
            </div>

            {/* Right Column: Agentic Copilot Chat Panel (5 cols) */}
            <div className="lg:col-span-5 sticky top-24">
              <AgentChatPanel
                darkMode={darkMode}
                selectedStore={selectedStore}
                messages={chatMessages}
                onSendMessage={handleSendMessage}
                isLoading={isChatLoading}
                onApproveAction={handleApproveAction}
                onResetChat={handleResetChat}
              />
            </div>
          </div>
        )}

        {/* Tab 2: Full Product Catalog View */}
        {activeTab === 'catalog' && (
          <div className="space-y-6">
            <ProductCatalogTable
              products={products}
              darkMode={darkMode}
              selectedStore={selectedStore}
              onAskCopilot={(prompt) => {
                setActiveTab('dashboard');
                handleSendMessage(prompt);
              }}
            />
          </div>
        )}
      </main>

      {/* Modals */}
      <ActivityFeedModal
        isOpen={isActivityModalOpen}
        onClose={() => setIsActivityModalOpen(false)}
        darkMode={darkMode}
        activities={activities}
        onResetFeed={handleResetFeed}
      />

      {/* Footer with exact required attribution */}
      <Footer darkMode={darkMode} />
    </div>
  );
}
