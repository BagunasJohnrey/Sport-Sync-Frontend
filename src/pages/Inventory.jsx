import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import Table from "../components/Table";
import KpiCard from "../components/KpiCard";
import Filter from "../components/Filter";
import Scanner from "../components/Scanner.jsx";
import EditProductModal from "../components/inventory/EditProductModal.jsx";
import AlertModal from "../components/inventory/AlertModal.jsx";
import { categories } from "../mockData";
import { useAuth } from "../context/AuthContext";
import { getCategoryMap } from "../utils/Utils.js";
import {
  Package,
  AlertTriangle,
  TrendingDown,
  DollarSign,
  Trash2,
  Search,
  Edit,
  PlusCircle,
  X,
} from "lucide-react";

const products = [
  {
    product_id: 1,
    product_name: "Nike Air Force 1 Low White",
    category_id: 1,
    cost_price: "3500.00",
    selling_price: "5500.00",
    quantity: 25,
    barcode: "BSI1681234567890",
  },
  {
    product_id: 2,
    product_name: "Adidas Ultraboost 22",
    category_id: 2,
    cost_price: "5000.00",
    selling_price: "8500.00",
    quantity: 15,
    barcode: "BSI1682345678901",
  },
  {
    product_id: 3,
    product_name: "Lakers Jersey - LeBron James #6",
    category_id: 3,
    cost_price: "1500.00",
    selling_price: "3200.00",
    quantity: 8,
    barcode: "BSI1683456789012",
  },
  {
    product_id: 4,
    product_name: "Spalding NBA Basketball",
    category_id: 4,
    cost_price: "800.00",
    selling_price: "1800.00",
    quantity: 0,
    barcode: "BSI1684567890123",
  },
  {
    product_id: 5,
    product_name: "Under Armour Compression Shirt",
    category_id: 5,
    cost_price: "1200.00",
    selling_price: "2500.00",
    quantity: 30,
    barcode: "BSI1685678901234",
  },
  {
    product_id: 6,
    product_name: "Wilson Tennis Racket Pro Staff",
    category_id: 6,
    cost_price: "7000.00",
    selling_price: "12000.00",
    quantity: 6,
    barcode: "BSI1686789012345",
  },
  {
    product_id: 7,
    product_name: "Puma Football Cleats",
    category_id: 7,
    cost_price: "2500.00",
    selling_price: "4500.00",
    quantity: 12,
    barcode: "BSI1687890123456",
  },
  {
    product_id: 8,
    product_name: "Nike Dri-FIT Shorts",
    category_id: 5,
    cost_price: "800.00",
    selling_price: "1800.00",
    quantity: 45,
    barcode: "BSI1688901234567",
  },
  {
    product_id: 9,
    product_name: "Champion Hoodie",
    category_id: 8,
    cost_price: "1500.00",
    selling_price: "3500.00",
    quantity: 18,
    barcode: "BSI1689012345678",
  },
  {
    product_id: 10,
    product_name: "Converse Chuck Taylor All Star",
    category_id: 9,
    cost_price: "1800.00",
    selling_price: "3200.00",
    quantity: 22,
    barcode: "BSI1681123456789",
  },
  {
    product_id: 11,
    product_name: "Yonex Badminton Racket",
    category_id: 10,
    cost_price: "2500.00",
    selling_price: "4800.00",
    quantity: 9,
    barcode: "BSI1681123456789",
  },
  {
    product_id: 12,
    product_name: "Adidas Track Suit",
    category_id: 5,
    cost_price: "3000.00",
    selling_price: "5500.00",
    quantity: 14,
    barcode: "BSI1682345678901",
  },
];

export default function Inventory() {
  const { user } = useAuth();
  const categoryMap = getCategoryMap(categories);

  const [isAlertOpen, setIsAlertOpen] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Only show popup when there are low stock items
  useEffect(() => {
    if (lowStockItems > 0) {
      setIsAlertOpen(true);
    }
  }, []);

  // Form state
  const [formData, setFormData] = useState({
    productName: "",
    category: "",
    description: "",
    sellingPrice: "0.00",
    costPrice: "0.00",
    initialStock: "0",
    reorderPoint: "10",
    supplier: "",
    barcode: "",
  });

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStockLevel, setSelectedStockLevel] = useState("all");

  // Logic
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.product_name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" ||
      product.category_id === parseInt(selectedCategory);
    let matchesStockLevel = true;
    if (selectedStockLevel === "in-stock")
      matchesStockLevel = product.quantity > 0;
    else if (selectedStockLevel === "low-stock")
      matchesStockLevel = product.quantity > 0 && product.quantity <= 10;
    else if (selectedStockLevel === "out-of-stock")
      matchesStockLevel = product.quantity === 0;
    return matchesSearch && matchesCategory && matchesStockLevel;
  });

  const totalProducts = products.length;
  const lowStockItems = products.filter(
    (p) => p.quantity > 0 && p.quantity <= 10
  ).length;
  const outOfStockItems = products.filter((p) => p.quantity === 0).length;
  const inventoryValue = products.reduce(
    (sum, p) => sum + parseFloat(p.cost_price) * p.quantity,
    0
  );

  // Table Config
  const columns = [
    { header: "Product", accessor: "Product" },
    { header: "Category", accessor: "Category" },
    { header: "Cost Price", accessor: "Cost Price" },
    { header: "Selling Price", accessor: "Selling Price" },
    { header: "Stock", accessor: "Stock" },
    { header: "Status", accessor: "Status" },
    { header: "Actions", accessor: "Actions" },
  ];

  const handleEditClick = (product) => {
    setSelectedProduct(product);
    setIsEditModalOpen(true);
  };

  const handleSaveProduct = (updatedProduct) => {
    console.log("Saving:", updatedProduct);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    setIsModalOpen(false);
  };

  const data = filteredProducts.map((p) => ({
    Product: p.product_name,
    Category: categoryMap[p.category_id],
    "Cost Price": `₱${parseFloat(p.cost_price).toLocaleString("en-PH", {
      minimumFractionDigits: 2,
    })}`,
    "Selling Price": `₱${parseFloat(p.selling_price).toLocaleString("en-PH", {
      minimumFractionDigits: 2,
    })}`,
    Stock: (
      <span
        className={
          p.quantity === 0
            ? "text-red-500 font-bold"
            : "text-emerald-600 font-bold"
        }
      >
        {p.quantity}
      </span>
    ),
    Status:
      p.quantity === 0 ? (
        <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-xs font-bold uppercase">
          Out of Stock
        </span>
      ) : (
        <span className="bg-emerald-100 text-emerald-600 px-2 py-1 rounded text-xs font-bold uppercase">
          In Stock
        </span>
      ),
    Actions:
      user.role === "Admin" || user.role === "Staff" ? (
        <div className="flex gap-2">
          <button
            onClick={() => handleEditClick(p)}
            className="p-1.5 text-slate-500 hover:text-navyBlue bg-slate-100 hover:bg-blue-50 rounded transition-colors"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => console.log("Delete", p)}
            className="p-1.5 text-slate-500 hover:text-red-500 bg-slate-100 hover:bg-red-50 rounded transition-colors"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ) : null,
  }));

  // Filter Configuration for Reusable Component
  const filterConfig = [
    {
      value: selectedCategory,
      onChange: (e) => setSelectedCategory(e.target.value),
      options: [
        { value: "all", label: "All Categories" },
        ...categories.map((cat) => ({
          value: cat.category_id,
          label: cat.category_name,
        })),
      ],
    },
    {
      value: selectedStockLevel,
      onChange: (e) => setSelectedStockLevel(e.target.value),
      options: [
        { value: "all", label: "All Stock Levels" },
        { value: "in-stock", label: "In Stock" },
        { value: "low-stock", label: "Low Stock" },
        { value: "out-of-stock", label: "Out of Stock" },
      ],
    },
  ];

  return (
    <Layout>
      <div className="space-y-5">
        {/* Header Section */}
        <div className="mb-5 flex justify-between items-start">
          <div>
            <h1 className="page-title">Inventory</h1>
            <p className="page-description">
              Manage your sports equipment and stock levels
            </p>
          </div>

          {/* Scanner & Add Button */}
          <div className="flex flex-col sm:flex-row justify-en items-start sm:items-center gap-4 shrink-0 mt-15 lg:mt-0">
          
              <Scanner />

              {/* Add Product Button */}
              {(user.role === "Admin" || user.role === "Staff") && (
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                  style={{ backgroundColor: "#004B8D" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#003366")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "#004B8D")
                  }
                >
                  <PlusCircle size={18} />
                  Add Product
                </button>
              )}
            
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Products */}
          <KpiCard
            bgColor="#002B50"
            title="Total Products"
            icon={<Package />}
            value={totalProducts}
          />

          {/* Low Stock */}
          <KpiCard
            bgColor="#F39C12"
            title="Low Stock"
            icon={<AlertTriangle />}
            value={lowStockItems}
          />

          {/* Out of Stock */}
          <KpiCard
            bgColor="#E74C3C"
            title="Out of Stock"
            icon={<TrendingDown />}
            value={outOfStockItems}
          />

          {/* Inventory Value */}
          <KpiCard
            bgColor="#1f781a"
            title="Inventory Value"
            icon={<DollarSign />}
            value={`₱${inventoryValue.toLocaleString("en-PH", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`}
          />
        </div>

        {/* Reusable Filter */}
        <Filter
          searchQuery={searchQuery}
          onSearchChange={(e) => setSearchQuery(e.target.value)}
          searchPlaceholder="Search products by name..."
          filters={filterConfig}
          showClearButton={
            searchQuery ||
            selectedCategory !== "all" ||
            selectedStockLevel !== "all"
          }
          onClear={() => {
            setSearchQuery("");
            setSelectedCategory("all");
            setSelectedStockLevel("all");
          }}
          resultsCount={`Showing ${filteredProducts.length} products`}
        />

        {/* Table */}
        <Table
          tableName="All Products Inventory"
          columns={columns}
          data={data}
          rowsPerPage={10}
        />
      </div>

      {/* Add Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-charcoalBlack/40 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-softWhite rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto hide-scrollbar">
            {/* Modal Header */}
            <div className="bg-navyBlue flex items-center justify-between p-6 border-b">
              <div>
                <h2 className="text-xl font-semibold text-gray-200">
                  Add New Sports Product
                </h2>
                <p className="text-sm text-gray-200 mt-1">
                  Fill in the details below to add a new sports equipment item
                  to your inventory.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-300 hover:text-slateGray transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <div className="space-y-4">
                {/* Product Name and Category Row */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Product Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="productName"
                      value={formData.productName}
                      onChange={handleInputChange}
                      placeholder="Product name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navyBlue focus:border-transparent bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navyBlue focus:border-transparent bg-gray-50"
                    >
                      <option value="">Select category</option>
                      {categories.map((cat) => (
                        <option key={cat.category_id} value={cat.category_id}>
                          {cat.category_name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Selling Price and Cost Price Row */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Selling Price <span className="text-red-500">*</span> (₱)
                    </label>
                    <input
                      type="number"
                      name="sellingPrice"
                      value={formData.sellingPrice}
                      onChange={handleInputChange}
                      placeholder="0.00"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navyBlue focus:border-transparent bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cost Price (₱)
                    </label>
                    <input
                      type="number"
                      name="costPrice"
                      value={formData.costPrice}
                      onChange={handleInputChange}
                      placeholder="0.00"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navyBlue focus:border-transparent bg-gray-50"
                    />
                  </div>
                </div>

                {/* Initial Stock and Reorder Point Row */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Initial Stock
                    </label>
                    <input
                      type="number"
                      name="initialStock"
                      value={formData.initialStock}
                      onChange={handleInputChange}
                      placeholder="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navyBlue focus:border-transparent bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Reorder Point
                    </label>
                    <input
                      type="number"
                      name="reorderPoint"
                      value={formData.reorderPoint}
                      onChange={handleInputChange}
                      placeholder="10"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navyBlue focus:border-transparent bg-gray-50"
                    />
                  </div>
                </div>

                {/* Barcode */}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Barcode
                  </label>
                  <input
                    type="text"
                    name="barcode"
                    value={formData.barcode}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6">
              <button
                onClick={handleSubmit}
                className="w-full bg-navyBlue text-white py-3 rounded-lg font-medium hover:bg-green-800 transition-colors"
              >
                Add Product
              </button>
            </div>
          </div>
        </div>
      )}

      {isAlertOpen && (
        <AlertModal
          lowStockItems={products.filter(
            (p) => p.quantity > 0 && p.quantity <= 10
          )}
          onClose={() => setIsAlertOpen(false)}
        />
      )}

      <EditProductModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        product={selectedProduct}
        categories={categories}
        onSave={handleSaveProduct}
      />
    </Layout>
  );
}
