import { useState, useEffect, useCallback } from "react";
import KpiCard from "../../components/KpiCard";
import Table from "../../components/Table";
import ExportButton from "../../components/ExportButton";
import { DollarSign, TrendingUp, BarChart4, Loader2 } from "lucide-react";
import CalendarFilter from "../../components/CalendarFilter";
import API from '../../services/api';
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, format } from "date-fns";

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
    const [loading, setLoading] = useState(true);

    const [startDate, setStartDate] = useState(format(startOfMonth(new Date()), 'yyyy-MM-dd'));
    const [endDate, setEndDate] = useState(format(endOfMonth(new Date()), 'yyyy-MM-dd'));

    const fetchData = useCallback(async (start, end) => {
        setLoading(true);
        try {
            const response = await API.get('/reports/profitability', {
                params: { start_date: start, end_date: end }
            });
            const rawData = response.data.data || [];
            
            const processedData = rawData.map((p, index) => {
                const margin = parseFloat(p.margin_percent || 0);
                let status = "Average";
                let statusBg = "bg-amberOrange";
                
                if (margin >= 50) {
                    status = "Excellent";
                    statusBg = "bg-darkGreen";
                } else if (margin < 30) {
                    status = "Poor";
                    statusBg = "bg-crimsonRed";
                }

                return {
                    Rank: index + 1,
                    Product: p.product_name,
                    Category: p.category_name,
                    "Cost Price": `₱${parseFloat(p.cost_price || 0).toLocaleString()}`,
                    "Selling Price": `₱${parseFloat(p.selling_price || 0).toLocaleString()}`,
                    "Gross Profit": `₱${parseFloat(p.gross_profit || 0).toLocaleString()}`,
                    "Margin %": (
                        <span className={margin >= 50 ? "text-green-600" : margin < 30 ? "text-red-500" : "text-yellow-500"}>
                            {margin.toFixed(2)}%
                        </span>
                    ),
                    Status: (
                        <span className={`text-white px-2 py-1 rounded-full text-xs ${statusBg}`}>
                            {status}
                        </span>
                    ),
                    // Hidden fields for clean export
                    _marginValue: margin,
                    _statusText: status
                };
            });
            
            setProfitData(processedData);

        } catch (error) {
            console.error("Failed to fetch profitability report:", error.response?.data || error);
            setProfitData([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData(startDate, endDate);
    }, [fetchData, startDate, endDate]);

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

    if (loading) {
        return (
            <div className="default-container flex flex-col items-center justify-center h-96">
                <Loader2 className="w-8 h-8 animate-spin text-navyBlue mb-4" />
                <p className="text-slate-500">Calculating Profitability...</p>
            </div>
        );
    }

    // Calculate KPIS
    const totalGrossProfit = profitData.reduce((sum, p) => sum + (parseFloat(p["Gross Profit"].replace('₱', '').replace(/,/g, '')) || 0), 0);
    const totalMargin = profitData.reduce((sum, p) => sum + p._marginValue, 0);
    const averageMargin = profitData.length > 0 ? (totalMargin / profitData.length).toFixed(2) : 0;
    const bestMarginProduct = profitData.length > 0 ? profitData[0] : null;

    // --- CLEAN EXPORT DATA ---
    // Replace ₱ with PHP
    const exportData = profitData.map(p => ({
        Rank: p.Rank,
        Product: p.Product,
        Category: p.Category,
        "Cost Price": p["Cost Price"].replace('₱', 'PHP '),
        "Selling Price": p["Selling Price"].replace('₱', 'PHP '),
        "Gross Profit": p["Gross Profit"].replace('₱', 'PHP '),
        "Margin %": p._marginValue.toFixed(2) + "%", 
        Status: p._statusText 
    }));

    return (
        <div className="flex flex-col space-y-5">
            <div className="flex gap-5 justify-end">
                <CalendarFilter onChange={handleDateFilterChange} />
                <div>
                    <ExportButton
                        data={exportData}
                        columns={columns}
                        fileName={`Profitability_Report_${startDate}_to_${endDate}`}
                        title="Product Profitability Analysis"
                    />
                </div>
            </div>

            {/* KPI */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <KpiCard
                    bgColor="#002B50"
                    title="Total Gross Profit"
                    icon={<TrendingUp />}
                    value={`₱${totalGrossProfit.toLocaleString('en-PH', {minimumFractionDigits: 2})}`}
                />
                <KpiCard
                    bgColor="#0A6DDC"
                    title="Average Margin"
                    icon={<BarChart4/>}
                    value={`${averageMargin}%`}
                />
                <KpiCard
                    bgColor="#1f781a"
                    title="Most Profitable Item"
                    icon={<DollarSign />}
                    value={bestMarginProduct ? bestMarginProduct.Product : 'N/A'}
                    description={bestMarginProduct ? `Margin: ${bestMarginProduct._marginValue.toFixed(2)}%` : 'No data'}
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