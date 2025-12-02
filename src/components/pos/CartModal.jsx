import { X, ShoppingCart, Trash2, Banknote, CreditCard, Smartphone } from "lucide-react";
import CartItem from "./CartItem";

export default function CartModal({ 
  isOpen, 
  onClose, 
  cart, 
  onIncrease, 
  onDecrease, 
  onRemove, 
  totalAmount,
  paymentMethod,    
  setPaymentMethod,   
  onCheckout         
}) {

  if (!isOpen) return null;

  // IDs matched to Backend Validation (Cash, Card, Mobile)
  const paymentOptions = [
    { id: "Cash", icon: Banknote, label: "Cash" },
    { id: "Card", icon: CreditCard, label: "Card" },
    { id: "Mobile", icon: Smartphone, label: "GCash" }, 
  ];

  return (
    <div 
      className="fixed inset-0 z-100 flex items-end sm:items-center justify-center bg-charcoalBlack/40 transition-opacity"
      onClick={onClose}
    >
      {/* Modal Container */}
      <div 
        className="
          w-full h-[90vh] sm:h-[85vh] sm:max-h-[750px] sm:w-[450px] 
          bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl 
          flex flex-col animate-in slide-in-from-bottom-10 fade-in duration-200
        "
        onClick={(e) => e.stopPropagation()} 
      >
        
        {/* --- Header --- */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-white rounded-t-2xl">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-50 rounded-lg">
                <ShoppingCart className="text-darkGreen" size={20} />
            </div>
            <div>
                <h2 className="text-xl font-bold text-navyBlue">Current Order</h2>
                <p className="text-xs text-slate-500">{cart.length} items</p>
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
            <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-3">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center">
                 <ShoppingCart size={32} className="opacity-20" />
              </div>
              <p className="text-sm font-medium">Cart is empty</p>
              <button 
                onClick={onClose}
                className="text-sm text-navyBlue font-semibold hover:underline"
              >
                Go back to products
              </button>
            </div>
          ) : (
            <div className="space-y-4">
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
        <div className="p-5 bg-slate-50 border-t border-slate-200 rounded-b-2xl">
            
            {/* 1. Payment Method Selector */}
            <div className="mb-6">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2 block">
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
                          ? "bg-navyBlue border-navyBlue text-white shadow-md ring-2 ring-navyBlue/20" 
                          : "bg-white border-slate-200 text-slate-600 hover:border-navyBlue hover:text-navyBlue"}
                      `}
                    >
                      <Icon size={20} className="mb-1" />
                      <span className="text-xs font-semibold">{option.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Totals */}
            <div className="space-y-2 mb-4 border-t border-slate-200 pt-4">
                <div className="flex justify-between text-navyBlue font-bold text-xl">
                    <span>Total</span>
                    <span>₱{totalAmount.toLocaleString()}</span>
                </div>
            </div>

            {/* 3. Action Buttons */}
            <div className="grid grid-cols-4 gap-3">
                {/* Clear Button */}
                <button 
                    disabled={cart.length === 0}
                    className="col-span-1 flex items-center justify-center bg-white border border-slate-200 text-rose-500 rounded-xl hover:bg-rose-50 hover:border-rose-200 transition-colors disabled:opacity-50"
                    title="Clear Cart"
                    onClick={() => {
                        if(window.confirm("Clear entire cart?")) {
                           cart.forEach(item => onRemove(item.id));
                        }
                    }}
                >
                    <Trash2 size={20} />
                </button>

                {/* Checkout Button */}
                <button 
                    disabled={cart.length === 0}
                    onClick={() => {
                        onCheckout();
                        onClose(); 
                    }}
                    className="col-span-3 bg-navyBlue text-white py-3.5 rounded-xl font-bold text-lg hover:bg-darkGreen transition-colors shadow-lg shadow-indigo-900/10 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                >
                    <span>Pay with {paymentMethod === 'Mobile' ? 'GCash' : paymentMethod}</span>
                </button>
            </div>
        </div>

      </div>
    </div>
  );
}