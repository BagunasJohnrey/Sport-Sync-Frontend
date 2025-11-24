import { Plus } from "lucide-react";

export default function Product({ product }) {
  return (
    <div
      className="p-4 bg-white rounded-lg border border-gray-300 shadow-sm hover:shadow-md 
      cursor-pointer transition flex flex-col justify-between"
    >

      <div className="flex flex-row items-center justify-between mb-4">
        <h3 className="font-medium text-sm">{product.product_name}</h3>
        <p className="font-semibold text-sm mt-1">₱{product.selling_price}</p>
      </div>

      <div className="flex justify-between items-center">
        <span
          className={`text-xs ${
            product.quantity === 0
              ? "text-red-500"
              : product.quantity < 20
              ? "text-orange-500"
              : "text-green-500"
          }`}
        >
          {product.quantity} in stock
        </span>
        <button className="px-3 py-1 bg-navyBlue text-white rounded flex items-center space-x-1 hover:bg-deepBlue transition">
          <Plus size={14} />
        </button>
      </div>
    </div>
  );
}
