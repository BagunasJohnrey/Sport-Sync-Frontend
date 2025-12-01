import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import Table from "../components/Table";
import KpiCard from "../components/KpiCard";
import Filter from "../components/Filter";
import Scanner from "../components/Scanner.jsx";
import EditProductModal from "../components/inventory/EditProductModal.jsx";
import AlertModal from "../components/inventory/AlertModal.jsx";
// Import Toast Component
import Toast from "../components/Toast"; 
import { categories, products } from "../mockData"; 
import { useAuth } from "../context/AuthContext";
import { getCategoryMap } from "../utils/Utils.js";
import {
  Package,
  AlertTriangle,
  TrendingDown,
  DollarSign,
  Trash2,
  Edit,
  PlusCircle,
  X,
} from "lucide-react";

export default function Inventory() {
  const { user } = useAuth();
  const categoryMap = getCategoryMap(categories);

  const [isAlertOpen, setIsAlertOpen] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  // NEW: Toast State
  const [toast, setToast] = useState(null);

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

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStockLevel, setSelectedStockLevel] = useState("all");

  const handleScan = (scannedBarcode) => {
    const existingProduct = products.find((p) => p.barcode === scannedBarcode);

    if (existingProduct) {
      setFormData({
        productName: existingProduct.product_name,
        category: String(existingProduct.category_id),
        description: "", 
        sellingPrice: existingProduct.selling_price,
        costPrice: existingProduct.cost_price,
        initialStock: existingProduct.quantity,
        reorderPoint: "10",
        supplier: "",
        barcode: existingProduct.barcode,
      });
    } else {
      setFormData({
        productName: "",
        category: "",
        description: "",
        sellingPrice: "0.00",
        costPrice: "0.00",
        initialStock: "0",
        reorderPoint: "10",
        supplier: "",
        barcode: scannedBarcode,
      });
    }
    setIsModalOpen(true);
  };

  const lowStockList = products
    .filter((p) => p.quantity > 0 && p.quantity <= 10)
    .map((p) => ({
      name: p.product_name,
      sku: p.barcode,
      current: p.quantity,
      minimum: 10,
      unit: "pcs",
    }));

  useEffect(() => {
    if (lowStockList.length > 0) {
      setIsAlertOpen(true);
    }
  }, []);

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.product_name
      .toLowerCase()
      .includes(searchQuery.toLowerCase()) || 
      product.barcode.includes(searchQuery);

    const matchesCategory =
      selectedCategory === "all" ||
      String(product.category_id) === selectedCategory;

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

  // --- UPDATED SUBMIT LOGIC ---
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Simple Validation
    if (!formData.productName || !formData.category || !formData.sellingPrice) {
      setToast({ message: "Please fill in all required fields.", type: "error" });
      return; // Stop function if validation fails
    }

    try {
      // Simulate API call or data saving
      console.log("Form submitted:", formData);
      
      // Success Feedback
      setToast({ message: "Product added successfully!", type: "success" });
      setIsModalOpen(false); // Close Modal on success
    } catch (error) {
      // Fail Feedback
      setToast({ message: "Failed to add product.", type: "error" });
    }
  };

  const data = filteredProducts.map((p) => ({
    id: p.id,
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

  const filterConfig = [
    {
      id: "selectedCategory",
      value: selectedCategory,
      onChange: (e) => setSelectedCategory(e.target.value),
      options: [
        { value: "all", label: "All Categories" },
        ...categories.map((cat) => ({
          value: String(cat.id), 
          label: cat.category_name,
        })),
      ],
    },
    {
      id: "selectedStockLevel",
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
        <div className="mb-5 flex justify-between items-start">
          <div>
            <h1 className="page-title">Inventory</h1>
            <p className="page-description">
              Manage your sports equipment and stock levels
            </p>
          </div>

          <div className="flex flex-row justify-end items-center gap-4 shrink-0 mt-15 lg:mt-0">
            <Scanner onScan={handleScan} />
            
            {(user.role === "Admin" || user.role === "Staff") && (
              <button
                onClick={() => {
                  setFormData({
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
                  setIsModalOpen(true);
                }}
                className="text-softWhite px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard
            bgColor="#002B50"
            title="Total Products"
            icon={<Package />}
            value={totalProducts}
          />
          <KpiCard
            bgColor="#F39C12"
            title="Low Stock"
            icon={<AlertTriangle />}
            value={lowStockItems}
          />
          <KpiCard
            bgColor="#E74C3C"
            title="Out of Stock"
            icon={<TrendingDown />}
            value={outOfStockItems}
          />
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

        <Table
          tableName="All Products Inventory"
          columns={columns}
          data={data}
          rowsPerPage={10}
        />
      </div>

      {isModalOpen && (
        <div 
          className="fixed inset-0 bg-charcoalBlack/40 bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setIsModalOpen(false)}
        >
          <div 
            className="bg-softWhite rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto hide-scrollbar"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-navyBlue flex items-center justify-between p-6 border-b">
              <div>
                <h2 className="text-xl font-semibold text-gray-200">
                  {products.find(p => p.barcode === formData.barcode) 
                    ? "Product Details" 
                    : "Add New Sports Product"}
                </h2>
                <p className="text-sm text-gray-200 mt-1">
                  {products.find(p => p.barcode === formData.barcode)
                    ? "View or replicate existing product details."
                    : "Fill in the details below to add a new item."}
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-300 hover:text-slateGray transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              <div className="space-y-4">
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
                        <option key={cat.id} value={cat.id}>
                          {cat.category_name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Barcode
                  </label>
                  <input
                    type="text"
                    name="barcode"
                    value={formData.barcode}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-200 text-gray-500 cursor-not-allowed focus:outline-none"
                  />
                </div>
              </div>
            </div>

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

      {/* RENDER TOAST HERE */}
      {toast && (
        <div className="relative z-[9999]">
            <Toast
            message={toast.message}
            type={toast.type}
            duration={2000}
            onClose={() => setToast(null)}
            />
        </div>
      )}

      {isAlertOpen && (
        <AlertModal
          lowStockItems={lowStockList}
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