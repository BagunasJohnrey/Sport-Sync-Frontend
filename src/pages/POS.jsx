import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import Scanner from "../components/Scanner";
import Search from "../components/Search";
import CategoryButton from "../components/pos/CategoryButton.jsx";
import Product from "../components/pos/Product.jsx";
import { products, categories } from "../mockData";
import CartModal from "../components/pos/CartModal";
import CartItem from "../components/pos/CartItem";
import { ShoppingCart, PackageOpen, Banknote, CreditCard, Smartphone, Trash2 } from "lucide-react";
import Toast from "../components/Toast";

export default function POS() {
  const [filtered, setFiltered] = useState(products);
  const [activeCategory, setActiveCategory] = useState("All");
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toast, setToast] = useState(null);
  
  const [paymentMethod, setPaymentMethod] = useState("Cash");

  const paymentOptions = [
    { id: "Cash", icon: Banknote, label: "Cash" },
    { id: "Card", icon: CreditCard, label: "Card" },
    { id: "GCash", icon: Smartphone, label: "GCash" },
  ];

  // --- Filtering Logic ---
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

  // --- Cart Handlers ---
  const addToCart = (product) => {
    if (product.quantity === 0) {
      setToast({ message: "Product is out of stock!", type: "error" });
      return;
    }

    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        if (existing.quantity < product.quantity) {
          return prev.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        } else {
             setToast({ message: "Max stock reached for this item", type: "error" });
             return prev;
        }
      }
      return [...prev, { ...product, quantity: 1, stock: product.quantity }];
    });
  };

  // --- SCANNER HANDLER ---
  const handleScanResult = (barcodeText) => {
    const foundProduct = products.find(p => p.barcode === barcodeText);

    if (foundProduct) {
        addToCart(foundProduct);
        setToast({ message: `Added: ${foundProduct.product_name}`, type: "success" });
    } else {
        setToast({ message: `Product not found (Barcode: ${barcodeText})`, type: "error" });
    }
  };

  const updateQuantity = (productId, delta) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.id === productId) {
             const newQuantity = item.quantity + delta;
             if(newQuantity > item.stock) return item; 
             if(newQuantity < 1) return item;
             return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  const removeItem = (productId) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  const clearCart = () => {
    if(cart.length > 0 && window.confirm("Are you sure you want to clear the cart?")){
        setCart([]);
    }
  };

  const handleCheckout = () => {
    setToast({ message: `Processing ${paymentMethod} payment...`, type: "success" });
    // Logic for transaction
    setTimeout(() => setCart([]), 1500);
  };

  const totalAmount = cart.reduce(
    (acc, item) => acc + item.selling_price * item.quantity,
    0
  );

  return (
    <Layout>
      <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-8rem)]">
        
        {/* --- LEFT COLUMN: PRODUCTS --- */}
        <div className="flex-1 flex flex-col gap-4 h-full overflow-hidden">
          
          {/* Header & Search */}
          <div className="shrink-0 mt-5 lg:mt-0 w-full mb-4 relative z-10"> 
            <div className="flex items-center gap-3 w-full">
              <div className="flex-1">
                <Search />
              </div>
              <div className="shrink-0">
                <Scanner onScan={handleScanResult} />
              </div>
            </div>
          </div>

          {/* Categories */}
          <div className="shrink-0">
            <CategoryButton
              categories={categories}
              active={activeCategory}
              onSelect={setActiveCategory}
            />
          </div>

          {/* Products Grid Area */}
          <div className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl p-4 overflow-y-auto hide-scrollbar shadow-inner relative z-0">
            <div className="flex items-center justify-between mb-4">
                 <h2 className="text-navyBlue font-bold text-lg tracking-tight">
                  {activeCategory === "All" ? "All Products" : activeCategory}
                 </h2>
                 <span className="text-sm text-slate-500 font-medium">
                   {filtered.length} Items
                 </span>
            </div>

            {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                    <PackageOpen size={48} className="mb-2 opacity-50" />
                    <p>No products found in this category.</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 pb-20 lg:pb-0">
                {filtered.map((p) => {
                    const cartItem = cart.find((c) => c.id === p.id);
                    const inCartQuantity = cartItem ? cartItem.quantity : 0;
                    const isMaxed = inCartQuantity >= p.quantity;

                    return (
                        <Product
                            key={p.id}
                            product={p}
                            onAdd={() => !isMaxed && addToCart(p)}
                            disabled={isMaxed || p.quantity === 0}
                        />
                    );
                })}
                </div>
            )}
          </div>
        </div>

        {/* --- RIGHT COLUMN: CART (Fixed Width on Desktop) --- */}
        <div className="
            fixed bottom-0 left-0 right-0 h-20 bg-softWhite border-t border-slate-200 p-4 
            shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] 
            z-10 
            lg:shadow-none lg:static lg:h-full lg:w-[400px] lg:flex lg:flex-col lg:rounded-2xl lg:border lg:border-slate-200 lg:bg-softWhite
        ">
            {/* Mobile View Summary */}
            <div className="flex lg:hidden justify-between items-center w-full">
                <div className="flex flex-col">
                    <span className="text-xs text-slate-500">Total ({cart.length} items)</span>
                    <span className="font-bold text-navyBlue text-xl">₱{totalAmount.toLocaleString()}</span>
                </div>
                <button 
                    onClick={() => setIsCartOpen(true)} 
                    className="bg-navyBlue text-softWhite px-6 py-2 rounded-lg font-bold"
                >
                    View Cart
                </button>
            </div>

            {/* Desktop View Full Cart */}
            <div className="hidden lg:flex flex-col h-full">
                <div className="p-5 border-b border-slate-100">
                    <h2 className="text-xl font-bold text-navyBlue flex items-center gap-2">
                        <ShoppingCart className="text-darkGreen" /> 
                        Current Order
                    </h2>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4 hide-scrollbar">
                    {cart.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-2">
                            <ShoppingCart size={48} className="opacity-50" />
                            <p className="text-sm font-semibold">Cart is empty</p>
                            <p className="text-xs text-slate-400">Scan or click products to add</p>
                        </div>
                    ) : (
                        <CartItem
                            cart={cart}
                            onIncrease={(id) => updateQuantity(id, 1)}
                            onDecrease={(id) => updateQuantity(id, -1)}
                            onRemove={removeItem}
                        />
                    )}
                </div>

                <div className="p-5 bg-slate-50 border-t border-slate-200 mt-auto rounded-b-2xl">
                    <div className="mb-4">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-2 block">
                        Payment Method
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {paymentOptions.map((option) => {
                          const Icon = option.icon;
                          const isSelected = paymentMethod === option.id;
                          return (
                            <button
                              key={option.id}
                              onClick={() => setPaymentMethod(option.id)}
                              className={`
                                flex flex-col items-center justify-center py-2 rounded-lg border transition-all duration-200
                                ${isSelected 
                                  ? "bg-navyBlue border-navyBlue text-softWhite shadow-md ring-1 ring-navyBlue" 
                                  : "bg-softWhite border-slate-200 text-slate-600 hover:border-navyBlue hover:text-navyBlue"}
                              `}
                            >
                              <Icon size={18} className="mb-1" />
                              <span className="text-[10px] font-bold">{option.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="space-y-2 mb-4 pt-4 border-t border-slate-200">
                        <div className="flex justify-between text-navyBlue font-bold text-xl">
                            <span>Total</span>
                            <span>₱{totalAmount.toLocaleString()}</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-4 gap-3">
                        <button 
                            disabled={cart.length === 0}
                            onClick={clearCart}
                            className="col-span-1 flex items-center justify-center bg-softWhite border border-slate-200 text-rose-500 rounded-xl hover:bg-rose-50 hover:border-rose-200 transition-colors disabled:opacity-50"
                            title="Clear Cart"
                        >
                            <Trash2 size={20} />
                        </button>

                        <button 
                            disabled={cart.length === 0}
                            onClick={handleCheckout}
                            className="col-span-3 bg-navyBlue text-softWhite py-3.5 rounded-xl font-bold text-base hover:bg-darkGreen transition-colors shadow-lg shadow-indigo-900/10 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                        >
                            <span>Pay with {paymentMethod}</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>

      </div>

      {/* FIX: Wrapped Toast in a high z-index relative container to ensure it stays above the fixed Cart Footer */}
      <div className="relative z-[9999]">
        {toast && (
            <Toast
            message={toast.message}
            type={toast.type}
            duration={2000}
            onClose={() => setToast(null)}
            />
        )}
      </div>

      <div className="relative z-[9999]">
        <CartModal 
            isOpen={isCartOpen}
            onClose={() => setIsCartOpen(false)}
            cart={cart}
            onIncrease={(id) => updateQuantity(id, 1)}
            onDecrease={(id) => updateQuantity(id, -1)}
            onRemove={removeItem}
            totalAmount={totalAmount}
        />
      </div>
    </Layout>
  );
}