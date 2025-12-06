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
  totalAmount,
  onCheckout 
}) {
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [amountPaid, setAmountPaid] = useState("");
  const [change, setChange] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setAmountPaid("");
      setChange(0);
    }
  }, [isOpen, totalAmount]);

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

  const handleQuickAmount = (amount) => {
    setAmountPaid(amount.toString());
  };

  const isPaymentSufficient = (parseFloat(amountPaid) || 0) >= totalAmount;

  const handlePaymentSubmit = () => {
      if (paymentMethod === "Cash" && !isPaymentSufficient) return;
      
      if (onCheckout) {
          onCheckout({
              method: paymentMethod,
              paid: paymentMethod === "Cash" ? parseFloat(amountPaid) : totalAmount,
              change: change
          });
      }
  };

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-charcoalBlack/40 transition-opacity"
      onClick={onClose}
    >
      {/* Modal Container */}
      <div 
        className="
          w-full h-[90vh] sm:h-[85vh] sm:max-h-[700px] sm:w-[400px] 
          bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl 
          flex flex-col animate-in slide-in-from-bottom-10 fade-in duration-200
        "
        onClick={(e) => e.stopPropagation()} 
      >
        
        {/* --- Header (Compact) --- */}
        <div className="flex items-center justify-between p-3 border-b border-slate-100 bg-white rounded-t-2xl shrink-0">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-emerald-50 rounded-lg">
                <ShoppingCart className="text-darkGreen" size={18} />
            </div>
            <div>
                <h2 className="text-base font-bold text-navyBlue">Current Order</h2>
                <p className="text-[10px] text-slate-500 font-medium">{cart.length} items</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* --- Body (Scrollable) --- */}
        <div className="flex-1 min-h-0 overflow-y-auto p-3 space-y-1 hide-scrollbar bg-white">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-2">
              <div className="w-14 h-14 bg-slate-50 rounded-full flex items-center justify-center">
                 <ShoppingCart size={28} className="opacity-20" />
              </div>
              <p className="text-xs font-medium">Cart is empty</p>
              <button 
                onClick={onClose}
                className="text-[10px] text-navyBlue font-bold hover:underline"
              >
                Go back to products
              </button>
            </div>
          ) : (
            <CartItem
              cart={cart}
              onIncrease={onIncrease}
              onDecrease={onDecrease}
              onRemove={onRemove}
            />
          )}
        </div>

        {/* --- Footer (Compact) --- */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 rounded-b-2xl shrink-0">
            
            {/* Payment Method */}
            <div className="mb-2">
              <div className="grid grid-cols-3 gap-2">
                {paymentOptions.map((option) => {
                  const Icon = option.icon;
                  const isSelected = paymentMethod === option.id;
                  
                  return (
                    <button
                      key={option.id}
                      onClick={() => setPaymentMethod(option.id)}
                      className={`
                        flex flex-col items-center justify-center py-1.5 rounded-lg border transition-all duration-200
                        ${isSelected 
                          ? "bg-navyBlue border-navyBlue text-white shadow-sm ring-1 ring-navyBlue" 
                          : "bg-white border-slate-200 text-slate-600 hover:border-navyBlue/50 hover:bg-slate-50"}
                      `}
                    >
                      <Icon size={16} className="mb-1" />
                      <span className="text-[9px] font-bold">{option.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Change Calculator */}
            {paymentMethod === "Cash" && cart.length > 0 && (
              <div className="mb-2 p-2.5 bg-white rounded-lg border border-slate-200 shadow-sm">
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-bold text-navyBlue flex items-center gap-1">
                    <Calculator size={12} />
                    Amount Receive
                  </label>
                  <div className="flex gap-1">
                    {[100, 500, 1000].map(amt => (
                      <button
                        key={amt}
                        onClick={() => handleQuickAmount(amt)}
                        className="text-xs font-bold px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded hover:bg-slate-200 transition-colors"
                      >
                        {amt}
                      </button>
                    ))}
                    <button
                        onClick={() => handleQuickAmount(totalAmount)}
                        className="text-xs font-bold px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                      >
                        Exact
                      </button>
                  </div>
                </div>
                
                <div className="relative">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">₱</span>
                  <input 
                    type="number" 
                    value={amountPaid}
                    onChange={(e) => setAmountPaid(e.target.value)}
                    placeholder="0.00"
                    className="w-full pl-6 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-navyBlue text-sm font-bold text-slate-800"
                  />
                </div>
              </div>
            )}

            {/* Totals */}
            <div className="space-y-0.5 mb-2 pt-1 border-t border-slate-200">
                <div className="flex justify-between text-slate-600 text-xs">
                    <span>Subtotal</span>
                    <span className="font-semibold">₱{totalAmount.toLocaleString()}</span>
                </div>
                
                {paymentMethod === "Cash" && (
                  <div className="flex justify-between text-emerald-600 text-sm font-bold">
                      <span>Change</span>
                      <span>₱{change.toLocaleString()}</span>
                  </div>
                )}

                <div className="flex justify-between text-navyBlue font-extrabold text-base pt-1 border-t border-dashed border-slate-300">
                    <span>Total</span>
                    <span>₱{totalAmount.toLocaleString()}</span>
                </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-4 gap-2">
                <button 
                    disabled={cart.length === 0}
                    className="col-span-1 flex items-center justify-center bg-white border border-slate-200 text-rose-500 rounded-lg hover:bg-rose-50 hover:border-rose-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Clear Cart"
                    onClick={() => {
                        if(window.confirm("Clear entire cart?")) {
                           cart.forEach(item => onRemove(item.id));
                        }
                    }}
                >
                    <Trash2 size={18} />
                </button>

                <button 
                    disabled={cart.length === 0 || (paymentMethod === "Cash" && !isPaymentSufficient)}
                    onClick={handlePaymentSubmit}
                    className={`
                      col-span-3 py-2.5 rounded-lg font-bold text-sm shadow-sm flex justify-center items-center gap-2 transition-all
                      ${(cart.length === 0 || (paymentMethod === "Cash" && !isPaymentSufficient))
                        ? "bg-slate-300 text-slate-500 cursor-not-allowed shadow-none" 
                        : "bg-navyBlue text-white hover:bg-emerald-600 hover:shadow-md active:scale-[0.98]"}
                    `}
                >
                    {paymentMethod === "Cash" && !isPaymentSufficient ? (
                      <span>Insufficient</span>
                    ) : (
                      <>
                        <span>Pay</span>
                      </>
                    )}
                </button>
            </div>
        </div>

      </div>
    </div>
  );
}