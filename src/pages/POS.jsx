import { useState } from "react";
import Layout from "../components/Layout";
import Scanner from "../components/Scanner";
import CategoryButton from "../components/pos/CategoryButton.jsx";
import Product from "../components/pos/Product.jsx";
import { products, categories } from "../mockData";
import CartItem from "../components/pos/CartItem";
import { ShoppingCart } from "lucide-react";


export default function POS() {
  const [filtered, setFiltered] = useState(products);
  const [activeCategory, setActiveCategory] = useState("All");

  return (
    <Layout>
      <div className="flex gap-6 w-full">

        <div className="flex-1 flex flex-col gap-3">
          <div className="flex justify-between items-center gap-5">
            {/* Insert Search and Scanner component here */}
            <Scanner />
          </div>

          {/* Categories */}
          <div>
            <CategoryButton
              categories={categories}
              active={activeCategory}
              onSelect={setActiveCategory}
            />
          </div>

          {/* Product Grid */}
          <div className="bg-softWhite border border-gray-300 p-4 rounded-xl overflow-x-auto max-h-115 [&::-webkit-scrollbar]:hidden -ms-overflow-style-none">
            <h2 className="text-lg font-semibold mb-2">
              {activeCategory === "All" ? "All Products" : activeCategory}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4 mt-2">
              {filtered.map((p) => (
                <Product key={p.id} product={p} />
              ))}
            </div>
          </div>
        </div>

        {/* Cart */}
          <div className="w-[320px] bg-white rounded-xl border border-gray-300 shadow-sm p-4 flex flex-col">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <ShoppingCart size={18} /> Cart
            </h2>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto pr-2 space-y-3">
              <CartItem />
            </div>

            {/* Summary */}
            <div className="border-t border-gray-300 pt-4 mt-4 space-y-2">
              <div className="flex justify-between font-semibold text-base">
                <span>Total</span>
                <span>₱0.00</span>
              </div>

              <button
                className="w-full mt-3 bg-darkGreen text-white py-2 rounded-lg 
              hover:bg-navyBlue transition font-semibold"
              >
                Checkout
              </button>
            </div>
          </div>
      </div>
    </Layout>
  );
}
