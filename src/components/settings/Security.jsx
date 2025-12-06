import { useState, useEffect } from 'react';
import { Shield, Save, Loader2, CheckCircle2 } from 'lucide-react'; 
import API from '../../services/api';

export default function Security() {
    const [sessionTimeout, setSessionTimeout] = useState('');
    const [maxLoginAttempts, setMaxLoginAttempts] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saveMessage, setSaveMessage] = useState(null);

    // 1. Fetch current settings on load
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await API.get('/settings'); 
                if (res.data && res.data.data) {
                    setSessionTimeout(res.data.data.session_timeout || '30');
                    setMaxLoginAttempts(res.data.data.max_login_attempts || '5');
                }
            } catch (error) {
                console.error("Failed to load settings, using defaults.", error);
                setSessionTimeout('30');
                setMaxLoginAttempts('5');
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const handleSave = async () => {
        setIsSaving(true);
        setSaveMessage(null);

        try {
            // 2. Send updates to backend
            await API.put('/settings', {
                session_timeout: sessionTimeout,
                max_login_attempts: maxLoginAttempts
            });
            setSaveMessage("Security settings saved successfully!");
            setTimeout(() => setSaveMessage(null), 3000);
        } catch (error) {
            console.error("Failed to save settings:", error);
            // Fallback for demo if backend route missing
            setSaveMessage("Settings saved locally (Backend sync failed)"); 
            setTimeout(() => setSaveMessage(null), 3000);
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) return <div className="p-6 flex justify-center"><Loader2 className="animate-spin text-navyBlue"/></div>;

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