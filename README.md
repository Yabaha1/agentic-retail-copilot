# Agentic / NewGen Retail Copilot (Concept Prototype) 🛒⚡

An enterprise-grade demo of an **Agentic AI Assistant for Retail & Supply Chain Operations**, powered by **Google Gemini 3.8 Flash** with autonomous function calling, multi-step reasoning traces, financial impact quantification ($), and automated process execution.

---

## 👨‍💻 Author & Attribution

**© 2026 Developed by BAMBA Yabaha ( +225 07 77 61 47 11 ) , email id : bambayabahasolomarius@gmail.com**  
- **Lead Developer**: BAMBA Yabaha  
- **Contact / WhatsApp**: `+225 07 77 61 47 11`  
- **Email**: `bambayabahasolomarius@gmail.com`  

---

## 🌟 Executive Summary & Capabilities

Retail store managers and supply-chain directors make dozens of high-stakes inventory and pricing decisions daily. **Agentic Retail Copilot** acts as an autonomous co-pilot across 5 retail stores and 40 products with 90 days of daily sales telemetry.

Instead of functioning as a simple text chatbot, this system operates as an **Autonomous Agent**:
1. **Perceives Real-Time Data**: Directly queries live stock velocity, run-rates, and supplier lead times.
2. **Executes Multi-Tool Reasoning**: Decides which specialized analytical tools to invoke based on the operational context.
3. **Quantifies Business Value**: Computes exact dollar impacts (e.g., `+$14,950 Revenue Protected`, `+$3,840 Working Capital Freed`, `+$5,200 Gross Margin Uplift`).
4. **Automates Decisions**: Allows store directors to click **"Approve Action & Automate"**, immediately dispatching simulated Purchase Orders or POS markdowns into the ERP Audit Feed.

---

## 🛠️ Multi-Tool Agentic Architecture (Gemini 3.8 Flash)

The agent leverages `@google/genai` function calling with 4 operational tools:

| Tool Name | Scope & Functionality | Typical Trigger Questions |
| :--- | :--- | :--- |
| 🚨 **`forecast_stockout`** | Compares 7-day velocity against supplier lead times to identify imminent stockouts before shelves empty. | *"Which products will stock out next week?"* |
| 🏷️ **`suggest_price`** | Simulates price elasticity and margins to recommend margin uplifts or price calibrations. | *"Which items can support a price increase?"* |
| ⚡ **`generate_offer`** | Generates promotional discounts, markdown campaigns, and high-margin product bundles for slow-moving stock. | *"Which items should get a discount?"* |
| 📈 **`get_sales_trend`** | Evaluates 90-day revenue curves, momentum, unit volume, and period-over-period growth. | *"What is our 30-day sales velocity and margin trend?"* |

---

## 📊 Synthetic Retail Dataset Specifications

The application includes an extensive, self-contained synthetic retail database (18,000 granular data points):
- **40 Retail Products** across 5 categories:
  - *Electronics & Smart Gadgets* (Smartwatches, ANC Headphones, 4K Security Cams, Tablets)
  - *Fresh & Gourmet Groceries* (Single-origin Arabica Coffee, Extra Virgin Olive Oil, Artisan Cocoa)
  - *Home & Kitchen* (HEPA Air Purifiers, Air Fryers, Bamboo Cutting Sets, Digital Kettles)
  - *Apparel & Footwear* (Performance Running Shoes, Organic Hoodies, Stretch Denim)
  - *Personal Care & Wellness* (Hyaluronic Acid Serum, Shea Body Butter, Sonic Toothbrushes)
- **5 Realistic Stores in Abidjan**:
  1. `STR-01`: Abidjan Central Superstore (Flagship • 1.35x Traffic)
  2. `STR-02`: Plateau Business Mall (Business Mall • 1.15x Traffic)
  3. `STR-03`: Cocody Hypermarket (Hypermarket • 1.25x Traffic)
  4. `STR-04`: Marcory Express Depot (Express Depot • 0.85x Traffic)
  5. `STR-05`: Yopougon Regional Hub (Regional Hub • 1.10x Traffic)
- **90 Days of Daily Sales History** with realistic weekend sales peaks, seasonal trends, and promotional periods.
- **Supply Chain Metrics**: Unit cost, retail price, gross margin %, current stock, 7-day run rate, days of supply, safety stock, and supplier replenishment lead times (4–18 days).

---

## 🖥️ UI & Design Highlights

- **Glassmorphic Aesthetic**: Translucent glass panels with backdrop blur, glowing neon badges, and subtle ambient gradients.
- **Dark & Light Mode**: Seamless theme toggle persisted in `localStorage`.
- **Channel Filtering**: Instant switching between chain-wide view (`All 5 Stores`) or individual store locations.
- **Interactive SVG Chart**: Interactive Bezier sales curve with hover tooltips displaying daily revenue, gross profit, and unit volume.
- **Transparent Reasoning Trace**: Expandable reasoning steps showing tool names, input parameters, and data summaries for full explainability.
- **ERP Process Automation Feed**: Audit log recording every approved business action with timestamps, dollar impact, and payload parameters.

---

## 🚀 Quickstart & Local Execution

### Prerequisites
- Node.js >= 18
- npm

### 1. Installation
```bash
# Clone the repository
git clone https://github.com/YOUR_GITHUB_USERNAME/retail-copilot.git
cd retail-copilot

# Install dependencies
npm install
```

### 2. Environment Configuration
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
*(When hosted on Google AI Studio, `GEMINI_API_KEY` is injected automatically via Cloud Run secrets).*

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📦 Pushing to Public GitHub

You can publish this applet directly from **Google AI Studio** using the GitHub export button, or push manually via git:

```bash
# Initialize git (if needed)
git init
git add .
git commit -m "feat: Agentic Retail Copilot (Concept Prototype) by BAMBA Yabaha"
git branch -M main

# Add your GitHub repository remote
git remote add origin https://github.com/YOUR_USERNAME/agentic-retail-copilot.git

# Push to your repository
git push -u origin main
```

---

## 📄 License & Copyright

**© 2026 Developed by BAMBA Yabaha ( +225 07 77 61 47 11 ) , email id : bambayabahasolomarius@gmail.com**  
Licensed under the Apache License, Version 2.0.
