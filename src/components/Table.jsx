import { useState } from "react";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

export default function Table({ tableName, columns = [], data = [], rowsPerPage = 10 }) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(data.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentData = data.slice(startIndex, startIndex + rowsPerPage);

  const goNext = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const goPrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const goFirst = () => setCurrentPage(1);
  const goLast = () => setCurrentPage(totalPages);
  
  const handlePageInput = (e) => {
    const page = Number(e.target.value);
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="w-full bg-softWhite rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
      
      {/* --- Table Header Section --- */}
      {tableName && (
        <div className="px-6 py-4 border-b border-slate-100 bg-white">
          <h3 className="title">
            {tableName}
          </h3>
        </div>
      )}

      {/* --- Scrollable Wrapper --- */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  scope="col"
                  className="px-6 py-3 text-xs font-semibold text-slate-800 uppercase tracking-wider whitespace-nowrap"
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {currentData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-8 text-center text-slate-400 italic"
                >
                  No data available
                </td>
              </tr>
            ) : (
              currentData.map((row, idx) => (
                <tr 
                    key={idx} 
                    className="hover:bg-slate-50 transition-colors duration-150 group"
                >
                  {columns.map((col, i) => (
                    <td 
                        key={i} 
                        className="px-6 py-4 text-sm text-slate-700 whitespace-nowrap group-hover:text-navyBlue"
                    >
                      {/* Render custom component or raw value */}
                      {col.render ? col.render(row, idx) : row[col.accessor] || "-"}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* --- Pagination Footer --- */}
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50/50">
          
          {/* Info Text */}
          <span className="text-sm text-slate-500 font-medium">
            Showing {startIndex + 1} to {Math.min(startIndex + rowsPerPage, data.length)} of {data.length} entries
          </span>

          {/* Controls */}
          <div className="flex items-center gap-2">
            
            <button
              onClick={goFirst}
              disabled={currentPage === 1}
              className="p-2 rounded-lg text-slate-500 hover:bg-white hover:text-navyBlue hover:shadow-sm disabled:opacity-30 disabled:hover:bg-transparent transition-all"
              title="First Page"
            >
              <ChevronsLeft size={18} />
            </button>
            
            <button
              onClick={goPrev}
              disabled={currentPage === 1}
              className="p-2 rounded-lg text-slate-500 hover:bg-white hover:text-navyBlue hover:shadow-sm disabled:opacity-30 disabled:hover:bg-transparent transition-all"
              title="Previous"
            >
              <ChevronLeft size={18} />
            </button>

            {/* Page Input */}
            <div className="flex items-center gap-2 mx-2">
              <span className="text-sm text-slate-600">Page</span>
              <input
                type="number"
                min={1}
                max={totalPages}
                value={currentPage}
                onChange={handlePageInput}
                className="w-12 h-8 text-center text-sm border border-slate-300 rounded-md focus:ring-2 focus:ring-darkGreen/20 focus:border-darkGreen transition-all outline-none"
              />
              <span className="text-sm text-slate-600">of {totalPages}</span>
            </div>

            <button
              onClick={goNext}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg text-slate-500 hover:bg-white hover:text-navyBlue hover:shadow-sm disabled:opacity-30 disabled:hover:bg-transparent transition-all"
              title="Next"
            >
              <ChevronRight size={18} />
            </button>

            <button
              onClick={goLast}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg text-slate-500 hover:bg-white hover:text-navyBlue hover:shadow-sm disabled:opacity-30 disabled:hover:bg-transparent transition-all"
              title="Last Page"
            >
              <ChevronsRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}


