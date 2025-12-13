import { useState, useEffect } from 'react';
import { Shield, Save, Loader2, CheckCircle2, AlertCircle } from 'lucide-react'; 
import API from '../../services/api';

export default function Security() {
    // Repurposed state variable: previously sessionTimeout
    const [lockoutDuration, setLockoutDuration] = useState('');
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
                    // Map 'session_timeout' from DB to lockoutDuration state
                    setLockoutDuration(res.data.data.session_timeout || '15');
                    setMaxLoginAttempts(res.data.data.max_login_attempts || '5');
                }
            } catch (error) {
                console.error("Failed to load settings, using defaults.", error);
                setLockoutDuration('15');
                setMaxLoginAttempts('5');
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const handleSave = async () => {
        // Validation
        if (parseInt(lockoutDuration) < 5) {
            setSaveMessage({ type: 'error', text: "Lockout duration must be at least 5 minutes." });
            return;
        }
        if (parseInt(maxLoginAttempts) < 3) {
            setSaveMessage({ type: 'error', text: "Max login attempts must be at least 3." });
            return;
        }

        setIsSaving(true);
        setSaveMessage(null);

        try {
            // 2. Send updates to backend
            // Map lockoutDuration state back to 'session_timeout' key for DB compatibility
            await API.put('/settings', {
                session_timeout: lockoutDuration,
                max_login_attempts: maxLoginAttempts
            });
            setSaveMessage({ type: 'success', text: "Security settings saved successfully!" });
            setTimeout(() => setSaveMessage(null), 3000);
        } catch (error) {
            console.error("Failed to save settings:", error);
            setSaveMessage({ type: 'error', text: "Failed to save settings. Please try again." }); 
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Repurposed Field */}
                    <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                            Account Lockout Duration (minutes)
                        </label>
                        <input
                            type="number"
                            min="5"
                            value={lockoutDuration}
                            onChange={(e) => setLockoutDuration(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Time an account remains locked after exceeding max attempts.
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                            Max Login Attempts
                        </label>
                        <input
                            type="number"
                            min="3"
                            value={maxLoginAttempts}
                            onChange={(e) => setMaxLoginAttempts(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <p className="text-xs text-gray-500 mt-1">Account locks automatically after consecutive failures.</p>
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
                    <div className={`flex items-center justify-center gap-2 p-2 rounded-md text-sm font-medium animate-fade-in ${
                        saveMessage.type === 'success' ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'
                    }`}>
                        {saveMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                        {saveMessage.text}
                    </div>
                )}
            </div>
        </div>
    );
}