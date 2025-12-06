import { useState, useEffect, useCallback } from "react"; 
import KpiCard from "../../components/KpiCard";
import Table from "../../components/Table";
import ExportButton from "../../components/ExportButton";
import { DollarSign, Package, AlertTriangle, AlertOctagon, TrendingDown, Loader2, RefreshCw } from "lucide-react";
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
    { header: "Stock", accessor: "Stock" },
    { header: "Reorder", accessor: "Reorder" },
    { header: "Status", accessor: "Status" },
];

export default function InventoryReport() {
    const [reportData, setReportData] = useState(null);
    const [loading, setLoading] = useState(false);
    // Removed reportRef definition as it is no longer needed for snapshots

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

    if (loading && !reportData) {
        return (
            <div className="default-container flex flex-col items-center justify-center h-96">
                <Loader2 className="w-8 h-8 animate-spin text-navyBlue mb-4" />
                <p className="text-slate-500">Loading Current Inventory...</p>
            </div>
        );
    }
    
    const safeData = reportData || { summary: {}, inventory_by_category: [], products_requiring_attention: [] };
    const { summary, inventory_by_category, products_requiring_attention } = safeData;

    // Data for Table 1: Inventory by Category
    const categoryData = (inventory_by_category || []).map(cat => ({
        Category: cat.category_name,
        Products: cat.product_count,
        "Total Stock": cat.total_stock.toLocaleString(),
        "Total Value": `₱${parseFloat(cat.total_value || 0).toLocaleString('en-PH', {minimumFractionDigits: 2})}`,
        "Low Stock Counts": cat.low_stock_count
    }));

    // Data for Table 2: Products Requiring Attention
    const attentionProducts = (products_requiring_attention || []).map(p => {
        let statusBadge;
        // Use stock_level from API if available, otherwise infer
        if (p.stock_level === 'critical') {
             statusBadge = <span className="inline-flex items-center gap-1 bg-red-90 text-red-600 px-2 py-1 rounded text-xs font-bold border border-red-200"><AlertOctagon size={12}/> Critical</span>;
        } else if (p.stock_level === 'low') {
             statusBadge = <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-700 px-2 py-1 rounded text-xs font-bold border border-amber-200"><TrendingDown size={12}/> Low</span>;
        } else if (p.quantity === 0) {
             statusBadge = <span className="inline-flex items-center gap-1 bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-bold border border-red-300"><AlertTriangle size={12}/> Out</span>;
        } else {
             statusBadge = <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded text-xs font-bold">Check</span>;
        }

        return {
            Product: <span className="font-medium text-slate-700">{p.product_name}</span>,
            "Stock": <span className={p.quantity === 0 ? "text-slate-400" : "font-bold"}>{p.quantity}</span>,
            "Reorder": p.reorder_level,
            Status: statusBadge,
        };
    });

    // KPI & Legend Stats
    const totalProducts = parseInt(summary?.total_products || 0);
    const lowStockCount = parseInt(summary?.low_stock_count || 0);
    const criticalStockCount = parseInt(summary?.critical_stock_count || 0);
    const outOfStockCount = parseInt(summary?.out_of_stock_count || 0);
    const inStockCount = totalProducts - (lowStockCount + criticalStockCount + outOfStockCount);

    const exportData = categoryData.map(item => ({
        Category: item.Category,
        Products: item.Products,
        "Total Stock": item["Total Stock"],
        "Total Value": item["Total Value"].replace('₱', 'PHP '), 
        "Low Stock Counts": item["Low Stock Counts"]
    }));

    const currentDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    return (
        <div className="flex flex-col space-y-6"> 
            
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                 <div>
                    <h2 className="text-2xl font-bold text-navyBlue">Inventory Report</h2>
                    <p className="text-sm text-slate-500">Snapshot as of {currentDate}</p>
                 </div>

                <div className="flex gap-3 justify-end items-center">
                    <button onClick={fetchData} className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 transition-all text-sm font-medium">
                        {loading ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />} 
                        Refresh
                    </button>

                    <ExportButton
                        data={exportData}
                        columns={columns}
                        fileName={`Inventory_Data_${new Date().toISOString().split('T')[0]}`}
                        title={`Inventory Report - ${currentDate}`}
                    />
                </div>
            </div>

            {/* Main KPI Cards - Financial & High Level */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <KpiCard 
                    bgColor="#002B50" 
                    title="Total Inventory Value" 
                    icon={<DollarSign />} 
                    value={`₱${parseFloat(summary?.total_inventory_value || 0).toLocaleString('en-PH', {minimumFractionDigits: 2})}`} 
                    description="Cost value of active stock"
                />
                <KpiCard 
                    bgColor="#004B8D" 
                    title="Total Active Products" 
                    icon={<Package />} 
                    value={totalProducts} 
                    description="Items currently in catalog"
                />
            </div>

            {/* Health Legend & Detailed Tables */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                
                {/* Left Column: Category Table */}
                <div className="lg:col-span-2 flex flex-col gap-6">
                    <Table 
                        tableName="Inventory Valuation by Category" 
                        columns={columns} 
                        data={categoryData} 
                        rowsPerPage={10} 
                    />
                </div>

                {/* Right Column: Health Status & Alerts */}
                <div className="flex flex-col lg:col-span-2 gap-6">
                    
                    {/* Enhanced Status Legend */}
                    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                        <h3 className="text-base font-bold text-slate-700 mb-4 flex items-center gap-2">
                            <AlertTriangle size={18} className="text-slate-400"/>
                            Stock Health Overview
                        </h3>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between p-2 rounded hover:bg-slate-50">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 ring-4 ring-emerald-50"></div>
                                    <span className="text-sm text-slate-600 font-medium">In Stock</span>
                                </div>
                                <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-sm">{inStockCount}</span>
                            </div>
                            <div className="flex items-center justify-between p-2 rounded hover:bg-slate-50">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-amber-500 ring-4 ring-amber-50"></div>
                                    <span className="text-sm text-slate-600 font-medium">Low Stock</span>
                                </div>
                                <span className="font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded text-sm">{lowStockCount}</span>
                            </div>
                            <div className="flex items-center justify-between p-2 rounded hover:bg-slate-50">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-red-500 ring-4 ring-red-50"></div>
                                    <span className="text-sm text-slate-600 font-medium">Critical</span>
                                </div>
                                <span className="font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded text-sm">{criticalStockCount}</span>
                            </div>
                            <div className="flex items-center justify-between p-2 rounded hover:bg-slate-50">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-slate-500 ring-4 ring-slate-100"></div>
                                    <span className="text-sm text-slate-600 font-medium">Out of Stock</span>
                                </div>
                                <span className="font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded text-sm">{outOfStockCount}</span>
                            </div>
                        </div>
                    </div>

                    {/* Attention Table */}
                    <div className="grow">
                        <Table 
                            tableName="Attention Required" 
                            columns={stockColumns} 
                            data={attentionProducts} 
                            rowsPerPage={10}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}