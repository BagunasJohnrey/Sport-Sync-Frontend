import { useState, useEffect, useCallback, useRef } from "react";
import ExportButton from "../../components/ExportButton";
import Table from "../../components/Table";
// import { transactions, products } from "../../mockData"; // REMOVED
import { User, Eye, Loader2 } from "lucide-react";
import TransactionModal from "../../components/TransactionModal";
import CalendarFilter from  "../../components/CalendarFilter";
import API from '../../services/api';

export default function TransactionHistory() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [openModal, setOpenModal] = useState(false); 
  const reportRef = useRef(null);

  const [startDate, setStartDate] = useState(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);

  // Fetch transaction history
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

  // Handler for CalendarFilter changes
  const handleDateFilterChange = (filterType, date) => {
    // Simple implementation: forcing a month-long range from the selected date backwards
    let newEnd = date.toISOString().split('T')[0];
    let newStart = new Date(date.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    setStartDate(newStart);
    setEndDate(newEnd);
  };
  
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

  // Convert raw transactions to table format
  const tableData = transactions.map((t) => {
    const cashierRole = t.role || 'Cashier'; // Fallback role if role not merged by query
    
    // NOTE: Item details and products array are not available in the `/transactions` list response, 
    // only in the detailed GET /transactions/:id response. We only display general details here.
    const itemsSoldCount = t.items_sold_count || 0; 

    // Helper to get transaction details when viewing modal
    const handleViewDetails = async (transactionId) => {
        try {
            const response = await API.get(`/transactions/${transactionId}`);
            setSelectedTransaction(response.data.data);
            setOpenModal(true);
        } catch (error) {
            console.error("Failed to fetch transaction details:", error.response?.data || error);
        }
    };

    return {
      "Transaction ID": t.transaction_id,
      "Date & Time": new Date(t.transaction_date).toLocaleString(),

      Cashier: (
        <div className="flex items-center gap-2">
          <span
            className={`
              flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide shadow-sm transition-shadow
              ${cashierColors[cashierRole]?.bg} ${cashierColors[cashierRole]?.text} hover:shadow-md
            `}
          >
            <User
              size={14}
              className={`${cashierColors[cashierRole]?.icon}`}
              strokeWidth={2.5}
            />
            {t.cashier_name || 'N/A'}
          </span>
        </div>
      ),

      "Payment Method": (
        <span
          className={`px-3 py-1 rounded-full text-sm font-semibold ${
            paymentColors[t.payment_method]
          }`}
        >
          {t.payment_method}
        </span>
      ),

      Total: (
        <span className="font-semibold">
          ₱{parseFloat(t.total_amount).toLocaleString('en-PH', {minimumFractionDigits: 2})}
        </span>
      ),

      Actions: (
        <button
          className="p-2 text-navyBlue hover:text-darkGreen hover:bg-lightGray rounded transition"
          onClick={() => handleViewDetails(t.transaction_id)} // Use the dedicated API fetcher
        >
          <Eye size={18} />
        </button>
      ),
    };
  });

  const columns = [
    { header: "Transaction ID", accessor: "Transaction ID" },
    { header: "Date & Time", accessor: "Date & Time" },
    { header: "Cashier", accessor: "Cashier" },
    { header: "Payment Method", accessor: "Payment Method" },
    { header: "Total", accessor: "Total" },
    { header: "Actions", accessor: "Actions" },
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
    <div className="flex flex-col space-y-6" ref={reportRef}>
      <div className="flex gap-5 justify-end">
        <CalendarFilter onChange={handleDateFilterChange}/>
        <div>
          <ExportButton
             data={tableData}
             columns={columns}
             fileName={`Transaction_History_${startDate}_to_${endDate}`}
             title="Transaction History Report"
             domElementRef={reportRef} 
          />
        </div>
      </div>
      <Table
        tableName={`Transaction History (${startDate} to ${endDate})`}
        columns={columns}
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