import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { Settings, User, Mail, Shield, CheckCircle, Edit2 } from "lucide-react";

export default function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center p-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 text-lg">No user data available</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Responsive Grid */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
            {/* LEFT SECTION */}
            <div className="md:col-span-2 xl:col-span-2">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 h-full">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                    Profile
                  </h1>

                  <div className="flex gap-2 sm:gap-3">
                    <button
                      onClick={() => navigate("/edit-profile")}
                      className="p-2 sm:p-3 text-gray-400 hover:text-navyBlue hover:bg-gray-50 rounded-lg transition"
                    >
                      <Edit2 className="w-5 h-5 sm:w-6 sm:h-6" />
                    </button>
                    <button
                      onClick={() => navigate("/profile-settings")}
                      className="p-2 sm:p-3 text-gray-400 hover:text-navyBlue hover:bg-gray-50 rounded-lg transition"
                    >
                      <Settings className="w-5 h-5 sm:w-6 sm:h-6" />
                    </button>
                  </div>
                </div>

                {/* Avatar */}
                <div className="flex flex-col items-center text-center mb-8">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-navyBlue to-darkGreen rounded-full flex items-center justify-center mb-6">
                    <span className="text-xl sm:text-2xl text-white font-semibold">
                      {user.full_name.charAt(0).toUpperCase()}
                    </span>
                  </div>

                  <div className="space-y-1 sm:space-y-2">
                    <h2 className="text-xl sm:text-2xl font-semibold">
                      {user.full_name}
                    </h2>
                    <p className="text-gray-500 text-base sm:text-lg">
                      @{user.username}
                    </p>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="flex justify-center">
                  <div className="inline-flex items-center gap-2 sm:gap-3 px-5 sm:px-6 py-2 sm:py-3 rounded-full bg-green-50 border border-green-200">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-darkGreen" />
                    <span className="text-sm sm:text-base font-medium text-darkGreen capitalize">
                      {user.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT SECTION */}
            <div className="md:col-span-2 xl:col-span-2 space-y-6">
              {/* Personal */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
                <h3 className="flex items-center gap-3 text-lg sm:text-xl font-semibold text-gray-900 mb-6 sm:mb-8">
                  <div className="p-3 bg-navyBlue/30 rounded-xl">
                    <User className="w-5 h-5 sm:w-6 sm:h-6 text-navyBlue" />
                  </div>
                  Personal Information
                </h3>

                <div className="space-y-5">
                  <InfoItem label="Full Name" value={user.full_name} />
                  <InfoItem label="Username" value={user.username} />
                </div>
              </div>

              {/* Account */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
                <h3 className="flex items-center gap-3 text-lg sm:text-xl font-semibold text-gray-900 mb-6 sm:mb-8">
                  <div className="p-3 bg-darkGreen/30 rounded-xl">
                    <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-darkGreen" />
                  </div>
                  Account Information
                </h3>

                <div className="space-y-5">
                  <InfoItem
                    label="Email"
                    value={user.email}
                    icon={<Mail className="w-5 h-5 text-gray-400" />}
                  />
                  <InfoItem label="Role" value={user.role} capitalize />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

function InfoItem({ label, value, icon, capitalize = false }) {
  return (
    <div
      className="flex flex-col sm:flex-row sm:items-center justify-between 
      gap-1 sm:gap-4 py-4 px-2 border-b border-gray-100 last:border-b-0"
    >
      <div className="flex items-center gap-3">
        {icon}
        <span className="text-sm sm:text-base font-medium text-gray-600">
          {label}
        </span>
      </div>

      <span
        className={`text-sm sm:text-base font-semibold text-gray-900 ${
          capitalize ? "capitalize" : ""
        }`}
      >
        {value}
      </span>
    </div>
  );
}
