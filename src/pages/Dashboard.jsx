import { useState, useEffect, useCallback } from "react";
import Layout from "../components/Layout";
import KpiCard from "../components/KpiCard";
import Chart from "../components/Chart";
import { DollarSign, ShoppingCart, AlertTriangle, ArrowUp, AlertCircle, TrendingUp, Calendar, Loader2, Boxes } from "lucide-react";
import API from '../services/api';
import { format, eachDayOfInterval } from "date-fns"; // Added date-fns for gap filling

// Helper function to process percentage change
const percentChange = (current, previous) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return (((current - previous) / previous) * 100).toFixed(1);
};

export default function Dashboard() {
  const [todayChartType, setTodayChartType] = useState("revenue"); 
  const [weeklyChartType, setWeeklyChartType] = useState("revenue");
  
  const [dashboardData, setDashboardData] = useState(null);
  const [stockAlerts, setStockAlerts] = useState([]);
  const [inventorySummary, setInventorySummary] = useState(null); 
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      
      const [todayResponse, trendResponse, inventoryResponse] = await Promise.all([
        API.get('/reports/sales', { 
          params: { start_date: today, end_date: today, period: 'daily' }
        }),
        API.get('/reports/sales', { 
          params: { start_date: weekAgo, end_date: today, period: 'daily' }
        }),
        API.get('/reports/inventory')
      ]);
      
      setDashboardData({
          today: todayResponse.data.data,
          trend: trendResponse.data.data
      });

      // Set inventory data
      setStockAlerts(inventoryResponse.data.data.products_requiring_attention || []);
      setInventorySummary(inventoryResponse.data.data.summary); 
      
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading || !dashboardData) {
    return (
        <Layout>
            <div className="flex flex-col items-center justify-center h-[80vh]">
                <Loader2 className="w-10 h-10 animate-spin text-navyBlue mb-4" />
                <p className="text-slate-500">Loading dashboard...</p>
            </div>
        </Layout>
    );
  }
  
  const { summary: todaySummary, sales_by_category, top_products } = dashboardData.today;
  const { sales_trend } = dashboardData.trend;

  // SALES KPIs
  const totalRevenue = parseFloat(todaySummary?.total_revenue || 0);
  const totalTransactions = parseInt(todaySummary?.total_transactions || 0);
  
  // INVENTORY KPIs 
  const lowStock = parseInt(inventorySummary?.low_stock_count || 0);
  const outOfStock = parseInt(inventorySummary?.out_of_stock_count || 0);

  // TREND Calculation
  // We use the raw sales_trend here for quick yesterday comparison before gap filling
  const rawTrendRevenue = (sales_trend || []).map(d => parseFloat(d.total_revenue));
  const yesterdayRevenue = rawTrendRevenue[rawTrendRevenue.length - 2] || 0;
  const revenueChange = yesterdayRevenue > 0 
    ? (((totalRevenue - yesterdayRevenue) / yesterdayRevenue) * 100).toFixed(1) 
    : 0;
  const isPositiveChange = revenueChange >= 0;

  // --- DATA GAP FILLING FOR CHARTS ---
  const filledTrend = (() => {
      // Re-create the date interval used in fetchData (7 days ago to today)
      const end = new Date();
      const start = new Date();
      start.setDate(end.getDate() - 7); 

      const allDays = eachDayOfInterval({ start, end });
      
      return allDays.map(day => {
          const dateKey = format(day, 'yyyy-MM-dd');
          const found = (sales_trend || []).find(d => d.date_label === dateKey);
          return {
              label: format(day, 'MMM dd'), // Formatted for Tooltip/Axis
              revenue: found ? parseFloat(found.total_revenue) : 0,
              volume: found ? parseInt(found.total_sales_count) : 0
          };
      });
  })();

  const trendLabels = filledTrend.map(d => d.label);
  const trendRevenue = filledTrend.map(d => d.revenue);
  const trendVolume = filledTrend.map(d => d.volume);
  
  const categoryNames = (sales_by_category || []).map(c => c.category_name);
  const categoryRevenue = (sales_by_category || []).map(c => parseFloat(c.total_revenue));
  const categoryVolume = (sales_by_category || []).map(c => parseInt(c.total_volume));

  const topSelling = top_products || [];
  const maxSold = Math.max(...topSelling.map(p => p.total_sold), 1);

  const todayChartSeries = todayChartType === "revenue" 
    ? [{ name: "Revenue", data: categoryRevenue, color: "#1f781a" }] 
    : [{ name: "Volume", data: categoryVolume, color: "#002B50" }];
    
  const weeklyChartSeries = weeklyChartType === "revenue" 
    ? [{ name: "Revenue", data: trendRevenue, color: "#1f781a" }] 
    : [{ name: "Volume", data: trendVolume, color: "#002B50" }];

  return (
    <Layout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="page-title">Dashboard Overview</h1>
          <p className="page-description">Here is what's happening with your store today.</p>
        </div>
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm text-sm text-slate-600 font-medium">
          <Calendar size={16} className="text-navyBlue" />
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KpiCard 
          bgColor="#002B50" 
          title="Today's Revenue" 
          icon={<DollarSign />} 
          value={`₱${totalRevenue.toLocaleString("en-PH", {minimumFractionDigits: 2})}`} 
          description={
            <div className="flex items-center gap-2">
              <span className={`flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full ${
                isPositiveChange ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
              }`}>
                <ArrowUp size={12} className={isPositiveChange ? '' : 'rotate-180'} />
                {Math.abs(revenueChange)}%
              </span>
              <span className="opacity-70">vs yesterday</span>
            </div>
          } 
        />
        <KpiCard 
          bgColor="#1f781a" 
          title="Today's Transactions" 
          icon={<ShoppingCart />} 
          value={totalTransactions} 
          description="Completed orders today" 
        />
        
        {/* Low Stock KPI */}
        <KpiCard
          bgColor="#f59e0b"
          title="Low Stock Items"
          icon={<Boxes />}
          value={lowStock}
          description="Items requiring restocking soon"
        />

        {/* Out of Stock KPI */}
        <KpiCard
          bgColor="#ef4444"
          title="Out of Stock"
          icon={<AlertTriangle />}
          value={outOfStock}
          description="Requires immediate attention"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Chart 
          type="bar" 
          title="Today's Category Performance" 
          categories={categoryNames} 
          series={todayChartSeries} 
          height={320} 
          filter={
            <select 
              value={todayChartType} 
              onChange={(e) => setTodayChartType(e.target.value)} 
              className="appearance-none bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold uppercase tracking-wide rounded-lg py-1.5 pl-3 pr-8 shadow-sm focus:outline-none focus:ring-2 focus:ring-navyBlue/20"
            >
              <option value="revenue">By Revenue</option>
              <option value="volume">By Volume</option>
            </select>
          } 
        />
        <Chart 
          type="line" 
          title="7-Day Sales Trend" 
          categories={trendLabels} 
          series={weeklyChartSeries} 
          height={320} 
          filter={
            <select 
              value={weeklyChartType} 
              onChange={(e) => setWeeklyChartType(e.target.value)} 
              className="appearance-none bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold uppercase tracking-wide rounded-lg py-1.5 pl-3 pr-8 shadow-sm focus:outline-none focus:ring-2 focus:ring-navyBlue/20"
            >
              <option value="revenue">Revenue</option>
              <option value="volume">Volume</option>
            </select>
          } 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col h-full">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                <h3 className="text-navyBlue font-bold text-lg tracking-tight flex items-center gap-2">
                  <TrendingUp size={20} className="text-darkGreen" /> 
                  Today's Top Selling Products
                </h3>
            </div>
            <div className="p-4 overflow-y-auto max-h-[400px] hide-scrollbar">
                {topSelling.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-40 text-slate-400">
                    <Boxes size={40} className="mb-2 opacity-50" />
                    <p className="text-sm font-medium">No sales today</p>
                  </div>
                ) : (
                  topSelling.map((p, index) => (
                    <div key={index} className="group flex items-center gap-4 p-3 hover:bg-slate-100 rounded-lg transition-colors">
                        <span className={`w-8 h-8 shrink-0 flex items-center justify-center rounded-lg font-bold text-sm ${
                          index < 3 ? 'bg-navyBlue text-white' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {index + 1}
                        </span>
                        <div className="grow min-w-0">
                            <p className="font-semibold text-slate-800 text-sm truncate">{p.product_name}</p>
                            <p className="text-xs text-slate-500 truncate">{p.category_name || 'Uncategorized'}</p> 
                            <div className="mt-2 w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-darkGreen rounded-full opacity-80" 
                                style={{ width: `${(p.total_sold / maxSold) * 100}%` }}
                              ></div>
                            </div>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="font-bold text-navyBlue text-sm">{p.total_sold} Sold</p>
                          <p className="text-xs text-slate-500">₱{parseFloat(p.total_revenue || 0).toLocaleString('en-PH', {minimumFractionDigits: 2})}</p>
                        </div>
                    </div>
                  ))
                )}
            </div>
        </div>

        {/* Stock Alerts */}
        <div className="lg:col-span-1 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col h-full">
             <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-rose-50/50">
                <h3 className="text-rose-700 font-bold text-lg tracking-tight flex items-center gap-2">
                    <AlertCircle size={20} />
                    Stock Alerts
                </h3>
                <span className="bg-rose-100 text-rose-700 text-xs font-bold px-2 py-1 rounded-full">
                    {stockAlerts.length}
                </span>
            </div>
            
            <div className="p-4 overflow-y-auto max-h-[400px] space-y-3">
                {stockAlerts.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-40 text-slate-400">
                      <Boxes size={40} className="mb-2 opacity-50" />
                      <p className="text-sm font-medium">No stock alerts</p>
                  </div>
                ) : (
                  stockAlerts.map((p) => (
                    <div key={p.product_id} className="p-3 border border-slate-100 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                              <p className="font-semibold text-slate-800 text-sm">{p.product_name}</p>
                              <p className="text-xs text-slate-500">{p.category_name}</p>
                          </div>
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded ${p.quantity === 0 ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'}`}>
                              {p.quantity === 0 ? 'Out of Stock' : 'Low Stock'}
                          </span>
                        </div>
                        <div className={`flex items-center gap-2 text-xs font-medium ${p.quantity === 0 ? 'text-red-600' : 'text-orange-600'}`}>
                          <AlertTriangle size={14} />
                          <span>{p.quantity === 0 ? 'Restock immediately' : `${p.quantity} units remaining`}</span>
                        </div>
                    </div>
                  ))
                )}
            </div>
        </div>
      </div>
    </Layout>
  );
}