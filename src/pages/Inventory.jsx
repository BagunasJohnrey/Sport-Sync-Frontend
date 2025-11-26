import Layout from "../components/Layout";
import Table from "../components/Table";
import KpiCard from "../components/KpiCard";
import { products, categories } from "../mockData";
import { useAuth } from "../context/AuthContext";
import { getCategoryMap } from "../utils/Utils.js";
import { Edit, PlusCircle } from "lucide-react";
import { Package, AlertTriangle, TrendingDown, DollarSign } from 'lucide-react';



export default function Inventory() {
  const { user } = useAuth();
  const categoryMap = getCategoryMap(categories);

  // Calculate stats
  const totalProducts = products.length;
  const lowStockItems = products.filter(p => p.quantity > 0 && p.quantity <= 10).length;

  const columns = [
    { header: "Product", accessor: "Product" },
    { header: "Category", accessor: "Category" },
    { header: "Cost Price", accessor: "Cost Price" },
    { header: "Selling Price", accessor: "Selling Price" },
    { header: "Stock", accessor: "Stock" },
    { header: "Status", accessor: "Status" },
    { header: "Actions", accessor: "Actions" },
  ];

  const data = products.map((p) => ({
    Product: p.product_name,
    Category: categoryMap[p.category_id],
    "Cost Price": `₱${parseFloat(p.cost_price).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    "Selling Price": `₱${parseFloat(p.selling_price).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    Stock:
      p.quantity === 0 ? (
        <span className="text-red-500 font-semibold">{p.quantity}</span>
      ) : (
        <span className="text-green-500 font-semibold">{p.quantity}</span>
      ),
    Status:
      p.quantity === 0 ? (
        <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs">
          Out of Stock
        </span>
      ) : (
        <span className="bg-navyBlue text-white px-2 py-1 rounded-full text-xs">
          In Stock
        </span>
      ),
    Actions:
      user.role === "Admin" || user.role === "Staff" ? (
        <div className="flex gap-2">
          <button
            className="p-2 text-darkGreen rounded hover:bg-lightGray flex items-center justify-center"
            onClick={() => console.log("Edit", p)}
          >
            <Edit size={16} />
          </button>
          <button
            className="p-2 text-navyBlue rounded hover:bg-lightGray flex items-center justify-center"
            onClick={() => console.log("Adjust", p)}
          >
            <PlusCircle size={16} />
          </button>
        </div>
      ) : null,
  }));

  return (
    <Layout>
      <div className="space-y-5">

        {/* Header Section */}
        <div className="mb-5">
          <h1 className="page-title">
            Inventory
          </h1>
          <p className="text-gray-600">
            Manage your sports equipment and stock levels
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Products */}
          <KpiCard
            bgColor="#FAFAFA"
            title="Total Products"
            icon={<Package />}
            value={0}
          />

          {/* Low Stock */}
          <KpiCard
            bgColor="#FAFAFA"
            title="Low Stock"
            icon={<AlertTriangle />}
            value={0}
          />

          {/* Out of Stock */}
          <KpiCard
            bgColor="#FAFAFA"
            title="Out of Stock"
            icon={<TrendingDown />}
            value={0}
          />

          {/* Inventory Value */}
          <KpiCard
            bgColor="#FAFAFA"
            title="Inventory Value"
            icon={<DollarSign />}
            value="₱0"
          />
        </div>

        {/* Table */}
        <Table 
          tableName="All Products Inventory" 
          columns={columns} 
          data={data} 
          rowsPerPage={10} 
        />

      </div>

    </Layout>
  );
};