
import { X, AlertTriangle } from "lucide-react";

export default function AlertModal({ lowStockItems = [], onClose }) {
  return (
    <div 
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-999 p-15 md:p-10" 
      onClick={onClose}
    >
      <div 
        className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden pb-5" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with close button */}
        <div className="relative px-6 pt-6 pb-4">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
          
          {/* Alert Icon */}
          <div className="flex justify-center mb-3">
            <div className="w-12 h-12 rounded-full border-3 border-red-600 flex items-center justify-center">
              <span className="text-red-600 text-3xl font-light">!</span>
            </div>
          </div>
          
          {/* Title */}
          <div className="flex items-center justify-center gap-2 mb-7">
            <AlertTriangle className="text-orange-400" size={18} />
            <h2 className="title">Low Stock Alert</h2>
          </div>
          
          {/* Subtitle */}
          <p className="text-justify text-gray-900 text-xs mb-1 font-montserrat-medium">
            {lowStockItems.length} item(s) are running low on stock:
          </p>
        </div>

        {/* Items List */}
        <div className="px-6 pb-4 max-h-60 overflow-y-auto">
          <ul className="space-y-1.5">
            {lowStockItems.map((item, index) => (
              <li key={index} className="text-gray-700 text-xs">
                <div className="flex items-start gap-1.5">
                  <span className="text-gray-700 mt-0.5">•</span>
                  <div>
                    <div className="font-semibold text-gray-700">
                      {item.name} <span className="text-gray-700 text-xs font-normal">(SKU: {item.sku})</span>
                    </div>
                    <div className="text-xs text-gray-700">
                      Current: {item.current} {item.unit}, Minimum: {item.minimum} {item.unit}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
