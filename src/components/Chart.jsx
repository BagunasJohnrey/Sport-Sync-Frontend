import React, { useEffect, useState, useMemo } from "react";
import ReactApexChart from "react-apexcharts";

export default function Chart({
  type = "bar",
  series = [],
  categories = [],
  height = 350,
  title = "",
  filter = null, 
}) {
  const [mounted, setMounted] = useState(false);
  const [chartKey, setChartKey] = useState(0);

  const brandPalette = [
    "#002B50", "#1f781a", "#335573", "#4c9348", "#668096", "#79ae76"
  ];

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setChartKey((prev) => prev + 1);
  }, [type, series, categories]);

  // --- Data Validation & Sanitization ---
  const { validSeries, validCategories, hasData } = useMemo(() => {
    let vSeries = [];
    let vCategories = [];
    let hasDataCheck = false;

    try {
      if (Array.isArray(series)) {
        if (type === "donut" || type === "pie") {
          // For Pie/Donut: Ensure simple array of numbers
          vSeries = series.map(val => parseFloat(val) || 0);
          hasDataCheck = vSeries.some((val) => val > 0);
          if (!hasDataCheck) vSeries = []; // Don't show empty pie
        } else {
          // For Bar/Line/Area
          if (series.length > 0 && typeof series[0] === "object") {
             // Ensure 'data' array exists and contains numbers
             vSeries = series.map(s => ({
                 ...s,
                 data: (s.data || []).map(d => parseFloat(d) || 0)
             }));
             hasDataCheck = vSeries.some(s => s.data.length > 0 && s.data.some(v => v > 0));
          } else if (series.length > 0 && (typeof series[0] === "number" || typeof series[0] === "string")) {
             // Handle simple array input [10, 20, 30]
             const numericData = series.map(d => parseFloat(d) || 0);
             vSeries = [{ name: "Data", data: numericData }];
             hasDataCheck = numericData.some(v => v > 0);
          } else {
            vSeries = [{ name: "Series", data: [] }];
          }
        }
      }
      if (Array.isArray(categories)) {
        vCategories = categories.filter((item) => item != null);
      }
    } catch (error) {
      console.error("Chart Error:", error);
      vSeries = [];
    }

    return { validSeries: vSeries, validCategories: vCategories, hasData: hasDataCheck };
  }, [series, categories, type]);


    // --- Chart Configuration ---
    const chartOptions = useMemo(() => {
    const isCircular = type === "donut" || type === "pie";
    
    // Detect if this is a volume chart (not currency)
    const isVolumeChart = !isCircular && validSeries.length > 0 && 
        (validSeries[0].name || "").toLowerCase().match(/volume|quantity|sold|count/);

    return {
      chart: {
        type: type === "donut" ? "donut" : type,
        background: "transparent",
        toolbar: { show: false },
        fontFamily: "'Inter', 'Poppins', sans-serif",
        animations: {
          enabled: true,
          easing: "easeinout",
          speed: 800,
          animateGradually: { enabled: true, delay: 150 },
        },
      },
      colors: brandPalette,
      labels: validCategories, 

      grid: {
        show: !isCircular,
        borderColor: "#e2e8f0", 
        strokeDashArray: 4, 
        padding: { top: 0, right: 0, bottom: 0, left: 15 },
        xaxis: { lines: { show: false } },   
        yaxis: { lines: { show: true } }, 
      },
      fill: {
        type: type === "area" ? "gradient" : "solid",
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.05,  
          stops: [0, 100],
        },
        opacity: type === "bar" ? 1 : undefined,
      },
      stroke: {
        show: true,
        curve: "smooth", 
        width: type === "line" ? 3 : type === "area" ? 2 : 0,
        colors: isCircular ? ["#ffffff"] : undefined,
        lineCap: "round",
      },
      xaxis: {
        categories: validCategories,
        axisBorder: { show: false },
        axisTicks: { show: false },
        labels: {
          style: { colors: "#64748B", fontSize: "12px", fontWeight: 500 },
          offsetY: 5,
        },
        tooltip: { enabled: false }, 
      },
      yaxis: {
        show: !isCircular,
        labels: {
          style: { colors: "#64748B", fontSize: "12px", fontWeight: 500 },
          formatter: (value) => {
             const prefix = isVolumeChart ? "" : "₱"; 
             if (value >= 1000000) return `${prefix}${(value / 1000000).toFixed(1)}M`;
             if (value >= 1000) return `${prefix}${(value / 1000).toFixed(0)}k`;
             return `${prefix}${value}`;
          }
        },
      },
      tooltip: {
        enabled: true,
        shared: !isCircular, 
        intersect: false, 
        theme: "light",
        fillSeriesColor: false,
        style: { fontSize: "12px" },
        custom: function({ series, seriesIndex, dataPointIndex, w }) {
          // Handle Circular Charts
          if (isCircular) {
            const value = series[seriesIndex];
            const color = w.globals.colors[seriesIndex];
            const label = w.globals.labels[seriesIndex]; 
            const total = w.globals.seriesTotals.reduce((a, b) => a + b, 0);
            const percent = total > 0 ? ((value / total) * 100).toFixed(1) : 0.0;

            const formattedValue = value?.toLocaleString(); 

            return `
              <div style="background: white; padding: 12px; border: 1px solid #e2e8f0; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
                  <span style="display:inline-block; width:8px; height:8px; border-radius:50%; background-color: ${color};"></span>
                  <span style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.025em; color: #64748B;">${label}</span>
                </div>
                <div style="display: flex; align-items: baseline; gap: 8px;">
                  <span style="font-size: 16px; font-weight: 700; color: #002B50;">${formattedValue}</span>
                  <span style="font-size: 11px; font-weight: 600; color: #1f781a; background: #f0fdf4; padding: 2px 6px; border-radius: 4px;">${percent}%</span>
                </div>
              </div>`;
          }

          // Handle Bar/Line/Area
          const category = validCategories[dataPointIndex]; 
          
          let html = `
            <div style="background: white; border: 1px solid #e2e8f0; border-radius: 8px; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); min-width: 150px; overflow: hidden;">
              <div style="background: #f8fafc; padding: 8px 12px; border-bottom: 1px solid #e2e8f0;">
                <span style="font-size: 12px; font-weight: 600; color: #64748B;">${category}</span>
              </div>
              <div style="padding: 8px 12px; display: flex; flex-direction: column; gap: 6px;">`;
          
          w.config.series.forEach((s, i) => {
            const val = w.globals.series[i][dataPointIndex];
            if (typeof val !== 'undefined' && val !== null) {
               const color = w.globals.colors[i];
               const name = s.name || `Series ${i+1}`;
               const isVolumeSeries = name.toLowerCase().match(/volume|quantity|sold|count/);
               
               const prefix = isVolumeSeries ? "" : "₱";
               const formattedVal = val.toLocaleString();
               
               html += `
                 <div style="display: flex; align-items: center; justify-content: space-between; gap: 12px;">
                    <div style="display: flex; align-items: center; gap: 6px;">
                      <span style="width: 8px; height: 8px; border-radius: 50%; background-color: ${color};"></span>
                      <span style="font-size: 12px; color: #334155; font-weight: 500;">${name}</span>
                    </div>
                    <span style="font-size: 13px; font-weight: 700; color: #002B50;">${prefix}${formattedVal}</span>
                 </div>`;
            }
          });
          html += `</div></div>`;
          return html;
        }
      },
      plotOptions: {
        bar: { borderRadius: 4, borderRadiusApplication: "end", columnWidth: "35%" },
        pie: {
          donut: {
            size: "72%",
            labels: {
              show: true,
              name: { show: true, fontSize: "11px", color: "#64748B", offsetY: -4 },
              value: { 
                  show: true, 
                  fontSize: "20px", 
                  fontWeight: 700, 
                  color: "#002B50", 
                  offsetY: 6, 
                  formatter: (val) => parseInt(val).toLocaleString() 
              },
              total: { 
                  show: true, 
                  label: "Total", 
                  color: "#94a3b8", 
                  fontWeight: 600, 
                  fontSize: "11px", 
                  formatter: (w) => w.globals.seriesTotals.reduce((a, b) => a + b, 0).toLocaleString() 
              },
            },
          },
        },
      },
      dataLabels: { enabled: false },
      legend: { show: true, position: "bottom", horizontalAlign: "left", fontSize: "13px", fontWeight: 500, markers: { radius: 12, width: 12, height: 12 }, itemMargin: { horizontal: 15, vertical: 5 } }
    };
  }, [type, validSeries, validCategories, brandPalette]);

  const containerClasses = `
    w-full bg-white rounded-xl p-6 
    border border-slate-100 shadow-sm hover:shadow-md
    transform transition-all duration-700 ease-[cubic-bezier(0.25,0.8,0.25,1)]
    ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}
  `;

  if (!hasData) {
    return (
      <div className={containerClasses} style={{ height: `${height + 50}px` }}>
        {(title || filter) && (
            <div className="flex justify-between items-center mb-6 pl-1">
                {title && <h3 className="title">{title}</h3>}
                {filter && <div className="relative z-10">{filter}</div>}
            </div>
        )}
        <div className="flex flex-col items-center justify-center h-full opacity-50 -mt-10">
           <p className="text-slate-400 font-medium text-sm">No data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className={containerClasses}>
      {(title || filter) && (
        <div className="flex justify-between items-center mb-6 pl-1">
            {title && (
              <h3 className="title">
                {title}
              </h3>
            )}
            {filter && (
              <div className="relative z-10">
                {filter}
              </div>
            )}
        </div>
      )}

      <div 
        className={`relative ${type === "donut" ? "flex justify-center" : ""}`}
        style={{ minHeight: height }}
      >
        <ReactApexChart
          key={chartKey}
          options={chartOptions}
          series={validSeries}
          type={type === "donut" ? "donut" : type}
          height={height}
          width="100%"
        />
      </div>
    </div>
  );
}