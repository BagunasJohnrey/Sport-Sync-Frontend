import ExportButton from "../../components/ExportButton";
import { mockReports } from "../../mockData";
import { Clock, Calendar, ChartLine, TrendingUp, BarChart } from "lucide-react";

export default function AutomatedReports() {
  return (
    <div className="flex flex-col space-y-5">

      {/* Automatic Report Schedule */}
      <div className="default-container">
        <div className="flex items-center gap-2">
          <Clock size={20} className="text-gray-800" />
          <h3 className="text-gray-800">Automatic Report Schedule</h3>
        </div>

        <div className="flex justify-between gap-6 mt-4">
          <div className="default-container p-3 w-full flex items-center gap-3">
            <div>
              <Calendar size={25} className="text-deepBlue" />
            </div>
            <div>
              <p className="text-sm">
                <span className="font-semibold text-base">Daily Reports </span>
                <br />
                <span className="text-gray-800">Generated at 23:59</span>
              </p>
            </div>
          </div>

          <div className="default-container p-3 w-full flex items-center gap-3">
            <div>
              <ChartLine size={25} className="text-darkGreen" />
            </div>
            <div>
              <p className="text-sm">
                <span className="font-semibold text-base">Weekly Reports </span>
                <br />
                <span className="text-gray-800">Every Sunday at 23:59</span>
              </p>
            </div>
          </div>

          <div className="default-container p-3 w-full flex items-center gap-3">
            <div>
              <TrendingUp size={25} className="text-crimsonRed" />
            </div>
            <div>
              <p className="text-sm">
                <span className="font-semibold text-base">Monthly Reports </span>
                <br />
                <span className="text-gray-800">Last day of month at 23:59</span>
              </p>
            </div>
          </div>
        </div>
      </div>

        <div className="flex justify-end">
                  {/* insert calendar */}
        </div>

      {/* List of Auto-Generated Reports */}
      <div className="default-container">
        <h3 className="text-gray-800">Auto-Generated Reports</h3>

        <div className="mt-4 space-y-3">
          {mockReports.map((report, index) => (
            <div
              key={index}
              className="flex justify-between items-center p-3 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition cursor-pointer"
            >
              {/* Report Item */}
              <div className="flex items-center gap-5">
                <div>
                  <BarChart size={20} className="text-navyBlue" />
                </div>

                <div>
                  <p className="font-semibold text-sm text-charcoalBlack">
                    {report.type}
                  </p>
                  <p className="text-sm text-gray-600">
                    {report.date || report.weekRange || report.month}
                  </p>
                </div>
              </div>

              <div>
                <ExportButton />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}