import React, { useState } from 'react';
import { Plus, X, Users } from 'lucide-react';

export default function UserManagementHeader() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    username: '',
    password: '',
    role: 'Cashier'
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Creating user:', { ...formData, active: isActive });
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="flex items-center justify-between ">
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-darkGreen text-softWhite px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-800 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add User
        </button>
      </div>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-charcoalBlack/40 bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto hide-scrollbar">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 bg-navyBlue">
              <div>
                <h2 className="text-2xl font-bold text-white">Add New User</h2>
                <p className="text-blue-100 text-sm mt-1">
                  Create a new user account with appropriate role and permissions.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-navyBlue rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Enter full name"
                  required
                  className="w-full px-4 py-3 border-2 border-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-blue-900 transition-all bg-slate-50"
                />
              </div>

              {/* Email  */}
              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-2">
                  Email  <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter email "
                  required
                  className="w-full px-4 py-3 border-2 border-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-blue-900 transition-all bg-slate-50"
                />
              </div>

              {/* Username */}
              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-2">
                  Username <span className="text-red-500">*</span>
                </label>
                <input
                  type="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="Enter Username"
                  required
                  className="w-full px-4 py-3 border-2 border-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-blue-900 transition-all bg-slate-50"
                />
              </div>

                {/* Password */}
              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-2">
                  Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter password"
                  required
                  className="w-full px-4 py-3 border-2 border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-blue-900 transition-all bg-slate-50"
                />
              </div>


              

              {/* Role */}
              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-2">
                  Role
                </label>
                <div className="relative">
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-blue-900 transition-all appearance-none bg-slate-50 cursor-pointer"
                  >
                    <option value="Cashier">Admin</option>
                    <option value="Admin">Staff</option>
                    <option value="Staff">Cashier</option>
                  </select>
                  <Users className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-700 pointer-events-none" />
                </div>
              </div>

              {/* Active User Toggle */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsActive(!isActive)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    isActive ? 'bg-blue-900' : 'bg-slate-400'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform shadow-md ${
                      isActive ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
                <span className="text-sm font-semibold text-slate-800">Active User</span>
              </div>

              

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-darkGreen text-white py-3 rounded-lg font-semibold hover:bg-navyBlue shadow-lg transition-all duration-200"
              >
                Create User
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}