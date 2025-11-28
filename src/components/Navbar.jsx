import { useAuth } from "../context/AuthContext";
import { useState, useRef, useEffect } from "react";
import { Bell, Menu } from "lucide-react";
import NotificationPanel from "./Notification"; 

export default function Navbar({ setOpenSidebar }) {
  const { user } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [visible, setVisible] = useState(true);
  const lastScroll = useRef(0);
  const panelRef = useRef(null);

  // Detect scroll direction
  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      setVisible(currentScroll < lastScroll.current); // show on scroll up
      lastScroll.current = currentScroll;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close notifications when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  return (
    <header
  className={`
    transition-transform duration-300
    ${visible ? "translate-y-0" : "-translate-y-full"}
    bg-softWhite shadow flex justify-between items-center p-4
    lg:rounded-lg lg:max-w-[calc(100%-2rem)] lg:mx-5
    ${window.innerWidth < 1024 ? "fixed top-0 left-0 w-full z-40" : "relative z-50"}
  `}
>
  {/* Left / hamburger */}
  <div className="flex items-center gap-3">
    <button
      onClick={() => setOpenSidebar(true)}
      className="lg:hidden p-2 rounded hover:bg-gray-100"
    >
      <Menu size={24} />
    </button>
    <h2 className="text-lg font-semibold pl-2">
      {user ? `Welcome, ${user.full_name}` : "Welcome"}
    </h2>
  </div>

  {/* Right side: notifications */}
  <div className="flex items-center gap-4 relative">
    <button
      className="p-2 rounded hover:bg-lightBlue/20"
      onClick={() => setShowNotifications((s) => !s)}
      aria-expanded={showNotifications}
      aria-haspopup="true"
    >
      <Bell size={20} />
    </button>

    {showNotifications && (
      <div
        ref={panelRef}
        className="absolute top-full right-0 mt-2 w-80 z-50"
      >
        <NotificationPanel onClose={() => setShowNotifications(false)} />
      </div>
    )}
  </div>
</header>

  );
}
