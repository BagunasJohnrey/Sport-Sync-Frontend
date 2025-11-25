export default function KpiCard({ bgColor, title, icon, value, description }) {
  return (
    <div
      className={`flex items-start justify-between gap-4 p-6 rounded-xl shadow-md text-navyBlue`}
      style={{ backgroundColor: bgColor }}
    >
      

      {/* Content */}
      <div className="flex flex-col space-y-3">
        <h3 className="text-sm">{title}</h3>
        <span className="text-2xl font-extrabold mt-5">{value}</span>
        {description && (
          <span className="text-xs opacity-80 flex items-center gap-1">
            {description}
          </span>
        )}
      </div>

      {/* Icon */}
      <div className="text-3xl">{icon}</div>
    </div>
  );
}
