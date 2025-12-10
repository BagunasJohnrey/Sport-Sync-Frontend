import { useAuth } from "../context/AuthContext";
import { useState, useRef, useEffect } from "react";
import { Menu } from "lucide-react";
import Notification from "./Notification"; // Updated Import

export default function Navbar({ setOpenSidebar }) {
  const { user } = useAuth();
  const [visible, setVisible] = useState(true);
  const lastScroll = useRef(0);

  // Detect scroll direction
  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      setVisible(currentScroll < lastScroll.current || currentScroll < 10); 
      lastScroll.current = currentScroll;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
    className={`
      transition-transform duration-300
      ${visible ? "translate-y-0" : "-translate-y-full"}
      bg-softWhite shadow-sm border-b border-slate-100 flex justify-between items-center p-4
      
      /* Base Mobile Styles (Fixed positioning) */
      fixed top-0 left-0 w-full z-40
      
      /* Desktop Styles (Sticky positioning, resetting mobile constraints) */
      lg:sticky lg:top-4 lg:z-30 lg:rounded-xl lg:max-w-[calc(100%-2rem)] lg:mx-5
    `}
  >
      {/* Left / hamburger */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setOpenSidebar(true)}
          className="lg:hidden p-2 rounded-lg hover:bg-slate-100 text-slate-600"
        >
          <Menu size={24} />
        </button>
        <div>
            <h2 className="text-lg font-bold text-navyBlue leading-tight">
            {user ? `Welcome back, ${user.full_name.split(' ')[0]}` : "Welcome"}
            </h2>
        </div>
      </div>

      {/* Right side: notifications */}
      <div className="flex items-center gap-4"> 
        {/* User Avatar */}
        <div className="w-8 h-8 rounded-full bg-navyBlue text-white flex items-center justify-center text-sm font-bold shadow-sm ring-2 ring-slate-100">
            {user?.full_name?.charAt(0) || 'U'}
        </div>

        <Notification /> 
      </div>
    </header>
  );
}