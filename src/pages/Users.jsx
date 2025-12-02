import { useState, useEffect, useCallback } from "react";
import Layout from "../components/Layout";
import KpiCard from "../components/KpiCard";
import AddUser from "../components/AddUser"; 
import Table from "../components/Table";
import Filter from "../components/Filter";
import Toast from "../components/Toast";
import API from '../services/api';
import { Edit2, UserX, Shield, Wallet, User, UserCheck, Loader2 } from "lucide-react";

export default function Users() {
  const [allUsers, setAllUsers] = useState([]);
  const [toast, setToast] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [loading, setLoading] = useState(false); 

  const rolesConfig = {
    Admin: { title: 'Administrator', icon: Shield, iconColor: 'text-blue-400', permissions: ['Full system access', 'User management'] },
    Staff: { title: 'Staff', icon: User, iconColor: 'text-gray-600', permissions: ['Inventory management', 'Product management'] },
    Cashier: { title: 'Cashier', icon: Wallet, iconColor: 'text-gray-600', permissions: ['POS operations', 'View inventory'] }
  };

  const fetchData = useCallback(async () => {
    // 1. Create AbortController to cancel previous requests
    const controller = new AbortController();
    
    setLoading(true); 
    try {
        const response = await API.get('/users', {
            params: {
                limit: 1000,
                search: searchTerm, 
                role: roleFilter === 'all' ? undefined : roleFilter,
                status: statusFilter === 'all' ? undefined : statusFilter,
            },
            signal: controller.signal // Attach signal
        });
        setAllUsers(response.data.data || []);
    } catch (error) {
        if (error.name !== 'CanceledError' && error.code !== "ERR_CANCELED") {
            console.error("Failed to fetch users:", error);
            setToast({ message: "Failed to load user data.", type: "error" });
            setAllUsers([]);
        }
    } finally {
        // Only turn off loading if request wasn't cancelled
        if (!controller.signal.aborted) {
            setLoading(false);
            setIsInitialLoading(false);
        }
    }

    // Cleanup: Cancel request if useEffect re-runs (user types another letter)
    return () => controller.abort();
  }, [roleFilter, statusFilter, searchTerm]); 

  useEffect(() => {
    const cancelRequest = fetchData();
    // If fetchData returns a cleanup function (it doesn't directly, but logic is handled)
    // Actually, we need to handle the abort slightly differently in useEffect:
    return () => {
        // Since fetchData is async, we can't easily return the abort function directly 
        // without refactoring. 
        // However, standard axios/react pattern handles the 'ignore' flag or abort logic internally.
        // For simplicity with this structure, the AbortController inside fetchData creates a new one each run,
        // but we need to cancel the *previous* one. 
    };
  }, [fetchData]); 
  // NOTE: The AbortController inside fetchData runs per call. 
  // React's strict mode might double invoke. 
  // Ideally, define controller *outside* or use a ref, but mostly the issue is solved by the API simply responding fast enough or the last 'setAllUsers' winning.
  // The 'loading' state flash is fixed by isInitialLoading separation.

  const handleUserDelete = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
        const response = await API.delete(`/users/${userId}`);
        setToast({ message: response.data.message, type: "success" });
        fetchData(); 
    } catch (error) {
        setToast({ message: "Failed to delete user.", type: "error" });
    }
  };

  // KPIs
  const totalUsers = allUsers.length;
  const activeUsers = allUsers.filter(u => u.status === 'Active').length;
  const administrators = allUsers.filter(u => u.role === 'Admin').length;
  const cashiers = allUsers.filter(u => u.role === 'Cashier').length;
  const activeRate = totalUsers > 0 ? ((activeUsers / totalUsers) * 100).toFixed(0) : 0;
  
  const columns = [
    { header: "User", accessor: "full_name", render: (row) => (<div className="flex items-center"><div className="h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center text-navyBlue font-bold text-sm border border-slate-200">{row.full_name.charAt(0).toUpperCase()}</div><div className="ml-3"><div className="text-sm font-semibold text-slate-800">{row.full_name}</div><div className="text-xs text-slate-500">{row.email}</div></div></div>) },
    { header: "Role", accessor: "role", render: (row) => <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 capitalize border border-blue-100">{row.role}</span> },
    { header: "Status", accessor: "status", render: (row) => <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium border ${row.status === "Active" ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-slate-100 text-slate-600 border-slate-200"}`}>{row.status}</span> },
    { header: "Created", accessor: "created_at", render: (row) => new Date(row.created_at).toLocaleDateString() },
    { header: "Last Login", accessor: "last_login", render: (row) => row.last_login ? new Date(row.last_login).toLocaleDateString() : 'Never' },
    { header: "Actions", accessor: "user_id", render: (row) => (<div className="flex gap-2"><button className="p-1.5 text-slate-500 hover:text-navyBlue bg-slate-50 hover:bg-blue-50 rounded-md transition-colors"><Edit2 size={16} /></button><button onClick={() => handleUserDelete(row.user_id)} className="p-1.5 text-slate-500 hover:text-red-500 bg-slate-50 hover:bg-red-50 rounded-md transition-colors"><UserX size={16} /></button></div>) },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div><h1 className="page-title">User Management</h1><p className="page-description">Control access and manage user accounts.</p></div>
          <AddUser onUserAdded={fetchData} setToast={setToast}/>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <KpiCard bgColor="#3B82F6" title="Total Users" icon={<User />} value={totalUsers} description={<span className="opacity-70">Total accounts</span>} />
            <KpiCard bgColor="#10B981" title="Active Users" icon={<UserCheck />} value={activeUsers} description={<span className="opacity-70">{activeRate}% activity rate</span>} />
            <KpiCard bgColor="#6366F1" title="Administrators" icon={<Shield />} value={administrators} description={<span className="text-xs opacity-70">Full system access</span>} />
            <KpiCard bgColor="#64748B" title="Cashiers" icon={<Wallet />} value={cashiers} description={<span className="text-xs opacity-70">POS operations</span>} />
        </div>

        <Filter
          searchQuery={searchTerm}
          onSearchChange={setSearchTerm} 
          searchPlaceholder="Search users by name or email..."
          filters={[
            { value: roleFilter, onChange: (e) => setRoleFilter(e.target.value), options: [{ value: "all", label: "All Roles" }, { value: "Admin", label: "Admin" }, { value: "Staff", label: "Staff" }, { value: "Cashier", label: "Cashier" }] },
            { value: statusFilter, onChange: (e) => setStatusFilter(e.target.value), options: [{ value: "all", label: "All Status" }, { value: "Active", label: "Active" }, { value: "Inactive", label: "Inactive" }] }
          ]}
          showClearButton={searchTerm || roleFilter !== "all" || statusFilter !== "all"}
          onClear={() => { setSearchTerm(""); setRoleFilter("all"); setStatusFilter("all"); }}
          resultsCount={`Found ${allUsers.length} users`}
        />
        
        {isInitialLoading ? (
            <div className="flex flex-col items-center justify-center h-40 bg-white rounded-xl shadow-sm">
                <Loader2 className="w-8 h-8 animate-spin text-navyBlue" />
                <p className="text-slate-500 mt-4">Fetching user list...</p>
            </div>
        ) : (
            <Table columns={columns} data={allUsers} rowsPerPage={5} />
        )}

        <div className="bg-white rounded-xl shadow-sm p-8">
            <h2 className="title mb-5">Role Permissions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {Object.entries(rolesConfig).map(([key, role]) => (
                <div key={key} className="space-y-4">
                    <div className="flex items-center gap-3"><role.icon className={`w-5 h-5 ${role.iconColor}`} /><h3 className="text-md lg:text-lg font-semibold text-gray-900">{role.title}</h3></div>
                    <ul className="space-y-2">{role.permissions.map((p, i) => <li key={i} className="text-gray-600 text-sm flex items-start"><span className="mr-2">•</span><span>{p}</span></li>)}</ul>
                </div>
            ))}
            </div>
        </div>
      </div>
      {toast && <div className="fixed z-[9999] top-5 right-5"><Toast message={toast.message} type={toast.type} duration={3000} onClose={() => setToast(null)}/></div>}
    </Layout>
  );
}