import KpiCard from "../../components/KpiCard";
import Chart from "../../components/Chart";
import Table from "../../components/Table";
import {
  DollarSign,
  ShoppingCart,
  Activity,
  Star
} from "lucide-react";
import { products, sales, categories, transactions } from "../../mockData";



const todayCategoryNames = categories.map(c => c.category_name);
const todayCategoryVolumeValues = categories.map(c =>
  transactions
    .filter(t => t.date.toISOString().startsWith("2025-11-20")) // example date
    .filter(t => categories.find(cat => cat.id === products.find(p => p.id === t.product_id).category_id)?.id === c.id)
    .reduce((acc, t) => acc + t.quantity, 0)
);

// Line Chart - Sales & Revenue Trend
const lineDates = sales.daily.map(d => d.date);
const salesTrend = sales.daily.map(d => d.volume);
const revenueTrend = sales.daily.map(d => d.revenue);

// Bar Chart - Sales by Category
const barCategoryNames = categories.map(c => c.category_name);
const barCategorySales = categories.map(c =>
  transactions
    .filter(t => categories.find(cat => cat.id === products.find(p => p.id === t.product_id).category_id)?.id === c.id)
    .reduce((acc, t) => acc + t.quantity, 0)
);

// Donut Chart - Payment Methods
const paymentMethods = ["Cash", "Card", "Online"];
const paymentCounts = paymentMethods.map(method =>
  transactions.filter(t => t.payment_method === method).length
);

// Bar Chart - Category Performance Comparison (Revenue vs Volume)
const categoryRevenue = categories.map(c =>
  transactions
    .filter(t => categories.find(cat => cat.id === products.find(p => p.id === t.product_id).category_id)?.id === c.id)
    .reduce((acc, t) => acc + t.total_amount, 0)
);
const categoryVolume = categories.map(c =>
  transactions
    .filter(t => categories.find(cat => cat.id === products.find(p => p.id === t.product_id).category_id)?.id === c.id)
    .reduce((acc, t) => acc + t.quantity, 0)
);

// Top Selling Products

const categoryMap = categories.reduce((acc, c) => {
    acc[c.id] = c.category_name;
    return acc;
  }, {});

  const productSales = products.map(p => {
    const productTransactions = transactions.filter(t => t.product_id === p.id);
    const quantitySold = productTransactions.reduce((sum, t) => sum + t.quantity, 0);
    const revenue = productTransactions.reduce((sum, t) => sum + t.total_amount, 0);
    const profit = revenue - quantitySold * p.cost_price;
    const margin = revenue > 0 ? (profit / revenue) * 100 : 0;

    return {
      Product: p.product_name,
      Category: categoryMap[p.category_id],
      "Quantity Sold": quantitySold,
      Revenue: `₱${revenue.toLocaleString()}`,
      Profit: `₱${profit.toLocaleString()}`,
      "Margin %": (
        <span className={margin >= 50 ? "text-green-600" : margin < 30 ? "text-red-500" : "text-yellow-500"}>
          {margin.toFixed(2)}%
        </span>
      ),
    };
  });

  // Sort by quantity sold or revenue
  const topProducts = productSales
    .sort((a, b) => b["Quantity Sold"] - a["Quantity Sold"])
    .slice(0, 10);

  const columns = [
    { header: "Product", accessor: "Product" },
    { header: "Category", accessor: "Category" },
    { header: "Quantity Sold", accessor: "Quantity Sold" },
    { header: "Revenue", accessor: "Revenue" },
    { header: "Profit", accessor: "Profit" },
    { header: "Margin %", accessor: "Margin %" },
  ];

export default function SalesReport() {
  return (
    <div className="flex flex-col space-y-5">
        <div className="flex justify-end">
            {/* insert calendar */}
        </div>

        {/* KPI */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Sales Revenue */}
        <KpiCard
          bgColor="#FAFAFA"
          title="Total Sales Revenue"
          icon={<DollarSign />}
          value={<>100, 000</>}
          description={<>Total revenue generated</>}
        />

        {/* Transactions */}
        <KpiCard
          bgColor="#FAFAFA"
          title="Transactions"
          icon={<ShoppingCart />}
          value={<>10</>}
          description={<>Completed transactions</>}
        />

        {/* Average Transaction */}
        <KpiCard
          bgColor="#FAFAFA"
          title="Average Transaction"
          icon={<Activity />}
          value={<>2</>}
          description={<>Per transaction</>}
        />

        {/* Top Payment */}
        <KpiCard
          bgColor="#FAFAFA"
          title="Top Payment"
          icon={<Star />}
          value={<>Cash</>}
          description={<>Most used method</>}
        />
      </div>

        {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <Chart
        type="line"
        title="Sales & Revenue Trend"
        categories={lineDates}
        series={[
          { name: "Sales", data: salesTrend, color: "navyBlue" },
          { name: "Revenue", data: revenueTrend, color: "darkGreen" }
        ]}
        height={320}
      />

      <Chart
        type="bar"
        title="Sales by Category"
        categories={barCategoryNames}
        series={[{ name: "Sales Volume", data: barCategorySales }]}
        height={320}
      />

      <Chart
        type="donut"
        title="Payment Methods"
        categories={['Cash', 'GCash']}
        series={[35, 25]}
        height={320}
      />


      <Chart
        type="bar"
        title="Category Performance Comparison"
        categories={barCategoryNames}
        series={[
          { name: "Revenue", data: categoryRevenue },
          { name: "Volume", data: categoryVolume }
        ]}
        height={320}
      />
      </div>

      <Table tableName="Top Selling Products" columns={columns} data={topProducts} rowsPerPage={10} />
    </div>
  );
}