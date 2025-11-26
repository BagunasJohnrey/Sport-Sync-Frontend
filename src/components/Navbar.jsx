import { useAuth } from "../context/AuthContext";
import { Bell, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Notification from "./Notification";

export default function Navbar({ setOpenSidebar }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  

  return (
    <header className="bg-softWhite lg:rounded-lg shadow flex justify-between items-center p-4">

      {/* Hamburger for mobile */}
<button
  onClick={() => setOpenSidebar(true)}
  className="lg:hidden p-2 rounded hover:bg-gray-100"
>
  <Menu size={24} />
</button> 
      <h2 className="text-lg font-semibold pl-2">Welcome, {user?.full_name}</h2>

      <div className="flex items-center gap-4">
        
        {/* User Info */}
        <button
          onClick={() => navigate("/profile")}
          className="flex items-center gap-2 px-3 py-1 border border-gray-200 rounded-full hover:bg-gray-100 transition"
        >
          <span className="text-sm font-medium text-gray-800">{user.full_name}</span>
        </button>

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
        
        
      </div>
    </header>
  );
}
