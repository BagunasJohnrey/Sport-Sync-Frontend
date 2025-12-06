import React, { useState, useEffect } from "react";
import { Search, Filter as FilterIcon, X } from "lucide-react";

export default function Filter({
  searchQuery,
  onSearchChange,
  searchPlaceholder = "Search...",
  filters = [],
  onClear,
  showClearButton,
  resultsCount,
  debounceTime = 500
}) {
  // Local state for immediate UI feedback
  const [localQuery, setLocalQuery] = useState(searchQuery || "");

  // Sync with parent prop if it changes externally (e.g. clear button)
  useEffect(() => {
    setLocalQuery(searchQuery || "");
  }, [searchQuery]);

  // Debounce logic
  useEffect(() => {
    const handler = setTimeout(() => {
      if (onSearchChange) {
        onSearchChange(localQuery);
      }
    }, debounceTime);

    return () => {
      clearTimeout(handler);
    };
  }, [localQuery, debounceTime]); // Removed onSearchChange from dep array to avoid loops if parent recreates it

  const handleChange = (e) => {
    setLocalQuery(e.target.value);
  };

  const handleClear = () => {
    setLocalQuery("");
    if (onClear) onClear();
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <FilterIcon size={20} className="text-slate-500" />
        <h2 className="text-lg font-bold text-navyBlue">Filters</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5">
        <div className="relative md:col-span-2">
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={localQuery}
            onChange={handleChange}
            className="w-full pl-10 pr-5 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navyBlue/20 focus:border-navyBlue transition-all text-sm"
          />
        </div>

        {filters.map((filter, index) => (
          <div key={index}>
            <select
              value={filter.value}
              onChange={filter.onChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navyBlue/20 focus:border-navyBlue bg-white text-sm text-slate-700 cursor-pointer"
            >
              {filter.options.map((option) => (
                <option key={option.value} value={option.value}> 
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>

      {(showClearButton || resultsCount) && (
        <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100">
          {resultsCount && <p className="text-xs text-slate-500 font-medium">{resultsCount}</p>}
          
          {showClearButton && (
            <button onClick={handleClear} className="text-xs flex items-center gap-1 text-navyBlue hover:text-red-600 font-semibold transition-colors">
              <X size={14} /> Clear All Filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}