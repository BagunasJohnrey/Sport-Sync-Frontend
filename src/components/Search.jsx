import { useState } from "react";
import { Search, X } from "lucide-react";

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState("");

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
  };

  const clearSearch = () => {
    setQuery("");
    onSearch("");
  };

  return (
    <div className="w-full max-w-md relative">
      <div className="
        flex items-center w-full
        bg-softWhite border border-gray-300
        rounded-full px-4 py-2 shadow-sm
        focus-within:border-navyBlue focus-within:ring-2 focus-within:ring-blue-100
      ">
         
        <Search size={18} className="text-navyBlue mr-2" />

        <input
          type="text"
          placeholder="Search products..."
          className="flex-1 bg-transparent outline-none text-sm"
          value={query}
          onChange={handleChange}
        />

        {query.length > 0 && (
          <button onClick={clearSearch}>
            <X size={18} className="text-navyBlue hover:text-deepBlue" />
          </button>
        )}
      </div>
    </div>
  );
}
