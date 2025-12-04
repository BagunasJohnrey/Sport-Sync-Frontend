import { Plus, AlertCircle, CheckCircle2 } from "lucide-react";

export default function Product({ product, onAdd, disabled, inCartQuantity = 0 }) {
  // Calculate visual stock: Total - In Cart
  const currentStock = Math.max(0, product.quantity - inCartQuantity);
  

  const reorderThreshold = product.reorder_level !== undefined ? product.reorder_level : 10;

  const isLowStock = product.quantity > 0 && product.quantity <= (product.reorder_level || 10);
  const isOutOfStock = currentStock === 0;

  return (
    <div
      className={`
        relative flex flex-col justify-between p-4 sm:p-5 md:p-6 rounded-2xl border transition-all duration-200 min-h-[10rem]
        ${
          disabled
            ? "bg-gray-50 border-gray-100 opacity-60 cursor-not-allowed"
            : "bg-white border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 hover:border-slate-200"
        }
      `}
    >
      {/* Top Section: Header & Price */}
      <div>
        <h3 className="
          font-semibold text-slate-700 
          text-sm sm:text-base leading-tight 
          mb-2 sm:mb-2 md:mb-3 
          line-clamp-2 min-h-[2.5em]
        ">
          {product.product_name}
        </h3>
        <p className="
          font-bold text-navyBlue 
          text-lg sm:text-xl md:text-2xl 
          tracking-tight
        ">
          ₱{product.selling_price.toLocaleString()}
        </p>
      </div>

      {/* Bottom Section: Stock & Action */}
      <div className="
        flex items-end justify-between 
        mt-3 sm:mt-4
      ">
        
        {/* Stock Indicator */}
        <div className="flex flex-col gap-1">
          <div className={`
            flex items-center gap-1.5 
            text-xs sm:text-sm font-medium 
            px-2 py-1 rounded-md w-fit
            ${isOutOfStock ? "bg-red-50 text-red-600" : 
              isLowStock ? "bg-orange-50 text-orange-600" : "bg-emerald-50 text-emerald-600"}
          `}>
            {isOutOfStock ? <AlertCircle size={14} className="sm:size-4" /> : <CheckCircle2 size={14} className="sm:size-4" />}
            {currentStock} left
          </div>
        </div>

        {/* Add Button */}
        <button
          onClick={onAdd}
          disabled={disabled}
          className={`
            size-8 sm:size-10 md:size-12 
            rounded-full flex items-center justify-center shadow-md transition-all
            ${disabled
              ? "bg-slate-200 text-slate-400"
              : "bg-navyBlue text-white hover:bg-darkGreen hover:scale-105 active:scale-95"
            }
          `}
        >
          <Plus size={18} className="sm:size-5 md:size-6" strokeWidth={3} />
        </button>
      </div>
    </div>
  );
}