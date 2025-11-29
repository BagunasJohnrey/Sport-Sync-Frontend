import { useState } from "react";
import ExportButton from "../../components/ExportButton";
import Table from "../../components/Table";
import { transactions, products } from "../../mockData";
import { User, Eye } from "lucide-react";
import TransactionModal from "../../components/TransactionModal";

export default function SalesReport() {
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [openModal, setOpenModal] = useState(false); // State for opening/closing the modal

  const cashierColors = {
    Admin: {
      bg: "bg-blue-100",
      text: "text-blue-700",
      icon: "text-blue-500",
    },
    Staff: {
      bg: "bg-indigo-100",
      text: "text-indigo-700",
      icon: "text-indigo-500",
    },
    Cashier: {
      bg: "bg-green-100",
      text: "text-green-700",
      icon: "text-green-500",
    },
  };

  const paymentColors = {
    Cash: "bg-green-100 text-green-700",
    GCash: "bg-blue-100 text-blue-700",
  };

  const tableData = transactions.map((t) => {
    const itemsSold = t.items
      .map((item) => {
        const product = products.find((p) => p.id === item.product_id);
        return `${product.product_name} × ${item.quantity}`;
      })
      .join(", ");

    const roles = ["Admin", "Staff", "Cashier"];
    const cashierRole = roles[t.user_id % roles.length];

    return {
      "Transaction ID": t.id,
      "Date & Time": new Date(t.date).toLocaleString(),

      // Cashier badge
      Cashier: (
        <div className="flex items-center gap-2">
          <span
            className={`
        flex items-center gap-1.5 
        px-3.5 py-1.5 rounded-full 
        text-xs font-semibold uppercase tracking-wide 
        shadow-sm transition-shadow
        ${cashierColors[cashierRole]?.bg} 
        ${cashierColors[cashierRole]?.text} 
        hover:shadow-md
      `}
          >
            {/* Icon based on role color */}
            <User
              size={14}
              className={`${cashierColors[cashierRole]?.icon}`}
              strokeWidth={2.5}
            />
            {cashierRole}
          </span>
        </div>
      ),

      "Items Sold": itemsSold,

      // Payment Method badge
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
          ₱{t.total_amount.toLocaleString()}
        </span>
      ),

      Actions: (
        <button
          className="p-2 text-navyBlue hover:text-darkGreen hover:bg-lightGray rounded transition"
          onClick={() => {
            setSelectedTransaction(t);
            setOpenModal(true);
          }}
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

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex gap-5 justify-end">
        <div>
          <ExportButton />
        </div>
        {/* insert calendar */}
      </div>
      <Table
        tableName="Transaction History"
        columns={columns}
        data={tableData}
        rowsPerPage={10}
      />

      {/* Modal Component */}
      <TransactionModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        data={selectedTransaction}
      />
    </div>
  );
}
