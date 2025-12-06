import { useState, useRef, useEffect, useCallback } from "react";
import ExportButton from "../../components/ExportButton";
import KpiCard from "../../components/KpiCard";
import Chart from "../../components/Chart";
import Table from "../../components/Table";
import {
  DollarSign,
  ShoppingCart,
  Activity,
  Star,
  Loader2,
  ArrowUp,
  RefreshCw,
} from "lucide-react";
import {
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  format,
} from "date-fns";
import CalendarFilter from "../../components/CalendarFilter";
import API from "../../services/api";

const displayColumns = [
  { header: "Product", accessor: "Product" },
  { header: "Category", accessor: "Category" },
  { header: "Quantity Sold", accessor: "Quantity Sold" },
  { header: "Revenue", accessor: "Revenue" },
  { header: "Profit", accessor: "Profit" },
  { header: "Margin %", accessor: "Margin %" },
];

const formatSalesTableData = (rawProducts) => {
  return rawProducts.map((p) => {
    const margin = parseFloat(p.margin_percent || 0);
    return {
      Product: p.product_name,
      Category: p.category_name,
      "Quantity Sold": p.total_sold,
      Revenue: `₱${(p.total_revenue || 0).toLocaleString()}`,
      Profit: `₱${(p.total_profit || 0).toLocaleString()}`,
      "Margin %": (
        <span
          className={`font-medium ${
            margin >= 50
              ? "text-emerald-600"
              : margin < 30
              ? "text-rose-500"
              : "text-yellow-500"
          }`}
        >
          {margin.toFixed(1)}%
        </span>
      ),
      _rawRevenue: p.total_revenue || 0,
      _rawProfit: p.total_profit || 0,
      _rawMargin: margin,
    };
  });
};

export default function SalesReport() {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [trendFilter, setTrendFilter] = useState("revenue");
  const [categoryFilter, setCategoryFilter] = useState("revenue");
  const reportRef = useRef(null);

  // STATE MANAGEMENT FIX: Control the filter and date from the parent
  const [activeFilter, setActiveFilter] = useState("Daily");
  const [activeDate, setActiveDate] = useState(new Date());

  // Derived state for API calls
  const [dateRange, setDateRange] = useState({
    start: format(new Date(), "yyyy-MM-dd"),
    end: format(new Date(), "yyyy-MM-dd"),
  });

  const COLORS = { navy: "#002B50", green: "#1f781a", amber: "#f59e0b" };

  // Calculate Start/End dates whenever Filter or Date changes
  const calculateDateRange = useCallback((filter, date) => {
    let start, end;

    switch (filter) {
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
    return {
      start: format(start, "yyyy-MM-dd"),
      end: format(end, "yyyy-MM-dd"),
    };
  }, []);

  // Update date range when UI state changes
  useEffect(() => {
    const range = calculateDateRange(activeFilter, activeDate);
    setDateRange(range);
  }, [activeFilter, activeDate, calculateDateRange]);

  const fetchData = useCallback(async () => {
    // Prevent fetching if start/end are null (initial load safety)
    if (!dateRange.start || !dateRange.end) return;

    setLoading(true);
    try {
      console.log(
        `🔄 Fetching sales data from ${dateRange.start} to ${dateRange.end}`
      );

      const salesRes = await API.get("/reports/sales", {
        params: {
          start_date: dateRange.start,
          end_date: dateRange.end,
          period: "daily",
        },
      });

      setReportData({
        ...salesRes.data.data,
        start_date: dateRange.start,
        end_date: dateRange.end,
      });
    } catch (error) {
      console.error(
        "❌ Failed to fetch sales report:",
        error.response?.data || error
      );
      setReportData(null);
    } finally {
      setLoading(false);
    }
  }, [dateRange.start, dateRange.end]);

  // Fetch when the CALCULATED date range changes
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handler passed to CalendarFilter
  const handleFilterChange = (newFilter, newDate) => {
    setActiveFilter(newFilter);
    setActiveDate(newDate);
  };

  // --- Render Logic ---

  if (loading && !reportData) {
    return (
      <div className="default-container flex flex-col items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-navyBlue mb-4" />
        <p className="text-slate-500">Generating Sales Report...</p>
      </div>
    );
  }

  // Safety check for first render before data arrives
  if (!reportData) return null;

  const {
    summary,
    sales_trend,
    sales_by_category,
    payment_methods,
    top_products,
  } = reportData;

  const currentRevenue = parseFloat(summary?.total_revenue || 0);
  const currentTransactions = parseInt(summary?.total_transactions || 0);
  const avgTransaction = parseFloat(summary?.average_transaction_value || 0);
  const prevRevenue = currentRevenue / 1.1; // Placeholder logic from your code
  const saleChange = ((currentRevenue - prevRevenue) / prevRevenue) * 100;

  const trendLabels = (sales_trend || []).map((d) => d.date_label);
  const trendRevenue = (sales_trend || []).map((d) =>
    parseFloat(d.total_revenue)
  );
  const trendVolume = (sales_trend || []).map((d) =>
    parseInt(d.total_sales_count)
  );

  const categoryNames = (sales_by_category || []).map((c) => c.category_name);
  const categoryRevenue = (sales_by_category || []).map((c) =>
    parseFloat(c.total_revenue)
  );
  const categoryVolume = (sales_by_category || []).map((c) =>
    parseInt(c.total_volume)
  );

  const normalizePaymentMethod = (method) => {
    if (!method) return "GCash";
    const normalized = method.trim();
    if (["Mobile", "mobile", "Unknown", ""].includes(normalized))
      return "GCash";
    return normalized.charAt(0).toUpperCase() + normalized.slice(1);
  };

  const paymentLabels = (payment_methods || []).map((p) =>
    normalizePaymentMethod(p.payment_method)
  );
  const paymentCounts = (payment_methods || []).map((p) =>
    parseInt(p.usage_count)
  );

  const filteredTrendSeries =
    trendFilter === "volume"
      ? [{ name: "Sales Volume", data: trendVolume, color: COLORS.navy }]
      : [{ name: "Revenue", data: trendRevenue, color: COLORS.green }];

  const categoryChartData = () => {
    return categoryFilter === "volume"
      ? [{ name: "Volume", data: categoryVolume, color: COLORS.navy }]
      : [{ name: "Revenue", data: categoryRevenue, color: COLORS.green }];
  };

  const topProductsTableData = formatSalesTableData(top_products || []);

  const exportData = topProductsTableData.map((item) => ({
    Product: item.Product,
    Category: item.Category,
    "Quantity Sold": item["Quantity Sold"],
    Revenue: `PHP ${item._rawRevenue.toLocaleString(undefined, {
      minimumFractionDigits: 2,
    })}`,
    Profit: `PHP ${item._rawProfit.toLocaleString(undefined, {
      minimumFractionDigits: 2,
    })}`,
    "Margin %": `${item._rawMargin.toFixed(2)}%`,
  }));

  const fileName = `Balayan Smasher's Hub_Sales_Report_${reportData.start_date}_to_${reportData.end_date}`;
  const topPaymentDisplay = normalizePaymentMethod(summary?.top_payment_method);

  return (
    <div className="flex flex-col space-y-6" ref={reportRef}>
      <div className="flex flex-row gap-3 justify-end items-center">
        <button
          onClick={fetchData}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 hover:text-navyBlue hover:border-navyBlue/30 rounded-lg transition-all shadow-sm"
        >
          {loading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <RefreshCw size={16} />
          )}
          <span className="hidden sm:inline">Refresh</span>
        </button>
        <CalendarFilter
          activeFilter={activeFilter}
          activeDate={activeDate}
          onChange={handleFilterChange}
        />

        <ExportButton
          data={exportData}
          columns={displayColumns}
          fileName={fileName}
          title={`Sales Report - ${dateRange.start} to ${dateRange.end}`}
          domElementRef={reportRef}
        />
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard
          bgColor={COLORS.navy}
          title="Total Revenue"
          icon={<DollarSign />}
          value={`₱${currentRevenue.toLocaleString("en-PH", {
            minimumFractionDigits: 2,
          })}`}
          description={
            <div className="flex items-center gap-2">
              <span
                className={`flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full ${
                  saleChange >= 0
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-rose-100 text-rose-700"
                }`}
              >
                <ArrowUp
                  size={12}
                  className={saleChange >= 0 ? "" : "rotate-180"}
                />{" "}
                {Math.abs(saleChange).toFixed(1)}%
              </span>
              <span className="opacity-70">vs last period</span>
            </div>
          }
        />
        <KpiCard
          bgColor={COLORS.navy}
          title="Transactions"
          icon={<ShoppingCart />}
          value={currentTransactions}
          description="Total completed orders"
        />
        <KpiCard
          bgColor={COLORS.green}
          title="Avg. Transaction"
          icon={<Activity />}
          value={`₱${avgTransaction.toLocaleString("en-PH", {
            minimumFractionDigits: 2,
          })}`}
          description="Per order value"
        />
        <KpiCard
          bgColor={COLORS.green}
          title="Top Payment"
          icon={<Star />}
          value={topPaymentDisplay}
          description="Most frequently used"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Chart
          type="line"
          title="Trend Analysis"
          categories={trendLabels}
          series={filteredTrendSeries}
          height={340}
          filter={
            <select
              value={trendFilter}
              onChange={(e) => setTrendFilter(e.target.value)}
              className="appearance-none bg-slate-50 border border-slate-200 text-slate-700 text-sm font-medium rounded-lg py-2 pl-3 pr-8 outline-none focus:ring-2 focus:ring-navyBlue/20"
            >
              <option value="revenue">Revenue</option>
              <option value="volume">Sales Volume</option>
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
              className="appearance-none bg-slate-50 border border-slate-200 text-slate-700 text-sm font-medium rounded-lg py-2 pl-3 pr-8 outline-none focus:ring-2 focus:ring-navyBlue/20"
            >
              <option value="revenue">By Revenue</option>
              <option value="volume">By Volume</option>
            </select>
          }
        />
      </div>

      {/* Bottom Section */}
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
