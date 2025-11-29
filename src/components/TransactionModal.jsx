import { X, Receipt, Calendar, User, Package, CreditCard } from "lucide-react";
import { products, users } from "../mockData";
import { useEffect } from "react";

export default function TransactionModal({ open, onClose, data }) {
  if (!open || !data) return null;

  const cashier = users.find((u) => u.id === data.user_id);

  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };

    if (open) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [open, onClose]);

  const formatCurrency = (amount) => `₱${amount?.toLocaleString()}`;

  const getPaymentMethodInfo = (method) => {
  return method || "N/A"; // fallback if undefined or null
};

  const paymentInfo = getPaymentMethodInfo(data.payment_method);

  return (
    <div
      className="fixed inset-0 bg-charcoalBlack/40 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-softWhite rounded-2xl shadow-2xl w-full max-w-md animate-scaleIn relative flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-navyBlue rounded-t-2xl p-6 text-softWhite shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Receipt className="w-6 h-6" />
              <h2 className="text-xl font-bold">Transaction Details</h2>
            </div>
            <button
              className="text-white/80 hover:text-white transition-colors duration-200 p-1 hover:bg-white/20 rounded-lg"
              onClick={onClose}
            >
              <X size={20} />
            </button>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-blue-100 text-sm">Transaction ID</span>
            <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-mono font-semibold">
              #{data.id}
            </span>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1 hide-scrollbar">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2 text-gray-600">
              <Calendar className="w-4 h-4" />
              <span className="text-sm font-medium">Date & Time</span>
            </div>
            <div className="text-sm text-gray-900 font-semibold">
              {new Date(data.date).toLocaleString()}
            </div>

            <div className="flex items-center space-x-2 text-gray-600">
              <User className="w-4 h-4" />
              <span className="text-sm font-medium">Cashier</span>
            </div>
            <div className="text-sm text-gray-900 font-semibold">
              {cashier?.full_name}
            </div>
          </div>

          {/* Product Details */}
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <div className="flex items-center space-x-2 mb-3">
              <Package className="w-4 h-4 text-blue-600" />
              <h3 className="font-semibold text-gray-900">Item Details</h3>
            </div>

            <div className="space-y-2 text-sm">
              {data.items.map((item, idx) => {
                const product = products.find((p) => p.id === item.product_id);
                return (
                  <div key={idx} className="bg-white p-3 border border-gray-300 rounded-lg">
              <div className="flex justify-between items-start">
                {/* Left Side */}
                <div className="flex-1">
                  <div className="font-semibold text-gray-900 mb-1">
                    {product?.product_name}
                  </div>
                  <div className="text-gray-600 text-sm">
                    {data.quantity} × {formatCurrency(product?.selling_price)}
                  </div>
                </div>
                
                {/* Right Side */}
                <div className="font-semibold text-gray-900 text-right">
                  {formatCurrency(data.total_amount)}
                </div>
              </div>
            </div>
                );
              })}
              
            
            </div>
          </div>

          {/* Payment Details */}
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <div className="flex items-center space-x-2 mb-3">
              <CreditCard className="w-4 h-4 text-darkGreen" />
              <h3 className="font-semibold text-gray-900">Payment Details</h3>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Payment Method</span>
                <span className="font-semibold capitalize">
  {getPaymentMethodInfo(data.payment_method)}
</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Amount Paid</span>
                <span className="font-semibold">
                  {formatCurrency(data.amount_paid)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Change Due</span>
                <span className="font-semibold text-green-600">
                  {formatCurrency(data.change_due)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
