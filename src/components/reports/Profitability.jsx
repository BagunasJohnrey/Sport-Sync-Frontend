import KpiCard from "../../components/KpiCard";
import Table from "../../components/Table";
import ExportButton from "../../components/ExportButton";
import { DollarSign, TrendingUp, BarChart4 } from "lucide-react";
import { products, categories, transactions } from "../../mockData";
import CalendarFilter from  "../../components/CalendarFilter";

const categoryMap = categories.reduce((acc, c) => {
    acc[c.id] = c.category_name;
    return acc;
  }, {});

  // Compute gross profit and margin per product
  const productMargins = products.map(p => {
    const productTransactions = transactions.filter(t => t.product_id === p.id);
    const revenue = productTransactions.reduce((sum, t) => sum + t.total_amount, 0);
    const quantitySold = productTransactions.reduce((sum, t) => sum + t.quantity, 0);
    const grossProfit = revenue - (p.cost_price * quantitySold);
    const margin = revenue > 0 ? (grossProfit / revenue) * 100 : 0;

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
      Product: p.product_name,
      Category: categoryMap[p.category_id],
      "Cost Price": `₱${p.cost_price}`,
      "Selling Price": `₱${p.selling_price}`,
      "Gross Profit": `₱${grossProfit.toLocaleString()}`,
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
      marginValue: margin // used for sorting
    };
  });

  // Sort descending by margin
  const sortedProducts = productMargins.sort((a, b) => b.marginValue - a.marginValue);

  // Add rank
  const topProducts = sortedProducts.map((p, index) => ({ Rank: index + 1, ...p }));

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


export default function InventoryReport() {
  return (
    <div className="flex flex-col space-y-5">
      <div className="flex gap-5 justify-end">
         <CalendarFilter/>
        <div>
          <ExportButton />
        </div>
        {/* insert calendar */}

       
      </div>

      {/* KPI */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Total Gross Profit */}
        <KpiCard
          bgColor="#002B50"
          title="Total Gross Profit"
          icon={<TrendingUp />}
          value={<>₱7300.00</>}
        />

        {/* Average Margin */}
        <KpiCard
          bgColor="#0A6DDC"
          title="Average Margin"
          icon={<BarChart4/>}
          value={<>₱523,500.00</>}
        />

        {/* Best Margin */}
        <KpiCard
          bgColor="#1f781a"
          title="Best Margin"
          icon={<DollarSign  />}
          value={<>₱523,500.00</>}
          description={<>Items below reorder point</>}
        />

    
      </div>

      <Table
        tableName="Products Ranked by Profit Margin"
        columns={columns}
        data={topProducts}
        rowsPerPage={10}
      />
    </div>
  );
}
