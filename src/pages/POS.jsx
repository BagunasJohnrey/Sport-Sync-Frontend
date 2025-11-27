import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import Scanner from "../components/Scanner";
import CategoryButton from "../components/pos/CategoryButton.jsx";
import Product from "../components/pos/Product.jsx";
import { products, categories } from "../mockData";
import CartItem from "../components/pos/CartItem";
import { ShoppingCart } from "lucide-react";
import Toast from "../components/Toast";

export default function POS() {
  const [filtered, setFiltered] = useState(products);
  const [activeCategory, setActiveCategory] = useState("All");
  const [cart, setCart] = useState([]);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    setFiltered(
      activeCategory === "All"
        ? products
        : products.filter((p) =>
            categories.find(
              (c) =>
                c.category_name === activeCategory && c.id === p.category_id
            )
          )
    );
  }, [activeCategory]);

  {
    filtered.map((p) => {
      const cartItem = cart.find((c) => c.id === p.id);
      const inCartQuantity = cartItem ? cartItem.quantity : 0;
      const isMaxed = inCartQuantity >= p.quantity; // disable if cart has reached stock

      return (
        <Product
          key={p.id}
          product={p}
          onAdd={() => !isMaxed && addToCart(p)}
          disabled={isMaxed}
        />
      );
    });
  }

  const addToCart = (product) => {
    if (product.quantity === 0) {
      setToast({ message: "Product is out of stock!", type: "error" });
      return;
    }

    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        // Prevent exceeding stock
        if (existing.quantity < product.quantity) {
          return prev.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        }
        return prev;
      }
      // Include stock field from original product
      return product.quantity > 0
        ? [...prev, { ...product, quantity: 1, stock: product.quantity }]
        : prev;
    });
  };

  const updateQuantity = (productId, delta) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === productId
          ? { ...item, quantity: Math.min(item.quantity + delta, item.stock) }
          : item
      )
    );
  };

  const removeItem = (productId) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  const totalAmount = cart.reduce(
    (acc, item) => acc + item.selling_price * item.quantity,
    0
  );

  return (
    <Layout>
      <div className="flex gap-6 w-full">
        {/* Products Column */}
        <div className="flex-1 flex flex-col gap-3">
          <div className="flex justify-between items-center gap-5">
            <Scanner />
          </div>

          <div>
            <CategoryButton
              categories={categories}
              active={activeCategory}
              onSelect={setActiveCategory}
            />
          </div>

          <div className="bg-softWhite border border-gray-300 p-4 rounded-xl overflow-x-auto max-h-115 hide-scrollbar -ms-overflow-style-none">
            <h2 className="text-lg font-semibold mb-2">
              {activeCategory === "All" ? "All Products" : activeCategory}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4 mt-2">
              {filtered.map((p) => (
                <Product key={p.id} product={p} onAdd={() => addToCart(p)} />
              ))}
            </div>
          </div>
        </div>

        {/* Cart Column */}
<div className="w-[320px] bg-white rounded-xl border border-gray-300 shadow-sm p-4 flex flex-col
                lg:h-[610px]"> 
  <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
    <ShoppingCart size={18} /> Cart
  </h2>

  {/* Cart Items */}
  <div className="flex-1 overflow-y-auto pr-2 space-y-3">
    <CartItem
      cart={cart}
      onIncrease={(id) => updateQuantity(id, 1)}
      onDecrease={(id) => updateQuantity(id, -1)}
      onRemove={removeItem}
    />
  </div>

  {/* Summary */}
  <div className="border-t border-gray-300 pt-4 mt-4 space-y-2">
    <div className="flex justify-between font-semibold text-base">
      <span>Total</span>
      <span>₱{totalAmount.toFixed(2)}</span>
    </div>

    <button className="w-full mt-3 bg-darkGreen text-white py-2 rounded-lg hover:bg-navyBlue transition font-semibold">
      Checkout
    </button>
  </div>
</div>

      </div>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          duration={2000}
          onClose={() => setToast(null)}
        />
      )}
    </Layout>
  );
}
