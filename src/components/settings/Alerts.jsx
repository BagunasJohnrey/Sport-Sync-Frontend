import { Bell } from 'lucide-react';

export default function Alerts() {
    const alerts = [
        {
            type: 'Low Stock Alert',
            threshold: 20,
            textColor: 'text-green-600'
        },
        {
            type: 'Critical Stock Alert',
            threshold: 10,
            textColor: 'text-orange-600'
        },
        {
            type: 'Out of Stock Alert',
            threshold: 0,
            textColor: 'text-red-600'
        }
    ];

    return (
        <div className="p-6 max-w-7xl bg-softWhite rounded-lg">
            <div className="flex items-center gap-2 mb-6">
                <Bell size={20} className="text-gray-900" />
                <h2 className="text-base font-normal text-gray-900">Stock Alert Configuration</h2>
            </div>

            <h3 className="text-sm font-semibold text-gray-900 mb-4">Stock Alert Thresholds & Colors</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {alerts.map((alert, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <h4 className={`font-semibold mb-3 ${alert.textColor}`}>{alert.type}</h4>
                        <div className="text-sm text-gray-900 mb-2">Threshold</div>
                        <div className="bg-gray-100 rounded px-4 py-2">
                            <span className="text-gray-900">{alert.threshold}</span>
                        </div>
                    </div>
                ))}
            </div>

            <button className="mt-6 flex items-center gap-2 px-4 py-2 bg-navyBlue text-gray-100 rounded-lg hover:bg-green-800 transition-colors">
                <Bell size={18} />
                View Alerts
            </button>
        </div>
    )
}