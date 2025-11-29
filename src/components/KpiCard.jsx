import React from 'react';

export default function KpiCard({ bgColor, title, icon, value, description }) {
  return (
    <div className="group relative p-6 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <div className="flex justify-between items-start">
        {/* Text Content */}
        <div className="flex flex-col gap-1">
          <h3 className="text-slate-700 text-sm font-medium uppercase tracking-wide">
            {title}
          </h3>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-bold text-slate-800 tracking-tight">
              {value}
            </span>
          </div>
          {description && (
            <span className="text-xs font-medium text-slate-500 mt-1 flex items-center gap-1">
              {description}
            </span>
          )}
        </div>

        {/* Icon Wrapper */}
        <div
          className="flex items-center justify-center w-12 h-12 rounded-xl text-white shadow-sm transition-transform group-hover:scale-110"
          style={{ backgroundColor: bgColor }}
        >
          <div className="text-xl">
            {icon}
          </div>
        </div>
      </div>
    </div>
  );
}