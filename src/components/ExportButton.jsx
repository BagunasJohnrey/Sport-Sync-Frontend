import { useState, useRef } from "react";
import { Download, FileText, File } from "lucide-react";

export default function ExportButton({ className = "", onSelect = () => {} }) {
  const [open, setOpen] = useState(false);
  const btnRef = useRef(null);

  return (
    <div className={`relative inline-block ${className}`} onBlur={(e) => {
      if (!e.currentTarget.contains(e.relatedTarget)) setOpen(false);
    }}>
      <button
        ref={btnRef}
        type="button"
        onClick={() => setOpen((s) => !s)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 shadow-sm rounded-md hover:shadow-md  transition"
      >
        <Download size={16} />
        <span className="text-sm font-medium">Export</span>
        <svg
          className={`w-4 h-4 transform transition-transform ${open ? "rotate-180" : ""}`}
          viewBox="0 0 20 20"
          fill="none"
          aria-hidden="true"
        >
          <path d="M6 8l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <div
          role="menu"
          aria-label="Export options"
          className="absolute right-0 mt-2 w-65 bg-white border border-gray-200 shadow-sm rounded-lg overflow-hidden z-50"
        >
          <div className="py-1">
            <button
              role="menuitem"
              onClick={() => { setOpen(false); onSelect("pdf"); }}
              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
            >
              <FileText size={16} />
              <div className="flex-1 text-left">
                <div className="font-medium">Export as PDF</div>
                <div className="text-xs text-gray-500">High-quality printable PDF</div>
              </div>
              <span className="text-xs text-gray-400">.pdf</span>
            </button>

            <button
              role="menuitem"
              onClick={() => { setOpen(false); onSelect("csv"); }}
              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
            >
              <File size={16} />
              <div className="flex-1 text-left">
                <div className="font-medium">Export as CSV</div>
                <div className="text-xs text-gray-500">Spreadsheet-ready data</div>
              </div>
              <span className="text-xs text-gray-400">.csv</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
