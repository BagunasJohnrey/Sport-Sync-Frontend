import { useState } from 'react';
import { Shield, Save, Loader2, CheckCircle2 } from 'lucide-react'; 

export default function Security() {
    const [sessionTimeout, setSessionTimeout] = useState('30');
    const [maxLoginAttempts, setMaxLoginAttempts] = useState('3');
    
    const [isSaving, setIsSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState(null);

    const handleSave = () => {
        setIsSaving(true);
        setSaveMessage(null);

        setTimeout(() => {
            setIsSaving(false);
            setSaveMessage("Security settings saved successfully!");
            
            setTimeout(() => setSaveMessage(null), 3000);
        }, 1500);
    };

    return (
        <div className="default-container">
                    <div className="flex items-center gap-2 mb-6">
                        <Shield className="w-5 h-5" />
                        <h2 className="title">Security Settings</h2>
                    </div>

                    <div className="space-y-6">
                        {/* Session Timeout */}
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-900 mb-2">
                                    Session Timeout (minutes)
                                </label>
                                <input
                                    type="number"
                                    value={sessionTimeout}
                                    onChange={(e) => setSessionTimeout(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-900 mb-2">
                                    Max Login Attempts
                                </label>
                                <input
                                    type="number"
                                    value={maxLoginAttempts}
                                    onChange={(e) => setMaxLoginAttempts(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Save Button with Loading State */}
                    <div className="mt-6 flex flex-col gap-3">
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
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4" />
                                    Save Security Settings
                                </>
                            )}
                        </button>


                        {saveMessage && (
                            <div className="flex items-center justify-center gap-2 text-green-600 bg-green-50 p-2 rounded-md text-sm font-medium animate-fade-in">
                                <CheckCircle2 className="w-4 h-4" />
                                {saveMessage}
                            </div>
                        )}
                    </div>
        </div>
    );
}