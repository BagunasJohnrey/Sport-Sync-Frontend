import React, { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.png";
import {
  Home, ShoppingCart, Archive, BarChart2, Users, Settings, LogOut, ChevronLeft, ChevronRight
} from "lucide-react";

export default function Sidebar({ onToggle }) {
  const isFirstRender = useRef(true);
  const [isCollapsed, setIsCollapsed] = useState(window.innerWidth >= 1024 ? true : false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation(); 
  

  const menuItems = [
    { title: "Dashboard", path: "/dashboard", roles: ["Admin","Staff","Cashier"], icon: <Home size={20} /> },
    { title: "Point of Sale", path: "/point-of-sale", roles: ["Admin","Staff","Cashier"], icon: <ShoppingCart size={20} /> },
    { title: "Inventory", path: "/inventory", roles: ["Admin","Staff","Cashier"], icon: <Archive size={20} /> },
    { title: "Reports", path: "/reports", roles: ["Admin"], icon: <BarChart2 size={20} /> },
    { title: "Users", path: "/users", roles: ["Admin"], icon: <Users size={20} /> },
    { title: "Settings", path: "/settings", roles: ["Admin"], icon: <Settings size={20} /> },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
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
            <div className={`mb-4 p-3 bg-lightBlue/20 rounded-lg block lg:${isCollapsed ? "hidden" : "block"}`}>
              <p className="font-semibold text-sm truncate">{user.full_name}</p>
              <p className="text-xs text-softWhite/70 capitalize">{user.role}</p>
            </div>
          )}
          <button onClick={handleLogout} className={`flex items-center gap-3 w-full p-3 rounded-xl transition-all duration-200 font-medium justify-start lg:${isCollapsed ? "justify-center" : "justify-start"} hover:bg-darkGreen hover:text-red-200`}>
            <LogOut size={20} stroke="currentColor" className="shrink-0" />
            <span className={`block lg:${isCollapsed ? "hidden" : "block"}`}>Log Out</span>
            {isCollapsed && <div className="hidden lg:block absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">Log Out</div>}
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {!isCollapsed && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setIsCollapsed(true)} />}
    </>
  );
}
