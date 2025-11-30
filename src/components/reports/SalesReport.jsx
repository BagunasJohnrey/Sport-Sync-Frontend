import { useState, useRef } from "react";
import ExportButton from "../../components/ExportButton";
import KpiCard from "../../components/KpiCard";
import Chart from "../../components/Chart";
import Table from "../../components/Table";
import { DollarSign, ShoppingCart, Activity, Star } from "lucide-react";
import { products, sales, categories, transactions } from "../../mockData";
import CalendarFilter from  "../../components/CalendarFilter";


// ... (Keep your existing data preparation logic for charts) ...
// 1. Line Chart Data
const lineDates = sales.daily.map((d) => d.date);
const salesTrend = sales.daily.map((d) => d.volume);
const revenueTrend = sales.daily.map((d) => d.revenue);

// 2. Category Metrics
const categoryMetrics = categories.map((c) => {
  const catTransactions = transactions.filter(
    (t) =>
      categories.find(
        (cat) =>
          cat.id === products.find((p) => p.id === t.product_id).category_id
      )?.id === c.id
  );

  return {
    name: c.category_name,
    revenue: catTransactions.reduce((acc, t) => acc + t.total_amount, 0),
    volume: catTransactions.reduce((acc, t) => acc + t.quantity, 0),
    transactions: catTransactions.length,
  };
});
const categoryNames = categoryMetrics.map((m) => m.name);

// 3. Payment Methods
const paymentMethods = ["Cash", "Card", "GCash"];
const paymentCounts = paymentMethods.map(
  (method) => transactions.filter((t) => t.payment_method === method).length
);

// 4. Products Table Data Logic
const categoryMap = categories.reduce((acc, c) => {
  acc[c.id] = c.category_name;
  return acc;
}, {});

// --- FIX: Create Raw Data for Calculations ---
const rawProductSales = products.map((p) => {
  const productTransactions = transactions.filter((t) => t.product_id === p.id);
  const quantitySold = productTransactions.reduce((sum, t) => sum + t.quantity, 0);
  const revenue = productTransactions.reduce((sum, t) => sum + t.total_amount, 0);
  const profit = revenue - quantitySold * p.cost_price;
  const margin = revenue > 0 ? (profit / revenue) * 100 : 0;

  return {
    product: p.product_name,
    category: categoryMap[p.category_id],
    quantitySold,
    revenue,
    profit,
    margin,
  };
});

// Sort
const sortedProducts = rawProductSales
  .sort((a, b) => b.quantitySold - a.quantitySold)
  .slice(0, 10);

// --- 1. Data for Display (JSX allowed) ---
const displayData = sortedProducts.map((p) => ({
  Product: p.product,
  Category: p.category,
  "Quantity Sold": p.quantitySold,
  Revenue: `₱${p.revenue.toLocaleString()}`,
  Profit: `₱${p.profit.toLocaleString()}`,
  "Margin %": (
    <span
      className={`font-medium ${
        p.margin >= 50 ? "text-emerald-600" : p.margin < 30 ? "text-rose-500" : "text-amber-500"
      }`}
    >
      {p.margin.toFixed(1)}%
    </span>
  ),
}));

// --- 2. Data for Export (Pure Strings/Numbers only) ---
// This fixes the weird characters issue.
const exportData = sortedProducts.map((p) => ({
  Product: p.product,
  Category: p.category,
  "Quantity Sold": p.quantitySold,
  Revenue: p.revenue.toFixed(2), // Clean number
  Profit: p.profit.toFixed(2),   // Clean number
  "Margin %": `${p.margin.toFixed(1)}%`, // Clean string
}));

const displayColumns = [
  { header: "Product", accessor: "Product" },
  { header: "Category", accessor: "Category" },
  { header: "Quantity Sold", accessor: "Quantity Sold" },
  { header: "Revenue", accessor: "Revenue" },
  { header: "Profit", accessor: "Profit" },
  { header: "Margin %", accessor: "Margin %" },
];

export default function SalesReport() {
  const [trendFilter, setTrendFilter] = useState("both");
  const [categoryFilter, setCategoryFilter] = useState("revenue");
  
  // Ref for the entire container to capture charts
  const reportRef = useRef(null); 

  // Colors
  const COLORS = {
    navy: "#002B50",
    green: "#1f781a",
    amber: "#f59e0b",
  };

  // Logic for Trend Chart
  const filteredTrendSeries =
    trendFilter === "sales"
      ? [{ name: "Sales Volume", data: salesTrend, color: COLORS.navy }]
      : trendFilter === "revenue"
      ? [{ name: "Revenue", data: revenueTrend, color: COLORS.green }]
      : [
          { name: "Sales Volume", data: salesTrend, color: COLORS.navy },
          { name: "Revenue", data: revenueTrend, color: COLORS.green },
        ];

  // Logic for Category Chart
  const categoryChartData = () => {
    switch (categoryFilter) {
      case "revenue":
        return [{ name: "Revenue", data: categoryMetrics.map((m) => m.revenue), color: COLORS.green }];
      case "volume":
        return [{ name: "Volume", data: categoryMetrics.map((m) => m.volume), color: COLORS.navy }];
      case "transactions":
        return [{ name: "Transactions", data: categoryMetrics.map((m) => m.transactions), color: COLORS.amber }];
      default:
        return [];
    }
  };

  // Generate Filename with Date
  const dateStr = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const fileName = `Sales_Report_${dateStr}`;
 

  return (
    <div className="flex flex-col space-y-6" ref={reportRef}>
      <div className="flex gap-5 justify-end">

      {/* Calendar */}

       <CalendarFilter/>
       

          <ExportButton
            data={exportData} 
            columns={displayColumns}
            fileName={fileName}
            title={`Sales Report - ${dateStr}`}
            
            domElementRef={reportRef} 
          />
        
      </div>

      {/* 1. KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard bgColor={COLORS.navy} title="Total Revenue" icon={<DollarSign />} value="₱100k" description="Total revenue generated" />
        <KpiCard bgColor={COLORS.navy} title="Transactions" icon={<ShoppingCart />} value="142" description="Completed orders" />
        <KpiCard bgColor={COLORS.green} title="Avg. Transaction" icon={<Activity />} value="₱704" description="Per order value" />
        <KpiCard bgColor={COLORS.green} title="Top Payment" icon={<Star />} value="Cash" description="35% of all orders" />
      </div>

      {/* 2. Top Row Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Chart
          type="line"
          title="Trend Analysis"
          categories={lineDates}
          series={filteredTrendSeries}
          height={340}
          filter={
            <select
              value={trendFilter}
              onChange={(e) => setTrendFilter(e.target.value)}
              className="appearance-none bg-slate-50 border border-slate-200 text-slate-700 text-sm font-medium rounded-lg py-2 pl-3 pr-8 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#002B50]/20 cursor-pointer hover:border-slate-300 transition-colors"
            >
              <option value="both">All Metrics</option>
              <option value="sales">Sales Volume</option>
              <option value="revenue">Revenue</option>
            </select>
          }
        />

        <Chart
          type="bar"
          title="Category Performance"
          categories={categoryNames}
          series={categoryChartData()}
          height={340}
          filter={
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="appearance-none bg-slate-50 border border-slate-200 text-slate-700 text-sm font-medium rounded-lg py-2 pl-3 pr-8 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#002B50]/20 cursor-pointer hover:border-slate-300 transition-colors"
            >
              <option value="revenue">By Revenue</option>
              <option value="volume">By Volume</option>
              <option value="transactions">By Transactions</option>
            </select>
          }
        />
      </div>

      {/* 3. Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Chart
            type="donut"
            title="Payment Distribution"
            categories={["Cash", "Card", "GCash"]}
            series={paymentCounts}
            height={360}
          />
        </div>

        <div className="lg:col-span-2">
          {/* Note: Pass displayData here for the screen, but exportData is used in ExportButton */}
          <Table
            tableName="Top Selling Products"
            columns={displayColumns}
            data={displayData} 
            rowsPerPage={5}
          />
        </div>
      </div>
    </div>
  );
}