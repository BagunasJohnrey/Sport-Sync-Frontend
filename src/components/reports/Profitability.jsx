import { useState, useEffect, useCallback, useRef } from "react";
import KpiCard from "../../components/KpiCard";
import Table from "../../components/Table";
import ExportButton from "../../components/ExportButton";
import { DollarSign, TrendingUp, BarChart4, Loader2 } from "lucide-react";
// import { products, categories, transactions } from "../../mockData"; // REMOVED
import CalendarFilter from  "../../components/CalendarFilter";
import API from '../../services/api';


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
    const reportRef = useRef(null); 

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            // API call to fetch product profitability analysis
            const response = await API.get('/reports/profitability');
            const rawData = response.data.data || [];
            
            // --- Process and Format Data ---
            const processedData = rawData
                .map((p, index) => {
                    const margin = parseFloat(p.margin_percent || 0);
                    let status = "";
                    let statusBg = "";
                    if (margin >= 50) {
                        status = "Excellent";
                        statusBg = "bg-darkGreen";
                    } else if (margin < 30) {
                        status = "Poor";
                        statusBg = "bg-crimsonRed";
                    } else {
                        status = "Average";
                        statusBg = "bg-amberOrange";
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
                        marginValue: margin 
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
        fetchData();
    }, [fetchData]);

    if (loading) {
        return (
            <div className="default-container flex flex-col items-center justify-center h-96">
                <Loader2 className="w-8 h-8 animate-spin text-navyBlue mb-4" />
                <p className="text-slate-500">Calculating Profitability...</p>
            </div>
        );
    }

    // Calculate KPIS from the fetched/processed data
    const totalGrossProfit = profitData.reduce((sum, p) => sum + (parseFloat(p["Gross Profit"].replace('₱', '').replace(/,/g, '')) || 0), 0);
    const totalMargin = profitData.reduce((sum, p) => sum + p.marginValue, 0);
    const averageMargin = profitData.length > 0 ? (totalMargin / profitData.length).toFixed(2) : 0;
    const bestMarginProduct = profitData.length > 0 ? profitData[0] : null;

    // Export Data (clean strings/numbers)
    const exportData = profitData.map(p => ({
        Rank: p.Rank,
        Product: p.Product,
        Category: p.Category,
        "Cost Price": p["Cost Price"],
        "Selling Price": p["Selling Price"],
        "Gross Profit": p["Gross Profit"],
        "Margin %": p.marginValue.toFixed(2) + "%",
        Status: p.Status.props.children
    }));

    return (
        <div className="flex flex-col space-y-5" ref={reportRef}>
            <div className="flex gap-5 justify-end">
                <CalendarFilter/>
                <div>
                    <ExportButton
                        data={exportData}
                        columns={columns}
                        fileName={`Profitability_Report_${new Date().toISOString().split('T')[0]}`}
                        title="Product Profitability Analysis"
                        domElementRef={reportRef}
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
                    description={bestMarginProduct ? `Margin: ${bestMarginProduct.marginValue.toFixed(2)}%` : 'No data'}
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