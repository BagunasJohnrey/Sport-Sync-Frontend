import { useState, useEffect, useCallback } from "react";
import ExportButton from "../../components/ExportButton";
import Table from "../../components/Table";
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, format } from "date-fns";
import { User, Eye, Loader2 } from "lucide-react";
import TransactionModal from "../../components/reports/TransactionModal";
import CalendarFilter from "../../components/CalendarFilter";
import API from '../../services/api';

export default function TransactionHistory() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [openModal, setOpenModal] = useState(false); 

  const [startDate, setStartDate] = useState(format(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
        const response = await API.get('/transactions', {
            params: {
                limit: 1000,
                start_date: startDate,
                end_date: endDate,
                status: 'Completed'
            }
        });
        setTransactions(response.data.data || []);
    } catch (error) {
        console.error("Failed to fetch transactions:", error.response?.data || error);
        setTransactions([]);
    } finally {
        setLoading(false);
    }
  }, [startDate, endDate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDateFilterChange = (filterType, date) => {
    let start, end;
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
    setStartDate(format(start, 'yyyy-MM-dd'));
    setEndDate(format(end, 'yyyy-MM-dd'));
  };
  
  // Helper for Table Display (JSX)
  const cashierColors = {
    Admin: { bg: "bg-blue-100", text: "text-blue-700", icon: "text-blue-500", },
    Staff: { bg: "bg-indigo-100", text: "text-indigo-700", icon: "text-indigo-500", },
    Cashier: { bg: "bg-green-100", text: "text-green-700", icon: "text-green-500", },
  };
  const paymentColors = {
    Cash: "bg-green-100 text-green-700",
    Card: "bg-blue-100 text-blue-700",
    Mobile: "bg-yellow-100 text-yellow-700",
  };

  const handleViewDetails = async (transactionId) => {
    try {
        const response = await API.get(`/transactions/${transactionId}`);
        setSelectedTransaction(response.data.data);
        setOpenModal(true);
    } catch (error) {
        console.error("Failed to fetch transaction details:", error.response?.data || error);
    }
  };

  // 1. Display Data (Contains JSX for UI)
  const tableData = transactions.map((t) => {
    const cashierRole = t.role || 'Cashier'; 
    return {
      "Transaction ID": t.transaction_id,
      "Date & Time": new Date(t.transaction_date).toLocaleString(),
      Cashier: (
        <div className="flex items-center gap-2">
          <span className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide shadow-sm transition-shadow ${cashierColors[cashierRole]?.bg} ${cashierColors[cashierRole]?.text}`}>
            <User size={14} className={`${cashierColors[cashierRole]?.icon}`} strokeWidth={2.5} />
            {t.cashier_name || 'N/A'}
          </span>
        </div>
      ),
      "Payment Method": (
        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${paymentColors[t.payment_method]}`}>
          {t.payment_method}
        </span>
      ),
      Total: <span className="font-semibold">₱{parseFloat(t.total_amount).toLocaleString('en-PH', {minimumFractionDigits: 2})}</span>,
      Actions: (
        <button className="p-2 text-navyBlue hover:text-darkGreen hover:bg-lightGray rounded transition" onClick={() => handleViewDetails(t.transaction_id)}>
          <Eye size={18} />
        </button>
      ),
    };
  });

  const tableColumns = [
    { header: "Transaction ID", accessor: "Transaction ID" },
    { header: "Date & Time", accessor: "Date & Time" },
    { header: "Cashier", accessor: "Cashier" },
    { header: "Payment Method", accessor: "Payment Method" },
    { header: "Total", accessor: "Total" },
    { header: "Actions", accessor: "Actions" },
  ];

  // 2. Export Data (Clean Strings)
  const exportData = transactions.map(t => ({
      "Transaction ID": t.transaction_id,
      "Date & Time": new Date(t.transaction_date).toLocaleString(),
      "Cashier": t.cashier_name || 'N/A',
      "Payment Method": t.payment_method,
      // FIXED: Use PHP prefix
      "Total": `PHP ${parseFloat(t.total_amount).toLocaleString('en-PH', {minimumFractionDigits: 2})}`
  }));

  const exportColumns = [
      { header: "Transaction ID", accessor: "Transaction ID" },
      { header: "Date & Time", accessor: "Date & Time" },
      { header: "Cashier", accessor: "Cashier" },
      { header: "Payment Method", accessor: "Payment Method" },
      { header: "Total", accessor: "Total" }
  ];
  
  if (loading) {
      return (
        <div className="default-container flex flex-col items-center justify-center h-96">
            <Loader2 className="w-8 h-8 animate-spin text-navyBlue mb-4" />
            <p className="text-slate-500">Loading Transaction History...</p>
        </div>
      );
  }

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex gap-5 justify-end">
        <CalendarFilter onChange={handleDateFilterChange}/>
        <div>
          <ExportButton
             data={exportData}       
             columns={exportColumns} 
             fileName={`Transaction_History_${startDate}_to_${endDate}`}
             title="Transaction History Report"
          />
        </div>
      </div>
      <Table
        tableName={`Transaction History (${startDate} to ${endDate})`}
        columns={tableColumns}
        data={tableData}
        rowsPerPage={10}
      />

      <TransactionModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        data={selectedTransaction}
      />
    </div>
  );
}