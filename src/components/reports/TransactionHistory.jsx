import { useState } from "react";
import Table from "../../components/Table";
import { transactions, products } from "../../mockData";
import { Eye } from "lucide-react";
// import TransactionModal from "../../components/TransactionModal";

export default function SalesReport() {
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  // Predefined badge colors
  const cashierColors = {
    Staff: "bg-green-100 text-green-800",
    Admin: "bg-blue-100 text-blue-800",
    Cashier: "bg-red-100 text-red-800",
  };

  const paymentColors = {
    Cash: "bg-green-100 text-green-700",
    GCash: "bg-blue-100 text-blue-700",
  };

  const tableData = transactions.map((t) => {
    // Map all items in this transaction
    const itemsSold = t.items
      .map((item) => {
        const product = products.find((p) => p.id === item.product_id);
        return `${product.product_name} × ${item.quantity}`;
      })
      .join(", ");

    // Assign Cashier role randomly from Admin, Staff, Cashier
    const roles = ["Admin", "Staff", "Cashier"];
    const cashierRole = roles[t.user_id % roles.length]; // deterministic assignment

    return {
      "Transaction ID": t.id,
      "Date & Time": new Date(t.date).toLocaleString(),

      // Cashier badge
      Cashier: (
        <span
          className={`px-3 py-1 rounded-full text-sm font-semibold ${cashierColors[cashierRole]}`}
        >
          {cashierRole}
        </span>
      ),

      "Items Sold": itemsSold,

      // Payment Method badge
      "Payment Method": (
        <span
          className={`px-3 py-1 rounded-full text-sm font-semibold ${paymentColors[t.payment_method]}`}
        >
          {t.payment_method}
        </span>
      ),

      Total: <span className="font-semibold">₱{t.total_amount.toLocaleString()}</span>,

      Actions: (
        <button
          className="p-2 text-navyBlue hover:text-darkGreen hover:bg-lightGray rounded transition"
          // onClick={() => {
          //   setSelectedTransaction(t);
          //   setOpenModal(true);
          // }}
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
    { header: "Items Sold", accessor: "Items Sold" },
    { header: "Payment Method", accessor: "Payment Method" },
    { header: "Total", accessor: "Total" },
    { header: "Actions", accessor: "Actions" },
  ];

  return (
    <div>
      <Table
        tableName="Transaction History"
        columns={columns}
        data={tableData}
        rowsPerPage={10}
      />

      {/* <TransactionModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        data={selectedTransaction}
      /> */}
    </div>
  );
}
