import { useState, useEffect, useCallback, useRef } from "react";
import KpiCard from "../../components/KpiCard";
import Table from "../../components/Table";
import ExportButton from "../../components/ExportButton";
import { DollarSign, Box, Boxes, AlertTriangle, Loader2 } from "lucide-react";
import CalendarFilter from "../../components/CalendarFilter";
import API from '../../services/api';

const columns = [
    { header: "Category", accessor: "Category" },
    { header: "Products", accessor: "Products" },
    { header: "Total Stock", accessor: "Total Stock" },
    { header: "Total Value", accessor: "Total Value" },
    { header: "Low Stock Counts", accessor: "Low Stock Counts" },
];

const stockColumns = [
    { header: "Product", accessor: "Product" },
    { header: "Current Stock", accessor: "Current Stock" },
    { header: "Reorder Point", accessor: "Reorder Point" },
    { header: "Status", accessor: "Status" },
];

export default function InventoryReport() {
    const [reportData, setReportData] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const response = await API.get('/reports/inventory');
            setReportData(response.data.data);
        } catch (error) {
            console.error("Failed to fetch inventory report:", error.response?.data || error);
            setReportData(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    if (loading || !reportData || !reportData.summary || !reportData.inventory_by_category) {
        return (
            <div className="default-container flex flex-col items-center justify-center h-96">
                <Loader2 className="w-8 h-8 animate-spin text-navyBlue mb-4" />
                <p className="text-slate-500">Generating Inventory Report...</p>
            </div>
        );
    }
    
    const { summary, inventory_by_category, products_requiring_attention } = reportData;

    // Data for Table 1 (Inventory by Category) - Display (Keep ₱ for UI)
    const categoryData = (inventory_by_category || []).map(cat => ({
        Category: cat.category_name,
        Products: cat.product_count,
        "Total Stock": cat.total_stock.toLocaleString(),
        "Total Value": `₱${parseFloat(cat.total_value || 0).toLocaleString('en-PH', {minimumFractionDigits: 2})}`,
        "Low Stock Counts": cat.low_stock_count
    }));

    // Data for Table 2 (Products Requiring Attention)
    const attentionProducts = (products_requiring_attention || []).map(p => ({
        Product: p.product_name,
        "Current Stock": p.quantity,
        "Reorder Point": p.reorder_level,
        Status: p.quantity === 0 
            ? <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs whitespace-nowrap">Out of Stock</span> 
            : <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs">Low Stock</span>,
    }));

    // KPI Stats
    const totalProducts = parseInt(summary.total_products || 0);
    const lowStockCount = parseInt(summary.low_stock_count || 0);
    const outOfStockCount = parseInt(summary.out_of_stock_count || 0);
    const inStockCount = totalProducts - lowStockCount - outOfStockCount;

    const stats = [
        { label: "In Stock", value: inStockCount, bgClass: "bg-vibrantGreen" },
        { label: "Low Stock", value: lowStockCount, bgClass: "bg-amberOrange" },
        { label: "Out of Stock", value: outOfStockCount, bgClass: "bg-crimsonRed" },
    ];
    
    // --- CLEAN EXPORT DATA ---
    // Replace ₱ with PHP to avoid PDF encoding errors
    const exportData = categoryData.map(item => ({
        Category: item.Category,
        Products: item.Products,
        "Total Stock": item["Total Stock"],
        "Total Value": item["Total Value"].replace('₱', 'PHP '), // FIXED
        "Low Stock Counts": item["Low Stock Counts"]
    }));

    return (
        <div className="flex flex-col space-y-5">
            <div className="flex gap-5 justify-end">
                <CalendarFilter />
                <div>
                    <ExportButton
                        data={exportData}
                        columns={columns}
                        fileName={`Inventory_Summary_Report_${new Date().toISOString().split('T')[0]}`}
                        title="Inventory Summary Report"
                    />
                </div>
            </div>

            {/* KPI */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <KpiCard
                    bgColor="#002B50"
                    title="Total Products"
                    icon={<Boxes />}
                    value={totalProducts}
                />
                <KpiCard
                    bgColor="#002B50"
                    title="Total Inventory Value (Cost)"
                    icon={<DollarSign />}
                    value={`₱${parseFloat(summary.total_inventory_value || 0).toLocaleString('en-PH', {minimumFractionDigits: 2})}`}
                />
                <KpiCard
                    bgColor="#F39C12"
                    title="Low Stock"
                    icon={<AlertTriangle />}
                    value={lowStockCount}
                />
                <KpiCard
                    bgColor="#E74C3C"
                    title="Out of Stock"
                    icon={<Box />}
                    value={outOfStockCount}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                <Table tableName="Inventory by Category" columns={columns} data={categoryData} rowsPerPage={10} />
                
                <div className="default-container p-6">
                    <h3 className="title mb-3">Stock Status Overview</h3>
                    <div className="space-y-5">
                        {stats.map(stat => (
                            <div key={stat.label} className="default-container rounded-lg py-2 px-4 flex justify-between items-center">
                                <span className="font-medium text-gray-700">{stat.label}</span>
                                <span className={`font-semibold text-softWhite text-base w-6 h-6 p-1 rounded flex items-center justify-center ${stat.bgClass}`}>
                                    {stat.value}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="col-span-2">
                    <Table 
                        tableName="Products Requiring Attention (Low/Out of Stock)" 
                        columns={stockColumns} 
                        data={attentionProducts} 
                        rowsPerPage={10}
                    />
                </div>
            </div>
        </div>
    );
}