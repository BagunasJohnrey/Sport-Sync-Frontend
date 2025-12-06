import { useState, useEffect } from "react";
import { Bell, Save, AlertTriangle, Loader2, CheckCircle2 } from "lucide-react";
import API from "../../services/api";

export default function Alerts() {
  const [lowStock, setLowStock] = useState(0);
  const [criticalStock, setCriticalStock] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saveMessage, setSaveMessage] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await API.get("/settings");
        // Ensure values are numbers or fallback to 0
        setLowStock(parseInt(res.data.data.stock_threshold_low) || 0);
        setCriticalStock(parseInt(res.data.data.stock_threshold_critical) || 0);
      } catch (error) {
        console.error(error);
        // Fallback on error/initial load if not in DB
        setLowStock(10);
        setCriticalStock(3);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleThresholdChange = (id, value) => {
    const numericValue = parseInt(value);
    if (isNaN(numericValue) || numericValue < 0) return;

    if (id === 1) {
      setLowStock(numericValue);
    } else if (id === 2) {
      setCriticalStock(numericValue);
    }
  };

  const handleSave = async () => {
    if (parseInt(lowStock) <= parseInt(criticalStock)) {
      setSaveMessage({
        type: "error",
        text: "Low Stock threshold must be greater than Critical Stock threshold.",
      });
      return;
    }

    setIsSaving(true);
    setSaveMessage(null);

    try {
      await API.put("/settings", {
        stock_threshold_low: lowStock,
        stock_threshold_critical: criticalStock,
      });
      setSaveMessage({ type: "success", text: "Configuration saved!" });
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (error) {
      console.error("Save failed:", error);
      setSaveMessage({ type: "error", text: "Failed to save configuration." });
    } finally {
      setIsSaving(false);
    }
  };

  const alerts = [
    {
      id: 1,
      type: "Low Stock",
      threshold: lowStock,
      textColor: "text-yellow-600",
      helperText: 'When product quantity falls to this level, a "Low Stock" notification is triggered.',
      disabled: false,
    },
    {
      id: 2,
      type: "Critical Stock",
      threshold: criticalStock,
      textColor: "text-orange-600",
      helperText: 'When product quantity falls to this level, a "Critical Stock" notification is triggered.',
      disabled: false,
    },
    {
      id: 3,
      type: "Out of Stock",
      threshold: 0,
      textColor: "text-red-600",
      helperText: 'When product quantity reaches this level, an "Out of Stock" notification is triggered.',
      disabled: true,
    },
  ];

  if (loading)
    return (
      <div className="p-6 flex justify-center">
        <Loader2 className="animate-spin text-navyBlue" />
      </div>
    );

  return (
    <div className="default-container">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <Bell className="w-5 h-5" />
        <h2 className="title">Stock Alert Configuration</h2>
      </div>

      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-900 mb-4">
          Set Threshold Levels
        </h3>

        {/* Alert Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className="border border-gray-200 rounded-lg p-5 hover:shadow-sm transition-shadow bg-white"
            >
              <h4 className={`text-sm font-bold mb-3 uppercase tracking-wide ${alert.textColor}`}>
                {alert.type}
              </h4>
              <div>
                <label
                  htmlFor={`threshold-${alert.id}`}
                  className="block text-xs font-semibold text-gray-500 mb-2"
                >
                  THRESHOLD QUANTITY
                </label>
                <input
                  id={`threshold-${alert.id}`}
                  type="number"
                  min="0"
                  value={alert.threshold}
                  onChange={(e) =>
                    handleThresholdChange(alert.id, e.target.value)
                  }
                  className="w-full bg-slate-50 border border-gray-300 rounded-md px-3 py-2 text-lg font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-navyBlue focus:border-transparent transition-all"
                  disabled={alert.disabled}
                />
              </div>
              <p className="mt-3 text-xs text-gray-500 leading-relaxed">
                {alert.helperText}
                {alert.id === 3 && (
                  <span className="text-red-500 font-medium block mt-1">
                    (Fixed at 0)
                  </span>
                )}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Save Section */}
      <div className="mt-8 flex flex-col gap-3">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className={`
            w-full py-3 rounded-md flex items-center justify-center gap-2 font-medium transition-colors
            ${isSaving
              ? "bg-gray-400 text-gray-100 cursor-not-allowed"
              : "bg-navyBlue text-white hover:bg-green-800"
            }
          `}
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving Configuration...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save Configuration
            </>
          )}
        </button>

        {/* Status Message */}
        {saveMessage && (
          <div
            className={`
              flex items-center justify-center gap-2 p-2 rounded-md text-sm font-medium animate-fade-in
              ${saveMessage.type === "success"
                ? "bg-green-50 text-green-700"
                : "bg-red-50 text-red-700"
              }
            `}
          >
            {saveMessage.type === "success" ? (
              <CheckCircle2 className="w-4 h-4" />
            ) : (
              <AlertTriangle className="w-4 h-4" />
            )}
            {saveMessage.text}
          </div>
        )}
      </div>
    </div>
  );
}