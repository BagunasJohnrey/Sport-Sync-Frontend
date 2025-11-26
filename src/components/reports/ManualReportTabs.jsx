import { useState } from "react";
import { BarChart2, Boxes, LineChart, History } from "lucide-react";
import SalesReport from "../../components/reports/SalesReport";
import InventoryReport from "../../components/reports/InventoryReport";
import Profitability from "../../components/reports/Profitability";
import TransactionHistory from "../../components/reports/TransactionHistory";



export default function ManualReportTabs() {
  const [reportTab, setReportTab] = useState("sales");

  return (
    <div>
      {/* Tabs */}
      <div className="flex justify-between bg-softWhite border border-gray-300 shadow-md rounded-xl gap-3 px-5 py-1 mb-6 border-b overflow-x-auto">
        <button
            onClick={() => setReportTab("sales")}
            className={`relative flex items-center gap-2 px-4 py-2 rounded-t-lg transition
                ${reportTab === "sales"
                ? " text-gray-800 after:absolute after:-bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-40 after:h-1 after:rounded-t-full after:bg-darkGreen"
                : "hover:text-darkGreen"
                }`}
            >
            <BarChart2 size={18} />
            <span>Sales Report</span>
        </button>

        <button
            onClick={() => setReportTab("inventory")}
            className={`relative flex items-center gap-2 px-4 py-2 rounded-t-lg transition
                ${reportTab === "inventory"
                ? " text-gray-800 after:absolute after:-bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-45 after:h-1 after:rounded-t-full after:bg-darkGreen"
                : "hover:text-darkGreen"
                }`}
            >
            <Boxes size={18} />
            <span>Inventory Report</span>
        </button>


        <button
            onClick={() => setReportTab("profit")}
            className={`relative flex items-center gap-2 px-4 py-2 rounded-t-lg transition
                ${reportTab === "profit"
                ? " text-gray-800 after:absolute after:-bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-38 after:h-1 after:rounded-t-full after:bg-darkGreen"
                : "hover:text-darkGreen"
                }`}
            >
            <LineChart size={18} />
            <span>Profitability</span>
        </button>

        <button
            onClick={() => setReportTab("history")}
            className={`relative flex items-center gap-2 px-4 py-2 rounded-t-lg transition
                ${reportTab === "history"
                ? " text-gray-800 after:absolute after:-bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-50 after:h-1 after:rounded-t-full after:bg-darkGreen"
                : "hover:text-darkGreen"
                }`}
            >
            <History size={18} />
            <span>Transaction History</span>
        </button>

      </div>

      {/* Display Content */}
      <div>
        {reportTab === "sales" && <SalesReport />}
        {reportTab === "inventory" && <InventoryReport />}
        {reportTab === "profit" && <Profitability />}
        {reportTab === "history" && <TransactionHistory />}
      </div>

    </div>
  );
}
