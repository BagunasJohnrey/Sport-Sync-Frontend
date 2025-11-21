import { useAuth } from "../context/AuthContext";
import { Bell, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Notification from "./Notification";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = () => {
    logout(); 
    navigate("/login"); 
  };

  return (
    <header className="bg-softWhite rounded-lg mt-3 mr-3 shadow flex justify-between items-center p-4">

      <h2 className="text-lg font-semibold pl-2">Welcome, {user?.full_name}</h2>

      <div className="flex items-center gap-4">

        <div className="relative">
          <button
            className="p-2 rounded hover:bg-lightBlue/20"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell size={20} />
          </button>

          {/* Dropdown */}
          {showNotifications && (
          <div className="absolute top-0 right-0 p-3 w-64 bg-softWhite shadow-lg rounded z-50">
            <Notification />
          </div>
          )}

        </div>
        
        <button
          onClick={handleLogout}
          className="p-2 rounded hover:bg-crimsonRed/20 text-crimsonRed"
        >
          <LogOut size={20} />
        </button>
      </div>
    </header>
  );
}
