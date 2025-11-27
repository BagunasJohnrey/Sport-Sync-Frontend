import { Plus, Minus, Trash2 } from "lucide-react";

export default function CartItem({ cart, onIncrease, onDecrease, onRemove }) {
  return (
    <div className="flex flex-col gap-3">
      {cart.map((item) => (
        <div
          key={item.id}
          className="bg-gray-50 p-3 rounded-lg border border-gray-200 w-full"
        >
          {/* Top */}
          <div className="flex justify-between items-center mb-2">
            <div className="flex flex-col">
              <span className="font-semibold text-gray-800">
                {item.product_name}
              </span>
              <span className="text-gray-500 text-sm">
                ₱{item.selling_price}
              </span>
            </div>
            <button
              className="text-red-500 hover:text-red-600"
              onClick={() => onRemove(item.id)}
            >
              <Trash2 size={18} />
            </button>
          </div>

          {/* Bottom: Quantity controls */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <button
                className="p-1 rounded-md bg-gray-200 hover:bg-gray-300"
                onClick={() => onDecrease(item.id)}
              >
                <Minus size={16} />
              </button>
              <span className="px-2">{item.quantity}</span>
              <button
                className={`p-1 rounded-md bg-gray-200 hover:bg-gray-300 ${
                  item.quantity >= item.stock
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
                onClick={() =>
                  item.quantity < item.stock && onIncrease(item.id)
                }
                disabled={item.quantity >= item.stock}
              >
                <Plus size={16} />
              </button>
            </div>
            <span className="font-semibold text-gray-800">
              ₱{(item.selling_price * item.quantity).toFixed(2)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
