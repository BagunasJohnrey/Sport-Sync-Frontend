import { useState, useEffect, useRef } from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { 
  format, 
  startOfWeek,
  endOfWeek,
} from "date-fns";

const options = ["Daily", "Weekly", "Monthly", "Yearly"];

export default function CalendarFilter({ activeFilter = "Daily", activeDate = new Date(), onChange }) {
  // UI State only (Open/Close)
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const containerRef = useRef(null);

  // Handle Filter Type Selection (Daily, Weekly, etc.)
  const handleFilterSelect = (filter) => {
    if (onChange) onChange(filter, activeDate);
  };

  // Handle Date Selection
  const handleDateChange = (newDate) => {
    if (onChange) onChange(activeFilter, newDate);
  };

  const handleNativeDateChange = (e) => {
    const newDate = new Date(e.target.value);
    if (!isNaN(newDate.getTime())) {
      handleDateChange(newDate);
    }
  };

  // Get Label for Main Button based on PROPS
  const getLabel = () => {
    if (!activeDate) return "";
    
    switch (activeFilter) {
      case "Daily":
        return format(activeDate, "MMM dd, yyyy");
      case "Weekly":
        const start = startOfWeek(activeDate, { weekStartsOn: 1 });
        const end = endOfWeek(activeDate, { weekStartsOn: 1 });
        return `${format(start, "MMM dd")} - ${format(end, "MMM dd, yyyy")}`;
      case "Monthly":
        return format(activeDate, "MMMM yyyy");
      case "Yearly":
        return format(activeDate, "yyyy");
      default:
        return format(activeDate, "MMM dd, yyyy");
    }
  };

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsPickerOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative flex items-center gap-2" ref={containerRef}>
      {/* Main Display / Toggle */}
      <div className="relative">
        <button
          onClick={() => setIsPickerOpen(!isPickerOpen)}
          className="flex items-center gap-3 px-4 py-2 bg-white border border-slate-200 rounded-lg hover:border-navyBlue/30 transition-all shadow-sm min-w-[150px] text-sm justify-between"
        >
          <div className="flex items-center gap-2 text-slate-700 font-medium">
            <CalendarIcon size={18} className="text-navyBlue" />
            <span>{getLabel()}</span>
          </div>
        </button>

        {/* Dropdown Panel */}
        {isPickerOpen && (
          <div className="absolute top-full right-0 mt-2 w-72 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
            
            {/* Filter Type Selector */}
            <div className="p-3 bg-slate-50 border-b border-slate-100 grid grid-cols-2 gap-2">
              {options.map((option) => (
                <button
                  key={option}
                  onClick={() => handleFilterSelect(option)}
                  className={`
                    px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-200 border
                    ${activeFilter === option
                      ? "bg-navyBlue text-white border-navyBlue shadow-md"
                      : "bg-white text-slate-600 border-slate-200 hover:border-navyBlue/30 hover:bg-slate-50"
                    }
                  `}
                >
                  {option}
                </button>
              ))}
            </div>

            {/* Date Selection Content */}
            <div className="p-4">
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
                Jump to Date
              </label>
              <input
                type="date"
                // Safe format ensuring date exists
                value={activeDate ? format(activeDate, "yyyy-MM-dd") : ""}
                onChange={handleNativeDateChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navyBlue/20 focus:border-navyBlue transition-all"
              />
              <p className="text-xs text-slate-400 mt-2 text-center">
                Select a reference date for {activeFilter.toLowerCase()} view.
              </p>
            </div>

            {/* Footer Action */}
            <div className="p-3 border-t border-slate-100 bg-slate-50">
              <button
                onClick={() => {
                  const today = new Date();
                  handleDateChange(today);
                  setIsPickerOpen(false);
                }}
                className="w-full py-2 text-sm font-semibold text-navyBlue hover:bg-white border border-transparent hover:border-slate-200 rounded-lg transition-all"
              >
                Go to Today
              </button>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}