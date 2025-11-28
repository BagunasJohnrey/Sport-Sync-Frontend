import { useState } from "react";
import Layout from "../components/Layout";
import Table from "../components/Table";
import KpiCard from "../components/KpiCard";
import { categories } from "../mockData";
import { useAuth } from "../context/AuthContext";
import { getCategoryMap } from "../utils/Utils.js";
import { Edit, PlusCircle, X } from "lucide-react";
import { Package, AlertTriangle, TrendingDown, DollarSign } from 'lucide-react';
import { Search, Filter } from 'lucide-react';


const products = [
  {
    product_id: 1,
    product_name: "Nike Air Force 1 Low White",
    category_id: 1,
    cost_price: "3500.00",
    selling_price: "5500.00",
    quantity: 25,
    barcode: "BSI1681234567890"
  },
  {
    product_id: 2,
    product_name: "Adidas Ultraboost 22",
    category_id: 2,
    cost_price: "5000.00",
    selling_price: "8500.00",
    quantity: 15,
    barcode: "BSI1682345678901"
  },
  {
    product_id: 3,
    product_name: "Lakers Jersey - LeBron James #6",
    category_id: 3,
    cost_price: "1500.00",
    selling_price: "3200.00",
    quantity: 8,
    barcode: "BSI1683456789012"
  },
  {
    product_id: 4,
    product_name: "Spalding NBA Basketball",
    category_id: 4,
    cost_price: "800.00",
    selling_price: "1800.00",
    quantity: 0,
    barcode: "BSI1684567890123"
  },
  {
    product_id: 5,
    product_name: "Under Armour Compression Shirt",
    category_id: 5,
    cost_price: "1200.00",
    selling_price: "2500.00",
    quantity: 30,
    barcode: "BSI1685678901234"
  },
  {
    product_id: 6,
    product_name: "Wilson Tennis Racket Pro Staff",
    category_id: 6,
    cost_price: "7000.00",
    selling_price: "12000.00",
    quantity: 6,
    barcode: "BSI1686789012345"
  },
  {
    product_id: 7,
    product_name: "Puma Football Cleats",
    category_id: 7,
    cost_price: "2500.00",
    selling_price: "4500.00",
    quantity: 12,
    barcode: "BSI1687890123456"
  },
  {
    product_id: 8,
    product_name: "Nike Dri-FIT Shorts",
    category_id: 5,
    cost_price: "800.00",
    selling_price: "1800.00",
    quantity: 45,
    barcode: "BSI1688901234567"
  },
  {
    product_id: 9,
    product_name: "Champion Hoodie",
    category_id: 8,
    cost_price: "1500.00",
    selling_price: "3500.00",
    quantity: 18,
    barcode: "BSI1689012345678"
  },
  {
    product_id: 10,
    product_name: "Converse Chuck Taylor All Star",
    category_id: 9,
    cost_price: "1800.00",
    selling_price: "3200.00",
    quantity: 22,
    barcode: "BSI1681123456789"
  },
  {
    product_id: 11,
    product_name: "Yonex Badminton Racket",
    category_id: 10,
    cost_price: "2500.00",
    selling_price: "4800.00",
    quantity: 9,
    barcode: "BSI1681123456789"
  },
  {
    product_id: 12,
    product_name: "Adidas Track Suit",
    category_id: 5,
    cost_price: "3000.00",
    selling_price: "5500.00",
    quantity: 14,
    barcode: "BSI1682345678901"
  }
];

export default function Inventory() {
  const { user } = useAuth();
  const categoryMap = getCategoryMap(categories);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form states
  const [formData, setFormData] = useState({
    productName: "",
    category: "",
    description: "",
    sellingPrice: "0.00",
    costPrice: "0.00",
    initialStock: "0",
    reorderPoint: "10",
    supplier: "",
    barcode: "Auto-generated"
  });

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStockLevel, setSelectedStockLevel] = useState("all");

  // Filter logic - Apply filters to products
  const filteredProducts = products.filter((product) => {
    // Search filter
    const matchesSearch = product.product_name.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Category filter
    const matchesCategory = selectedCategory === "all" || product.category_id === parseInt(selectedCategory);
    
    // Stock level filter
    let matchesStockLevel = true;
    if (selectedStockLevel === "in-stock") {
      matchesStockLevel = product.quantity > 0;
    } else if (selectedStockLevel === "low-stock") {
      matchesStockLevel = product.quantity > 0 && product.quantity <= 10;
    } else if (selectedStockLevel === "out-of-stock") {
      matchesStockLevel = product.quantity === 0;
    }
    
    return matchesSearch && matchesCategory && matchesStockLevel;
  });

  // Calculate stats based on ALL products (not filtered)
  const totalProducts = products.length;
  const lowStockItems = products.filter(p => p.quantity > 0 && p.quantity <= 10).length;
  const outOfStockItems = products.filter(p => p.quantity === 0).length;
  const inventoryValue = products.reduce((sum, p) => sum + (parseFloat(p.cost_price) * p.quantity), 0);

  const columns = [
    { header: "Product", accessor: "Product" },
    { header: "Category", accessor: "Category" },
    { header: "Cost Price", accessor: "Cost Price" },
    { header: "Selling Price", accessor: "Selling Price" },
    { header: "Stock", accessor: "Stock" },
    { header: "Status", accessor: "Status" },
    { header: "Actions", accessor: "Actions" },
  ];

  // Use filteredProducts instead of products for table data
  const data = filteredProducts.map((p) => ({
    Product: p.product_name,
    Category: categoryMap[p.category_id],
    "Cost Price": new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(p.cost_price),
    "Selling Price": `₱${parseFloat(p.selling_price).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    Stock:
      p.quantity === 0 ? (
        <span className="text-red-500 font-semibold">{p.quantity}</span>
      ) : (
        <span className="text-green-500 font-semibold">{p.quantity}</span>
      ),
    Status:
      p.quantity === 0 ? (
        <span className="bg-red-500 text-white px-3 py-1.5 rounded-full text-xs font-medium inline-block whitespace-nowrap">
          Out of Stock
        </span>
      ) : (
        <span className="bg-navyBlue text-white px-3 py-1.5 rounded-full text-xs font-medium inline-block whitespace-nowrap">
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

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Add your submit logic here
    setIsModalOpen(false);
    // Reset form
    setFormData({
      productName: "",
      category: "",
      description: "",
      sellingPrice: "0.00",
      costPrice: "0.00",
      initialStock: "0",
      reorderPoint: "10",
      supplier: "",
      barcode: "Auto-generated"
    });
  };

  return (
    <Layout>
      <div className="space-y-5">

        {/* Header Section */}
        <div className="mb-5 flex justify-between items-start">
          <div>
            <h1 className="page-title">
              Inventory
            </h1>
            <p className="text-gray-600">
              Manage your sports equipment and stock levels
            </p>
          </div>
          
          {/* Add Product Button */}
          {(user.role === "Admin" || user.role === "Staff") && (
            <button 
              onClick={() => setIsModalOpen(true)}
              className="text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              style={{ backgroundColor: '#004B8D' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#003366'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#004B8D'}
            >
              <PlusCircle size={18} />
              Add Product
            </button>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Products */}
          <KpiCard
            bgColor="#FAFAFA"
            title="Total Products"
            icon={<Package />}
            value={totalProducts}
          />

          {/* Low Stock */}
          <KpiCard
            bgColor="#FAFAFA"
            title="Low Stock"
            icon={<AlertTriangle />}
            value={lowStockItems}
          />

          {/* Out of Stock */}
          <KpiCard
            bgColor="#FAFAFA"
            title="Out of Stock"
            icon={<TrendingDown />}
            value={outOfStockItems}
          />

          {/* Inventory Value */}
          <KpiCard
            bgColor="#FAFAFA"
            title="Inventory Value"
            icon={<DollarSign />}
            value={`₱${inventoryValue.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          />
        </div>

        {/* Filter Section */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <Filter size={20} className="text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-800">Filters</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search Input */}
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navyBlue focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navyBlue focus:border-transparent bg-white"
              >
                <option value="all">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.category_id} value={cat.category_id}>
                    {cat.category_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Stock Level Filter */}
            <div>
              <select
                value={selectedStockLevel}
                onChange={(e) => setSelectedStockLevel(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navyBlue focus:border-transparent bg-white"
              >
                <option value="all">All Stock Levels</option>
                <option value="in-stock">In Stock</option>
                <option value="low-stock">Low Stock</option>
                <option value="out-of-stock">Out of Stock</option>
              </select>
            </div>
          </div>

          {/* Active Filters Display / Clear Filters */}
          {(searchQuery || selectedCategory !== "all" || selectedStockLevel !== "all") && (
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Showing {filteredProducts.length} of {totalProducts} products
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                  setSelectedStockLevel("all");
                }}
                className="text-sm text-navyBlue hover:text-darkGreen font-medium"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>

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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-softWhite rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-navyBlue flex items-center justify-between p-6 border-b">
              <div>
                <h2 className="text-xl font-semibold text-gray-200">Add New Sports Product</h2>
                <p className="text-sm text-gray-200 mt-1">
                  Fill in the details below to add a new sports equipment item to your inventory.
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

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Product description"
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navyBlue focus:border-transparent bg-gray-50 resize-none"
                  />
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

                {/* Supplier and Barcode Row */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Supplier
                    </label>
                    <input
                      type="text"
                      name="supplier"
                      value={formData.supplier}
                      onChange={handleInputChange}
                      placeholder="Supplier name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navyBlue focus:border-transparent bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Barcode
                    </label>
                    <input
                      type="text"
                      name="barcode"
                      value={formData.barcode}
                      onChange={handleInputChange}
                      placeholder="Auto-generated"
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t">
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

    </Layout>
    
  );
}