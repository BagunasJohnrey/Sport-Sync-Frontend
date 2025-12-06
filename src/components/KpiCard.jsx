export default function KpiCard({ bgColor, title, icon, value, description }) {
  // Check if bgColor is a hex code (e.g. #002B50) to apply modern opacity tint.
  // If not, fallback to solid background.
  const isHex = bgColor && bgColor.startsWith('#');
  
  const iconStyle = isHex 
    ? { backgroundColor: `${bgColor}15`, color: bgColor } // ~8% Opacity Tint
    : { backgroundColor: bgColor, color: 'white' };       // Solid Fallback

  return (
    <div className="group relative p-6 bg-white rounded-2xl border border-slate-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col h-full justify-between overflow-hidden">
      
      {/* Top Section: Title & Icon */}
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-slate-500 text-sm font-semibold tracking-tight leading-relaxed max-w-[75%]">
          {title}
        </h3>

        {/* Icon Wrapper */}
        <div
          className="flex items-center justify-center w-10 h-10 rounded-full shadow-sm transition-transform duration-300 group-hover:scale-110 shrink-0"
          style={iconStyle}
        >
          <div className="text-lg">
            {icon}
          </div>
        </div>
      </div>

      {/* Bottom Section: Value & Description */}
      <div className="mt-auto space-y-1">
        <div className="text-3xl font-bold text-slate-800 tracking-tight">
          {value}
        </div>
        
        {description && (
          <p className="text-xs lg:text-sm font-medium text-slate-500 flex items-center gap-1">
            {description}
          </p>
        )}
      </div>

    </div>
  );
}