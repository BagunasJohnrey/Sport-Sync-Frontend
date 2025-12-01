import { useState } from 'react';
import { Bell, Save, AlertTriangle, Loader2, CheckCircle2 } from 'lucide-react';

const initialAlerts = [
    {
        id: 1,
        type: 'Low Stock Alert',
        threshold: 20,
        textColor: 'text-green-600',
        helperText: 'Triggers a cautionary alert.',
    },
    {
        id: 2,
        type: 'Critical Stock Alert',
        threshold: 10,
        textColor: 'text-orange-600',
        helperText: 'Triggers an urgent alert, requires immediate action.',
    },
    {
        id: 3,
        type: 'Out of Stock Alert',
        threshold: 0,
        textColor: 'text-red-600',
        helperText: 'Triggers when inventory reaches zero.',
    },
];

export default function Alerts() {
    const [alerts, setAlerts] = useState(initialAlerts);
    const [isSaving, setIsSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState(null);

    const handleThresholdChange = (id, value) => {
        const parsedValue = Math.max(0, parseInt(value, 10) || 0);
        
        setAlerts(prevAlerts => 
            prevAlerts.map(alert => 
                alert.id === id 
                    ? { ...alert, threshold: parsedValue } 
                    : alert
            )
        );
        setSaveMessage(null);
    };

    const handleSave = () => {
        setIsSaving(true);
        setSaveMessage(null);

        // Validation Logic
        if (alerts[0].threshold <= alerts[1].threshold) {
            setIsSaving(false);
            setSaveMessage({ 
                type: 'error', 
                text: 'Low Stock threshold must be higher than Critical Stock threshold.' 
            });
            return;
        }

        setTimeout(() => {
            console.log("Saving new configuration:", alerts);
            setIsSaving(false);
            setSaveMessage({ 
                type: 'success', 
                text: 'Configuration saved successfully!' 
            });

            setTimeout(() => setSaveMessage(null), 3000);
        }, 1500);
    };

    return (
        <div className="default-container">
                
                {/* Header */}
                <div className="flex items-center gap-2 mb-6">
                    <Bell className="w-5 h-5" />
                    <h2 className="title">Stock Alert Configuration</h2>
                </div>
                
                <div className="mb-6">
                    <h3 className="text-sm font-medium text-gray-900 mb-4">Set Threshold Levels</h3>

                    {/* Alert Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {alerts.map((alert) => (
                            <div key={alert.id} className="border border-gray-200 rounded-lg p-5 hover:shadow-sm transition-shadow bg-white">
                                <h4 className={`text-sm font-bold mb-3 uppercase tracking-wide ${alert.textColor}`}>
                                    {alert.type}
                                </h4>
                                
                                <div>
                                    <label htmlFor={`threshold-${alert.id}`} className="block text-xs font-semibold text-gray-500 mb-2">
                                        THRESHOLD QUANTITY
                                    </label>
                                    <input
                                        id={`threshold-${alert.id}`}
                                        type="number"
                                        min="0"
                                        value={alert.threshold}
                                        onChange={(e) => handleThresholdChange(alert.id, e.target.value)}
                                        className="w-full bg-slate-50 border border-gray-300 rounded-md px-3 py-2 text-lg font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-navyBlue focus:border-transparent transition-all"
                                        disabled={alert.id === 3} 
                                    />
                                </div>
                                
                                <p className="mt-3 text-xs text-gray-500 leading-relaxed">
                                    {alert.helperText}
                                    {alert.id === 3 && <span className="text-red-500 font-medium block mt-1">(Fixed at 0)</span>}
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
                                ? 'bg-gray-400 text-gray-100 cursor-not-allowed' 
                                : 'bg-navyBlue text-white hover:bg-green-800'
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
                        <div className={`
                            flex items-center justify-center gap-2 p-2 rounded-md text-sm font-medium animate-fade-in
                            ${saveMessage.type === 'success' 
                                ? 'bg-green-50 text-green-700' 
                                : 'bg-red-50 text-red-700'
                            }
                        `}>
                            {saveMessage.type === 'success' ? (
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