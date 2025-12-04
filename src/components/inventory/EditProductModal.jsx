import { useState, useEffect } from "react";
import { X, Save, Plus, Minus, ArrowRight } from "lucide-react";

export default function EditProductModal({ isOpen, onClose, product, categories, onSave }) {
  const [formData, setFormData] = useState({
    productName: "",
    categoryId: "",
    sellingPrice: "",
    costPrice: "",
    reorderPoint: "",
  });

  const [currentStock, setCurrentStock] = useState(0);
  const [adjustType, setAdjustType] = useState("add");
  const [adjustQty, setAdjustQty] = useState(0);

  // Populate modal when product is opened
  useEffect(() => {
    if (product && isOpen) {
      setFormData({
        productName: product.product_name || "",
        categoryId: Number(product.category_id) || "",
        sellingPrice: product.selling_price || "",
        costPrice: product.cost_price || "",
        reorderPoint: product.reorder_point ?? "", // handles undefined
      });

      setCurrentStock(product.quantity || 0);
      setAdjustQty(0);
      setAdjustType("add");
    }
  }, [product, isOpen]);

  // Unified handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // ensure categoryId stored as number
    if (name === "categoryId") {
      setFormData(prev => ({ ...prev, categoryId: Number(value) }));
      return;
    }

    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const resultingStock =
    adjustType === "add"
      ? parseInt(currentStock) + (parseInt(adjustQty) || 0)
      : parseInt(currentStock) - (parseInt(adjustQty) || 0);

  const handleSubmit = () => {
    const updatedProduct = {
      ...product,
      product_name: formData.productName,
      category_id: Number(formData.categoryId),
      selling_price: parseFloat(formData.sellingPrice),
      cost_price: parseFloat(formData.costPrice),
      reorder_point: parseInt(formData.reorderPoint),
      quantity: resultingStock,
    };

    onSave(updatedProduct);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-charcoalBlack/40 bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-softWhite rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto hide-scrollbar animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-navyBlue flex items-center justify-between p-6 border-b border-navyBlue/80">
          <div>
            <h2 className="text-xl font-semibold text-gray-200">Edit Product</h2>
            <p className="text-sm text-gray-300 mt-1">
              Update product details and adjust inventory levels.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-300 hover:text-white hover:bg-white/10 p-1 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">

          {/* Basic Details */}
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Name
              </label>
              <input
                type="text"
                name="productName"
                value={formData.productName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-navyBlue"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-navyBlue"
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

          {/* Pricing */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Selling (₱)
              </label>
              <input
                type="number"
                name="sellingPrice"
                value={formData.sellingPrice}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-navyBlue"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cost (₱)
              </label>
              <input
                type="number"
                name="costPrice"
                value={formData.costPrice}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-navyBlue"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reorder Pt.
              </label>
              <input
                type="number"
                name="reorderPoint"
                value={formData.reorderPoint}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-navyBlue"
              />
            </div>
          </div>

          {/* Stock Adjustment */}
          <div className="bg-gray-100 p-4 rounded-lg border border-gray-200">
            <h3 className="text-sm font-bold text-navyBlue mb-3 uppercase tracking-wide">
              Adjust Stock Level
            </h3>

            <div className="flex items-center justify-between mb-4">
              {/* Toggle Type */}
              <div className="flex bg-white rounded-lg p-1 border border-gray-300 shadow-sm">
                <button
                  onClick={() => setAdjustType("add")}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                    adjustType === "add"
                      ? "bg-green-100 text-green-700 shadow-sm"
                      : "text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  <Plus size={14} /> Add
                </button>

                <button
                  onClick={() => setAdjustType("remove")}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                    adjustType === "remove"
                      ? "bg-red-100 text-red-700 shadow-sm"
                      : "text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  <Minus size={14} /> Remove
                </button>
              </div>

              {/* Qty */}
              <input
                type="number"
                min="0"
                placeholder="Qty"
                value={adjustQty === 0 ? "" : adjustQty}
                onChange={(e) => setAdjustQty(e.target.value)}
                className="w-24 px-3 py-2 border border-gray-300 rounded-lg text-center font-bold focus:ring-2 focus:ring-navyBlue"
              />
            </div>

            {/* Stock Preview */}
            <div className="flex items-center justify-between bg-white px-4 py-2 rounded border border-dashed border-gray-300 text-sm">
              <div className="flex flex-col">
                <span className="text-gray-500 text-xs">Current</span>
                <span className="font-semibold text-gray-800">{currentStock}</span>
              </div>

              <ArrowRight size={16} className="text-gray-400" />

              <div className="flex flex-col items-end">
                <span className="text-gray-500 text-xs">New Total</span>
                <span
                  className={`font-bold ${
                    resultingStock < 0 ? "text-red-600" : "text-navyBlue"
                  }`}
                >
                  {resultingStock}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-lg">
          <button
            onClick={handleSubmit}
            className="w-full flex items-center justify-center gap-2 bg-navyBlue text-white py-3 rounded-lg font-medium hover:bg-[#1f781a] transition-all shadow-md hover:shadow-lg active:scale-[0.98]"
          >
            <Save size={18} />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
