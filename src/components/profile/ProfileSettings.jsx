import Layout from "../../components/Layout";
import { Lock, Eye, EyeOff, Save, ArrowLeft } from "lucide-react";
import { useState } from "react";

export default function ProfileSettings() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <Layout>
      <div className="min-h-screen p-4 sm:px-6 md:px-8 lg:px-10 xl:px-12">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
            <button
              onClick={() => window.history.back()}
              className="p-2 sm:p-3 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                Profile Settings
              </h1>
              <p className="text-gray-500 text-sm sm:text-base mt-1">
                Manage your account security and preferences
              </p>
            </div>
          </div>

          <div className="flex flex-col space-y-6">
            {/* Change Password Card */}
            <div className="bg-softWhite rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 md:p-8">
              <div className="flex items-start gap-2 sm:gap-3 mb-4 sm:mb-6">
                <div className="p-2 sm:p-3 bg-navyBlue/10 rounded-lg">
                  <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-navyBlue" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                    Change Password
                  </h3>
                  <p className="text-gray-500 text-xs sm:text-sm mt-1">
                    Update your password to keep your account secure
                  </p>
                </div>
              </div>

              <div className="space-y-4 sm:space-y-5">
                {/* Current Password */}
                <PasswordField
                  label="Current Password"
                  value={""}
                  show={showCurrentPassword}
                  setShow={setShowCurrentPassword}
                  placeholder="Enter current password"
                />

                {/* New Password */}
                <PasswordField
                  label="New Password"
                  value={""}
                  show={showNewPassword}
                  setShow={setShowNewPassword}
                  placeholder="Enter new password"
                  requirements={[
                    "8+ characters",
                    "1 number",
                    "1 uppercase",
                    "1 symbol",
                  ]}
                />

                {/* Confirm New Password */}
                <PasswordField
                  label="Confirm New Password"
                  value={""}
                  show={showConfirmPassword}
                  setShow={setShowConfirmPassword}
                  placeholder="Confirm new password"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-between gap-3 pt-4">
              <button className="flex items-center justify-center gap-2 px-6 py-3 sm:px-6 sm:py-3 bg-darkGreen text-softWhite rounded-lg hover:bg-navyBlue transition-colors duration-200 font-medium text-sm sm:text-base">
                <Save className="w-4 h-4 sm:w-5 sm:h-5" />
                Update Password
              </button>
              <button
                onClick={() => window.history.back()}
                className="flex items-center justify-center gap-2 px-6 py-3 sm:px-6 sm:py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium text-sm sm:text-base"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

// Password Field Component
function PasswordField({
  label,
  value,
  show,
  setShow,
  placeholder,
  requirements,
}) {
  return (
    <div className="space-y-1">
      <label className="text-sm sm:text-base font-medium text-gray-700">
        {label}
      </label>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={() => {}}
          placeholder={placeholder}
          className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navyBlue/20 focus:border-navyBlue transition-colors duration-200 pr-12 text-sm sm:text-base"
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute inset-y-0 right-0 flex items-center pr-2 sm:pr-3 text-gray-400 hover:text-gray-600 transition-colors duration-200"
        >
          {show ? (
            <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
          ) : (
            <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
          )}
        </button>
      </div>
      {requirements && (
        <div className="grid grid-cols-2 gap-2 mt-1 sm:mt-2 text-xs sm:text-sm text-gray-500">
          {requirements.map((req, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-darkGreen rounded-full"></div>
              <span>{req}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
