import React, { useState, useEffect } from 'react';
import { Save, X, Loader2, User, Mail, Shield, Users } from 'lucide-react';
import API from '../../services/api';

export default function EditUserModal({ isOpen, onClose, user, onUserUpdated, setToast }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    username: '',
    role: 'Staff',
    status: 'Active'
  });

  // Populate form when user data changes
  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.full_name || '',
        email: user.email || '',
        username: user.username || '',
        role: user.role || 'Staff',
        status: user.status || 'Active'
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Call the update endpoint (PUT /api/users/:id)
      await API.put(`/users/${user.user_id}`, formData);
      
      setToast({ message: "User updated successfully!", type: "success" });
      onUserUpdated(); // Refresh the list in parent
      onClose();
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to update user.";
      setToast({ message: msg, type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-charcoalBlack/40 bg-opacity-60 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto hide-scrollbar animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 bg-navyBlue border-b border-navyBlue/80">
          <div>
            <h2 className="text-xl font-bold text-white">Edit User</h2>
            <p className="text-blue-100 text-xs mt-0.5">
              Update account details and permissions.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white hover:bg-white/10 p-1 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          
          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Full Name</label>
            <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-navyBlue/20 focus:border-navyBlue transition-all"
                    placeholder="John Doe"
                    required
                />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Email Address</label>
            <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-navyBlue/20 focus:border-navyBlue transition-all"
                    placeholder="name@company.com"
                    required
                />
            </div>
          </div>

          {/* Username */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Username</label>
            <div className="relative">
                <Shield className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-navyBlue/20 focus:border-navyBlue transition-all"
                    required
                />
            </div>
          </div>

          {/* Row: Role & Status */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Role</label>
                <div className="relative">
                    <select
                        name="role"
                        value={formData.role}
                        onChange={handleInputChange}
                        className="w-full pl-3 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-navyBlue/20 focus:border-navyBlue transition-all appearance-none cursor-pointer"
                    >
                        <option value="Admin">Admin</option>
                        <option value="Staff">Staff</option>
                        <option value="Cashier">Cashier</option>
                    </select>
                    <Users className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                </div>
            </div>

            <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Status</label>
                <div className="relative">
                    <select
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        className={`w-full pl-3 pr-8 py-2.5 border rounded-xl text-sm font-bold focus:outline-none focus:ring-2 transition-all appearance-none cursor-pointer
                            ${formData.status === 'Active' 
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 focus:ring-emerald-500/20 focus:border-emerald-500' 
                                : 'bg-slate-100 text-slate-600 border-slate-200 focus:ring-slate-500/20 focus:border-slate-500'
                            }`}
                    >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                    </select>
                </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 flex gap-3">
            <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 border border-slate-200 text-slate-600 font-semibold rounded-xl hover:bg-slate-50 transition-colors"
            >
                Cancel
            </button>
            <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-2.5 bg-navyBlue text-white font-semibold rounded-xl hover:bg-darkGreen shadow-md hover:shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Save Changes
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}