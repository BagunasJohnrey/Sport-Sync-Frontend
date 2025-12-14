import React, { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.png";
import {
  Home, ShoppingCart, Archive, BarChart2, Users, Settings, LogOut, ChevronLeft, ChevronRight, AlertCircle
} from "lucide-react";
import API from "../services/api";

export default function Sidebar({ onToggle }) {
  const isFirstRender = useRef(true);
  const [isCollapsed, setIsCollapsed] = useState(window.innerWidth >= 1024 ? true : false);
  const [showLogoutModal, setShowLogoutModal] = useState(false); // New state for modal
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation(); 
  

  const menuItems = [
    { title: "Dashboard", path: "/dashboard", roles: ["Admin","Staff","Cashier"], icon: <Home size={20} /> },
    { title: "Point of Sale", path: "/point-of-sale", roles: ["Admin","Cashier"], icon: <ShoppingCart size={20} /> },
    { title: "Inventory", path: "/inventory", roles: ["Admin","Staff","Cashier"], icon: <Archive size={20} /> },
    { title: "Reports", path: "/reports", roles: ["Admin"], icon: <BarChart2 size={20} /> },
    { title: "Users", path: "/users", roles: ["Admin"], icon: <Users size={20} /> },
    { title: "Settings", path: "/settings", roles: ["Admin"], icon: <Settings size={20} /> },
  ];

  const handleLogout = async () => {
    try {
      await API.get('/auth/logout'); 
    } catch (error) {
      console.error("Logout failed on server:", error);
    } finally {
      logout();
      navigate("/login");
      setShowLogoutModal(false); // Close modal after logout
    }
  };

  const toggleSidebar = () => {
    setIsCollapsed(prev => !prev);
    onToggle && onToggle(!isCollapsed);
  };

  const filteredMenuItems = menuItems.filter(item => item.roles.includes(user?.role));

  
  useEffect(() => {
  if (isFirstRender.current) {
    isFirstRender.current = false;
    return;
  }
  if (window.innerWidth >= 1024) {
    setIsCollapsed(true);
  }
}, [location.pathname]);


  return (
    <>
      <aside
        className={`
          fixed top-0 left-0 h-screen bg-linear-to-b from-navyBlue to-navyBlue/95 text-softWhite 
          flex flex-col justify-between transition-all duration-300 ease-in-out z-50
          w-64
          lg:mt-5 lg:ml-5 lg:h-[calc(100vh-2rem)] lg:rounded-2xl
          ${isCollapsed ? "lg:w-20" : "lg:w-64"}
        `}
      >
        {/* Header */}
        <div className={`flex items-center p-4 border-b border-lightBlue/30 justify-between lg:${isCollapsed ? "justify-center" : "justify-between"}`}>
          <img src={logo} alt="Logo" className={`h-20 w-auto object-contain transition-opacity duration-300 block ${isCollapsed ? "lg:hidden" : "lg:block"}`} />
          <button onClick={toggleSidebar} className="hidden lg:flex p-2 rounded-lg bg-lightBlue/20 hover:bg-lightBlue/30 transition-all duration-200 hover:scale-105">
            {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        {/* Menu */}
        <nav className="flex-1 flex flex-col space-y-2 p-4">
          {filteredMenuItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `
                flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group relative justify-start
                ${isActive ? "bg-softWhite text-navyBlue font-semibold shadow-lg" : "text-softWhite hover:bg-lightBlue/30 hover:shadow-md"}
                ${isCollapsed ? "lg:justify-center" : "lg:justify-start"}
              `}
            >
              {React.cloneElement(item.icon, { stroke: "currentColor", className: "flex-shrink-0" })}
              <span className={`font-medium transition-opacity duration-200 block ${isCollapsed ? "lg:hidden" : "lg:block"}`}>
                {item.title}
              </span>
              {isCollapsed && <div className="hidden lg:block absolute left-full ml-5 px-2 py-1 bg-darkGreen text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">{item.title}</div>}
            </NavLink>
          ))}
        </nav>

        {/* User info & logout */}
        <div className={`p-4 border-t border-lightBlue/30 lg:${isCollapsed ? "text-center" : ""}`}>
          {user && (
            <div
                onClick={() => navigate("/profile")}
                className={`
                mb-4 p-3 bg-lightBlue/20 rounded-lg cursor-pointer
                hover:bg-lightBlue/30 transition
                block lg:${isCollapsed ? "hidden" : "block"}
                `}
            >
                <p className="font-semibold text-sm truncate">{user.full_name}</p>
                <p className="text-xs text-softWhite/70 capitalize">{user.role}</p>
            </div>
            )}

          <button 
            onClick={() => setShowLogoutModal(true)} 
            className={`flex items-center gap-3 w-full p-3 rounded-xl transition-all duration-200 font-medium justify-start lg:${isCollapsed ? "justify-center" : "justify-start"} hover:bg-darkGreen `}
          >
            <LogOut size={20} stroke="currentColor" className="shrink-0" />
            <span className={`block lg:${isCollapsed ? "hidden" : "block"}`}>Log Out</span>
            {isCollapsed && <div className="hidden lg:block absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">Log Out</div>}
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {!isCollapsed && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setIsCollapsed(true)} />}

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 text-center">
              <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Confirm Logout</h3>
              <p className="text-sm text-gray-500 mb-6">
                Are you sure you want to log out of your account?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 px-4 py-2.5 bg-red-600 text-white font-medium rounded-xl hover:bg-red-700 transition-colors shadow-sm"
                >
                  Log Out
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}