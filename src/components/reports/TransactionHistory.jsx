import { useState, useEffect, useCallback } from "react";
import ExportButton from "../../components/ExportButton";
import Table from "../../components/Table";
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, format } from "date-fns";
import { User, Eye, Loader2, RefreshCw } from "lucide-react";
import TransactionModal from "../../components/reports/TransactionModal";
import CalendarFilter from "../../components/CalendarFilter";
import API from '../../services/api';

export default function TransactionHistory() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [openModal, setOpenModal] = useState(false); 

  // --- 1. CONTROLLED STATE (Single Source of Truth) ---
  // We lift the state here so TransactionHistory controls the filter, not the other way around.
  const [activeFilter, setActiveFilter] = useState("Daily");
  const [activeDate, setActiveDate] = useState(new Date());
  
  // Derived state for API parameters
  const [dateRange, setDateRange] = useState({
      start: format(new Date(), 'yyyy-MM-dd'),
      end: format(new Date(), 'yyyy-MM-dd')
  });
  
  // --- 2. DATE CALCULATION LOGIC ---
  const calculateDateRange = useCallback((filter, date) => {
    let start, end;
    const validDate = date instanceof Date && !isNaN(date) ? date : new Date();

    switch (filter) {
        case "Weekly":
            start = startOfWeek(validDate, { weekStartsOn: 1 });
            end = endOfWeek(validDate, { weekStartsOn: 1 });
            break;
        case "Monthly":
            start = startOfMonth(validDate);
            end = endOfMonth(validDate);
            break;
        case "Yearly":
            start = startOfYear(validDate);
            end = endOfYear(validDate);
            break;
        case "Daily":
        default:
            start = validDate;
            end = validDate;
            break;
    }
    return {
        start: format(start, 'yyyy-MM-dd'),
        end: format(end, 'yyyy-MM-dd')
    };
  }, []);

  // Update date range automatically when UI state changes
  useEffect(() => {
      const range = calculateDateRange(activeFilter, activeDate);
      setDateRange(range);
  }, [activeFilter, activeDate, calculateDateRange]);

  // --- 3. FETCH DATA ---
  const fetchData = useCallback(async () => {
    // Prevent fetching if dates aren't ready
    if (!dateRange.start || !dateRange.end) return;

    setLoading(true);
    try {
        console.log(`Fetching Transactions: ${dateRange.start} to ${dateRange.end}`);
        
        // Pass the calculated dates to your real API
        const response = await API.get('/transactions', {
            params: {
                limit: 1000,
                start_date: dateRange.start,
                end_date: dateRange.end,
            }
        });
        setTransactions(response.data.data || []);
    } catch (error) {
        console.error("Failed to fetch transactions:", error.response?.data || error);
        setTransactions([]);
    } finally {
        setLoading(false);
    }
  }, [dateRange.start, dateRange.end]);

  // Initial fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // --- 4. HANDLER ---
  // This function is passed to CalendarFilter to update the parent state
  const handleFilterChange = (newFilter, newDate) => {
    setActiveFilter(newFilter);
    setActiveDate(newDate);
  };
  
  // Helper: Normalize payment method display
  const normalizePaymentMethod = (method) => {
      if (!method) return 'GCash';
      const normalized = method.trim();
      
      if (['Mobile', 'mobile', 'Unknown', ''].includes(normalized)) {
          return 'GCash';
      }
      return normalized.charAt(0).toUpperCase() + normalized.slice(1);
  };

  // Styles for badges
  const cashierColors = {
    Admin: { bg: "bg-blue-100", text: "text-blue-700", icon: "text-blue-500", },
    Staff: { bg: "bg-indigo-100", text: "text-indigo-700", icon: "text-indigo-500", },
    Cashier: { bg: "bg-green-100", text: "text-green-700", icon: "text-green-500", },
  };
  
  const paymentColors = {
    Cash: "bg-green-100 text-green-700",
    Card: "bg-blue-100 text-blue-700",
    GCash: "bg-yellow-100 text-yellow-700",
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

  // Map API data to Table format
  const tableData = transactions.map((t) => {
    const cashierRole = t.role || 'Cashier';
    const normalizedPayment = normalizePaymentMethod(t.payment_method);
    
    return {
      "Transaction ID": t.transaction_id,
      "Date & Time": new Date(t.transaction_date).toLocaleString(),
      Cashier: (
        <div className="flex items-center gap-2">
          <span className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide shadow-sm transition-shadow ${cashierColors[cashierRole]?.bg || 'bg-gray-100'} ${cashierColors[cashierRole]?.text || 'text-gray-600'}`}>
            <User size={14} className={`${cashierColors[cashierRole]?.icon || 'text-gray-500'}`} strokeWidth={2.5} />
            {t.cashier_name || 'N/A'}
          </span>
        </div>
      ),
      "Payment Method": (
        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${paymentColors[normalizedPayment] || 'bg-gray-100 text-gray-600'}`}>
          {normalizedPayment}
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

  // Clean Export Data with normalized payment method
  const exportData = transactions.map(t => ({
      "Transaction ID": t.transaction_id,
      "Date & Time": new Date(t.transaction_date).toLocaleString(),
      "Cashier": t.cashier_name || 'N/A',
      "Payment Method": normalizePaymentMethod(t.payment_method),
      "Total": `PHP ${parseFloat(t.total_amount).toLocaleString('en-PH', {minimumFractionDigits: 2})}`
  }));

  const exportColumns = [
      { header: "Transaction ID", accessor: "Transaction ID" },
      { header: "Date & Time", accessor: "Date & Time" },
      { header: "Cashier", accessor: "Cashier" },
      { header: "Payment Method", accessor: "Payment Method" },
      { header: "Total", accessor: "Total" }
  ];
  
  if (loading && transactions.length === 0) {
      return (
        <div className="default-container flex flex-col items-center justify-center h-96">
            <Loader2 className="w-8 h-8 animate-spin text-navyBlue mb-4" />
            <p className="text-slate-500">Loading Transaction History...</p>
        </div>
      );
  }

  return (
    <div className="flex flex-col space-y-6">
      
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold text-slate-800">Transaction History</h2>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-end items-center">
          <button 
            onClick={fetchData} 
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 hover:text-navyBlue hover:border-navyBlue/30 rounded-lg transition-all shadow-sm"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />} 
            <span className="hidden sm:inline">Refresh</span>
          </button>
          
          {/* Using the Controlled Component Pattern.
             We pass the active state down, and receive changes via the handler.
          */}
          <CalendarFilter 
              activeFilter={activeFilter}
              activeDate={activeDate}
              onChange={handleFilterChange}
          />
          
          <ExportButton
             data={exportData}       
             columns={exportColumns} 
             fileName={`Transaction_History_${dateRange.start}_to_${dateRange.end}`}
             title={`Transaction History - ${dateRange.start} to ${dateRange.end}`}
          />
        </div>
      </div>
      
      {/* Table Section */}
      {tableData.length > 0 ? (
          <Table
            tableName={`${transactions.length} Transaction${transactions.length !== 1 ? 's' : ''} Found`}
            columns={tableColumns}
            data={tableData}
            rowsPerPage={10}
          />
      ) : (
          <div className="default-container flex flex-col items-center justify-center h-64 text-slate-400 border border-dashed border-slate-300 rounded-xl">
              <p className="text-lg font-medium">No transactions found.</p>
              <p className="text-sm">Try selecting a different date range.</p>
          </div>
      )}

      <TransactionModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        data={selectedTransaction}
      />
    </div>
  );
}