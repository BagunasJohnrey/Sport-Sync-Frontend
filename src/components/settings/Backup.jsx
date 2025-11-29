import { Database, Download } from "lucide-react";

export default function Backup() {
    return (
        <div className="default-container">

            {/* Header */}
            <div className="flex items-start gap-3 mb-8">
                <Database 
                    className="w-5 h-5 mt-0.5 text-gray-700"
                    strokeWidth={2}
                />
                <h2 className="title">Data Backup & Import</h2>
            </div>

            {/* Export Section */}
            <div>
                <h3 className="font-semibold mb-2">Export Data</h3>
                <p className="text-sm text-gray-900 mb-4">
                    Download a complete backup of your system data including products, transactions, and user data.
                </p>

                <button className="w-full border bg-navyBlue text-gray-100 rounded-xl py-3 px-4 flex items-center justify-center gap-2 hover:bg-green-800 transition-colors">
                    <Download 
                        className="w-4 h-4"
                        strokeWidth={2}
                    />
                    <span className="text-sm font-medium">Export System Data</span>
                </button>
            </div>

        </div>
    );
}
