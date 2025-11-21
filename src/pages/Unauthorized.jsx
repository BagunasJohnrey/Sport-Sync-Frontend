import { useNavigate } from "react-router-dom";
import { AlertCircle } from "lucide-react";
import logo from "../assets/logo.png";

export default function Unauthorized() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-navyBlue p-6">
      <div className="bg-softWhite rounded-xl shadow-lg p-10 flex flex-col items-center text-center max-w-md">
        <img src={logo} alt="Logo" className="w-28 h-auto mb-6" />
        <AlertCircle size={48} className="text-crimsonRed mb-4" />
        <h1 className="text-2xl font-heading font-bold text-deepBlue mb-2">
          Unauthorized Access
        </h1>
        <p className="text-slateGray mb-6">
          You do not have permission to view this page. Please contact your administrator if you believe this is an error.
        </p>
        <button
          onClick={() => navigate("/dashboard")}
          className="bg-deepBlue text-softWhite py-2 px-6 rounded-lg font-semibold hover:bg-navyBlue transition"
        >
          Go Back
        </button>
      </div>
    </div>
  );
}
