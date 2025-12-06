import { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import { Save, User, Mail, Shield, ArrowLeft, Loader2 } from "lucide-react";
import Toast from "../../components/Toast"; 
import API from "../../services/api";
import { useAuth } from "../../context/AuthContext";

export default function EditProfile() {
  const { user, login } = useAuth(); // Get login to update context after save
  const [toast, setToast] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
  });

  // Fetch latest profile data on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await API.get('/auth/profile');
        const data = response.data.data;
        setFormData({
            fullName: data.full_name || "",
            username: data.username || "",
            email: data.email || ""
        });
      } catch (error) {
        console.error("Failed to fetch profile:", error);
        setToast({ message: "Failed to load profile data.", type: "error" });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
      // If the input is directly an event
      if (e.target) {
          const { name, value } = e.target;
          setFormData(prev => ({ ...prev, [name]: value }));
      } 
      // If coming from the custom InfoCard component which might send name/value directly
      else if (e.name) {
          setFormData(prev => ({ ...prev, [e.name]: e.value }));
      }
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    try {
        const payload = {
            full_name: formData.fullName,
            email: formData.email
        };

        const response = await API.put('/auth/profile', payload);
        
        // Update local storage/context with new data
        if (user) {
            // We preserve the token but update the user details
            const token = localStorage.getItem("accessToken");
            // Construct updated user object based on current user + response
            const updatedUser = { ...user, ...response.data.data };
            login(updatedUser, token);
        }

        setToast({ message: "Profile updated successfully!", type: "success" });

    } catch (error) {
        const msg = error.response?.data?.message || "Failed to update profile.";
        setToast({ message: msg, type: "error" });
    } finally {
        setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
        <Layout>
            <div className="h-full flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-navyBlue" />
            </div>
        </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-3xl mx-auto pb-12">
        
        {/* --- Header --- */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => window.history.back()}
            className="p-2 -ml-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-all"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Edit Profile</h1>
            <p className="text-slate-500 text-sm">Update your personal details and contact info.</p>
          </div>
        </div>

        <div className="space-y-8">
          
          <InfoCard
            icon={<User className="w-5 h-5 text-[#002B50]" />}
            title="Personal Information"
            fields={[
              {
                label: "Full Name",
                name: "fullName",
                type: "text",
                value: formData.fullName,
                onChange: handleInputChange,
                placeholder: "e.g. John Doe",
              },
              {
                label: "Username",
                name: "username",
                type: "text",
                value: formData.username,
                disabled: true,
                icon: <Shield className="w-4 h-4 text-slate-400" />,
                note: "Username cannot be changed.",
              },
            ]}
          />

          <InfoCard
            icon={<Mail className="w-5 h-5 text-[#002B50]" />}
            title="Contact Information"
            fields={[
              {
                label: "Email Address",
                name: "email",
                type: "email",
                value: formData.email,
                onChange: handleInputChange,
                placeholder: "e.g. john@company.com",
                icon: <Mail className="w-4 h-4 text-slate-400" />,
              },
            ]}
          />

          {/* --- Action Buttons --- */}
          <div className="flex items-center justify-end gap-4 pt-4 border-t border-slate-100">
            <button
              onClick={() => window.history.back()}
              className="px-6 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button 
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 px-6 py-2.5 bg-[#002B50] text-white text-sm font-semibold rounded-lg hover:bg-[#1f781a] shadow-sm hover:shadow-md transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                </>
              ) : (
                <>
                    <Save className="w-4 h-4" />
                    Save Changes
                </>
              )}
            </button>
          </div>

        </div>
      </div>

      {toast && (
        <div className="fixed z-[9999] top-5 right-5">
            <Toast
            message={toast.message}
            type={toast.type}
            duration={3000}
            onClose={() => setToast(null)}
            />
        </div>
      )}
    </Layout>
  );
}

function InfoCard({ icon, title, fields }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      
      {/* Card Header */}
      <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3 bg-slate-50/50">
        <div className="p-2 bg-white border border-slate-200 rounded-lg shadow-sm">
          {icon}
        </div>
        <h3 className="text-base font-semibold text-slate-800">{title}</h3>
      </div>

      {/* Card Body */}
      <div className="p-6 space-y-6">
        {fields.map((field, i) => (
          <div key={i}>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              {field.label}
            </label>
            
            <div className="relative">
              <input
                type={field.type}
                name={field.name}
                value={field.value}
                onChange={field.onChange}
                placeholder={field.placeholder}
                disabled={field.disabled}
                className={`
                  w-full px-4 py-2.5 text-sm rounded-lg border outline-none transition-all
                  ${field.disabled 
                    ? "bg-slate-50 text-slate-500 border-slate-200 cursor-not-allowed" 
                    : "bg-white border-slate-300 text-slate-900 focus:border-[#002B50] focus:ring-4 focus:ring-[#002B50]/10"
                  }
                  ${field.icon ? "pr-10" : ""}
                `}
              />
              
              {/* Field Icon */}
              {field.icon && (
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  {field.icon}
                </div>
              )}
            </div>

            {/* Helper Note */}
            {field.note && (
              <p className="mt-1.5 text-xs text-slate-500 flex items-center gap-1">
                {field.disabled && <Shield className="w-3 h-3" />}
                {field.note}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}