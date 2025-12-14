import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import LogoutModal from './LogoutModal'; // Imported new component
import { useAuth } from "../context/AuthContext";
import API from "../services/api";

export default function Layout({ children }) {
  const [openSidebar, setOpenSidebar] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(window.innerWidth >= 1024 ? true : false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleSidebarToggle = (collapsed) => {
    setIsSidebarCollapsed(collapsed);
  };

  const handleConfirmLogout = async () => {
    try {
      await API.get('/auth/logout'); 
    } catch (error) {
      console.error("Logout failed on server:", error);
    } finally {
      logout();
      navigate("/login");
      setShowLogoutModal(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-offWhite lg:p-5 lg:gap-5">

      <div 
        className={`
          hidden lg:block shrink-0 transition-all duration-300 ease-in-out
          ${isSidebarCollapsed ? "w-20" : "w-64"}
        `}
      >
        <Sidebar 
            onToggle={handleSidebarToggle} 
            onLogoutRequest={() => setShowLogoutModal(true)} 
        />
      </div>

      {/* Mobile Overlay + Drawer */}
      <div
        className={`fixed inset-0 lg:hidden z-50 ${
          openSidebar ? "pointer-events-auto" : "pointer-events-none"
        }`}
        aria-hidden={!openSidebar}
      >
        <div
          onClick={() => setOpenSidebar(false)}
          className={`absolute inset-0 transition-colors duration-300 ease-in-out ${
            openSidebar ? "bg-black/20 opacity-100" : "bg-transparent opacity-0"
          }`}
        />
        <div
          className={`fixed top-0 left-0 w-64 h-full bg-navyBlue z-60 transform transition-transform duration-350 ease-[cubic-bezier(.25,.46,.45,.94)] rounded-r-2xl shadow-xl
            ${openSidebar ? "translate-x-0" : "-translate-x-full"}`}
          onClick={(e) => e.stopPropagation()}
        >
          <Sidebar 
            onToggle={setIsSidebarCollapsed} 
            onLogoutRequest={() => {
                setOpenSidebar(false); // Close mobile sidebar first
                setShowLogoutModal(true);
            }} 
          />
        </div>
      </div>

      <div className="flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out">
        <Navbar setOpenSidebar={setOpenSidebar} />
        <main className="flex-1 p-6 overflow-auto pt-25 md:pt-10 xl:pt-6">
          {children}
        </main>
      </div>

      {/* Logout Modal Component */}
      <LogoutModal 
        isOpen={showLogoutModal} 
        onClose={() => setShowLogoutModal(false)} 
        onConfirm={handleConfirmLogout} 
      />

    </div>
  );
}