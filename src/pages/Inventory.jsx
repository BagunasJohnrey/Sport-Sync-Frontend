import Layout from "../components/Layout";
import { Package, AlertTriangle, TrendingDown, DollarSign } from 'lucide-react';

export default function Inventory() {
  
  return (
    <Layout>
<div className="min-h-screen bg-softWhite p-6">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Inventory
        </h1>
        <p className="text-gray-600">
          Manage your sports equipment and stock levels
        </p>
      </div>

      {/* Stats Cards - Horizontal Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Products Card */}
        <div className="bg-softWhite rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-600 font-medium">Total Products</span>
            <Package className="w-5 h-5 text-gray-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">0</p>
        </div>

        {/* Low Stock Card */}
        <div className="bg-softWhite rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-600 font-medium">Low Stock</span>
            <AlertTriangle className="w-5 h-5 text-orange-500" />
          </div>
          <p className="text-2xl font-bold text-orange-500">0</p>
        </div>

        {/* Out of Stock Card */}
        <div className="bg-softWhite rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-600 font-medium">Out of Stock</span>
            <TrendingDown className="w-5 h-5 text-red-500" />
          </div>
          <p className="text-2xl font-bold text-red-500">0</p>
        </div>

        {/* Inventory Value Card */}
        <div className="bg-softWhite rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-600 font-medium">Inventory Value</span>
            <DollarSign className="w-5 h-5 text-gray-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">₱0</p>
        </div>
      </div>
    </div>
    </Layout>
  );
}

