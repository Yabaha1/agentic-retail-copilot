/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Neemba AI NewGen: Retail Copilot
 * Synthetic Retail Dataset: 40 Products, 5 Stores, 90 Days of Sales, Stock, Unit Costs, Prices & Lead Times.
 */

export interface Product {
  id: string;
  sku: string;
  name: string;
  category: 'Electronics' | 'Groceries' | 'Home & Kitchen' | 'Apparel' | 'Personal Care';
  unitCost: number;
  price: number;
  marginRate: number; // (price - unitCost) / price
  supplierLeadTimeDays: number;
  supplierName: string;
  reorderPoint: number;
  safetyStock: number;
  packSize: number;
}

export interface Store {
  id: string;
  name: string;
  code: string;
  city: string;
  type: 'Flagship' | 'Business Mall' | 'Hypermarket' | 'Express' | 'Regional Hub';
  trafficIndex: number; // multiplier for sales
}

export interface StoreInventory {
  productId: string;
  storeId: string;
  currentStock: number;
  reservedStock: number;
  availableStock: number;
  avgDailySales: number; // 7-day average run rate
  daysOfSupply: number;
  stockoutRisk: 'CRITICAL' | 'WARNING' | 'HEALTHY' | 'OVERSTOCKED';
  daysUntilStockout: number;
  lastRestockedDaysAgo: number;
}

export interface DailySale {
  date: string; // YYYY-MM-DD
  dayIndex: number; // 0 to 89
  productId: string;
  storeId: string;
  unitsSold: number;
  revenue: number;
  cost: number;
  grossMargin: number;
  wasDiscounted: boolean;
  discountRate: number;
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

// 5 Realistic Retail Stores
export const STORES: Store[] = [
  { id: 'STR-01', name: 'Abidjan Central Superstore', code: 'ABJ-01', city: 'Abidjan', type: 'Flagship', trafficIndex: 1.35 },
  { id: 'STR-02', name: 'Plateau Business Mall', code: 'PLT-02', city: 'Abidjan - Plateau', type: 'Business Mall', trafficIndex: 1.15 },
  { id: 'STR-03', name: 'Cocody Hypermarket', code: 'CCD-03', city: 'Abidjan - Cocody', type: 'Hypermarket', trafficIndex: 1.25 },
  { id: 'STR-04', name: 'Marcory Express Depot', code: 'MRC-04', city: 'Abidjan - Marcory', type: 'Express', trafficIndex: 0.85 },
  { id: 'STR-05', name: 'Yopougon Regional Hub', code: 'YOP-05', city: 'Abidjan - Yopougon', type: 'Regional Hub', trafficIndex: 1.10 },
];

// 40 Products across 5 retail categories
export const PRODUCTS: Product[] = [
  // 1-8: Electronics (8 products)
  { id: 'PRD-01', sku: 'ELEC-ANC-01', name: 'Neemba Pro Wireless Noise-Cancelling Headphones', category: 'Electronics', unitCost: 115, price: 249, marginRate: 0.538, supplierLeadTimeDays: 14, supplierName: 'Aura Sound Tech', reorderPoint: 45, safetyStock: 20, packSize: 10 },
  { id: 'PRD-02', sku: 'ELEC-SMW-02', name: 'Apex Ultra Smartwatch Series 6 (OLED)', category: 'Electronics', unitCost: 130, price: 299, marginRate: 0.565, supplierLeadTimeDays: 16, supplierName: 'Apex Micro Electronics', reorderPoint: 40, safetyStock: 15, packSize: 10 },
  { id: 'PRD-03', sku: 'ELEC-PWR-03', name: 'MagFast 20,000mAh Dual USB-C Power Bank', category: 'Electronics', unitCost: 22, price: 59, marginRate: 0.627, supplierLeadTimeDays: 7, supplierName: 'VoltCharge Global', reorderPoint: 90, safetyStock: 35, packSize: 20 },
  { id: 'PRD-04', sku: 'ELEC-SPK-04', name: 'SoundWave 360 Waterproof Bluetooth Speaker', category: 'Electronics', unitCost: 38, price: 89, marginRate: 0.573, supplierLeadTimeDays: 10, supplierName: 'Aura Sound Tech', reorderPoint: 60, safetyStock: 25, packSize: 15 },
  { id: 'PRD-05', sku: 'ELEC-CAM-05', name: 'VisionAI 4K Smart Indoor Security Camera', category: 'Electronics', unitCost: 45, price: 119, marginRate: 0.622, supplierLeadTimeDays: 14, supplierName: 'Sentrix IoT Systems', reorderPoint: 50, safetyStock: 20, packSize: 10 },
  { id: 'PRD-06', sku: 'ELEC-MOU-06', name: 'ErgoMaster Wireless Precision Mouse', category: 'Electronics', unitCost: 24, price: 65, marginRate: 0.631, supplierLeadTimeDays: 8, supplierName: 'PeriphTech Labs', reorderPoint: 70, safetyStock: 30, packSize: 25 },
  { id: 'PRD-07', sku: 'ELEC-TAB-07', name: 'Neemba Tab Pro 10.5-inch Tablet (128GB)', category: 'Electronics', unitCost: 210, price: 399, marginRate: 0.474, supplierLeadTimeDays: 18, supplierName: 'Apex Micro Electronics', reorderPoint: 35, safetyStock: 15, packSize: 10 },
  { id: 'PRD-08', sku: 'ELEC-CAB-08', name: 'Braided Kevlar USB-C 100W Fast Cable (2m)', category: 'Electronics', unitCost: 4.5, price: 18, marginRate: 0.750, supplierLeadTimeDays: 5, supplierName: 'VoltCharge Global', reorderPoint: 150, safetyStock: 60, packSize: 50 },

  // 9-16: Groceries (8 products)
  { id: 'PRD-09', sku: 'GROC-COF-09', name: 'Grand Domaine Organic Arabica Coffee (1kg)', category: 'Groceries', unitCost: 11.5, price: 23.5, marginRate: 0.511, supplierLeadTimeDays: 6, supplierName: 'Ivoire Agro Roasters', reorderPoint: 120, safetyStock: 50, packSize: 24 },
  { id: 'PRD-10', sku: 'GROC-OIL-10', name: 'Neemba Cold-Pressed Extra Virgin Olive Oil (1L)', category: 'Groceries', unitCost: 8.2, price: 16.9, marginRate: 0.515, supplierLeadTimeDays: 7, supplierName: 'Mediterranean Harvest Co', reorderPoint: 110, safetyStock: 45, packSize: 20 },
  { id: 'PRD-11', sku: 'GROC-CHO-11', name: 'Artisan Cocoa Noir 85% Single-Origin Bar (100g)', category: 'Groceries', unitCost: 1.8, price: 4.5, marginRate: 0.600, supplierLeadTimeDays: 4, supplierName: 'Cacao Royal Estates', reorderPoint: 200, safetyStock: 80, packSize: 50 },
  { id: 'PRD-12', sku: 'GROC-RIC-12', name: 'Fragrant Jasmine Rice Select Premium (5kg)', category: 'Groceries', unitCost: 9.0, price: 16.5, marginRate: 0.455, supplierLeadTimeDays: 5, supplierName: 'Sahel Grain Trading', reorderPoint: 140, safetyStock: 60, packSize: 10 },
  { id: 'PRD-13', sku: 'GROC-TEA-13', name: 'Bio Herbal Infusion Green Mint & Ginger (50ct)', category: 'Groceries', unitCost: 3.2, price: 7.8, marginRate: 0.590, supplierLeadTimeDays: 6, supplierName: 'Ivoire Agro Roasters', reorderPoint: 130, safetyStock: 50, packSize: 30 },
  { id: 'PRD-14', sku: 'GROC-HON-14', name: 'Pure Forest Wildflower Honey (500g Glass Jar)', category: 'Groceries', unitCost: 5.5, price: 12.9, marginRate: 0.574, supplierLeadTimeDays: 8, supplierName: 'BioSavanna Apiaries', reorderPoint: 80, safetyStock: 35, packSize: 24 },
  { id: 'PRD-15', sku: 'GROC-PAST-15', name: 'Bronze-Cut Italian Spaghetti Di Gragnano (500g)', category: 'Groceries', unitCost: 1.4, price: 3.4, marginRate: 0.588, supplierLeadTimeDays: 9, supplierName: 'Mediterranean Harvest Co', reorderPoint: 220, safetyStock: 90, packSize: 40 },
  { id: 'PRD-16', sku: 'GROC-NUT-16', name: 'Roasted Cashew Kernels Salted & Smoked (400g)', category: 'Groceries', unitCost: 4.8, price: 10.9, marginRate: 0.560, supplierLeadTimeDays: 5, supplierName: 'Cacao Royal Estates', reorderPoint: 100, safetyStock: 40, packSize: 20 },

  // 17-24: Home & Kitchen (8 products)
  { id: 'PRD-17', sku: 'HOME-AIR-17', name: 'AeroPure HEPA Smart Air Purifier 45m²', category: 'Home & Kitchen', unitCost: 85, price: 189, marginRate: 0.550, supplierLeadTimeDays: 15, supplierName: 'CleanHome Innovations', reorderPoint: 35, safetyStock: 15, packSize: 8 },
  { id: 'PRD-18', sku: 'HOME-KET-18', name: 'Stainless Steel Digital Temperature Kettle (1.7L)', category: 'Home & Kitchen', unitCost: 26, price: 62, marginRate: 0.581, supplierLeadTimeDays: 10, supplierName: 'CuisinePro Appliances', reorderPoint: 60, safetyStock: 25, packSize: 12 },
  { id: 'PRD-19', sku: 'HOME-FRY-19', name: 'CrispAir Dual-Zone Digital Air Fryer (8.5L)', category: 'Home & Kitchen', unitCost: 72, price: 159, marginRate: 0.547, supplierLeadTimeDays: 14, supplierName: 'CuisinePro Appliances', reorderPoint: 40, safetyStock: 15, packSize: 6 },
  { id: 'PRD-20', sku: 'HOME-PAN-20', name: 'Granite Non-Stick 3-Piece Skillet Pan Set', category: 'Home & Kitchen', unitCost: 35, price: 79, marginRate: 0.557, supplierLeadTimeDays: 11, supplierName: 'CuisinePro Appliances', reorderPoint: 55, safetyStock: 20, packSize: 10 },
  { id: 'PRD-21', sku: 'HOME-BLN-21', name: 'PulseMax High-Torque Smoothie Blender 1200W', category: 'Home & Kitchen', unitCost: 42, price: 95, marginRate: 0.558, supplierLeadTimeDays: 12, supplierName: 'CleanHome Innovations', reorderPoint: 50, safetyStock: 20, packSize: 8 },
  { id: 'PRD-22', sku: 'HOME-DIFF-22', name: 'AromaZen Ultrasonic Essential Oil Diffuser (500ml)', category: 'Home & Kitchen', unitCost: 15, price: 39, marginRate: 0.615, supplierLeadTimeDays: 7, supplierName: 'CleanHome Innovations', reorderPoint: 80, safetyStock: 30, packSize: 20 },
  { id: 'PRD-23', sku: 'HOME-BAM-23', name: 'Organic Bamboo Antibacterial Cutting Board Set', category: 'Home & Kitchen', unitCost: 12, price: 29, marginRate: 0.586, supplierLeadTimeDays: 8, supplierName: 'EcoHabitat Supplies', reorderPoint: 90, safetyStock: 35, packSize: 20 },
  { id: 'PRD-24', sku: 'HOME-MUG-24', name: 'ThermoShield Double-Wall Travel Tumbler (600ml)', category: 'Home & Kitchen', unitCost: 9, price: 24, marginRate: 0.625, supplierLeadTimeDays: 6, supplierName: 'EcoHabitat Supplies', reorderPoint: 110, safetyStock: 40, packSize: 30 },

  // 25-32: Apparel (8 products)
  { id: 'PRD-25', sku: 'APP-POL-25', name: 'Premium Mercerized Cotton Polo Shirt', category: 'Apparel', unitCost: 16, price: 45, marginRate: 0.644, supplierLeadTimeDays: 12, supplierName: 'Vanguard Textiles Ltd', reorderPoint: 95, safetyStock: 40, packSize: 25 },
  { id: 'PRD-26', sku: 'APP-DEN-26', name: 'Heritage Stretch Comfort Denim Jeans', category: 'Apparel', unitCost: 24, price: 69, marginRate: 0.652, supplierLeadTimeDays: 14, supplierName: 'Vanguard Textiles Ltd', reorderPoint: 80, safetyStock: 30, packSize: 20 },
  { id: 'PRD-27', sku: 'APP-RUN-27', name: 'CloudStride Lightweight Breathable Running Shoes', category: 'Apparel', unitCost: 45, price: 115, marginRate: 0.609, supplierLeadTimeDays: 16, supplierName: 'Stride Athletic Footwear', reorderPoint: 60, safetyStock: 25, packSize: 15 },
  { id: 'PRD-28', sku: 'APP-HOO-28', name: 'French Terry Relaxed Fit Organic Hoodie', category: 'Apparel', unitCost: 22, price: 58, marginRate: 0.621, supplierLeadTimeDays: 10, supplierName: 'Vanguard Textiles Ltd', reorderPoint: 75, safetyStock: 30, packSize: 20 },
  { id: 'PRD-29', sku: 'APP-JAC-29', name: 'All-Weather Packable Windbreaker Rain Jacket', category: 'Apparel', unitCost: 32, price: 85, marginRate: 0.624, supplierLeadTimeDays: 14, supplierName: 'Stride Athletic Footwear', reorderPoint: 50, safetyStock: 20, packSize: 15 },
  { id: 'PRD-30', sku: 'APP-LGT-30', name: 'Seamless High-Waist Performance Gym Leggings', category: 'Apparel', unitCost: 18, price: 48, marginRate: 0.625, supplierLeadTimeDays: 10, supplierName: 'Stride Athletic Footwear', reorderPoint: 85, safetyStock: 35, packSize: 25 },
  { id: 'PRD-31', sku: 'APP-CAP-31', name: 'Neemba Classic Embroidered Twill Cap', category: 'Apparel', unitCost: 6.5, price: 22, marginRate: 0.705, supplierLeadTimeDays: 7, supplierName: 'Vanguard Textiles Ltd', reorderPoint: 120, safetyStock: 50, packSize: 40 },
  { id: 'PRD-32', sku: 'APP-SCK-32', name: 'Bamboo Cushion Athletic Crew Socks (3-Pack)', category: 'Apparel', unitCost: 4.2, price: 14.5, marginRate: 0.710, supplierLeadTimeDays: 6, supplierName: 'Stride Athletic Footwear', reorderPoint: 150, safetyStock: 60, packSize: 50 },

  // 33-40: Personal Care (8 products)
  { id: 'PRD-33', sku: 'CARE-SER-33', name: 'HydraGlow Vitamin C + Hyaluronic Acid Serum (30ml)', category: 'Personal Care', unitCost: 8.5, price: 28, marginRate: 0.696, supplierLeadTimeDays: 8, supplierName: 'DermaLuxe Labs', reorderPoint: 110, safetyStock: 45, packSize: 30 },
  { id: 'PRD-34', sku: 'CARE-CRE-34', name: 'Pure Bio Botanical Shea Nourishing Body Butter (250g)', category: 'Personal Care', unitCost: 5.2, price: 16.5, marginRate: 0.685, supplierLeadTimeDays: 7, supplierName: 'BioSavanna Cosmetics', reorderPoint: 130, safetyStock: 55, packSize: 30 },
  { id: 'PRD-35', sku: 'CARE-BRU-35', name: 'SonicClean Pro Rechargeable Toothbrush 40k VPM', category: 'Personal Care', unitCost: 28, price: 74, marginRate: 0.622, supplierLeadTimeDays: 12, supplierName: 'OralTech Wellness', reorderPoint: 55, safetyStock: 25, packSize: 15 },
  { id: 'PRD-36', sku: 'CARE-SUN-36', name: 'Invisible Shield Mineral Sunscreen SPF 50+ (100ml)', category: 'Personal Care', unitCost: 7.0, price: 22.5, marginRate: 0.689, supplierLeadTimeDays: 9, supplierName: 'DermaLuxe Labs', reorderPoint: 120, safetyStock: 50, packSize: 30 },
  { id: 'PRD-37', sku: 'CARE-OIL-37', name: 'Organic Moroccan Argan Hair Treatment Elixir (100ml)', category: 'Personal Care', unitCost: 9.8, price: 29.9, marginRate: 0.672, supplierLeadTimeDays: 11, supplierName: 'BioSavanna Cosmetics', reorderPoint: 85, safetyStock: 35, packSize: 25 },
  { id: 'PRD-38', sku: 'CARE-SHP-38', name: 'Sulfate-Free Clarifying Scalp & Hair Shampoo (400ml)', category: 'Personal Care', unitCost: 4.5, price: 14.5, marginRate: 0.690, supplierLeadTimeDays: 7, supplierName: 'BioSavanna Cosmetics', reorderPoint: 140, safetyStock: 60, packSize: 30 },
  { id: 'PRD-39', sku: 'CARE-RAZ-39', name: 'Zero-Waste Matte Black Safety Razor + 20 Platinum Blades', category: 'Personal Care', unitCost: 11.0, price: 34, marginRate: 0.676, supplierLeadTimeDays: 9, supplierName: 'DermaLuxe Labs', reorderPoint: 70, safetyStock: 30, packSize: 20 },
  { id: 'PRD-40', sku: 'CARE-BAL-40', name: 'Deep Moisture Beeswax & Peppermint Lip Balm (Pack of 3)', category: 'Personal Care', unitCost: 2.8, price: 9.9, marginRate: 0.717, supplierLeadTimeDays: 5, supplierName: 'BioSavanna Apiaries', reorderPoint: 180, safetyStock: 75, packSize: 60 },
];

// Helper: Pseudo-random generator with seed for deterministic synthetic dataset
function pseudoRandom(seed: number) {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

// Generate 90 Days of synthetic sales history (40 products * 5 stores * 90 days = 18,000 data points)
export function generateSyntheticSalesData(): {
  sales: DailySale[];
  inventory: StoreInventory[];
  todayStr: string;
} {
  const today = new Date('2026-10-23T00:00:00Z');
  const sales: DailySale[] = [];
  const inventory: StoreInventory[] = [];

  // Generate 90 days of daily sales
  for (let dayOffset = 89; dayOffset >= 0; dayOffset--) {
    const d = new Date(today);
    d.setUTCDate(today.getUTCDate() - dayOffset);
    const dateStr = d.toISOString().split('T')[0];
    const dayOfWeek = d.getUTCDay(); // 0 is Sunday, 6 is Saturday
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    let pIdx = 0;
    for (const prod of PRODUCTS) {
      pIdx++;
      let sIdx = 0;
      for (const store of STORES) {
        sIdx++;
        const seed = dayOffset * 1000 + pIdx * 17 + sIdx * 31;
        const randVal = pseudoRandom(seed);

        // Base velocity per category
        let baseUnits = 4;
        if (prod.category === 'Groceries') baseUnits = 12;
        if (prod.category === 'Personal Care') baseUnits = 7;
        if (prod.category === 'Apparel') baseUnits = 5;
        if (prod.category === 'Home & Kitchen') baseUnits = 3.5;
        if (prod.category === 'Electronics') baseUnits = 2.5;

        // Weekend boost (retail peaks on Fri-Sun)
        const weekendFactor = isWeekend ? 1.45 : 0.92;
        // Growth trend over 90 days (older days slightly lower, recent days higher)
        const trendFactor = 0.85 + (90 - dayOffset) * 0.0035;

        // Occasional promotional spike (e.g., promotional week 30 days ago)
        const isPromoDay = (dayOffset >= 28 && dayOffset <= 34) && (pIdx % 3 === 0);
        const discountRate = isPromoDay ? 0.15 : 0;
        const promoBoost = isPromoDay ? 1.75 : 1.0;

        // Store traffic multiplier
        const storeFactor = store.trafficIndex;

        // Random jitter
        const jitter = 0.65 + randVal * 0.7; // 0.65 to 1.35

        let calculatedUnits = Math.round(baseUnits * weekendFactor * trendFactor * promoBoost * storeFactor * jitter);
        if (calculatedUnits < 0) calculatedUnits = 0;

        const effectivePrice = prod.price * (1 - discountRate);
        const revenue = Math.round(calculatedUnits * effectivePrice * 100) / 100;
        const cost = Math.round(calculatedUnits * prod.unitCost * 100) / 100;
        const grossMargin = Math.round((revenue - cost) * 100) / 100;

        sales.push({
          date: dateStr,
          dayIndex: 89 - dayOffset,
          productId: prod.id,
          storeId: store.id,
          unitsSold: calculatedUnits,
          revenue,
          cost,
          grossMargin,
          wasDiscounted: isPromoDay,
          discountRate,
        });
      }
    }
  }

  // Calculate current stock levels and run rates based on the most recent 7 days
  const recent7Days = sales.filter((s) => s.dayIndex >= 83);

  for (const prod of PRODUCTS) {
    for (const store of STORES) {
      const storeSales = recent7Days.filter((s) => s.productId === prod.id && s.storeId === store.id);
      const totalUnitsRecent7 = storeSales.reduce((acc, curr) => acc + curr.unitsSold, 0);
      const avgDailySales = Math.max(0.8, Math.round((totalUnitsRecent7 / 7) * 10) / 10);

      // Seed deterministic stock level
      const pNum = parseInt(prod.id.replace('PRD-', ''), 10);
      const sNum = parseInt(store.id.replace('STR-0', ''), 10);
      const stockSeed = pNum * 43 + sNum * 19;
      const stockRand = pseudoRandom(stockSeed);

      // We purposefully create realistic risk distribution:
      // Some products are CRITICAL (daysOfSupply < supplierLeadTimeDays)
      // Some WARNING (daysOfSupply < supplierLeadTimeDays * 1.5)
      // Some OVERSTOCKED (> 60 days)
      // Majority HEALTHY
      let simulatedDaysOfSupply: number;
      if (pNum % 7 === 0) {
        // Critical stockout products! (e.g. PRD-07, PRD-14, PRD-21, PRD-28, PRD-35)
        simulatedDaysOfSupply = Math.max(1.5, Math.round((prod.supplierLeadTimeDays * 0.45 + stockRand * 1.5) * 10) / 10);
      } else if (pNum % 5 === 0) {
        // Warning stockout products (e.g. PRD-05, PRD-10, PRD-15, PRD-20, PRD-25, PRD-30)
        simulatedDaysOfSupply = Math.round((prod.supplierLeadTimeDays * 1.1 + stockRand * 2.0) * 10) / 10;
      } else if (pNum % 9 === 0) {
        // Overstocked (slow moving capital tied up)
        simulatedDaysOfSupply = Math.round((55 + stockRand * 35) * 10) / 10;
      } else {
        // Healthy stock
        simulatedDaysOfSupply = Math.round((prod.supplierLeadTimeDays * 2.2 + stockRand * 12) * 10) / 10;
      }

      const currentStock = Math.round(simulatedDaysOfSupply * avgDailySales);
      const reservedStock = Math.round(currentStock * 0.08);
      const availableStock = Math.max(0, currentStock - reservedStock);
      const daysUntilStockout = Math.round((availableStock / avgDailySales) * 10) / 10;

      let stockoutRisk: 'CRITICAL' | 'WARNING' | 'HEALTHY' | 'OVERSTOCKED' = 'HEALTHY';
      if (daysUntilStockout <= prod.supplierLeadTimeDays) {
        stockoutRisk = 'CRITICAL';
      } else if (daysUntilStockout <= prod.supplierLeadTimeDays * 1.4) {
        stockoutRisk = 'WARNING';
      } else if (daysUntilStockout > 50) {
        stockoutRisk = 'OVERSTOCKED';
      }

      inventory.push({
        productId: prod.id,
        storeId: store.id,
        currentStock,
        reservedStock,
        availableStock,
        avgDailySales,
        daysOfSupply: daysUntilStockout,
        stockoutRisk,
        daysUntilStockout,
        lastRestockedDaysAgo: Math.min(28, Math.round(4 + stockRand * 20)),
      });
    }
  }

  return {
    sales,
    inventory,
    todayStr: '2026-10-23',
  };
}

// Singleton cache for runtime efficiency
export const RETAIL_DB = generateSyntheticSalesData();

// Analytical Helper Functions (used by Agent Tools & Dashboard)
export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id || p.sku === id || p.name.toLowerCase().includes(id.toLowerCase()));
}

export function getStoreById(id: string): Store | undefined {
  return STORES.find((s) => s.id === id || s.code === id || s.name.toLowerCase().includes(id.toLowerCase()));
}

/**
 * Tool 1: get_sales_trend
 * Computes historical sales velocity, revenue, gross margin, and direction.
 */
export function executeGetSalesTrend(productId?: string, storeId?: string, days: number = 30) {
  const targetDays = Math.min(90, Math.max(7, days));
  const minDayIndex = 90 - targetDays;

  let filtered = RETAIL_DB.sales.filter((s) => s.dayIndex >= minDayIndex);
  if (productId && productId !== 'ALL') {
    const p = getProductById(productId);
    if (p) filtered = filtered.filter((s) => s.productId === p.id);
  }
  if (storeId && storeId !== 'ALL') {
    const st = getStoreById(storeId);
    if (st) filtered = filtered.filter((s) => s.storeId === st.id);
  }

  const totalRevenue = Math.round(filtered.reduce((sum, s) => sum + s.revenue, 0));
  const totalUnits = filtered.reduce((sum, s) => sum + s.unitsSold, 0);
  const totalGrossMargin = Math.round(filtered.reduce((sum, s) => sum + s.grossMargin, 0));
  const avgMarginRate = totalRevenue > 0 ? Math.round((totalGrossMargin / totalRevenue) * 1000) / 10 : 0;

  // Split into first half and second half to detect momentum trend
  const midPoint = minDayIndex + Math.floor(targetDays / 2);
  const firstHalf = filtered.filter((s) => s.dayIndex < midPoint);
  const secondHalf = filtered.filter((s) => s.dayIndex >= midPoint);

  const firstHalfRev = firstHalf.reduce((sum, s) => sum + s.revenue, 0);
  const secondHalfRev = secondHalf.reduce((sum, s) => sum + s.revenue, 0);
  const growthRate = firstHalfRev > 0 ? Math.round(((secondHalfRev - firstHalfRev) / firstHalfRev) * 1000) / 10 : 0;

  let trendDirection: 'ACCELERATING' | 'STEADY' | 'DECLINING' = 'STEADY';
  if (growthRate > 5) trendDirection = 'ACCELERATING';
  if (growthRate < -5) trendDirection = 'DECLINING';

  // Group by date for series plotting
  const dateMap = new Map<string, { date: string; revenue: number; units: number; margin: number }>();
  for (const item of filtered) {
    const existing = dateMap.get(item.date) || { date: item.date, revenue: 0, units: 0, margin: 0 };
    existing.revenue += item.revenue;
    existing.units += item.unitsSold;
    existing.margin += item.grossMargin;
    dateMap.set(item.date, existing);
  }

  const timeSeries = Array.from(dateMap.values()).sort((a, b) => a.date.localeCompare(b.date));

  return {
    queryScope: {
      productId: productId || 'ALL',
      storeId: storeId || 'ALL',
      days: targetDays,
    },
    metrics: {
      totalRevenue,
      totalUnits,
      totalGrossMargin,
      avgMarginRatePercent: avgMarginRate,
      dailyAvgRevenue: Math.round(totalRevenue / targetDays),
      dailyAvgUnits: Math.round((totalUnits / targetDays) * 10) / 10,
      growthRatePercent: growthRate,
      trendDirection,
    },
    recentDataPointsCount: timeSeries.length,
    samplePoints: timeSeries.slice(-7), // last 7 days summary
  };
}

/**
 * Tool 2: forecast_stockout
 * Identifies products that will run out before supplier lead time.
 */
export function executeForecastStockout(thresholdDays?: number, storeId?: string, category?: string) {
  const maxDays = thresholdDays && thresholdDays > 0 ? thresholdDays : 14;

  let atRiskItems = RETAIL_DB.inventory.filter((inv) => {
    const prod = PRODUCTS.find((p) => p.id === inv.productId)!;
    // Risk if days until stockout is less than supplier lead time or threshold
    const isRisk = inv.daysUntilStockout <= Math.max(prod.supplierLeadTimeDays, maxDays);
    const storeMatch = !storeId || storeId === 'ALL' || inv.storeId === storeId;
    const catMatch = !category || category === 'ALL' || prod.category.toLowerCase() === category.toLowerCase();
    return isRisk && storeMatch && catMatch;
  });

  // Sort by urgency: shortest days until stockout first
  atRiskItems.sort((a, b) => a.daysUntilStockout - b.daysUntilStockout);

  const formattedResults = atRiskItems.slice(0, 10).map((inv) => {
    const prod = PRODUCTS.find((p) => p.id === inv.productId)!;
    const store = STORES.find((s) => s.id === inv.storeId)!;
    const leadTimeGapDays = Math.round((prod.supplierLeadTimeDays - inv.daysUntilStockout) * 10) / 10;
    // Potential lost revenue = daily sales * price * lead time gap
    const potentialLostRevenue = Math.max(0, Math.round(inv.avgDailySales * prod.price * Math.max(1, leadTimeGapDays)));
    const recommendedOrderUnits = Math.round(inv.avgDailySales * (prod.supplierLeadTimeDays + 14));

    return {
      productId: prod.id,
      productName: prod.name,
      sku: prod.sku,
      category: prod.category,
      storeId: store.id,
      storeName: store.name,
      currentStock: inv.currentStock,
      availableStock: inv.availableStock,
      avgDailySales: inv.avgDailySales,
      daysUntilStockout: inv.daysUntilStockout,
      supplierLeadTimeDays: prod.supplierLeadTimeDays,
      supplierName: prod.supplierName,
      leadTimeDeficitDays: leadTimeGapDays > 0 ? leadTimeGapDays : 0,
      riskLevel: inv.stockoutRisk,
      recommendedOrderUnits,
      potentialLostRevenue,
      estimatedRestockCost: recommendedOrderUnits * prod.unitCost,
    };
  });

  const totalLostRevenueAtRisk = formattedResults.reduce((sum, item) => sum + item.potentialLostRevenue, 0);

  return {
    forecastHorizonDays: maxDays,
    totalAtRiskCount: atRiskItems.length,
    totalPotentialRevenueAtRisk: totalLostRevenueAtRisk,
    topCriticalItems: formattedResults,
    recommendationSummary:
      formattedResults.length > 0
        ? `Identified ${atRiskItems.length} product-store locations with imminent stockout risk. Restocking top items protects ~$${totalLostRevenueAtRisk.toLocaleString()} in revenue.`
        : 'All inventory is currently above safety threshold.',
  };
}

/**
 * Tool 3: suggest_price
 * Recommends optimized pricing strategy (clearance, margin uplift, or volume balance).
 */
export function executeSuggestPrice(productId: string, storeId?: string, objective: 'margin' | 'clearance' | 'volume' = 'margin') {
  const product = getProductById(productId) || PRODUCTS[0];
  const store = storeId && storeId !== 'ALL' ? getStoreById(storeId) : undefined;

  // Find inventory status
  const invList = RETAIL_DB.inventory.filter(
    (inv) => inv.productId === product.id && (!store || inv.storeId === store.id)
  );
  const totalStock = invList.reduce((acc, i) => acc + i.currentStock, 0);
  const avgRunRate = invList.reduce((acc, i) => acc + i.avgDailySales, 0);
  const daysOfSupply = avgRunRate > 0 ? Math.round(totalStock / avgRunRate) : 45;

  let priceChangePct = 0;
  let rationale = '';
  let projectedImpact = 0;

  if (daysOfSupply > 45 || objective === 'clearance') {
    // Overstocked -> recommend markdown to free working capital
    priceChangePct = -15;
    const newPrice = Math.round(product.price * 0.85 * 100) / 100;
    const velocityUplift = 1.45; // 45% more volume
    projectedImpact = Math.round(totalStock * 0.5 * (newPrice - product.unitCost) * 1.2);
    rationale = `High inventory (${daysOfSupply} days of supply vs target 25d). A 15% promotional markdown accelerates inventory turnover, preventing spoilage/obsolescence and releasing ~$${Math.round(totalStock * product.unitCost * 0.4).toLocaleString()} in trapped liquidity.`;
  } else if (daysOfSupply < product.supplierLeadTimeDays * 1.2 || objective === 'margin') {
    // High demand / low supply -> premium pricing uplift
    priceChangePct = 8;
    const newPrice = Math.round(product.price * 1.08 * 100) / 100;
    projectedImpact = Math.round(avgRunRate * 30 * (newPrice - product.price));
    rationale = `Strong demand velocity with tight supply (${daysOfSupply} days remaining). Inelastic demand supports an 8% price increase from $${product.price} to $${newPrice}, lifting gross margin by $${projectedImpact.toLocaleString()} without sacrificing overall sales rank.`;
  } else {
    // Dynamic micro-adjustment
    priceChangePct = 4;
    const newPrice = Math.round(product.price * 1.04 * 100) / 100;
    projectedImpact = Math.round(avgRunRate * 30 * (newPrice - product.price));
    rationale = `Healthy supply equilibrium. An incremental 4% price calibration optimizes gross margin across retail channels.`;
  }

  const suggestedPrice = Math.round(product.price * (1 + priceChangePct / 100) * 100) / 100;
  const currentMargin = Math.round((product.price - product.unitCost) * 100) / 100;
  const newMargin = Math.round((suggestedPrice - product.unitCost) * 100) / 100;
  const newMarginRate = Math.round((newMargin / suggestedPrice) * 1000) / 10;

  return {
    productId: product.id,
    productName: product.name,
    category: product.category,
    currentPrice: product.price,
    unitCost: product.unitCost,
    suggestedPrice,
    priceDeltaDollars: Math.round((suggestedPrice - product.price) * 100) / 100,
    priceDeltaPercent: priceChangePct,
    currentMarginDollars: currentMargin,
    newMarginDollars: newMargin,
    newMarginPercent: newMarginRate,
    daysOfSupply,
    storeScope: store ? store.name : 'All 5 Stores',
    estimatedMonthlyGrossMarginImpact: projectedImpact,
    rationale,
  };
}

/**
 * Tool 4: generate_offer
 * Crafts targeted promotional discount or bundle offer.
 */
export function executeGenerateOffer(productId: string, discountPercent: number, rationale?: string, storeId?: string) {
  const product = getProductById(productId) || PRODUCTS[1];
  const store = storeId && storeId !== 'ALL' ? getStoreById(storeId) : undefined;
  const disc = Math.min(40, Math.max(5, discountPercent || 15));

  const promoPrice = Math.round(product.price * (1 - disc / 100) * 100) / 100;
  const promoMargin = Math.round((promoPrice - product.unitCost) * 100) / 100;
  const promoMarginRate = Math.round((promoMargin / promoPrice) * 1000) / 10;

  // Find complementary product for cross-sell bundle
  const compProduct = PRODUCTS.find((p) => p.category === product.category && p.id !== product.id) || PRODUCTS[2];
  const bundleFullPrice = Math.round((product.price + compProduct.price) * 100) / 100;
  const bundleDiscountPrice = Math.round(bundleFullPrice * 0.82 * 100) / 100;
  const bundleSavings = Math.round((bundleFullPrice - bundleDiscountPrice) * 100) / 100;

  const estimatedUpliftVolume = Math.round(disc * 2.8); // e.g. 15% discount -> ~42% unit sales surge
  const estimatedRevenueImpact = Math.round(product.price * 15 * (disc / 10) * 12);

  const offerTitle = `${disc}% Flash Promo: ${product.name}`;

  return {
    offerId: `OFFER-${Date.now().toString().slice(-4)}`,
    title: offerTitle,
    targetProduct: {
      id: product.id,
      name: product.name,
      regularPrice: product.price,
      discountedPrice: promoPrice,
      discountPercent: disc,
      marginAfterDiscount: promoMargin,
      marginPercentAfterDiscount: promoMarginRate,
    },
    crossSellBundle: {
      bundleTitle: `Neemba Duo Pack: ${product.name} + ${compProduct.name}`,
      regularPrice: bundleFullPrice,
      bundlePrice: bundleDiscountPrice,
      customerSavings: bundleSavings,
    },
    storeScope: store ? store.name : 'Chain-wide (All 5 Stores)',
    campaignDurationDays: 7,
    estimatedUnitSalesUpliftPercent: estimatedUpliftVolume,
    estimatedGrossRevenueImpact: estimatedRevenueImpact,
    strategicRationale: rationale || `Accelerates customer acquisition and product trial while maintaining a solid ${promoMarginRate}% gross margin threshold.`,
    executionActionPayload: {
      actionType: 'PUBLISH_POS_DISCOUNT',
      productId: product.id,
      storeId: store ? store.id : 'ALL',
      newPrice: promoPrice,
      discountPercent: disc,
      validDays: 7,
    },
  };
}

/**
 * Aggregated Dashboard Metrics
 */
export function getDashboardMetrics(storeId: string = 'ALL', daysWindow: number = 30) {
  const minDayIndex = 90 - daysWindow;
  const filteredSales = RETAIL_DB.sales.filter((s) => {
    const storeMatch = storeId === 'ALL' || s.storeId === storeId;
    const timeMatch = s.dayIndex >= minDayIndex;
    return storeMatch && timeMatch;
  });

  const totalRevenue = Math.round(filteredSales.reduce((acc, s) => acc + s.revenue, 0));
  const totalCost = Math.round(filteredSales.reduce((acc, s) => acc + s.cost, 0));
  const totalGrossMargin = Math.round(totalRevenue - totalCost);
  const grossMarginPercent = totalRevenue > 0 ? Math.round((totalGrossMargin / totalRevenue) * 1000) / 10 : 0;
  const totalUnits = filteredSales.reduce((acc, s) => acc + s.unitsSold, 0);

  // Filter inventory
  const filteredInventory = RETAIL_DB.inventory.filter((inv) => storeId === 'ALL' || inv.storeId === storeId);
  const criticalStockoutCount = filteredInventory.filter((i) => i.stockoutRisk === 'CRITICAL').length;
  const warningStockoutCount = filteredInventory.filter((i) => i.stockoutRisk === 'WARNING').length;
  const overstockedCount = filteredInventory.filter((i) => i.stockoutRisk === 'OVERSTOCKED').length;
  const totalInventoryUnits = filteredInventory.reduce((acc, i) => acc + i.currentStock, 0);
  const totalInventoryValue = Math.round(
    filteredInventory.reduce((acc, i) => {
      const prod = PRODUCTS.find((p) => p.id === i.productId);
      return acc + i.currentStock * (prod?.unitCost || 0);
    }, 0)
  );

  // Group daily revenue for chart
  const dailyMap = new Map<string, { date: string; revenue: number; margin: number; units: number }>();
  for (const s of filteredSales) {
    const row = dailyMap.get(s.date) || { date: s.date, revenue: 0, margin: 0, units: 0 };
    row.revenue += s.revenue;
    row.margin += s.grossMargin;
    row.units += s.unitsSold;
    dailyMap.set(s.date, row);
  }

  const chartSeries = Array.from(dailyMap.values()).sort((a, b) => a.date.localeCompare(b.date));

  // Category breakdown
  const categoryMap = new Map<string, { category: string; revenue: number; margin: number; units: number }>();
  for (const s of filteredSales) {
    const prod = PRODUCTS.find((p) => p.id === s.productId);
    const cat = prod?.category || 'General';
    const row = categoryMap.get(cat) || { category: cat, revenue: 0, margin: 0, units: 0 };
    row.revenue += s.revenue;
    row.margin += s.grossMargin;
    row.units += s.unitsSold;
    categoryMap.set(cat, row);
  }

  return {
    totalRevenue,
    totalCost,
    totalGrossMargin,
    grossMarginPercent,
    totalUnits,
    criticalStockoutCount,
    warningStockoutCount,
    overstockedCount,
    totalInventoryUnits,
    totalInventoryValue,
    chartSeries,
    categoryBreakdown: Array.from(categoryMap.values()),
  };
}
