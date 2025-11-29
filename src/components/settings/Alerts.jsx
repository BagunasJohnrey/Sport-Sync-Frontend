import { Bell, Save, AlertTriangle } from 'lucide-react';
import { useState } from 'react';

// Define the initial configuration outside the component for clarity
const initialAlerts = [
    {
        id: 1, // Added ID for mapping/state management
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

    /**
     * Handles changes to an individual alert's threshold input field.
     * Ensures input is a non-negative integer.
     */
    const handleThresholdChange = (id, value) => {
        const parsedValue = Math.max(0, parseInt(value, 10) || 0);
        
        setAlerts(prevAlerts => 
            prevAlerts.map(alert => 
                alert.id === id 
                    ? { ...alert, threshold: parsedValue } 
                    : alert
            )
        );
        setSaveMessage(null); // Clear previous messages on edit
    };

    /**
     * Simulates saving the configuration to the backend.
     */
    const handleSave = () => {
        setIsSaving(true);
        setSaveMessage(null);

        // --- Validation Logic ---
        // Ensure thresholds are hierarchical (Low > Critical > Out of Stock)
        if (alerts[0].threshold <= alerts[1].threshold) {
            setIsSaving(false);
            setSaveMessage({ type: 'error', text: 'Low Stock threshold must be higher than Critical Stock threshold.' });
            return;
        }

        // Simulate API call delay
        setTimeout(() => {
            console.log("Saving new configuration:", alerts);
            setIsSaving(false);
            setSaveMessage({ type: 'success', text: 'Configuration saved successfully!' });
        }, 1500);
    };

    return (
        <div className="default-container">
            
            {/* Header */}
            <div className="flex items-center gap-3 pb-4">
                <Bell size={24} className="text-gray-600" />
                <h2 className="title">Stock Alert Configuration</h2>
            </div>
            
            <h3 className="text-lg font-semibold text-gray-700 mb-6">Set Threshold Levels</h3>

            {/* Alert Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {alerts.map((alert) => (
                    <div key={alert.id} className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow">
                        <h4 className={`text-base font-bold mb-3 ${alert.textColor}`}>{alert.type}</h4>
                        
                        {/* Input Field */}
                        <label htmlFor={`threshold-${alert.id}`} className="block text-sm font-medium text-gray-700 mb-2">
                            Threshold Quantity
                        </label>
                        <input
                            id={`threshold-${alert.id}`}
                            type="number"
                            min="0"
                            value={alert.threshold}
                            onChange={(e) => handleThresholdChange(alert.id, e.target.value)}
                            className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2.5 text-lg font-semibold text-gray-900 focus:ring-navyBlue focus:border-navyBlue transition-colors"
                            disabled={alert.id === 3} 
                        />
                        
                        {/* Helper Text */}
                        <p className="mt-3 text-xs text-gray-500">
                            {alert.helperText}
                            {alert.id === 3 && <span className="text-red-500 font-medium"> (Fixed at 0)</span>}
                        </p>
                    </div>
                ))}
            </div>
            
            {/* Action Buttons & Status */}
            <div className="pt-6 flex flex-col  gap-3 items-center justify-between">
                
                {/* Save Button */}
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className={`
                        flex items-center w-full justify-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-colors
                        ${isSaving
                            ? 'bg-gray-400 text-gray-100 cursor-not-allowed'
                            : 'bg-navyBlue text-white hover:bg-green-800 active:scale-95'
                        }
                    `}
                >
                    <Save size={18} />
                    {isSaving ? 'Saving...' : 'Save Configuration'}
                </button>

                {/* Status Message */}
                {saveMessage && (
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium 
                        ${saveMessage.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
                    >
                        <AlertTriangle size={16} />
                        {saveMessage.text}
                    </div>
                )}
            </div>
            
        </div>
    );
}