import { useState, useRef, useEffect, useCallback } from "react";
import ExportButton from "../../components/ExportButton";
import KpiCard from "../../components/KpiCard";
import Chart from "../../components/Chart";
import Table from "../../components/Table";
import { DollarSign, ShoppingCart, Activity, Star, Loader2, ArrowUp } from "lucide-react";
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, format } from "date-fns";
import CalendarFilter from  "../../components/CalendarFilter";
import API from '../../services/api';


// Table Columns (Define once)
const displayColumns = [
  { header: "Product", accessor: "Product" },
  { header: "Category", accessor: "Category" },
  { header: "Quantity Sold", accessor: "Quantity Sold" },
  { header: "Revenue", accessor: "Revenue" },
  { header: "Profit", accessor: "Profit" },
  { header: "Margin %", accessor: "Margin %" },
];

// Helper to convert raw data to table format
const formatSalesTableData = (rawProducts) => {
    return rawProducts.map((p) => {
        // FIX: Ensure profitability data exists and margin is parsed as a number
        const profitability = p.profitability;
        const margin = parseFloat(profitability?.margin_percent || 0);

        return {
            Product: p.product_name,
            Category: p.category_name,
            "Quantity Sold": p.total_sold,
            Revenue: `₱${(p.total_revenue || 0).toLocaleString()}`,
            Profit: `₱${(p.total_profit || 0).toLocaleString()}`,
            "Margin %": (
                <span
                    className={`font-medium ${
                        margin >= 50 ? "text-emerald-600" : margin < 30 ? "text-rose-500" : "text-yellow-500"
                    }`}
                >
                    {margin.toFixed(1)}%
                </span>
            ),
        };
    });
};

export default function SalesReport() {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [trendFilter, setTrendFilter] = useState("revenue");
  const [categoryFilter, setCategoryFilter] = useState("revenue");
  const reportRef = useRef(null); 
  
  // State for date range (defaults to a fixed 30-day range for first load)
  const [startDate, setStartDate] = useState(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);

  // Colors
  const COLORS = {
    navy: "#002B50",
    green: "#1f781a",
    amber: "#f59e0b",
  };

  const fetchData = useCallback(async (start, end, period = 'daily') => {
    setLoading(true);
    try {
        const [salesRes, profitabilityRes] = await Promise.all([
            // 1. Fetch Sales Dashboard Data (KPIs, Trend, Categories, Payments)
            API.get('/reports/sales', { params: { start_date: start, end_date: end, period } }),
            // 2. Fetch Product Profitability (for detailed table margins)
            API.get('/reports/profitability')
        ]);
        
        // Merge profitability into top_products data structure
        const profitabilityMap = (profitabilityRes.data.data || []).reduce((acc, p) => {
            acc[p.product_name] = p;
            return acc;
        }, {});

        const mergedTopProducts = (salesRes.data.data.top_products || []).map(tp => ({
            ...tp,
            profitability: profitabilityMap[tp.product_name] || {}
        }));

        setReportData({
            ...salesRes.data.data,
            top_products: mergedTopProducts,
            start_date: start,
            end_date: end
        });
        
    } catch (error) {
        console.error("Failed to fetch sales report:", error.response?.data || error);
        setReportData(null);
    } finally {
        setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(startDate, endDate);
  }, [startDate, endDate, fetchData]);

  // Handler for CalendarFilter changes
const handleDateFilterChange = (filterType, date) => {
    let start, end;
    
    switch (filterType) {
        case "Weekly":
            start = startOfWeek(date, { weekStartsOn: 1 });
            end = endOfWeek(date, { weekStartsOn: 1 });
            break;
        case "Monthly":
            start = startOfMonth(date);
            end = endOfMonth(date);
            break;
        case "Yearly":
            start = startOfYear(date);
            end = endOfYear(date);
            break;
        case "Daily":
        default:
            start = date;
            end = date;
            break;
    }

    setStartDate(format(start, 'yyyy-MM-dd'));
    setEndDate(format(end, 'yyyy-MM-dd'));
  };


  if (loading || !reportData) {
    return (
        <div className="default-container flex flex-col items-center justify-center h-96">
            <Loader2 className="w-8 h-8 animate-spin text-navyBlue mb-4" />
            <p className="text-slate-500">Generating Sales Report...</p>
        </div>
    );
  }

  // --- Data Consumption ---
  const { summary, sales_trend, sales_by_category, payment_methods, top_products } = reportData;

  const currentRevenue = parseFloat(summary.total_revenue || 0);
  const currentTransactions = parseInt(summary.total_transactions || 0);
  const avgTransaction = parseFloat(summary.average_transaction_value || 0);

  // Chart Series
  const trendLabels = (sales_trend || []).map(d => d.date_label);
  const trendRevenue = (sales_trend || []).map(d => parseFloat(d.total_revenue));
  const trendVolume = (sales_trend || []).map(d => parseInt(d.total_sales_count));

  const categoryNames = (sales_by_category || []).map(c => c.category_name);
  const categoryRevenue = (sales_by_category || []).map(c => parseFloat(c.total_revenue));
  const categoryVolume = (sales_by_category || []).map(c => parseInt(c.total_volume));

  // KPI calculations (requires previous period data, mocked here as 10% lower)
  const prevRevenue = currentRevenue / 1.1; 
  const saleChange = ((currentRevenue - prevRevenue) / prevRevenue) * 100;
  
  const paymentLabels = (payment_methods || []).map(p => p.payment_method);
  const paymentCounts = (payment_methods || []).map(p => parseInt(p.usage_count));

  // --- Dynamic Chart Props ---
  const filteredTrendSeries =
    trendFilter === "volume"
      ? [{ name: "Sales Volume", data: trendVolume, color: COLORS.navy }]
      : trendFilter === "revenue"
      ? [{ name: "Revenue", data: trendRevenue, color: COLORS.green }]
      : [
          { name: "Sales Volume", data: trendVolume, color: COLORS.navy },
          { name: "Revenue", data: trendRevenue, color: COLORS.green },
        ];

  const categoryChartData = () => {
    switch (categoryFilter) {
      case "revenue":
        return [{ name: "Revenue", data: categoryRevenue, color: COLORS.green }];
      case "volume":
        return [{ name: "Volume", data: categoryVolume, color: COLORS.navy }];
      default: // default to transactions count, if available
        return [{ name: "Revenue", data: categoryRevenue, color: COLORS.green }];
    }
  };
  
  const topProductsTableData = formatSalesTableData(top_products || []); // SAFE CALL

  // Generate Filename with Date
  const fileName = `Sales_Report_${reportData.start_date}_to_${reportData.end_date}`;
 

  return (
    <div className="flex flex-col space-y-6" ref={reportRef}>
      <div className="flex gap-5 justify-end">

        <CalendarFilter onChange={handleDateFilterChange} />
       
          <ExportButton
            data={topProductsTableData} 
            columns={displayColumns}
            fileName={fileName}
            title={`Sales Report - ${reportData.start_date} to ${reportData.end_date}`}
            domElementRef={reportRef} 
          />
        
      </div>

      {/* 1. KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard 
            bgColor={COLORS.navy} 
            title="Total Revenue" 
            icon={<DollarSign />} 
            value={`₱${currentRevenue.toLocaleString('en-PH', {minimumFractionDigits: 2})}`} 
            description={
                <div className="flex items-center gap-2">
                    <span className={`flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full ${saleChange >= 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                        <ArrowUp size={12} className={saleChange >= 0 ? '' : 'rotate-180'}/> 
                        {Math.abs(saleChange).toFixed(1)}%
                    </span>
                    <span className="opacity-70">vs last period</span>
                </div>
            }
        />
        <KpiCard bgColor={COLORS.navy} title="Transactions" icon={<ShoppingCart />} value={currentTransactions} description="Total completed orders" />
        <KpiCard bgColor={COLORS.green} title="Avg. Transaction" icon={<Activity />} value={`₱${avgTransaction.toLocaleString('en-PH', {minimumFractionDigits: 2})}`} description="Per order value" />
        <KpiCard bgColor={COLORS.green} title="Top Payment" icon={<Star />} value={summary.top_payment_method || 'N/A'} description="Most frequently used" />
      </div>

      {/* 2. Top Row Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Chart
          type="line"
          title="Trend Analysis (Revenue vs Volume)"
          categories={trendLabels}
          series={filteredTrendSeries}
          height={340}
          filter={
            <select
              value={trendFilter}
              onChange={(e) => setTrendFilter(e.target.value)}
              className="appearance-none bg-slate-50 border border-slate-200 text-slate-700 text-sm font-medium rounded-lg py-2 pl-3 pr-8 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#002B50]/20 cursor-pointer hover:border-slate-300 transition-colors"
            >
              <option value="both">All Metrics</option>
              <option value="volume">Sales Volume</option>
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
            categories={paymentLabels}
            series={paymentCounts}
            height={360}
          />
        </div>

        <div className="lg:col-span-2">
          <Table
            tableName="Top Selling Products (Quantity)"
            columns={displayColumns}
            data={topProductsTableData} 
            rowsPerPage={5}
          />
        </div>
      </div>
    </div>
  );
}