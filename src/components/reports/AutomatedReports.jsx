import { useState, useEffect } from "react";
import ExportButton from "../../components/ExportButton";
import CalendarFilter from "../../components/CalendarFilter";
import API from "../../services/api";
import {
  Clock,
  Calendar,
  ChartLine,
  TrendingUp,
  FileText,
  Download,
  Loader2,
} from "lucide-react";
import {
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  format,
} from "date-fns";

const columns = [
  { header: "Report Type", accessor: "report_type" },
  {
    header: "Period Start",
    accessor: "period_start",
    render: (row) => new Date(row.period_start).toLocaleDateString(),
  },
  {
    header: "Period End",
    accessor: "period_end",
    render: (row) => new Date(row.period_end).toLocaleDateString(),
  },
  {
    header: "Created Date",
    accessor: "created_at",
    render: (row) => new Date(row.created_at).toLocaleDateString(),
  },
];

export default function AutomatedReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  // Initial date range (Today)
  const [dateRange, setDateRange] = useState({
    start: format(new Date(), "yyyy-MM-dd"),
    end: format(new Date(), "yyyy-MM-dd"),
  });

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const response = await API.get("/reports/history", {
        params: {
          start_date: dateRange.start,
          end_date: dateRange.end,
        },
      });
      setReports(response.data.data || []);
    } catch (error) {
      console.error("Failed to load report history", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [dateRange]);

  const handleDateFilterChange = (filterType, date) => {
    let start = date,
      end = date;

    switch (filterType) {
      case "Weekly":
        start = startOfWeek(date, { weekStartsOn: 1 });
        end = endOfWeek(date, { weekStartsOn: 1 });
        break;
      case "Monthly":
        start = startOfMonth(date);
        end = endOfMonth(date);
        break;
      case "Yearly":
        start = startOfYear(date);
        end = endOfYear(date);
        break;
      case "Daily":
      default:
        start = date;
        end = date;
        break;
    }

    setDateRange({
      start: format(start, "yyyy-MM-dd"),
      end: format(end, "yyyy-MM-dd"),
    });
  };

  const handleDownload = async (reportId, type) => {
    try {
      const response = await API.get(`/reports/download`, {
        params: { id: reportId, format: "pdf" },
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${type}_Report.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Download failed", error);
    }
  };

  // --- CLEAN EXPORT DATA ---
  // Format dates for export so they don't show as ISO strings
  const exportData = reports.map((report) => ({
    report_type: report.report_type,
    period_start: new Date(report.period_start).toLocaleDateString(),
    period_end: new Date(report.period_end).toLocaleDateString(),
    created_at: new Date(report.created_at).toLocaleDateString(),
  }));

  return (
    <div className="flex flex-col space-y-5">
      {/* Schedule Header */}
      <div className="default-container">
        <div className="flex items-center gap-2">
          <Clock size={20} className="text-gray-800" />
          <h3 className="text-gray-800">Automatic Report Schedule</h3>
        </div>

        <div className="flex flex-col md:flex-row justify-between gap-4 md:gap-6 mt-4">
          <div className="default-container p-3 w-full flex items-center gap-3">
            <div>
              <Calendar size={25} className="text-deepBlue" />
            </div>
            <div>
              <p className="text-sm">
                <span className="font-semibold text-base">Daily Reports</span>
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
                <span className="font-semibold text-base">Weekly Reports</span>
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
                <span className="font-semibold text-base">Monthly Reports</span>
                <br />
                <span className="text-gray-800">
                  Last day of month at 23:59
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between gap-3">
        <ExportButton
          data={exportData}
          columns={columns}
          fileName={`Report_History_${dateRange.start}_${dateRange.end}`}
          title="Report History Log"
        />
        <CalendarFilter onChange={handleDateFilterChange} />
      </div>

      {/* List of Reports */}
      <div className="default-container">
        <h3 className="title mb-4">Report History</h3>

        {loading ? (
          <div className="flex justify-center p-8">
            <Loader2 className="animate-spin text-navyBlue" />
          </div>
        ) : reports.length === 0 ? (
          <p className="text-slate-500 text-sm">
            No automated reports found for the selected period.
          </p>
        ) : (
          <div className="space-y-3">
            {reports.map((report) => (
              <div
                key={report.report_id}
                className="flex justify-between items-center p-4 bg-white border border-gray-200 rounded-xl shadow-sm hover:border-navyBlue/30 transition"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-blue-50 text-navyBlue rounded-lg">
                    <FileText size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-charcoalBlack">
                      {report.report_type} Report
                    </p>
                    <p className="text-xs text-gray-500">
                      Period:{" "}
                      {new Date(report.period_start).toLocaleDateString()} -{" "}
                      {new Date(report.period_end).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() =>
                    handleDownload(report.report_id, report.report_type)
                  }
                  className="flex items-center gap-2 text-sm text-navyBlue hover:text-darkGreen font-medium px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <Download size={16} /> Download
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
