import { X, AlertTriangle } from "lucide-react";

export default function AlertModal({ lowStockItems = [], onClose }) {
  return (
    <div className="fixed inset-0 bg-charcoalBlack/40 flex items-center justify-center z-[999] p-4" onClick={onClose}>
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl overflow-hidden" onClick={(e) => e.stopPropagation()}>

        <div>Low Stock Alerts</div>

      </div>
    </div>
  );
}
