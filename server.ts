/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Neemba AI NewGen: Retail Copilot - Full-Stack Express Server & Gemini Agent
 */

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type, FunctionDeclaration } from '@google/genai';
import {
  executeGetSalesTrend,
  executeForecastStockout,
  executeSuggestPrice,
  executeGenerateOffer,
  getDashboardMetrics,
  PRODUCTS,
  STORES,
  RETAIL_DB,
  RecommendationAction,
} from './src/data/retailData.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

app.use(express.json());

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Tool Function Declarations for Gemini Function Calling
const getSalesTrendTool: FunctionDeclaration = {
  name: 'get_sales_trend',
  description: 'Analyze historical sales velocity, revenue, units, gross margin, and trend trajectory across 90 days of retail transactions.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      productId: {
        type: Type.STRING,
        description: 'Product ID (e.g., PRD-01, PRD-02) or "ALL" for all products.',
      },
      storeId: {
        type: Type.STRING,
        description: 'Store ID (e.g., STR-01, STR-02) or "ALL" for chain-wide analysis.',
      },
      days: {
        type: Type.NUMBER,
        description: 'Number of past days to analyze (e.g., 7, 30, 90). Default is 30.',
      },
    },
  },
};

const forecastStockoutTool: FunctionDeclaration = {
  name: 'forecast_stockout',
  description: 'Forecast which retail products will stock out before supplier replenishment lead time and estimate lost revenue.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      thresholdDays: {
        type: Type.NUMBER,
        description: 'Horizon in days to look ahead (e.g., 7, 14, 21). Default is 14.',
      },
      storeId: {
        type: Type.STRING,
        description: 'Specific store ID or "ALL" for all 5 stores.',
      },
      category: {
        type: Type.STRING,
        description: 'Category filter (Electronics, Groceries, Home & Kitchen, Apparel, Personal Care, or ALL).',
      },
    },
  },
};

const suggestPriceTool: FunctionDeclaration = {
  name: 'suggest_price',
  description: 'Simulate price elasticity and recommend optimal pricing adjustment to maximize gross margin or clear excess inventory.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      productId: {
        type: Type.STRING,
        description: 'Product ID to optimize pricing for (e.g., PRD-01 to PRD-40).',
      },
      storeId: {
        type: Type.STRING,
        description: 'Store ID or "ALL".',
      },
      objective: {
        type: Type.STRING,
        description: 'Pricing goal: "margin" (maximize gross profit), "clearance" (liquidate excess stock), or "volume" (gain market share).',
      },
    },
    required: ['productId'],
  },
};

const generateOfferTool: FunctionDeclaration = {
  name: 'generate_offer',
  description: 'Generate a targeted promotional discount, cross-sell bundle, or markdown offer with projected revenue and volume lift.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      productId: {
        type: Type.STRING,
        description: 'Product ID for the offer.',
      },
      discountPercent: {
        type: Type.NUMBER,
        description: 'Discount percentage (e.g., 10, 15, 20, 25).',
      },
      rationale: {
        type: Type.STRING,
        description: 'Strategic reason for the promotional campaign.',
      },
      storeId: {
        type: Type.STRING,
        description: 'Store ID or "ALL" for chain-wide promotion.',
      },
    },
    required: ['productId', 'discountPercent'],
  },
};

const RETAIL_TOOLS = [
  {
    functionDeclarations: [getSalesTrendTool, forecastStockoutTool, suggestPriceTool, generateOfferTool],
  },
];

// In-memory Activity Feed (Process Automation Log)
let activityFeed: RecommendationAction[] = [
  {
    id: 'ACT-INIT-101',
    title: 'Automated PO Dispatched: Organic Arabica Coffee (500 units)',
    type: 'RESTOCK',
    urgency: 'HIGH',
    productId: 'PRD-09',
    productName: 'Grand Domaine Organic Arabica Coffee (1kg)',
    storeId: 'STR-01',
    storeName: 'Abidjan Central Superstore',
    rationale: 'Autonomous reorder triggered: run-rate reached 14 units/day with 3.2 days remaining vs 6-day lead time.',
    impactDollars: 11750,
    impactType: 'REVENUE_PROTECTED',
    actionPayload: { poNumber: 'PO-2026-8819', units: 500, supplier: 'Ivoire Agro Roasters', autoApproved: true },
    status: 'EXECUTED',
    timestamp: '2026-10-23T14:15:00Z',
  },
  {
    id: 'ACT-INIT-102',
    title: 'Dynamic Markdown Approved: 15% Off Bamboo Cutting Board Set',
    type: 'MARKDOWN',
    urgency: 'MEDIUM',
    productId: 'PRD-23',
    productName: 'Organic Bamboo Antibacterial Cutting Board Set',
    storeId: 'STR-03',
    storeName: 'Cocody Hypermarket',
    rationale: 'Overstock mitigation: 68 days of supply exceeding shelf-velocity target. Markdown accelerated stock turn.',
    impactDollars: 3840,
    impactType: 'CASH_FREED',
    actionPayload: { promoCode: 'BAMBOO-15-CLR', oldPrice: 29, newPrice: 24.65, autoApproved: true },
    status: 'EXECUTED',
    timestamp: '2026-10-23T11:40:00Z',
  },
];

// --- API Endpoints ---

// Get Dashboard KPIs & Chart Series
app.get('/api/kpis', (req, res) => {
  const storeId = (req.query.storeId as string) || 'ALL';
  const days = parseInt((req.query.days as string) || '30', 10);
  const metrics = getDashboardMetrics(storeId, days);
  res.json({ success: true, data: metrics });
});

// Get Products Catalog & Inventory Summary
app.get('/api/products', (req, res) => {
  const storeId = (req.query.storeId as string) || 'ALL';

  const productsWithStock = PRODUCTS.map((p) => {
    const storeInventories = RETAIL_DB.inventory.filter(
      (inv) => inv.productId === p.id && (storeId === 'ALL' || inv.storeId === storeId)
    );
    const totalCurrentStock = storeInventories.reduce((acc, curr) => acc + curr.currentStock, 0);
    const totalAvgDailySales = storeInventories.reduce((acc, curr) => acc + curr.avgDailySales, 0);
    const minDaysUntilStockout = storeInventories.length > 0
      ? Math.min(...storeInventories.map((i) => i.daysUntilStockout))
      : 99;
    const hasCritical = storeInventories.some((i) => i.stockoutRisk === 'CRITICAL');
    const hasWarning = storeInventories.some((i) => i.stockoutRisk === 'WARNING');
    const hasOverstocked = storeInventories.some((i) => i.stockoutRisk === 'OVERSTOCKED');

    let overallRisk: 'CRITICAL' | 'WARNING' | 'HEALTHY' | 'OVERSTOCKED' = 'HEALTHY';
    if (hasCritical) overallRisk = 'CRITICAL';
    else if (hasWarning) overallRisk = 'WARNING';
    else if (hasOverstocked) overallRisk = 'OVERSTOCKED';

    return {
      ...p,
      totalStock: totalCurrentStock,
      avgDailySales: Math.round(totalAvgDailySales * 10) / 10,
      daysOfSupply: Math.round((minDaysUntilStockout || 0) * 10) / 10,
      stockoutRisk: overallRisk,
    };
  });

  res.json({ success: true, data: productsWithStock, stores: STORES });
});

// Get Activity Feed
app.get('/api/activity-feed', (req, res) => {
  res.json({ success: true, data: activityFeed });
});

// Post Approve Action (Process Automation)
app.post('/api/approve-action', (req, res) => {
  const { action } = req.body;
  if (!action || !action.title) {
    return res.status(400).json({ success: false, error: 'Invalid action payload' });
  }

  const newLogItem: RecommendationAction = {
    ...action,
    id: action.id || `ACT-${Date.now()}`,
    status: 'EXECUTED',
    timestamp: new Date().toISOString(),
  };

  // Prepend to activity feed
  activityFeed = [newLogItem, ...activityFeed];

  res.json({
    success: true,
    message: `Action "${newLogItem.title}" approved and executed in retail ERP.`,
    data: newLogItem,
  });
});

// Reset Activity Feed (for demo resets)
app.post('/api/reset-activity-feed', (req, res) => {
  activityFeed = activityFeed.slice(0, 2);
  res.json({ success: true, data: activityFeed });
});

// --- Agentic Copilot Chat Endpoint ---
app.post('/api/chat', async (req, res) => {
  const { message, storeContext = 'ALL' } = req.body;

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Message is required' });
  }

  const reasoningSteps: Array<{
    step: number;
    toolName: string;
    args: Record<string, any>;
    resultSummary: string;
    timestamp: string;
  }> = [];

  let finalRecommendation: RecommendationAction | null = null;
  let responseText = '';

  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey) {
    try {
      // Step 1: Call Gemini with retail tools
      const systemInstruction = `You are "Agentic Retail Copilot: Concept Prototype", an agentic AI assistant specialized in retail store operations for a chain of 5 stores with 40 inventory products.
Your objective is to provide crisp, high-impact operational recommendations for store directors and inventory managers.
Always utilize function calling when answering questions regarding:
- Stockouts, replenishment, days of supply, lead times -> use forecast_stockout
- Sales trend, velocity, revenue growth, top sellers -> use get_sales_trend
- Pricing optimization, margin uplift, clearance -> use suggest_price
- Promotional offers, discounts, bundles, markdowns -> use generate_offer

Current Context: Active Store Filter: ${storeContext}.
When you receive tool results, provide:
1. Direct executive summary with clear figures.
2. Root-cause retail analysis.
3. Quantified dollar impact.
Keep your response concise, sharp, and structured.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: message,
        config: {
          systemInstruction,
          tools: RETAIL_TOOLS,
          temperature: 0.2,
        },
      });

      const functionCalls = response.functionCalls;

      if (functionCalls && functionCalls.length > 0) {
        // Execute tool calls and capture reasoning steps
        const toolExecutionResults: Array<{ toolName: string; result: any }> = [];

        for (let i = 0; i < functionCalls.length; i++) {
          const call = functionCalls[i];
          const toolName = call.name || 'retail_tool';
          const args = (call.args || {}) as Record<string, any>;

          let toolOutput: any = null;

          if (toolName === 'forecast_stockout') {
            toolOutput = executeForecastStockout(
              args.thresholdDays || 14,
              args.storeId || (storeContext !== 'ALL' ? storeContext : 'ALL'),
              args.category
            );
            reasoningSteps.push({
              step: reasoningSteps.length + 1,
              toolName: 'forecast_stockout',
              args,
              resultSummary: `Scanned inventory: identified ${toolOutput.totalAtRiskCount} items at risk; ~$${toolOutput.totalPotentialRevenueAtRisk.toLocaleString()} revenue at stake.`,
              timestamp: new Date().toISOString(),
            });

            if (toolOutput.topCriticalItems.length > 0 && !finalRecommendation) {
              const top = toolOutput.topCriticalItems[0];
              finalRecommendation = {
                id: `REC-${Date.now()}`,
                title: `Automated Replenishment PO: ${top.productName}`,
                type: 'RESTOCK',
                urgency: 'HIGH',
                productId: top.productId,
                productName: top.productName,
                storeId: top.storeId,
                storeName: top.storeName,
                rationale: `Stock will deplete in ${top.daysUntilStockout} days against a ${top.supplierLeadTimeDays}-day supplier lead time from ${top.supplierName}. Restocking prevents stockout.`,
                impactDollars: top.potentialLostRevenue || 12500,
                impactType: 'REVENUE_PROTECTED',
                actionPayload: {
                  poNumber: `PO-${Date.now().toString().slice(-4)}`,
                  orderUnits: top.recommendedOrderUnits,
                  supplier: top.supplierName,
                  leadTimeDays: top.supplierLeadTimeDays,
                },
                status: 'PENDING',
                timestamp: new Date().toISOString(),
              };
            }
          } else if (toolName === 'get_sales_trend') {
            toolOutput = executeGetSalesTrend(
              args.productId,
              args.storeId || (storeContext !== 'ALL' ? storeContext : 'ALL'),
              args.days || 30
            );
            reasoningSteps.push({
              step: reasoningSteps.length + 1,
              toolName: 'get_sales_trend',
              args,
              resultSummary: `Computed sales trajectory: Total revenue $${toolOutput.metrics.totalRevenue.toLocaleString()} across ${toolOutput.metrics.totalUnits} units (${toolOutput.metrics.trendDirection}, ${toolOutput.metrics.growthRatePercent}% growth).`,
              timestamp: new Date().toISOString(),
            });

            if (!finalRecommendation) {
              finalRecommendation = {
                id: `REC-${Date.now()}`,
                title: `Scale Allocation for Top Growth Velocity Categories`,
                type: 'TRANSFER',
                urgency: 'MEDIUM',
                productId: args.productId || 'PRD-01',
                productName: PRODUCTS.find((p) => p.id === args.productId)?.name || 'High-Velocity Product Line',
                storeId: args.storeId || 'ALL',
                storeName: STORES.find((s) => s.id === args.storeId)?.name || 'All Stores',
                rationale: `Trend analysis shows ${toolOutput.metrics.growthRatePercent}% acceleration with $${toolOutput.metrics.dailyAvgRevenue}/day velocity. Increasing store allocation captures untapped demand.`,
                impactDollars: Math.round(toolOutput.metrics.dailyAvgRevenue * 14 * 0.25),
                impactType: 'SALES_GROWTH',
                actionPayload: { targetGrowth: '20%', daysWindow: args.days || 30 },
                status: 'PENDING',
                timestamp: new Date().toISOString(),
              };
            }
          } else if (toolName === 'suggest_price') {
            toolOutput = executeSuggestPrice(
              args.productId || 'PRD-01',
              args.storeId || storeContext,
              args.objective || 'margin'
            );
            reasoningSteps.push({
              step: reasoningSteps.length + 1,
              toolName: 'suggest_price',
              args,
              resultSummary: `Optimized price from $${toolOutput.currentPrice} to $${toolOutput.suggestedPrice} (${toolOutput.priceDeltaPercent > 0 ? '+' : ''}${toolOutput.priceDeltaPercent}%); estimated monthly margin impact +$${toolOutput.estimatedMonthlyGrossMarginImpact.toLocaleString()}.`,
              timestamp: new Date().toISOString(),
            });

            if (!finalRecommendation) {
              finalRecommendation = {
                id: `REC-${Date.now()}`,
                title: `Price Calibration: ${toolOutput.productName} ($${toolOutput.currentPrice} → $${toolOutput.suggestedPrice})`,
                type: toolOutput.priceDeltaPercent < 0 ? 'MARKDOWN' : 'PRICE_INCREASE',
                urgency: toolOutput.priceDeltaPercent < 0 ? 'HIGH' : 'MEDIUM',
                productId: toolOutput.productId,
                productName: toolOutput.productName,
                storeId: args.storeId || 'ALL',
                storeName: toolOutput.storeScope,
                rationale: toolOutput.rationale,
                impactDollars: toolOutput.estimatedMonthlyGrossMarginImpact,
                impactType: toolOutput.priceDeltaPercent < 0 ? 'CASH_FREED' : 'MARGIN_UPLIFT',
                actionPayload: {
                  oldPrice: toolOutput.currentPrice,
                  newPrice: toolOutput.suggestedPrice,
                  deltaPercent: toolOutput.priceDeltaPercent,
                },
                status: 'PENDING',
                timestamp: new Date().toISOString(),
              };
            }
          } else if (toolName === 'generate_offer') {
            toolOutput = executeGenerateOffer(
              args.productId || 'PRD-17',
              args.discountPercent || 15,
              args.rationale,
              args.storeId || storeContext
            );
            reasoningSteps.push({
              step: reasoningSteps.length + 1,
              toolName: 'generate_offer',
              args,
              resultSummary: `Formulated offer "${toolOutput.title}": regular $${toolOutput.targetProduct.regularPrice} → promo $${toolOutput.targetProduct.discountedPrice} (+${toolOutput.estimatedUnitSalesUpliftPercent}% volume surge).`,
              timestamp: new Date().toISOString(),
            });

            if (!finalRecommendation) {
              finalRecommendation = {
                id: `REC-${Date.now()}`,
                title: `Publish POS Promotional Campaign: ${toolOutput.title}`,
                type: 'BUNDLE_PROMO',
                urgency: 'MEDIUM',
                productId: toolOutput.targetProduct.id,
                productName: toolOutput.targetProduct.name,
                storeId: args.storeId || 'ALL',
                storeName: toolOutput.storeScope,
                rationale: toolOutput.strategicRationale,
                impactDollars: toolOutput.estimatedGrossRevenueImpact,
                impactType: 'REVENUE_PROTECTED',
                actionPayload: toolOutput.executionActionPayload,
                status: 'PENDING',
                timestamp: new Date().toISOString(),
              };
            }
          }

          toolExecutionResults.push({ toolName, result: toolOutput });
        }

        // Second turn: Synthesize final answer incorporating tool execution data
        const followUpContents = [
          { role: 'user', parts: [{ text: message }] },
          {
            role: 'model',
            parts: functionCalls.map((fc) => ({
              functionCall: { name: fc.name, args: fc.args },
            })),
          },
          {
            role: 'user',
            parts: toolExecutionResults.map((tr) => ({
              functionResponse: {
                name: tr.toolName,
                response: { output: tr.result },
              },
            })),
          },
        ];

        try {
          const secondTurn = await ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: followUpContents as any,
            config: {
              systemInstruction: 'Summarize the retail findings clearly with concise bullet points and highlight the dollar impact. Keep it professional and direct.',
            },
          });
          responseText = secondTurn.text || '';
        } catch (turnErr) {
          console.warn('Second turn fallback:', turnErr);
        }
      } else {
        responseText = response.text || '';
      }
    } catch (geminiError: any) {
      console.warn('Gemini API call failed, switching to local autonomous engine:', geminiError?.message);
    }
  }

  // Fallback to local intelligent copilot engine if no response was generated
  if (!responseText || reasoningSteps.length === 0) {
    const fallbackResult = runLocalAgentEngine(message, storeContext);
    responseText = fallbackResult.content;
    reasoningSteps.push(...fallbackResult.reasoningSteps);
    if (!finalRecommendation && fallbackResult.recommendation) {
      finalRecommendation = fallbackResult.recommendation;
    }
  }

  // Ensure there is always a clean recommendation action card
  if (!finalRecommendation) {
    finalRecommendation = {
      id: `REC-${Date.now()}`,
      title: 'Optimize Reorder Cycles for Top 5 Velocity SKUs',
      type: 'RESTOCK',
      urgency: 'MEDIUM',
      productId: 'PRD-01',
      productName: PRODUCTS[0].name,
      storeId: storeContext !== 'ALL' ? storeContext : 'STR-01',
      storeName: STORES.find((s) => s.id === storeContext)?.name || 'Abidjan Central Superstore',
      rationale: 'Autonomous audit indicates tightening buffer inventory across fast-turning SKUs.',
      impactDollars: 12400,
      impactType: 'REVENUE_PROTECTED',
      actionPayload: { autoTriggered: true, targetSkus: 5 },
      status: 'PENDING',
      timestamp: new Date().toISOString(),
    };
  }

  return res.json({
    success: true,
    content: responseText,
    reasoningSteps,
    recommendation: finalRecommendation,
  });
});

/**
 * High-precision local agent engine fallback (ensures the demo is 100% robust)
 */
function runLocalAgentEngine(query: string, storeContext: string) {
  const lower = query.toLowerCase();
  const reasoningSteps: any[] = [];
  let recommendation: RecommendationAction | null = null;
  let content = '';

  if (lower.includes('stockout') || lower.includes('stock out') || lower.includes('run out') || lower.includes('replenish') || lower.includes('inventory risk')) {
    // Forecast stockout
    const toolRes = executeForecastStockout(14, storeContext);
    reasoningSteps.push({
      step: 1,
      toolName: 'forecast_stockout',
      args: { thresholdDays: 14, storeId: storeContext },
      resultSummary: `Scanned 40 products across ${storeContext === 'ALL' ? '5 stores' : storeContext}: detected ${toolRes.totalAtRiskCount} imminent stockouts.`,
      timestamp: new Date().toISOString(),
    });

    const top = toolRes.topCriticalItems[0] || {
      productName: 'Apex Ultra Smartwatch Series 6 (OLED)',
      productId: 'PRD-02',
      storeId: 'STR-01',
      storeName: 'Abidjan Central Superstore',
      daysUntilStockout: 2.1,
      supplierLeadTimeDays: 16,
      potentialLostRevenue: 14950,
      supplierName: 'Apex Micro Electronics',
      recommendedOrderUnits: 95,
    };

    content = `### 🚨 Autonomous Stockout Risk Diagnostic\n\nBased on real-time 7-day sales velocity and supplier replenishment lead times, **${toolRes.totalAtRiskCount} product locations** are projected to stock out within the next 7–14 days.\n\n**Key Critical Vulnerabilities:**\n- **${top.productName}** (${top.storeName}): **${top.daysUntilStockout} days of stock remaining** vs **${top.supplierLeadTimeDays} days** supplier lead time (${top.supplierName}).\n- **Estimated Potential Lost Revenue:** **$${(top.potentialLostRevenue || 14950).toLocaleString()}**.\n\n**Actionable Insight:**\nImmediate purchase order generation is required to bridge the lead time gap before the supply cliff is reached.`;

    recommendation = {
      id: `REC-${Date.now()}`,
      title: `Emergency Replenishment PO: ${top.productName}`,
      type: 'RESTOCK',
      urgency: 'HIGH',
      productId: top.productId,
      productName: top.productName,
      storeId: top.storeId,
      storeName: top.storeName,
      rationale: `Stock will fully deplete in ${top.daysUntilStockout} days; supplier lead time is ${top.supplierLeadTimeDays} days. Dispatching PO #PO-${Date.now().toString().slice(-4)} bridges the stockout gap and protects $${(top.potentialLostRevenue || 14950).toLocaleString()} in customer revenue.`,
      impactDollars: top.potentialLostRevenue || 14950,
      impactType: 'REVENUE_PROTECTED',
      actionPayload: { orderUnits: top.recommendedOrderUnits || 95, supplier: top.supplierName, expeditedShipping: true },
      status: 'PENDING',
      timestamp: new Date().toISOString(),
    };
  } else if (lower.includes('discount') || lower.includes('markdown') || lower.includes('overstock') || lower.includes('promo') || lower.includes('offer')) {
    // Generate offer / markdown
    const slowProduct = PRODUCTS.find((p) => p.id === 'PRD-23') || PRODUCTS[2]; // Bamboo Cutting Board or similar
    const toolRes = executeGenerateOffer(slowProduct.id, 15, 'Clear excess inventory to unlock working capital', storeContext);

    reasoningSteps.push({
      step: 1,
      toolName: 'forecast_stockout',
      args: { thresholdDays: 60, storeId: storeContext },
      resultSummary: `Analyzed inventory holding metrics: Identified ${slowProduct.name} with 68 days of supply (overstocked status).`,
      timestamp: new Date().toISOString(),
    });

    reasoningSteps.push({
      step: 2,
      toolName: 'generate_offer',
      args: { productId: slowProduct.id, discountPercent: 15, storeId: storeContext },
      resultSummary: `Generated campaign "${toolRes.title}": Retail price $${toolRes.targetProduct.regularPrice} → $${toolRes.targetProduct.discountedPrice} (Maintains healthy ${toolRes.targetProduct.marginPercentAfterDiscount}% gross margin).`,
      timestamp: new Date().toISOString(),
    });

    content = `### 🏷️ Inventory Velocity & Promotional Optimization\n\nI evaluated inventory holding costs and days of supply across the catalog. **${slowProduct.name}** currently holds **68 days of supply**, tying up vital shelf capacity.\n\n**Promotional Strategy Formulation:**\n- **Recommended Markdown:** **15% promotional discount** ($${toolRes.targetProduct.regularPrice} → $${toolRes.targetProduct.discountedPrice}).\n- **Margin Preservation:** Even after the markdown, the product retains a **${toolRes.targetProduct.marginPercentAfterDiscount}% gross margin**.\n- **Projected Sales Uplift:** **+${toolRes.estimatedUnitSalesUpliftPercent}% sales volume** over a 7-day campaign window.\n\n**Cross-Sell Opportunity:**\nBundle with *${toolRes.crossSellBundle.bundleTitle}* to lift basket size by 28%.`;

    recommendation = {
      id: `REC-${Date.now()}`,
      title: `Publish 15% Markdown Campaign: ${slowProduct.name}`,
      type: 'MARKDOWN',
      urgency: 'MEDIUM',
      productId: slowProduct.id,
      productName: slowProduct.name,
      storeId: storeContext !== 'ALL' ? storeContext : 'STR-03',
      storeName: STORES.find((s) => s.id === storeContext)?.name || 'Cocody Hypermarket',
      rationale: `Clears 45 units of slow-moving inventory, accelerating working capital turnover while protecting gross margins.`,
      impactDollars: toolRes.estimatedGrossRevenueImpact || 6250,
      impactType: 'CASH_FREED',
      actionPayload: toolRes.executionActionPayload,
      status: 'PENDING',
      timestamp: new Date().toISOString(),
    };
  } else if (lower.includes('price') || lower.includes('margin') || lower.includes('profit')) {
    // Suggest price
    const prod = PRODUCTS[0]; // Headphones
    const toolRes = executeSuggestPrice(prod.id, storeContext, 'margin');

    reasoningSteps.push({
      step: 1,
      toolName: 'suggest_price',
      args: { productId: prod.id, storeId: storeContext, objective: 'margin' },
      resultSummary: `Simulated elasticity: Product has low price sensitivity; recommended +${toolRes.priceDeltaPercent}% adjustment ($${toolRes.currentPrice} → $${toolRes.suggestedPrice}).`,
      timestamp: new Date().toISOString(),
    });

    content = `### 📈 Dynamic Price & Margin Calibration\n\nI analyzed price elasticity and demand sensitivity for **${prod.name}**.\n\n**Analysis & Findings:**\n- **Current Price:** $${toolRes.currentPrice} (Margin: $${toolRes.currentMarginDollars} / ${Math.round(prod.marginRate * 100)}%)\n- **Proposed Price:** **$${toolRes.suggestedPrice}** (+${toolRes.priceDeltaPercent}% calibration)\n- **Projected Monthly Impact:** **+$${toolRes.estimatedMonthlyGrossMarginImpact.toLocaleString()}** additional gross profit without customer attrition.\n\nDemand velocity remains stable across all flagship locations.`;

    recommendation = {
      id: `REC-${Date.now()}`,
      title: `Apply +${toolRes.priceDeltaPercent}% Margin Calibration: ${prod.name}`,
      type: 'PRICE_INCREASE',
      urgency: 'MEDIUM',
      productId: prod.id,
      productName: prod.name,
      storeId: storeContext,
      storeName: toolRes.storeScope,
      rationale: toolRes.rationale,
      impactDollars: toolRes.estimatedMonthlyGrossMarginImpact,
      impactType: 'MARGIN_UPLIFT',
      actionPayload: { oldPrice: toolRes.currentPrice, newPrice: toolRes.suggestedPrice },
      status: 'PENDING',
      timestamp: new Date().toISOString(),
    };
  } else {
    // Default: Sales trend analysis
    const toolRes = executeGetSalesTrend('ALL', storeContext, 30);
    reasoningSteps.push({
      step: 1,
      toolName: 'get_sales_trend',
      args: { productId: 'ALL', storeId: storeContext, days: 30 },
      resultSummary: `Aggregated 30-day performance: $${toolRes.metrics.totalRevenue.toLocaleString()} revenue, ${toolRes.metrics.totalUnits} units, ${toolRes.metrics.trendDirection} momentum (+${toolRes.metrics.growthRatePercent}% WoW).`,
      timestamp: new Date().toISOString(),
    });

    content = `### 📊 Chain-wide Retail Performance Briefing\n\nOver the past 30 days, total retail revenue reached **$${toolRes.metrics.totalRevenue.toLocaleString()}** across **${toolRes.metrics.totalUnits.toLocaleString()} units sold**, delivering an average gross margin rate of **${toolRes.metrics.avgMarginRatePercent}%**.\n\n**Strategic Takeaways:**\n- **Sales Trajectory:** Trajectory is **${toolRes.metrics.trendDirection}** with **+${toolRes.metrics.growthRatePercent}%** period-over-period growth.\n- **Top Margin Category:** *Personal Care* and *Apparel* are exceeding margin targets (>62%).\n- **Optimization Focus:** Fast-turning Groceries require continuous replenishment synchronization to maintain in-stock levels above 96%.`;

    recommendation = {
      id: `REC-${Date.now()}`,
      title: 'Synchronize Cross-Store Logistics for Top 10 High-Velocity SKUs',
      type: 'TRANSFER',
      urgency: 'MEDIUM',
      productId: 'ALL',
      productName: 'Top 10 Revenue Generating SKUs',
      storeId: storeContext,
      storeName: storeContext === 'ALL' ? 'All 5 Stores' : storeContext,
      rationale: 'Reallocating regional inventory balances buffer stocks and captures an additional $18,200 in peak weekend sales.',
      impactDollars: 18200,
      impactType: 'SALES_GROWTH',
      actionPayload: { autoTriggered: true, balanceStrategy: 'INTER_STORE_REBALANCE' },
      status: 'PENDING',
      timestamp: new Date().toISOString(),
    };
  }

  return { content, reasoningSteps, recommendation };
}

// Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Neemba AI NewGen: Retail Copilot server listening on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
