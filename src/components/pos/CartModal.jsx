import { useState, useEffect } from "react";
import { X, ShoppingCart, Trash2, Banknote, CreditCard, Smartphone, Calculator } from "lucide-react";
import CartItem from "./CartItem";

export default function CartModal({ 
  isOpen, 
  onClose, 
  cart, 
  onIncrease, 
  onDecrease, 
  onRemove, 
  totalAmount 
}) {
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [amountPaid, setAmountPaid] = useState("");
  const [change, setChange] = useState(0);

  // Reset local state when modal opens/closes or total changes
  useEffect(() => {
    if (isOpen) {
      setAmountPaid("");
      setChange(0);
    }
  }, [isOpen, totalAmount]);

  // Calculate change whenever amountPaid updates
  useEffect(() => {
    const paid = parseFloat(amountPaid) || 0;
    const due = parseFloat(totalAmount) || 0;
    setChange(Math.max(0, paid - due));
  }, [amountPaid, totalAmount]);

  if (!isOpen) return null;

  const paymentOptions = [
    { id: "Cash", icon: Banknote, label: "Cash" },
    { id: "Card", icon: CreditCard, label: "Card" },
    { id: "GCash", icon: Smartphone, label: "GCash" },
  ];

  // Quick set amount paid helper
  const handleQuickAmount = (amount) => {
    setAmountPaid(amount.toString());
  };

  const isPaymentSufficient = (parseFloat(amountPaid) || 0) >= totalAmount;

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-charcoalBlack/40 transition-opacity backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Modal Container */}
      <div 
        className="
          w-full h-[95vh] sm:h-[90vh] sm:max-h-[800px] sm:w-[480px] 
          bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl 
          flex flex-col animate-in slide-in-from-bottom-10 fade-in duration-200
        "
        onClick={(e) => e.stopPropagation()} 
      >
        
        {/* --- Header --- */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-white rounded-t-2xl shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-50 rounded-xl">
                <ShoppingCart className="text-darkGreen" size={22} />
            </div>
            <div>
                <h2 className="text-xl font-bold text-navyBlue">Current Order</h2>
                <p className="text-sm text-slate-500 font-medium">{cart.length} items</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* --- Body (Cart Items) --- */}
        <div className="flex-1 overflow-y-auto p-4 hide-scrollbar bg-white">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-4">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center">
                 <ShoppingCart size={40} className="opacity-20" />
              </div>
              <p className="text-base font-medium">Cart is empty</p>
              <button 
                onClick={onClose}
                className="text-sm text-navyBlue font-bold hover:underline"
              >
                Go back to products
              </button>
            </div>
          ) : (
            <div className="space-y-1">
                 <CartItem
                    cart={cart}
                    onIncrease={onIncrease}
                    onDecrease={onDecrease}
                    onRemove={onRemove}
                />
            </div>
          )}
        </div>

        {/* --- Footer (Payment & Totals) --- */}
        <div className="p-5 bg-slate-50 border-t border-slate-200 rounded-b-2xl shrink-0">
            
            {/* 1. Payment Method Selector */}
            <div className="mb-5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2.5 block">
                Payment Method
              </label>
              <div className="grid grid-cols-3 gap-3">
                {paymentOptions.map((option) => {
                  const Icon = option.icon;
                  const isSelected = paymentMethod === option.id;
                  
                  return (
                    <button
                      key={option.id}
                      onClick={() => setPaymentMethod(option.id)}
                      className={`
                        flex flex-col items-center justify-center py-3 rounded-xl border transition-all duration-200
                        ${isSelected 
                          ? "bg-navyBlue border-navyBlue text-white shadow-lg shadow-navyBlue/20 transform scale-[1.02]" 
                          : "bg-white border-slate-200 text-slate-600 hover:border-navyBlue/50 hover:bg-slate-50"}
                      `}
                    >
                      <Icon size={20} className="mb-1.5" />
                      <span className="text-xs font-bold">{option.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Change Calculator (Only for Cash) */}
            {paymentMethod === "Cash" && cart.length > 0 && (
              <div className="mb-5 p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
                <div className="flex justify-between items-center mb-3">
                  <label className="text-sm font-bold text-navyBlue flex items-center gap-2">
                    <Calculator size={16} />
                    Amount Received
                  </label>
                  {/* Quick Amounts */}
                  <div className="flex gap-2">
                    {[100, 500, 1000].map(amt => (
                      <button
                        key={amt}
                        onClick={() => handleQuickAmount(amt)}
                        className="text-[10px] font-bold px-2 py-1 bg-slate-100 text-slate-600 rounded hover:bg-slate-200 transition-colors"
                      >
                        {amt}
                      </button>
                    ))}
                    <button
                        onClick={() => handleQuickAmount(totalAmount)}
                        className="text-[10px] font-bold px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                      >
                        Exact
                      </button>
                  </div>
                </div>
                
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₱</span>
                  <input 
                    type="number" 
                    value={amountPaid}
                    onChange={(e) => setAmountPaid(e.target.value)}
                    placeholder="0.00"
                    className="w-full pl-8 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-navyBlue/20 focus:border-navyBlue font-mono text-lg font-bold text-slate-800"
                  />
                </div>
              </div>
            )}

            {/* 3. Totals Display */}
            <div className="space-y-3 mb-5 border-t border-slate-200 pt-4">
                <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-medium">Subtotal</span>
                    <span className="text-slate-800 font-bold">₱{totalAmount.toLocaleString()}</span>
                </div>
                
                {paymentMethod === "Cash" && (
                  <>
                    <div className="flex justify-between items-center">
                        <span className="text-slate-500 font-medium">Amount Paid</span>
                        <span className="text-slate-800 font-bold">
                          ₱{parseFloat(amountPaid || 0).toLocaleString()}
                        </span>
                    </div>
                    <div className="flex justify-between items-center text-lg">
                        <span className={`font-bold ${change > 0 ? "text-emerald-600" : "text-slate-400"}`}>Change</span>
                        <span className={`font-bold ${change > 0 ? "text-emerald-600" : "text-slate-400"}`}>
                          ₱{change.toLocaleString()}
                        </span>
                    </div>
                  </>
                )}

                <div className="flex justify-between items-center pt-2 border-t border-dashed border-slate-300">
                    <span className="text-navyBlue font-extrabold text-xl">Total Due</span>
                    <span className="text-navyBlue font-extrabold text-2xl">₱{totalAmount.toLocaleString()}</span>
                </div>
            </div>

            {/* 4. Action Buttons */}
            <div className="grid grid-cols-4 gap-3">
                <button 
                    disabled={cart.length === 0}
                    className="col-span-1 flex items-center justify-center bg-white border-2 border-slate-200 text-rose-500 rounded-xl hover:bg-rose-50 hover:border-rose-200 hover:text-rose-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Clear Cart"
                    onClick={() => {
                        if(window.confirm("Clear entire cart?")) {
                           cart.forEach(item => onRemove(item.id));
                        }
                    }}
                >
                    <Trash2 size={22} />
                </button>

                <button 
                    disabled={cart.length === 0 || (paymentMethod === "Cash" && !isPaymentSufficient)}
                    onClick={() => {
                      if (paymentMethod === "Cash" && !isPaymentSufficient) return;
                      // You can pass the change amount back to the parent here if needed
                      alert(`Processing ${paymentMethod} payment for ₱${totalAmount.toLocaleString()}\nChange: ₱${change.toLocaleString()}`);
                    }}
                    className={`
                      col-span-3 py-3.5 rounded-xl font-bold text-lg shadow-lg flex justify-center items-center gap-2 transition-all
                      ${(cart.length === 0 || (paymentMethod === "Cash" && !isPaymentSufficient))
                        ? "bg-slate-300 text-slate-500 cursor-not-allowed shadow-none" 
                        : "bg-navyBlue text-white hover:bg-emerald-600 hover:shadow-emerald-900/20 active:scale-[0.98]"}
                    `}
                >
                    {paymentMethod === "Cash" && !isPaymentSufficient ? (
                      <span>Insufficient Amount</span>
                    ) : (
                      <>
                        <span>Pay {paymentMethod}</span>
                        <span className="bg-white/20 px-2 py-0.5 rounded text-sm">
                          ₱{totalAmount.toLocaleString()}
                        </span>
                      </>
                    )}
                </button>
            </div>
        </div>

      </div>
    </div>
  );
}