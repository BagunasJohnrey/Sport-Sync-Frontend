import { useState, useEffect, useCallback } from "react"; 
import Layout from "../components/Layout";
import Scanner from "../components/Scanner";
import Search from "../components/Search"; 
import CategoryButton from "../components/pos/CategoryButton.jsx";
import Product from "../components/pos/Product.jsx";
import CartModal from "../components/pos/CartModal";
import CartItem from "../components/pos/CartItem";
import { ShoppingCart, PackageOpen, Banknote, CreditCard, Smartphone, Trash2, Loader2, Calculator } from "lucide-react"; 
import Toast from "../components/Toast";
import API from '../services/api'; 
import { useAuth } from '../context/AuthContext'; 

export default function POS() {
  const { user } = useAuth(); 
  const [allProducts, setAllProducts] = useState([]); 
  const [categories, setCategories] = useState([]); 
  const [filtered, setFiltered] = useState([]); 
  const [activeCategory, setActiveCategory] = useState("All");
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true); 
  
  const [searchQuery, setSearchQuery] = useState('');
  const [paymentMethod, setPaymentMethod] = useState("Cash");

  const [amountPaid, setAmountPaid] = useState("");
  const [change, setChange] = useState(0);

  const paymentOptions = [
    { id: "Cash", icon: Banknote, label: "Cash" },
    { id: "Card", icon: CreditCard, label: "Card" },
    { id: "GCash", icon: Smartphone, label: "GCash" }, 
  ];
  
  // --- DATA FETCHING ---
  const fetchProductsAndCategories = useCallback(async () => {
    setLoading(true);
    try {
        const [productsRes, categoriesRes] = await Promise.all([
            API.get('/products', { 
                params: { 
                    limit: 1000,
                    search: searchQuery, 
                    category_id: activeCategory === 'All' ? undefined : categories.find(c => c.category_name === activeCategory)?.category_id 
                } 
            }),
            API.get('/categories')
        ]);
        
        if (categories.length === 0) {
            setCategories(categoriesRes.data.data);
        }
        
        setAllProducts(productsRes.data.data);
    } catch (error) {
        console.error("Failed to fetch POS data:", error.response?.data || error);
        setToast({ message: "Failed to load products.", type: "error" });
        setAllProducts([]);
    } finally {
        setLoading(false);
    }
  }, [searchQuery, activeCategory, categories.length]);

  useEffect(() => {
    fetchProductsAndCategories();
  }, [fetchProductsAndCategories]); 

  useEffect(() => {
    setFiltered(allProducts);
  }, [allProducts]);


  const totalAmount = cart.reduce(
    (acc, item) => acc + item.selling_price * item.quantity,
    0
  );

  // --- CHANGE CALCULATION EFFECT ---
  useEffect(() => {
    const paid = parseFloat(amountPaid) || 0;
    const due = parseFloat(totalAmount) || 0;
    setChange(Math.max(0, paid - due));
  }, [amountPaid, totalAmount]);

  // --- HELPER FOR QUICK CASH BUTTONS ---
  const handleQuickAmount = (amount) => {
    setAmountPaid(amount.toString());
  };

  const isPaymentSufficient = (parseFloat(amountPaid) || 0) >= totalAmount;

  // --- CART LOGIC ---
  const addToCart = (product) => {
    if (product.quantity === 0) {
      setToast({ message: "Product is out of stock!", type: "error" });
      return;
    }

    setCart((prev) => {
      const existing = prev.find((item) => item.product_id === product.product_id); 
      if (existing) {
        if (existing.quantity < product.quantity) {
          return prev.map((item) =>
            item.product_id === product.product_id 
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        } else {
             setToast({ message: "Max stock reached for this item", type: "error" });
             return prev;
        }
      }
      return [...prev, { ...product, quantity: 1, stock: product.quantity, id: product.product_id }]; 
    });
  };

  // --- SCANNER HANDLER ---
  const handleScanResult = useCallback((barcodeText) => {
    const foundLocal = allProducts.find(p => p.barcode === barcodeText);
    
    if (foundLocal) {
        addToCart(foundLocal);
        setToast({ message: `Added: ${foundLocal.product_name}`, type: "success" });
    } else {
        API.get(`/products/barcode/${barcodeText}`)
          .then(res => {
            const product = res.data.data;
            if (product) {
                addToCart(product);
                setToast({ message: `Added: ${product.product_name}`, type: "success" });
            } else {
                setToast({ message: `Product not found (Barcode: ${barcodeText})`, type: "error" });
            }
          })
          .catch(() => {
            setToast({ message: `Product not found (Barcode: ${barcodeText})`, type: "error" });
          });
    }
  }, [allProducts]);

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
        setAmountPaid(""); 
        setChange(0);
        setToast({ message: "Cart cleared.", type: "info" });
    }
  };

  // --- UNIFIED CHECKOUT HANDLER ---
  // Accepts payment details object for mobile modal, otherwise uses desktop state
  const handleCheckout = async (paymentDetails = null) => { 
    if (cart.length === 0) return;

    // Determine source of payment data (Mobile Modal vs Desktop Sidebar)
    const finalMethod = paymentDetails ? paymentDetails.method : paymentMethod;
    const finalPaid = paymentDetails ? paymentDetails.paid : (paymentMethod === "Cash" ? parseFloat(amountPaid) : totalAmount);
    const finalChange = paymentDetails ? paymentDetails.change : change;

    // Validate
    if (finalMethod === "Cash" && (isNaN(finalPaid) || finalPaid < totalAmount)) {
        setToast({ message: "Insufficient payment amount.", type: "error" });
        return;
    }

    try {
        const transactionPayload = {
            user_id: user.user_id, 
            payment_method: finalMethod, 
            total_amount: totalAmount,
            amount_paid: finalPaid, 
            change_due: finalChange,
            remarks: 'POS Sale',
            items: cart.map(item => ({
                product_id: item.product_id, 
                quantity: item.quantity,
                unit_price: item.selling_price,
                total_price: item.selling_price * item.quantity
            }))
        };

        setToast({ message: `Processing ${finalMethod} payment...`, type: "info" });
        
        await API.post('/transactions', transactionPayload); 
        
        setToast({ message: "Transaction completed successfully!", type: "success" });
        
        // Reset State
        setCart([]);
        setAmountPaid(""); 
        setChange(0);
        setIsCartOpen(false); // Close mobile modal if open

        // "Refresh Page" (Re-fetch Data)
        fetchProductsAndCategories(); 

    } catch (error) {
        const errorMessage = error.response?.data?.message || 'Transaction failed due to server error.';
        setToast({ message: errorMessage, type: "error" });
    }
  };

  return (
    <Layout>
      <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-8rem)] ">
        
        {/* --- LEFT COLUMN: PRODUCTS --- */}
        <div className="flex-1 flex flex-col gap-4 h-full lg:max-w-240 overflow-hidden">
          
          {/* Header & Search */}
          <div className="shrink-0 mt-5 lg:mt-0 w-full mb-4 relative z-10"> 
            <div className="flex items-center gap-3 w-full">
              <div className="flex-1">
                <Search onSearch={setSearchQuery} /> 
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
              onSelect={(category) => {
                setActiveCategory(category);
                setSearchQuery('');
              }}
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

            {loading ? ( 
                <div className="flex flex-col items-center justify-center h-64 text-navyBlue">
                    <Loader2 size={40} className="mb-2 animate-spin" />
                    <p>Loading products...</p>
                </div>
            ) : filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                    <PackageOpen size={48} className="mb-2 opacity-50" />
                    <p>No products found in this selection.</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 pb-20 lg:pb-0">
                {filtered.map((p) => {
                    const cartItem = cart.find((c) => c.product_id === p.product_id); 
                    const inCartQuantity = cartItem ? cartItem.quantity : 0;
                    const isMaxed = inCartQuantity >= p.quantity;

                    return (
                        <Product
                            key={p.product_id} 
                            product={p}
                            inCartQuantity={inCartQuantity} 
                            onAdd={() => !isMaxed && addToCart(p)}
                            disabled={isMaxed || p.quantity === 0}
                        />
                    );
                })}
                </div>
            )}
          </div>
        </div>

        {/* --- RIGHT COLUMN: CART (Desktop Sidebar) --- */}
        <div className="
            fixed bottom-0 left-0 right-0 h-20 bg-softWhite border-t border-slate-200 p-2 
            shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] 
            z-40 
            lg:shadow-none lg:static lg:h-full lg:w-[340px] lg:flex lg:flex-col lg:rounded-2xl lg:border lg:border-slate-200 lg:bg-softWhite
        ">
            {/* Mobile View Summary Bar */}
            <div className="flex lg:hidden justify-between items-center w-full p-2">
                <div className="flex flex-col">
                    <span className="text-xs text-slate-500">Total ({cart.length} items)</span>
                    <span className="font-bold text-navyBlue text-xl">₱{totalAmount.toLocaleString()}</span>
                </div>
                <button 
                    onClick={() => setIsCartOpen(true)} 
                    className="bg-navyBlue text-softWhite px-6 py-2 rounded-lg font-bold shadow-md active:scale-95 transition-transform"
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

                <div className="p-2 bg-slate-50 border-t border-slate-200 mt-auto rounded-b-2xl">
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
                                flex flex-col items-center justify-center py-1 rounded-lg border transition-all duration-200
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

                    {/* Cash Input Section (Desktop) */}
                    {paymentMethod === "Cash" && cart.length > 0 && (
                      <div className="mb-4 p-3 bg-white rounded-lg border border-slate-200 shadow-sm">
                        <div className="flex justify-between items-center mb-2">
                          <label className="text-xs font-bold text-navyBlue flex items-center gap-1">
                            <Calculator size={14} />
                            Amount Received
                          </label>
                          <div className="flex gap-1.5">
                            {[100, 500, 1000].map(amt => (
                              <button
                                key={amt}
                                onClick={() => handleQuickAmount(amt)}
                                className="text-[10px] font-bold px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded hover:bg-slate-200 transition-colors"
                              >
                                {amt}
                              </button>
                            ))}
                            <button
                                onClick={() => handleQuickAmount(totalAmount)}
                                className="text-[10px] font-bold px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                              >
                                Exact
                              </button>
                          </div>
                        </div>
                        
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">₱</span>
                          <input 
                            type="number" 
                            value={amountPaid}
                            onChange={(e) => setAmountPaid(e.target.value)}
                            placeholder="0.00"
                            className="w-full pl-6 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-navyBlue text-sm font-bold text-slate-800"
                          />
                        </div>
                      </div>
                    )}

                    <div className="space-y-2 mb-4 pt-2 border-t border-slate-200">
                        <div className="flex justify-between text-slate-600 text-sm">
                            <span>Subtotal</span>
                            <span className="font-semibold">₱{totalAmount.toLocaleString()}</span>
                        </div>

                        {paymentMethod === "Cash" && (
                          <div className="flex justify-between text-emerald-600 text-base font-bold">
                              <span>Change</span>
                              <span>₱{change.toLocaleString()}</span>
                          </div>
                        )}

                        <div className="flex justify-between text-navyBlue font-extrabold text-lg pt-1 border-t border-dashed border-slate-300">
                            <span>Total Due</span>
                            <span>₱{totalAmount.toLocaleString()}</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-4 gap-2">
                        <button 
                            disabled={cart.length === 0}
                            onClick={clearCart}
                            className="col-span-1 flex items-center justify-center bg-softWhite border border-slate-200 text-rose-500 rounded-lg hover:bg-rose-50 hover:border-rose-200 transition-colors disabled:opacity-50"
                            title="Clear Cart"
                        >
                            <Trash2 size={18} />
                        </button>

                        <button 
                            disabled={cart.length === 0 || (paymentMethod === "Cash" && !isPaymentSufficient)}
                            onClick={() => handleCheckout()} 
                            className={`
                              col-span-3 bg-navyBlue text-softWhite py-2.5 rounded-lg font-bold text-sm hover:bg-darkGreen transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2
                              ${(cart.length === 0 || (paymentMethod === "Cash" && !isPaymentSufficient))
                                ? "bg-slate-300 text-slate-500 cursor-not-allowed shadow-none" 
                                : "bg-navyBlue text-softWhite hover:bg-darkGreen hover:shadow-md active:scale-[0.98]"}
                            `}
                        >
                            {paymentMethod === "Cash" && !isPaymentSufficient ? (
                              <span>Insufficient</span>
                            ) : (
                              <span>Pay</span>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
      </div>

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

      {/* Cart Modal (For Mobile) */}
      <div className="relative z-[9999]">
        <CartModal 
            isOpen={isCartOpen}
            onClose={() => setIsCartOpen(false)}
            cart={cart}
            onIncrease={(id) => updateQuantity(id, 1)}
            onDecrease={(id) => updateQuantity(id, -1)}
            onRemove={removeItem}
            totalAmount={totalAmount}
            onCheckout={handleCheckout} 
        />
      </div>
    </Layout>
  );
}