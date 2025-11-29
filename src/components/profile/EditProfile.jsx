import Layout from "../../components/Layout";
import { Save, User, Mail, Shield, ArrowLeft } from "lucide-react";

export default function EditProfile() {
  return (
    <Layout>
      <div className="min-h-screen p-4 sm:px-6 md:px-8 lg:px-10 xl:px-12">
        <div className="max-w-4xl">
          {/* Header */}
          <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8 justify-start">
            <button
              onClick={() => window.history.back()}
              className="p-2 sm:p-3 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
            </button>
            <div className="flex flex-col">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                Edit Profile
              </h1>
              <p className="text-gray-500 text-sm sm:text-base mt-1">
                Update your personal information
              </p>
            </div>
          </div>

          <div className="flex flex-col space-y-6">
            {/* Personal Information Card */}
            <InfoCard
              icon={<User className="w-4 h-4 sm:w-5 sm:h-5 text-navyBlue" />}
              title="Personal Information"
              fields={[
                {
                  label: "Full Name",
                  type: "text",
                  value: "John Doe",
                  placeholder: "Enter your full name",
                },
                {
                  label: "Username",
                  type: "text",
                  value: "johndoe",
                  disabled: true,
                  icon: (
                    <Shield className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
                  ),
                  note: "Username cannot be changed",
                },
              ]}
            />

            {/* Contact Information Card */}
            <InfoCard
              icon={<Mail className="w-4 h-4 sm:w-5 sm:h-5 text-navyBlue" />}
              title="Contact Information"
              fields={[
                {
                  label: "Email Address",
                  type: "email",
                  value: "john.doe@example.com",
                  placeholder: "Enter your email address",
                  icon: (
                    <Mail className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
                  ),
                },
              ]}
            />

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-start sm:justify-between gap-3 pt-4">
              <button className="flex items-center justify-center gap-2 px-6 py-3 bg-darkGreen text-white rounded-lg hover:bg-navyBlue transition-colors duration-200 font-medium text-sm sm:text-base">
                <Save className="w-4 h-4 sm:w-5 sm:h-5" />
                Save Changes
              </button>
              <button
                onClick={() => window.history.back()}
                className="flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium text-sm sm:text-base"
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

// InfoCard Component for Reusability
function InfoCard({ icon, title, fields }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 md:p-8">
      <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
        <div className="p-2 sm:p-3 bg-navyBlue/10 rounded-lg">{icon}</div>
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
          {title}
        </h3>
      </div>
      <div className="space-y-4 sm:space-y-5">
        {fields.map((field, i) => (
          <div key={i} className="space-y-1">
            <label className="text-sm sm:text-base font-medium text-gray-700">
              {field.label}
            </label>
            <div className="relative">
              <input
                type={field.type}
                value={field.value}
                placeholder={field.placeholder}
                disabled={field.disabled}
                className={`w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg ${
                  field.disabled
                    ? "bg-gray-50 text-gray-500"
                    : "focus:ring-2 focus:ring-navyBlue/20 focus:border-navyBlue"
                } transition-colors duration-200 text-sm sm:text-base`}
              />
              {field.icon && (
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:pr-3">
                  {field.icon}
                </div>
              )}
            </div>
            {field.note && (
              <p className="text-xs sm:text-sm text-gray-500">{field.note}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
