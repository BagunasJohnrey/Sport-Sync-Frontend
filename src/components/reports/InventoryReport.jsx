import KpiCard from "../../components/KpiCard";
import Table from "../../components/Table";
import ExportButton from "../../components/ExportButton";
import { DollarSign, Box, Boxes } from "lucide-react";
import { products, categories } from "../../mockData";
import CalendarFilter from  "../../components/CalendarFilter";

// Inventory by Category
const categoryMap = categories.reduce((acc, c) => {
    acc[c.id] = c.category_name;
    return acc;
  }, {});

  const categoryData = categories.map(cat => {
    const catProducts = products.filter(p => p.category_id === cat.id);
    const productCount = catProducts.length;
    const totalValue = catProducts.reduce((sum, p) => sum + p.selling_price * p.quantity, 0);
    const lowStockCount = catProducts.filter(p => p.quantity <= 5).length; // example threshold: 5 units

    return {
      Category: cat.category_name,
      Products: productCount,
      Value: `₱${totalValue.toLocaleString()}`,
      "Low Stock Counts": lowStockCount
    };
  });

  const columns = [
    { header: "Category", accessor: "Category" },
    { header: "Products", accessor: "Products" },
    { header: "Value", accessor: "Value" },
    { header: "Low Stock Counts", accessor: "Low Stock Counts" },
  ];

//  Stock Status Overview
  const inStockCount = products.filter(p => p.quantity > 5).length;
  const lowStockCount = products.filter(p => p.quantity > 0 && p.quantity <= 5).length;
  const outOfStockCount = products.filter(p => p.quantity === 0).length;

  const stats = [
    { label: "In Stock", value: inStockCount, bgClass: "bg-vibrantGreen" },
    { label: "Low Stock", value: lowStockCount, bgClass: "bg-amberOrange" },
    { label: "Out of Stock", value: outOfStockCount, bgClass: "bg-crimsonRed" },
  ];

//   Products Requiring Attention
const reorderPoint = 5; // Example reorder threshold

  // Filter products that are low stock or out of stock
  const attentionProducts = products
    .filter(p => p.quantity <= reorderPoint)
    .map(p => ({
      Product: p.product_name,
      "Current Stock": p.quantity,
      "Reorder Point": reorderPoint,
      Status:
        p.quantity === 0 ? (
          <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs whitespace-nowrap">
            Out of Stock
          </span>
        ) : (
          <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs">
            Low Stock
          </span>
        ),
    }));

  const stockColumns = [
    { header: "Product", accessor: "Product" },
    { header: "Current Stock", accessor: "Current Stock" },
    { header: "Reorder Point", accessor: "Reorder Point" },
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Products */}
        <KpiCard
          bgColor="#002B50"
          title="Total Products"
          icon={<Boxes />}
          value={<>100</>}
        />

        {/* Inventory Value */}
        <KpiCard
          bgColor="#002B50"
          title="Inventory Value"
          icon={<DollarSign />}
          value={<>₱523,500.00</>}
        />

        {/* Low Stock */}
        <KpiCard
          bgColor="#E74C3C"
          title="Low Stock"
          icon={<Box />}
          value={<span className="text-amberOrange">2</span>}
        />

        {/* Out of Stock */}
        <KpiCard
          bgColor="#F39C12"
          title="Out of Stock"
          icon={<Box />}
          value={<span className="text-crimsonRed">1</span>}
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
        <Table tableName="Products Requiring Attention" columns={stockColumns} data={attentionProducts} rowsPerPage={10}/>
    </div>
    



      </div>
    </div>
  );
}
