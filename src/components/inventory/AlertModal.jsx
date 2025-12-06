import { X, AlertTriangle, AlertOctagon, TrendingDown, CheckCircle } from "lucide-react";

export default function AlertModal({ lowStockItems = [], onClose }) {
  if (!lowStockItems || lowStockItems.length === 0) return null;

  // Render Status Badge based on item status
  const renderStatus = (status, current) => {
    switch(status) {
        case 'out_of_stock':
            return (
                <div className="flex items-center gap-1 text-red-700 bg-red-100 px-2 py-0.5 rounded text-xs font-bold border border-red-200">
                    <AlertTriangle size={12} strokeWidth={3} /> OUT
                </div>
            );
        case 'critical':
            return (
                <div className="flex items-center gap-1 text-red-600 bg-red-50 px-2 py-0.5 rounded text-xs font-bold border border-red-200">
                    <AlertOctagon size={12} strokeWidth={3} /> CRITICAL
                </div>
            );
        case 'low':
            return (
                <div className="flex items-center gap-1 text-orange-600 bg-orange-50 px-2 py-0.5 rounded text-xs font-bold border border-orange-200">
                    <TrendingDown size={12} strokeWidth={3} /> LOW
                </div>
            );
        default:
            return null;
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-charcoalBlack/50 flex items-center justify-center z-[999] p-4" 
      onClick={onClose}
    >
      <div 
        className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative px-6 pt-6 pb-2 text-center">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1 rounded-full transition-all"
          >
            <X size={20} />
          </button>
          
          <div className="inline-flex justify-center items-center p-3 bg-red-50 rounded-full mb-3 ring-4 ring-red-50/50">
            <AlertTriangle className="text-red-600" size={32} strokeWidth={2} />
          </div>
          
          <h2 className="text-xl font-bold text-gray-900 mb-1">Inventory Alert</h2>
          <p className="text-gray-500 text-sm">
            <span className="font-bold text-red-600">{lowStockItems.length}</span> product(s) require your attention.
          </p>
        </div>

        {/* Items List */}
        <div className="px-4 py-2">
            <div className="max-h-[60vh] overflow-y-auto pr-2 space-y-2 custom-scrollbar">
              {lowStockItems.map((item, index) => (
                <div 
                  key={index} 
                  className={`
                    p-3 rounded-xl border flex justify-between items-center transition-colors
                    ${item.status === 'out_of_stock' ? 'bg-red-50/50 border-red-100' : 'bg-white border-gray-100 hover:border-gray-200'}
                  `}
                >
                  <div className="flex-1 min-w-0 mr-3">
                    <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-gray-900 truncate">{item.name}</h4>
                        {renderStatus(item.status, item.current)}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span className="font-mono bg-gray-100 px-1.5 py-0.5 rounded text-gray-600">{item.sku}</span>
                        <span>Min: {item.minimum}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-500">Stock</div>
                    <div className={`text-xl font-bold ${item.current === 0 ? 'text-red-600' : 'text-gray-800'}`}>
                        {item.current}
                    </div>
                  </div>
                </div>
              ))}
            </div>
        </div>

      </div>
    </div>
  );
}