/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Neemba AI NewGen: Retail Copilot - TypeScript Types
 */

export interface Product {
  id: string;
  sku: string;
  name: string;
  category: 'Electronics' | 'Groceries' | 'Home & Kitchen' | 'Apparel' | 'Personal Care';
  unitCost: number;
  price: number;
  marginRate: number;
  supplierLeadTimeDays: number;
  supplierName: string;
  reorderPoint: number;
  safetyStock: number;
  packSize: number;
  totalStock?: number;
  avgDailySales?: number;
  daysOfSupply?: number;
  stockoutRisk?: 'CRITICAL' | 'WARNING' | 'HEALTHY' | 'OVERSTOCKED';
}

export interface Store {
  id: string;
  name: string;
  code: string;
  city: string;
  type: 'Flagship' | 'Business Mall' | 'Hypermarket' | 'Express' | 'Regional Hub';
  trafficIndex: number;
}

export interface RecommendationAction {
  id: string;
  title: string;
  type: 'RESTOCK' | 'MARKDOWN' | 'PRICE_INCREASE' | 'BUNDLE_PROMO' | 'TRANSFER';
  urgency: 'HIGH' | 'MEDIUM' | 'LOW';
  productId: string;
  productName: string;
  storeId: string;
  storeName: string;
  rationale: string;
  impactDollars: number;
  impactType: 'REVENUE_PROTECTED' | 'MARGIN_UPLIFT' | 'CASH_FREED' | 'SALES_GROWTH';
  actionPayload: Record<string, any>;
  status: 'PENDING' | 'APPROVED' | 'EXECUTED';
  timestamp: string;
}

export interface ReasoningStep {
  step: number;
  toolName: string;
  args: Record<string, any>;
  resultSummary: string;
  timestamp: string;
}

export interface AgentChatMessage {
  id: string;
  sender: 'user' | 'agent';
  content: string;
  reasoningSteps?: ReasoningStep[];
  recommendation?: RecommendationAction;
  timestamp: string;
}

export interface DashboardMetrics {
  totalRevenue: number;
  totalCost: number;
  totalGrossMargin: number;
  grossMarginPercent: number;
  totalUnits: number;
  criticalStockoutCount: number;
  warningStockoutCount: number;
  overstockedCount: number;
  totalInventoryUnits: number;
  totalInventoryValue: number;
  chartSeries: Array<{
    date: string;
    revenue: number;
    margin: number;
    units: number;
  }>;
  categoryBreakdown: Array<{
    category: string;
    revenue: number;
    margin: number;
    units: number;
  }>;
}
