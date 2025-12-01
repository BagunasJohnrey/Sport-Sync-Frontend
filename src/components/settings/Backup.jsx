import { useState } from 'react';
import { Database, Download, Loader2, CheckCircle2 } from "lucide-react";

export default function Backup() {
    const [isExporting, setIsExporting] = useState(false);
    const [statusMessage, setStatusMessage] = useState(null);

    const handleExport = () => {
        setIsExporting(true);
        setStatusMessage(null);

        setTimeout(() => {
            console.log("Exporting system data...");
            setIsExporting(false);
            setStatusMessage("System data exported successfully!");


            setTimeout(() => setStatusMessage(null), 3000);
        }, 2000);
    };

    return (
        <div className="default-container">
   
                {/* Header */}
                <div className="flex items-center gap-2 mb-6">
                    <Database className="w-5 h-5" strokeWidth={2} />
                    <h2 className="title">Data Backup & Import</h2>
                </div>

                {/* Export Section */}
                <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-sm transition-shadow">
                    <h3 className="font-bold text-gray-900 mb-2">Export Data</h3>
                    <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                        Download a complete backup of your system data including products, transactions, and user data. 
                        This file can be used to restore your system if needed.
                    </p>

                    <div className="flex flex-col gap-3">
                        <button 
                            onClick={handleExport}
                            disabled={isExporting}
                            className={`
                                w-full py-3 rounded-md flex items-center justify-center gap-2 font-medium transition-colors
                                ${isExporting 
                                    ? 'bg-gray-400 text-gray-100 cursor-not-allowed' 
                                    : 'bg-navyBlue text-white hover:bg-green-800'
                                }
                            `}
                        >
                            {isExporting ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Preparing Export...
                                </>
                            ) : (
                                <>
                                    <Download className="w-4 h-4" strokeWidth={2} />
                                    Export System Data
                                </>
                            )}
                        </button>

                        {/* Success Message */}
                        {statusMessage && (
                            <div className="flex items-center justify-center gap-2 text-green-600 bg-green-50 p-2 rounded-md text-sm font-medium animate-fade-in">
                                <CheckCircle2 className="w-4 h-4" />
                                {statusMessage}
                            </div>
                        )}
                    </div>
                </div>

        </div>
    );
}