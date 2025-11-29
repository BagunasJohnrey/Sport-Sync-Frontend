import Layout from "../../components/Layout";
import { Lock, Eye, EyeOff, Save, ArrowLeft, Check, ShieldCheck, X as XIcon } from "lucide-react";
import { useState } from "react";

export default function ProfileSettings() {
  // 1. Toggle Visibility State
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // 2. Form Data State
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 3. Validation Logic (Real-time)
  const password = formData.newPassword;
  const validation = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    symbol: /[^A-Za-z0-9]/.test(password), // Checks for any non-alphanumeric char
    match: password && password === formData.confirmPassword
  };

  const isFormValid = 
    Object.values(validation).every(Boolean) && 
    formData.currentPassword.length > 0;

  return (
    <Layout>
      <div className="max-w-2xl mx-auto pb-12">
        
        {/* --- Header --- */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => window.history.back()}
            className="p-2 -ml-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-all"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Security Settings</h1>
            <p className="text-slate-500 text-sm">Manage your password and account security.</p>
          </div>
        </div>

        {/* --- Main Card --- */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          
          {/* Card Title */}
          <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <Lock className="w-5 h-5" />
            </div>
            <div>
                <h3 className="font-semibold text-slate-800 text-lg">Change Password</h3>
                <p className="text-xs text-slate-500">Ensure your account is using a strong password.</p>
            </div>
          </div>

          <div className="p-8 space-y-6">
            
            {/* Current Password */}
            <PasswordField
              label="Current Password"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              placeholder="Enter current password"
              show={showCurrent}
              setShow={setShowCurrent}
            />

            <div className="border-t border-slate-100 my-2"></div>

            {/* New Password Section */}
            <div className="space-y-6">
                <PasswordField
                  label="New Password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  placeholder="Enter new password"
                  show={showNew}
                  setShow={setShowNew}
                />

                {/* Password Strength Indicators (FUNCTIONAL) */}
                <div className="bg-slate-50 p-5 rounded-xl border border-slate-100 transition-all">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <ShieldCheck size={14} /> Password Requirements
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6">
                        <RequirementItem text="At least 8 characters" met={validation.length} />
                        <RequirementItem text="1 uppercase letter" met={validation.uppercase} />
                        <RequirementItem text="1 number" met={validation.number} />
                        <RequirementItem text="1 symbol (!@#$)" met={validation.symbol} />
                    </div>
                </div>

                <PasswordField
                  label="Confirm New Password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter new password"
                  show={showConfirm}
                  setShow={setShowConfirm}
                />
                
                {/* Match Confirmation */}
                {formData.confirmPassword && (
                    <div className={`text-xs font-medium flex items-center gap-1.5 ${validation.match ? "text-emerald-600" : "text-rose-500"}`}>
                        {validation.match ? <Check size={14} /> : <XIcon size={14} />}
                        {validation.match ? "Passwords match" : "Passwords do not match"}
                    </div>
                )}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="px-8 py-5 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
            <button
              onClick={() => window.history.back()}
              className="px-5 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-white rounded-lg transition-all border border-transparent hover:border-slate-200"
            >
              Cancel
            </button>
            <button 
                disabled={!isFormValid}
                className="flex items-center gap-2 px-6 py-2.5 bg-[#002B50] text-white text-sm font-bold rounded-lg hover:bg-[#1f781a] shadow-sm hover:shadow-md transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              Update Password
            </button>
          </div>

        </div>
      </div>
    </Layout>
  );
}

// --- Helper Components ---

function RequirementItem({ text, met }) {
    return (
        <div className={`flex items-center gap-2 text-xs font-medium transition-colors duration-300 ${met ? 'text-emerald-700' : 'text-slate-400'}`}>
            <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors duration-300 ${met ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200 text-slate-400'}`}>
                {met && <Check size={12} strokeWidth={3} />}
            </div>
            {text}
        </div>
    )
}

function PasswordField({ label, name, value, onChange, show, setShow, placeholder }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-semibold text-slate-700">
        {label}
      </label>
      <div className="relative group">
        <input
          type={show ? "text" : "password"}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-sm outline-none transition-all focus:border-[#002B50] focus:ring-4 focus:ring-[#002B50]/10 placeholder:text-slate-400 text-slate-800"
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 hover:text-[#002B50] transition-colors focus:outline-none"
        >
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  );
}