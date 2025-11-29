export default function Backup() {
    return (
        <div className="p-6 w-full max-w-8xl mx-auto bg-softWhite rounded-lg">
            <div className="border border-gray-100 rounded-xl p-8 bg-white">
                <div className="flex items-start gap-3 mb-8">
                    <svg className="w-5 h-5 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                    </svg>
                    <h2 className="text-lg font-semibold">Data Backup & Import</h2>
                </div>

                <div>
                    <h3 className="font-semibold mb-2">Export Data</h3>
                    <p className="text-sm text-gray-900 mb-4">
                        Download a complete backup of your system data including products, transactions, and user data.
                    </p>
                    
                    <button className="w-full border bg-navyBlue text-gray-100 rounded-xl py-3 px-4 flex items-center justify-center gap-2 hover:bg-green-900 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        <span className="text-sm font-medium">Export System Data</span>
                    </button>
                </div>
            </div>
        </div>
    )
}