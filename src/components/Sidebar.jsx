import React from 'react'
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.png"; 
import {
  Home, ShoppingCart, Archive, BarChart2, Users, Settings, LogOut
} from "lucide-react";

export default function Sidebar() {

  const { user, logout } = useAuth();

  const menuItems = [
    { title: "Dashboard", path: "/dashboard", roles: ["Admin","Staff","Cashier"], icon: <Home size={18} stroke="#FAFAFA" /> },
    { title: "Point of Sale", path: "/point-of-sale", roles: ["Admin","Staff","Cashier"], icon: <ShoppingCart size={18} stroke="#FAFAFA" /> },
    { title: "Inventory", path: "/inventory", roles: ["Admin","Staff","Cashier"], icon: <Archive size={18} stroke="#FAFAFA" /> },
    { title: "Reports", path: "/reports", roles: ["Admin"], icon: <BarChart2 size={18} stroke="#FAFAFA" /> },
    { title: "Users", path: "/users", roles: ["Admin"], icon: <Users size={18} stroke="#FAFAFA" /> },
    { title: "Settings", path: "/settings", roles: ["Admin"], icon: <Settings size={18} stroke="#FAFAFA" /> },
  ];

  const handleLogout = () => {
    logout(); 
    navigate("/login"); 
  };

  return (
    <aside className="fixed lg:mt-5 lg:ml-5 top-0 left-0  w-64 h-[calc(100vh-2rem)] bg-navyBlue text-softWhite flex flex-col justify-between p-5 lg:rounded-2xl">
      <div className='flex flex-col h-full'>
        <div className="mb-10 flex items-center justify-center">
          <img src={logo} alt="Logo" className="w-25 h-auto object-contain" />
        </div>

        <nav className="flex-1 flex-col space-y-3">
          {menuItems
            .filter(item => item.roles.includes(user?.role))
            .map(item => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-2 p-2 rounded-lg transition-colors duration-200 ${
                    isActive
                      ? "bg-softWhite text-navyBlue font-semibold"
                      : "text-softWhite hover:bg-lightBlue/30 hover:text-softWhite"
                  }`
                }
              >
                {React.cloneElement(item.icon, { stroke: "currentColor" })}
                {item.title}
              </NavLink>

            ))}
        </nav>

<div>
  <button className="flex items-center gap-2 w-full text-white font-semibold p-2 rounded-lg hover:bg-darkGreen">
  <LogOut size={18}/>
  Log Out
</button>
</div>
        
      </div>
    </aside>
  );
}
