import { Plus, Minus, Trash2 } from "lucide-react";

export default function CartItem({ cart, onIncrease, onDecrease, onRemove }) {
  return (
    <div className="flex flex-col">
      {cart.map((item) => (
        <div
          key={item.id}
          className="group flex flex-col gap-3 py-1 border-b border-gray-100 last:border-0"
        >
          {/* Top Row: Name and Remove */}
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-semibold text-gray-800 text-sm leading-tight">
                {item.product_name}
              </h4>
              <p className="text-xs text-gray-500 mt-1">
                ₱{item.selling_price.toLocaleString()} / unit
              </p>
            </div>
            <button
              onClick={() => onRemove(item.id)}
              className="text-gray-300 hover:text-red-500 transition-colors p-1"
            >
              <Trash2 size={16} />
            </button>
          </div>

          {/* Bottom Row: Controls and Total */}
          <div className="flex justify-between items-end">
            
            {/* Quantity Capsule */}
            <div className="flex items-center bg-gray-50 rounded-lg border border-gray-200 p-0.5">
              <button
                className="p-1.5 rounded-md hover:bg-white hover:shadow-sm text-gray-600 transition-all disabled:opacity-30"
                onClick={() => onDecrease(item.id)}
                disabled={item.quantity <= 1}
              >
                <Minus size={14} />
              </button>
              
              <span className="w-8 text-center text-sm font-semibold text-gray-700">
                {item.quantity}
              </span>
              
              <button
                className="p-1.5 rounded-md hover:bg-white hover:shadow-sm text-navyBlue transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                onClick={() => onIncrease(item.id)}
                disabled={item.quantity >= item.stock}
              >
                <Plus size={14} />
              </button>
            </div>

            {/* Item Total */}
            <span className="font-bold text-navyBlue text-base">
              ₱{(item.selling_price * item.quantity).toLocaleString()}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}