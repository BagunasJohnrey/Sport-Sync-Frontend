import React from 'react'
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.png"; 
import {
  Home, ShoppingCart, Archive, BarChart2, Users, Settings, LogOut
} from "lucide-react";

export default function Sidebar() {
  const { user } = useAuth();

  const menuItems = [
    { title: "Dashboard", path: "/dashboard", roles: ["Admin","Staff","Cashier"], icon: <Home size={18} stroke="#FAFAFA" /> },
    { title: "Point of Sale", path: "/point-of-sale", roles: ["Admin","Staff","Cashier"], icon: <ShoppingCart size={18} stroke="#FAFAFA" /> },
    { title: "Inventory", path: "/inventory", roles: ["Admin","Staff","Cashier"], icon: <Archive size={18} stroke="#FAFAFA" /> },
    { title: "Reports", path: "/reports", roles: ["Admin"], icon: <BarChart2 size={18} stroke="#FAFAFA" /> },
    { title: "Users", path: "/users", roles: ["Admin"], icon: <Users size={18} stroke="#FAFAFA" /> },
    { title: "Settings", path: "/settings", roles: ["Admin"], icon: <Settings size={18} stroke="#FAFAFA" /> },
  ];

  return (
    <aside className="w-64 bg-navyBlue text-softWhite flex flex-col justify-between m-3 p-5 rounded-2xl">
      <div>
        <div className="mb-10 flex items-center justify-center">
          <img src={logo} alt="Logo" className="w-25 h-auto object-contain" />
        </div>

        <nav className="flex flex-col gap-3 ">
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
      </div>
    </aside>
  );
}
