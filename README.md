# Neemba AI NewGen: Retail Copilot 🛒✨

An enterprise-grade demo of an **Agentic AI Assistant for Retail & Supply Chain Operations**, powered by **Google Gemini 3.8 Flash** with dynamic function calling, automated reasoning traces, financial impact quantification, and autonomous process automation.

---

## 🌟 Overview & Key Capabilities

Retail store managers and supply-chain directors make hundreds of high-stakes inventory decisions every day. **Neemba AI NewGen: Retail Copilot** acts as an autonomous co-pilot across 5 retail stores and 40 products with 90 days of daily sales telemetry.

### 🎯 Core Features:
1. **Interactive Retail Operations Dashboard:**
   - **Executive KPIs**: Real-time 90-day Revenue, Gross Profit Margin ($ and %), Stockout Vulnerability count, and Trapped Working Capital.
   - **Sales Trajectory & Velocity Chart**: Interactive SVG curve with daily revenue, gross margin, unit sales, and category revenue share.
   - **40-Product Inventory Catalog**: Real-time days-of-supply tracking, stockout risk alerts (`CRITICAL`, `WARNING`, `HEALTHY`, `OVERSTOCKED`), unit costs, and supplier lead times.
2. **Agentic Copilot with Multi-Tool Function Calling:**
   - Powered by `@google/genai` with model `gemini-3.8-flash`.
   - **4 Autonomous Tools:**
     - `get_sales_trend`: Analyzes 90-day sales trajectory, momentum, volume, and period-over-period growth.
     - `forecast_stockout`: Compares run-rates against supplier replenishment lead times to catch stockouts before they happen.
     - `suggest_price`: Simulates price elasticity to optimize gross margin or liquidate slow-moving stock.
     - `generate_offer`: Formulates targeted promotional discounts, cross-sell bundles, and marketing campaigns.
3. **Reasoning Steps & Explainability:**
   - Each answer transparently displays the agent's reasoning steps, tool arguments, and intermediate findings.
4. **Quantified Financial Impact Cards:**
   - Evaluates concrete dollar impacts for every recommendation (e.g. `+$14,950 Protected Revenue`, `+$3,840 Working Capital Freed`, `+$5,200 Gross Margin Uplift`).
5. **Process Automation & Audit Log:**
   - One-click **"Approve Action & Automate"** button that executes decisions directly into the retail ERP simulation and logs them to the live Activity Feed.
6. **Glassmorphism UI & Dark Mode:**
   - Modern glass-morphism aesthetic with light/dark theme persistence and multi-store channel filtering.

---

## 📊 Synthetic Dataset Specifications

The application includes a rich synthetic retail dataset:
- **40 Products** across 5 categories (*Electronics*, *Groceries*, *Home & Kitchen*, *Apparel*, *Personal Care*).
- **5 Stores in Abidjan**:
  1. `STR-01`: Abidjan Central Superstore (Flagship)
  2. `STR-02`: Plateau Business Mall (Business & Tech)
  3. `STR-03`: Cocody Hypermarket (Family & Gourmet)
  4. `STR-04`: Marcory Express Depot (Fast Turnaround)
  5. `STR-05`: Yopougon Regional Hub (High Volume & Value)
- **90 Days of Daily Sales History** (18,000 granular transactions with weekend spikes, seasonality, and promotional surges).
- **Unit Costs, Retail Prices, Margin Rates, Safety Stock, and Supplier Lead Times** (ranging from 4 to 18 days).

---

## 🚀 Quickstart & Setup

### Prerequisites
- Node.js >= 18
- npm

### Installation
```bash
# Clone the repository
git clone https://github.com/YOUR_GITHUB_USERNAME/neemba-retail-copilot.git
cd neemba-retail-copilot

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Set GEMINI_API_KEY in .env (if calling Gemini directly)

# Start development server
npm run dev
```

The app will launch on `http://localhost:3000`.

---

## 🛠️ GitHub Push Instructions

To push this repository to your public GitHub account:

```bash
# 1. Initialize git repository
git init

# 2. Stage all files
git add .

# 3. Commit
git commit -m "feat: Neemba AI NewGen: Retail Copilot (Agentic Retail Operations Demo)"

# 4. Set main branch
git branch -M main

# 5. Add remote origin (replace with your repo URL)
git remote add origin https://github.com/YOUR_USERNAME/neemba-retail-copilot.git

# 6. Push to GitHub
git push -u origin main
```

---

## 👨‍💻 Author & Attribution

**© 2026 Neemba AI NewGen: Retail Copilot**  
Developed by **BAMBA Yabaha**  
📞 Phone: **+225 07 77 61 47 11**  
📧 Email: **bambayabahasolomarius@gmail.com**  

---
*License: Apache-2.0*
