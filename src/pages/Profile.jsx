import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { Settings, User, Mail, Shield, CheckCircle2, Edit2, LogOut } from "lucide-react";

export default function Profile() {
  const { user } = useAuth(); 
  const navigate = useNavigate();

  if (!user) {
    return (
      <Layout>
        <div className="min-h-[80vh] flex flex-col items-center justify-center p-8">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
            <User className="w-10 h-10 text-slate-400" />
          </div>
          <h2 className="text-xl font-bold text-slate-800">User Not Found</h2>
          <p className="text-slate-500 mt-2">Please log in to view your profile.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>

        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="page-title">My Profile</h1>
            <p className="page-description mb-5">Manage your account settings and preferences.</p>
          </div>
          <div className="flex gap-3 mb-4 justify-end">
            <button
              onClick={() => navigate("/edit-profile")}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-all text-sm font-medium shadow-sm"
            >
              <Edit2 size={16} />
              <span>Edit Profile</span>
            </button>
            <button
              onClick={() => navigate("/profile-settings")}
              className="p-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-all shadow-sm"
            >
              <Settings size={20} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN - Identity Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 flex flex-col items-center text-center sticky top-6">
              
              {/* Avatar */}
              <div className="relative mb-6">
                <div className="w-28 h-28 rounded-full bg-linear-to-br from-navyBlue to-[#1f781a] flex items-center justify-center text-white text-3xl font-bold shadow-lg ring-4 ring-white">
                  {user.full_name.charAt(0).toUpperCase()}
                </div>
                <div className="absolute bottom-1 right-1 bg-white p-1 rounded-full shadow-sm">
                    {/* Online Status Indicator */}
                    <div className="w-4 h-4 bg-emerald-500 rounded-full border-2 border-white"></div>
                </div>
              </div>

              <h2 className="text-xl font-bold text-slate-800 mb-1">{user.full_name}</h2>
              <p className="text-slate-500 text-sm font-medium mb-6">@{user.username}</p>

              {/* Status Pill */}
              <div className={`
                inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold mb-8
                ${user.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-slate-100 text-slate-600'}
              `}>
                <CheckCircle2 size={14} className={user.status === 'Active' ? 'text-emerald-600' : 'text-slate-500'} />
                <span className="capitalize">{user.status}</span>
              </div>

              {/* Quick Stats or Info (Optional) */}
              <div className="w-full grid grid-cols-2 gap-4 pt-6 border-t border-slate-100">
                <div className="text-center">
                    <span className="block text-xs text-slate-400 uppercase font-bold tracking-wider">Role</span>
                    <span className="text-slate-800 font-semibold capitalize">{user.role}</span>
                </div>
                <div className="text-center border-l border-slate-100">
                    <span className="block text-xs text-slate-400 uppercase font-bold tracking-wider">Joined</span>
                    <span className="text-slate-800 font-semibold">2024</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN - Details */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Personal Information */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3 bg-slate-50/50">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                    <User size={18} />
                </div>
                <h3 className="font-semibold text-slate-800">Personal Information</h3>
              </div>
              <div className="p-6 space-y-1">
                <InfoRow label="Full Name" value={user.full_name} />
                <div className="border-b border-slate-50 my-2"></div>
                <InfoRow label="Username" value={user.username} />
                <div className="border-b border-slate-50 my-2"></div>
                
              </div>
            </div>

            {/* Account Details */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3 bg-slate-50/50">
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                    <Shield size={18} />
                </div>
                <h3 className="font-semibold text-slate-800">Account Details</h3>
              </div>
              <div className="p-6 space-y-1">
                <InfoRow 
                    label="Email Address" 
                    value={user.email} 
                    icon={<Mail size={14} className="text-slate-400 mr-2 inline" />} 
                />
                <div className="border-b border-slate-50 my-2"></div>
                <InfoRow label="Role Access" value={user.role} capitalize />
                <div className="border-b border-slate-50 my-2"></div>
                <InfoRow label="Account Status" value={user.status} capitalize color="text-emerald-600" />
              </div>
            </div>

          </div>
        </div>

    </Layout>
  );
}

// Reusable Row Component
function InfoRow({ label, value, icon, capitalize, isPlaceholder, color = "text-slate-800" }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 py-3">
      <dt className="text-sm font-medium text-slate-500">{label}</dt>
      <dd className={`text-sm sm:col-span-2 font-medium ${capitalize ? 'capitalize' : ''} ${isPlaceholder ? 'text-slate-400 italic' : color}`}>
        {icon}
        {value}
      </dd>
    </div>
  );
}