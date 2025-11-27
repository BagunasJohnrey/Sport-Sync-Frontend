import { useEffect } from "react";
import { CheckCircle, XCircle, AlertTriangle, Info } from "lucide-react";

export default function Toast({ message, type = "info", duration = 2000, onClose }) {
  // Auto close
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose && onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  // Icon and color configuration
  const toastConfig = {
    success: {
      icon: CheckCircle,
      iconColor: "text-green-500",
      bgColor: "bg-white",
      borderColor: "border-gray-200"
    },
    error: {
      icon: XCircle,
      iconColor: "text-red-500",
      bgColor: "bg-white",
      borderColor: "border-gray-200"
    },
    warning: {
      icon: AlertTriangle,
      iconColor: "text-yellow-500",
      bgColor: "bg-white",
      borderColor: "border-gray-200"
    },
    info: {
      icon: Info,
      iconColor: "text-blue-500",
      bgColor: "bg-white",
      borderColor: "border-gray-200"
    }
  };

  const config = toastConfig[type];
  const IconComponent = config.icon;

  return (
    <div
      className={`fixed bottom-5 right-5 min-w-[200px] max-w-sm px-4 py-3 rounded-lg text-gray-800 shadow-lg border ${config.borderColor} ${config.bgColor} animate-slide-in backdrop-blur-sm bg-softWhite`}
    >
      <div className="flex items-center gap-3">
        <IconComponent className={`w-5 h-5 shrink-0 ${config.iconColor}`} />
        <span className="text-sm font-medium flex-1">{message}</span>
      </div>
    </div>
  );
}