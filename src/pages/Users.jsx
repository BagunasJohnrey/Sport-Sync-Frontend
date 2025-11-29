import { useState } from "react";
import Layout from "../components/Layout";
import KpiCard from "../components/KpiCard";
import AddUser from "../components/AddUser"; 
import Table from "../components/Table";
import Filter from "../components/Filter";
import { Edit2, UserX, Shield, Wallet, User, TrendingUp, UserCheck } from "lucide-react";


export default function Users() {
  const totalUsers = 3;
  const activeUsers = 3;
  const administrators = 1;
  const cashiers = 1;
  

  const userGrowth = 15; 
  const activeRate = ((activeUsers / totalUsers) * 100).toFixed(0); 


  // State
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const users = [
    {
      id: 1,
      name: "John Admin",
      email: "admin@balayansmasher.com",
      phone: "+63 917 123 4567",
      role: "admin",
      status: "Active",
      created: "1/1/2024",
      lastLogin: "11/26/2025",
      initial: "J",
    },
    {
      id: 2,
      name: "Jane Staff",
      email: "staff@balayansmasher.com",
      phone: "+63 917 234 5678",
      role: "staff",
      status: "Active",
      created: "1/15/2024",
      lastLogin: "11/26/2025",
      initial: "J",
    },
    {
      id: 3,
      name: "Bob Cashier",
      email: "cashier@balayansmasher.com",
      phone: "+63 917 345 6789",
      role: "cashier",
      status: "Active",
      created: "2/1/2024",
      lastLogin: "11/26/2025",
      initial: "B",
    },
  ];

  const roles = [
    {
      title: 'Administrator',
      icon: Shield,
      iconColor: 'text-blue-400',
      permissions: [
        'Full system access',
        'User management',
        'System settings',
        'All reports'
      ]
    },
    {
      title: 'Cashier',
      icon: Wallet,
      iconColor: 'text-gray-600',
      permissions: [
        'POS operations',
        'View inventory',
        'Basic dashboard'
      ]
    },
    {
      title: 'Staff',
      icon: User,
      iconColor: 'text-gray-600',
      permissions: [
        'Inventory management',
        'Stock adjustments',
        'Product management',
        'Basic dashboard'
      ]
    }
  ];

  // Filtering Logic
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesStatus =
      statusFilter === "all" ||
      user.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Table Configuration
  const columns = [
    {
      header: "User",
      accessor: "name",
      render: (row) => (
        <div className="flex items-center">
          <div className="h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center text-navyBlue font-bold text-sm border border-slate-200">
            {row.initial}
          </div>
          <div className="ml-3">
            <div className="text-sm font-semibold text-slate-800">
              {row.name}
            </div>
            <div className="text-xs text-slate-500">{row.email}</div>
          </div>
        </div>
      ),
    },
    {
      header: "Role",
      accessor: "role",
      render: (row) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 capitalize border border-blue-100">
          {row.role}
        </span>
      ),
    },
    {
      header: "Status",
      accessor: "status",
      render: (row) => (
        <span
          className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium border ${
            row.status === "Active"
              ? "bg-emerald-50 text-emerald-700 border-emerald-100"
              : "bg-slate-100 text-slate-600 border-slate-200"
          }`}
        >
          {row.status}
        </span>
      ),
    },
    { header: "Created", accessor: "created" },
    { header: "Last Login", accessor: "lastLogin" },
    {
      header: "Actions",
      accessor: "id",
      render: (row) => (
        <div className="flex gap-2">
          <button className="p-1.5 text-slate-500 hover:text-navyBlue bg-slate-50 hover:bg-blue-50 rounded-md transition-colors">
            <Edit2 size={16} />
          </button>
          <button className="p-1.5 text-slate-500 hover:text-red-500 bg-slate-50 hover:bg-red-50 rounded-md transition-colors">
            <UserX size={16} />
          </button>
        </div>
      ),
    },
  ];

  // Filter Configuration
  const filterConfig = [
    {
      value: roleFilter,
      onChange: (e) => setRoleFilter(e.target.value),
      options: [
        { value: "all", label: "All Roles" },
        { value: "admin", label: "Admin" },
        { value: "staff", label: "Staff" },
        { value: "cashier", label: "Cashier" },
      ],
    },
    {
      value: statusFilter,
      onChange: (e) => setStatusFilter(e.target.value),
      options: [
        { value: "all", label: "All Status" },
        { value: "active", label: "Active" },
        { value: "inactive", label: "Inactive" },
      ],
    },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="page-title">User Management</h1>
            <p className="page-description">
              Control access and manage user accounts.
            </p>
          </div>

          <AddUser />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard
          bgColor="#3B82F6"
          title="Total Users"
          icon={<User />}
          value={totalUsers}
          description={
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                <TrendingUp size={12} /> 
                {userGrowth}%
              </span>
              <span className="opacity-70">vs last month</span>
            </div>
          }
        />

        <KpiCard
          bgColor="#10B981"
          title="Active Users"
          icon={<UserCheck />}
          value={activeUsers}
          description={
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                {activeRate}%
              </span>
              <span className="opacity-70">activity rate</span>
            </div>
          }
        />

        <KpiCard
          bgColor="#6366F1"
          title="Administrators"
          icon={<Shield />}
          value={administrators}
          description={
            <div className="flex items-center gap-2">
              <span className="text-xs opacity-70">
                Full system access
              </span>
            </div>
          }
        />

        <KpiCard
          bgColor="#64748B"
          title="Cashiers"
          icon={<Wallet />}
          value={cashiers}
          description={
            <div className="flex items-center gap-2">
              <span className="text-xs opacity-70">
                POS operations
              </span>
            </div>
          }
        />
      </div>

        <Filter
          searchQuery={searchTerm}
          onSearchChange={(e) => setSearchTerm(e.target.value)}
          searchPlaceholder="Search users by name or email..."
          filters={filterConfig}
          showClearButton={
            searchTerm || roleFilter !== "all" || statusFilter !== "all"
          }
          onClear={() => {
            setSearchTerm("");
            setRoleFilter("all");
            setStatusFilter("all");
          }}
          resultsCount={`Showing ${filteredUsers.length} users`}
        />

        <Table
          tableName="Users"
          columns={columns}
          data={filteredUsers}
          rowsPerPage={5}
        />

        
          {/* Description */}
      <div className="bg-white rounded-xl shadow-sm p-8">
        <h2 className="title mb-5">Role Permissions</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {roles.map((role, index) => {
            const Icon = role.icon;
            return (
              <div key={index} className="space-y-4">
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${role.iconColor}`} />
                  <h3 className="text-md lg:text-lg font-semibold text-gray-900">
                    {role.title}
                  </h3>
                </div>
                
                <ul className="space-y-2">
                  {role.permissions.map((permission, pIndex) => (
                    <li key={pIndex} className="text-gray-600 text-sm flex items-start">
                      <span className="mr-2">•</span>
                      <span>{permission}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>

        
      </div>
    </Layout>
  );
}


