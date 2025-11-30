import { useState, useRef, useEffect } from "react";
import DatePicker from "react-datepicker";
import { Calendar, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import "react-datepicker/dist/react-datepicker.css";
import { 
  format, 
  startOfWeek, 
  endOfWeek, 
  isSameDay, 
  isWithinInterval,
  addWeeks,
  subWeeks,
  addMonths,
  subMonths,
  addYears,
  subYears
} from "date-fns";

const options = ["Day", "Week", "Month", "Year"];

export default function CalendarFilter({ onChange }) {
  const [selectedFilter, setSelectedFilter] = useState("Day");
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getDisplayText = () => {
    switch (selectedFilter) {
      case "Day":
        return format(selectedDate, "MMM dd, yyyy");
      case "Week":
        return `${format(startOfWeek(selectedDate), "MMM dd")} - ${format(endOfWeek(selectedDate), "MMM dd, yyyy")}`;
      case "Month":
        return format(selectedDate, "MMMM yyyy");
      case "Year":
        return format(selectedDate, "yyyy");
      default:
        return "";
    }
  };

  const handleSelectFilter = (filter) => {
    setSelectedFilter(filter);
    if (onChange) onChange(filter, selectedDate);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    if (onChange) onChange(selectedFilter, date);
  };

  const navigateDate = (direction) => {
    let newDate;
    
    switch (selectedFilter) {
      case "Day":
        newDate = direction === "next" 
          ? new Date(selectedDate.setDate(selectedDate.getDate() + 1))
          : new Date(selectedDate.setDate(selectedDate.getDate() - 1));
        break;
      case "Week":
        newDate = direction === "next" 
          ? addWeeks(selectedDate, 1)
          : subWeeks(selectedDate, 1);
        break;
      case "Month":
        newDate = direction === "next" 
          ? addMonths(selectedDate, 1)
          : subMonths(selectedDate, 1);
        break;
      case "Year":
        newDate = direction === "next" 
          ? addYears(selectedDate, 1)
          : subYears(selectedDate, 1);
        break;
      default:
        newDate = selectedDate;
    }
    
    setSelectedDate(newDate);
    if (onChange) onChange(selectedFilter, newDate);
  };

  // Custom day class for week highlighting
  const getDayClassName = (date) => {
    const baseClasses = "rounded-md transition-colors duration-200";
    
    if (selectedFilter === "Week") {
      const weekStart = startOfWeek(selectedDate);
      const weekEnd = endOfWeek(selectedDate);
      
      if (isWithinInterval(date, { start: weekStart, end: weekEnd })) {
        if (isSameDay(date, selectedDate)) {
          return `${baseClasses} bg-blue-600 text-white font-semibold`;
        }
        return `${baseClasses} bg-blue-100 text-blue-800 font-medium`;
      }
    }
    
    if (isSameDay(date, selectedDate)) {
      return `${baseClasses} bg-blue-500 text-white font-semibold`;
    }
    
    return `${baseClasses} hover:bg-gray-100`;
  };

  // Custom header for better navigation
  const CustomHeader = ({ date, decreaseMonth, increaseMonth, prevMonthButtonDisabled, nextMonthButtonDisabled }) => (
    <div className="flex items-center justify-between px-3 py-3 bg-white border-b border-gray-200 rounded-t-lg">
      <button
        onClick={decreaseMonth}
        disabled={prevMonthButtonDisabled}
        className="p-2 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronLeft size={16} className="text-gray-700" />
      </button>
      
      <span className="text-lg font-semibold text-gray-800 px-4 py-1 rounded-md bg-gray-50">
        {format(date, "MMMM yyyy")}
      </span>
      
      <button
        onClick={increaseMonth}
        disabled={nextMonthButtonDisabled}
        className="p-2 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronRight size={16} className="text-gray-700" />
      </button>
    </div>
  );

  return (
    <div className="relative w-72" ref={dropdownRef}>
      {/* Main Button with Navigation */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => navigateDate("prev")}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors border border-gray-300"
        >
          <ChevronLeft size={16} />
        </button>
        
        <button
          onClick={() => setOpen(!open)}
          className="flex-1 flex items-center justify-between px-4 py-3 bg-white border border-gray-300 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <div className="flex items-center gap-3">
            <Calendar size={18} className="text-gray-500" />
            <span className="text-gray-800 font-semibold">{getDisplayText()}</span>
          </div>
          <ChevronDown 
            size={18} 
            className={`text-gray-500 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          />
        </button>

        <button
          onClick={() => navigateDate("next")}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors border border-gray-300"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-50 mt-3 w-full bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden">
          {/* Filter Options */}
          <div className="p-2 border-b border-gray-100">
            <div className="grid grid-cols-2 gap-1">
              {options.map((option) => (
                <button
                  key={option}
                  onClick={() => handleSelectFilter(option)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    selectedFilter === option 
                      ? "bg-blue-500 text-white shadow-sm" 
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* Calendar */}
          <div className="p-3">
            <DatePicker
              selected={selectedDate}
              onChange={handleDateChange}
              inline
              calendarClassName="!border-0 !shadow-none"
              dayClassName={getDayClassName}
              renderCustomHeader={CustomHeader}
              showPopperArrow={false}
              calendarStartDay={1} // Start week on Monday
            />
          </div>

          {/* Quick Actions */}
          <div className="p-3 border-t border-gray-100 bg-gray-50">
            <button
              onClick={() => {
                const today = new Date();
                setSelectedDate(today);
                if (onChange) onChange(selectedFilter, today);
              }}
              className="w-full py-2 px-3 text-sm font-medium text-blue-600 bg-white border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
            >
              Go to Today
            </button>
          </div>
        </div>
      )}
    </div>
  );
}