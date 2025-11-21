import Layout from "../components/Layout";
import KpiCard from "../components/KpiCard";
import { DollarSign, ShoppingCart, Boxes, AlertTriangle, ArrowUp } from "lucide-react";

export default function Dashboard() {
  return (
    <Layout>
      <h1 className="text-2xl text-heading font-semibold mb-6">Dashboard</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <KpiCard
            bgColor="#BCD3E4"
            title="Today's Sale"
            icon={<DollarSign />}
            value="₱120,000"
            description={<><span className="flex bg-deepBlue/50 p-1 rounded-full font-bold"><ArrowUp size={14} /> 12%</span> vs yesterday</>}
            />

            <KpiCard
            bgColor="#D4E0EB"
            title="Transactions"
            icon={<ShoppingCart />}
            value="20"
            description={<><span className="flex bg-deepBlue/50 p-1 rounded-full font-bold"><ArrowUp size={14} /> 10%</span> vs yesterday</>}
            />

            <KpiCard
            bgColor="#E7F0F7"
            title="Low Stock Items"
            icon={<Boxes />}
            value="2"
            description={<>Items below reorder point</>}
            />

            <KpiCard
            bgColor="#F4F8FB"
            title="Out of Stock"
            icon={<AlertTriangle />}
            value="1"
            description={<>Items requiring immediate attention</>}
            />
        </div>
    </Layout>
  );
}
