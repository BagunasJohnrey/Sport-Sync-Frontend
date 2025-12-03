import { useState, useEffect } from "react";
import { FileText, Loader2, User, Calendar } from "lucide-react";
import API from "../../services/api";
import Table from "../../components/Table";

export default function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await API.get('/audit-logs');
        setLogs(response.data.data || []);
      } catch (error) {
        console.error("Failed to fetch audit logs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  // Define Table Columns
  const columns = [
    { 
      header: "User", 
      accessor: "user_name",
      render: (row) => (
        <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-navyBlue border border-slate-200">
                {row.user_name ? row.user_name.charAt(0).toUpperCase() : '?'}
            </div>
            <span className="text-sm font-medium text-slate-700">{row.user_name || "Unknown"}</span>
        </div>
      )
    },
    { 
      header: "Action", 
      accessor: "action",
      render: (row) => (
          <span className="px-2 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wide border border-blue-100">
              {row.action}
          </span>
      )
    },
    { 
      header: "Target", 
      accessor: "table_name",
      render: (row) => (
          <span className="text-xs text-slate-500 font-mono">
              {row.table_name} #{row.record_id}
          </span>
      )
    },
    { 
      header: "Date & Time", 
      accessor: "timestamp",
      render: (row) => (
        <div className="flex items-center gap-1.5 text-slate-500 text-sm">
            <Calendar size={14} />
            {new Date(row.timestamp).toLocaleString()}
        </div>
      )
    },
  ];

  if (loading) {
    return (
        <div className="default-container flex justify-center p-10">
            <Loader2 className="w-8 h-8 animate-spin text-navyBlue" />
        </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="default-container">
        <div className="flex items-center gap-2 mb-1">
            <FileText className="w-5 h-5" strokeWidth={2} />
            <h2 className="title">System Audit Logs</h2>
        </div>
        <p className="text-sm text-slate-500">
            Track user activities and system changes for security and accountability.
        </p>
      </div>

      {/* Logs Table */}
      <Table 
        columns={columns} 
        data={logs} 
        rowsPerPage={10} 
      />
    </div>
  );
}