import { Plus, Minus, Trash2 } from "lucide-react";
import { mockCartItems } from "../../mockData";

export default function CartItem() {
  return (
    <div className="flex flex-col gap-3">
      {mockCartItems.map((item) => (
        <div
          key={item.id}
          className="bg-gray-50 p-3 rounded-lg border border-gray-200 w-full"
        >
          {/* Top: Name, Price, Delete */}
          <div className="flex justify-between items-center mb-2">
            <div className="flex flex-col">
              <span className="font-semibold text-gray-800">{item.name}</span>
              <span className="text-gray-500 text-sm">₱{item.price}</span>
            </div>
            <button className="text-red-500 hover:text-red-600">
              <Trash2 size={18} />
            </button>
          </div>

          {/* Bottom: Quantity controls and total */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <button className="p-1 rounded-md bg-gray-200 hover:bg-gray-300">
                <Minus size={16} />
              </button>
              <span className="px-2">{item.quantity}</span>
              <button className="p-1 rounded-md bg-gray-200 hover:bg-gray-300">
                <Plus size={16} />
              </button>
            </div>
            <span className="font-semibold text-gray-800">
              ₱{item.price * item.quantity}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
