import { useState, useEffect, useCallback } from "react";
import KpiCard from "../../components/KpiCard";
import Table from "../../components/Table";
import ExportButton from "../../components/ExportButton";
import {
  DollarSign,
  TrendingUp,
  BarChart4,
  Loader2,
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

const columns = [
  { header: "Rank", accessor: "Rank" },
  { header: "Product", accessor: "Product" },
  { header: "Category", accessor: "Category" },
  { header: "Cost Price", accessor: "Cost Price" },
  { header: "Selling Price", accessor: "Selling Price" },
  { header: "Gross Profit", accessor: "Gross Profit" },
  { header: "Margin %", accessor: "Margin %" },
  { header: "Status", accessor: "Status" },
];

export default function Profitability() {
  const [profitData, setProfitData] = useState([]);
  const [loading, setLoading] = useState(false);

  // --- 1. CONTROLLED STATE (Single Source of Truth) ---
  const [activeFilter, setActiveFilter] = useState("Monthly");
  const [activeDate, setActiveDate] = useState(new Date());

  // Derived state for API
  const [dateRange, setDateRange] = useState({
    start: format(startOfMonth(new Date()), "yyyy-MM-dd"),
    end: format(endOfMonth(new Date()), "yyyy-MM-dd"),
  });

  // --- 2. DATE CALCULATION LOGIC ---
  const calculateDateRange = useCallback((filter, date) => {
    let start, end;
    const validDate = date instanceof Date && !isNaN(date) ? date : new Date();

    switch (filter) {
      case "Weekly":
        start = startOfWeek(validDate, { weekStartsOn: 1 });
        end = endOfWeek(validDate, { weekStartsOn: 1 });
        break;
      case "Monthly":
        start = startOfMonth(validDate);
        end = endOfMonth(validDate);
        break;
      case "Yearly":
        start = startOfYear(validDate);
        end = endOfYear(validDate);
        break;
      case "Daily":
      default:
        start = validDate;
        end = validDate;
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

  // --- 3. FETCH DATA ---
  const fetchData = useCallback(async () => {
    if (!dateRange.start || !dateRange.end) return;
    console.log("3. API Call Triggered with:", dateRange);

    setLoading(true);
    try {
      console.log(
        `Fetching Profitability: ${dateRange.start} to ${dateRange.end}`
      );

      const response = await API.get("/reports/profitability", {
        params: { start_date: dateRange.start, end_date: dateRange.end },
      });

      console.log("4. SERVER RESPONSE:", response.data.data);

      const rawData = response.data.data || [];

      const processedData = rawData.map((p, index) => {
        const margin = parseFloat(p.margin_percent || 0);
        let status = "Average";
        // Default style (Average) - Amber/Yellow
        let statusStyles = "bg-amber-50 text-amber-700 border-amber-200";

        if (margin >= 50) {
          status = "Excellent";
          // High Profit - Emerald/Green
          statusStyles = "bg-emerald-50 text-emerald-700 border-emerald-200";
        } else if (margin < 30) {
          status = "Poor";
          // Low Profit - Red
          statusStyles = "bg-red-50 text-red-700 border-red-200";
        }

        return {
          Rank: index + 1,
          Product: p.product_name,
          Category: p.category_name,
          "Cost Price": `₱${parseFloat(p.cost_price || 0).toLocaleString()}`,
          "Selling Price": `₱${parseFloat(p.selling_price || 0).toLocaleString()}`,
          "Gross Profit": `₱${parseFloat(p.gross_profit || 0).toLocaleString()}`,
          "Margin %": (
            <span
              className={`font-semibold ${
                margin >= 50
                  ? "text-emerald-500"
                  : margin < 30
                  ? "text-red-500"
                  : "text-amber-500"
              }`}
            >
              {margin.toFixed(2)}%
            </span>
          ),
          // Updated Status Badge with Minimal Style
          Status: (
            <span
              className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold border uppercase tracking-wide ${statusStyles}`}
            >
              {status}
            </span>
          ),
          // Hidden fields for export
          _marginValue: margin,
          _statusText: status,
        };
      });

      setProfitData(processedData);
    } catch (error) {
      console.error(
        "Failed to fetch profitability report:",
        error.response?.data || error
      );
      setProfitData([]);
    } finally {
      setLoading(false);
    }
  }, [dateRange.start, dateRange.end]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // --- 4. HANDLER ---
  const handleFilterChange = (newFilter, newDate) => {
    console.log("1. Parent received change:", newFilter, newDate);
    setActiveFilter(newFilter);
    setActiveDate(newDate);
  };

  // --- RENDER ---
  if (loading && profitData.length === 0) {
    return (
      <div className="default-container flex flex-col items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-navyBlue mb-4" />
        <p className="text-slate-500">Calculating Profitability...</p>
      </div>
    );
  }

  // Calculate KPIS
  const totalGrossProfit = profitData.reduce(
    (sum, p) =>
      sum +
      (parseFloat(p["Gross Profit"].replace("₱", "").replace(/,/g, "")) || 0),
    0
  );
  const totalMargin = profitData.reduce((sum, p) => sum + p._marginValue, 0);
  const averageMargin =
    profitData.length > 0 ? (totalMargin / profitData.length).toFixed(2) : 0;
  const bestMarginProduct = profitData.length > 0 ? profitData[0] : null;

  // Clean Export Data
  const exportData = profitData.map((p) => ({
    Rank: p.Rank,
    Product: p.Product,
    Category: p.Category,
    "Cost Price": p["Cost Price"].replace("₱", "PHP "),
    "Selling Price": p["Selling Price"].replace("₱", "PHP "),
    "Gross Profit": p["Gross Profit"].replace("₱", "PHP "),
    "Margin %": p._marginValue.toFixed(2) + "%",
    Status: p._statusText,
  }));

  return (
    <div className="flex flex-col space-y-5">
      {/* Header / Controls */}

      <div className="flex flex-col sm:flex-row gap-3 justify-end items-center">
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
          columns={columns}
          fileName={`Balayan Smasher's Hub_Profitability_Report_${dateRange.start}_to_${dateRange.end}`}
          title={`Product Profitability - ${dateRange.start} to ${dateRange.end}`}
        />
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <KpiCard
          bgColor="#002B50"
          title="Total Gross Profit"
          icon={<TrendingUp />}
          value={`₱${totalGrossProfit.toLocaleString("en-PH", {
            minimumFractionDigits: 2,
          })}`}
          description="Revenue minus Cost of Goods"
        />

        <KpiCard
          bgColor="#0A6DDC"
          title="Average Margin"
          icon={<BarChart4 />}
          value={`${averageMargin}%`}
          description="Average profit percentage per item"
        />
        <KpiCard
          bgColor="#1f781a"
          title="Highest Margin Item"
          icon={<DollarSign />}
          value={bestMarginProduct ? bestMarginProduct.Product : "N/A"}
          description={
            bestMarginProduct
              ? `${bestMarginProduct._marginValue.toFixed(2)}% Margin`
              : "No data"
          }
        />
      </div>

      <Table
        tableName="Products Ranked by Profit Margin"
        columns={columns}
        data={profitData}
        rowsPerPage={10}
      />
    </div>
  );
}