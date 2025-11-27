import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";

export default function Chart({
  type = "bar",
  series = [],
  categories = [],
  height = 350,
  title = "",
  colors,
}) {
  const [mounted, setMounted] = useState(false);
  const [chartKey, setChartKey] = useState(0);

  useEffect(() => {
    setTimeout(() => setMounted(true), 50);
  }, []);

  const validateData = () => {
    let validSeries = [];
    let validCategories = [];

    try {
      if (Array.isArray(series)) {
        if (type === "donut" || type === "pie") {
          validSeries = series.filter(
            (item) => typeof item === "number" && !isNaN(item)
          );
          if (validSeries.length === 0) {
            validSeries = [1];
          }
        } else {
          if (series.length > 0 && typeof series[0] === "number") {
  // case: numeric-only series array
  validSeries = [
    {
      data: series.filter((item) => typeof item === "number" && !isNaN(item)),
    },
  ];
} else if (
  Array.isArray(series) &&
  series.length > 0 &&
  typeof series[0] === "object" &&
  Array.isArray(series[0].data)
) {
  // case: multiple series with objects (line/bar charts)
  validSeries = series.map((s) => ({
    ...s,
    data: Array.isArray(s.data)
      ? s.data.filter((item) => typeof item === "number" && !isNaN(item))
      : [],
  }));
} else {
  validSeries = [{ name: "Series", data: [] }];
}

        }
      }

      if (Array.isArray(categories)) {
        validCategories = categories.filter((item) => item != null);
      }
    } catch (error) {
      console.error("Error validating chart data:", error);

      if (type === "donut" || type === "pie") {
        validSeries = [1];
      } else {
        validSeries = [{ data: [0] }];
      }
      validCategories = ["Data"];
    }

    return { validSeries, validCategories };
  };

  const { validSeries, validCategories } = validateData();

  useEffect(() => {
    setChartKey((prev) => prev + 1);
  }, [type, series, categories]);

  // Default colors
  const defaultColors = {
    bar: ["#004B8D"],
    line: ["#004B8D",  "#1f781a", "#0088FF", "#33A0FF"],
    donut: ["#004B8D", "#1f781a", "#0088FF", "#33A0FF", "#66B8FF", "#99D6FF"],
    area: ["#004B8D"],
    pie: ["#004B8D", "#1f781a", "#0088FF", "#33A0FF", "#66B8FF", "#99D6FF"],
  };

  const getChartColors = () => {
    if (colors && Array.isArray(colors)) return colors;
    return defaultColors[type] || defaultColors.bar;
  };

  const getPlotOptions = () => {
    const baseOptions = {};

    if (type === "donut" || type === "pie") {
      baseOptions.pie = {
        donut: {
          size: type === "donut" ? "65%" : "10%",
          background: "transparent",
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: "14px",
              fontWeight: 600,
              color: "#475569",
            },
            value: {
              show: true,
              fontSize: "16px",
              fontWeight: 700,
              color: "#1E293B",
            },
            total: {
              show: true,
              showAlways: true,
              label: "Total",
              fontSize: "14px",
              fontWeight: 600,
              color: "#475569",
            },
          },
        },
      };

      baseOptions.stroke = {
        width: 4,
        colors: ["#fff"],
        lineCap: "round",
      };

      baseOptions.pie.expandOnClick = false;
      baseOptions.pie.offsetX = 0;
      baseOptions.pie.offsetY = 0;
    }

    if (type === "bar") {
      baseOptions.bar = {
        borderRadius: 8,
        borderRadiusApplication: "end",
        borderRadiusWhenStacked: "last",
        columnWidth: "25%",
        endingShape: "rounded",
        distributed: false,
      };
    }

    return baseOptions;
  };

  const getStrokeOptions = () => {
    if (type === "line" || type === "area") {
      return {
        curve: "smooth",
        width: type === "line" ? 2.5 : 3,
        lineCap: "round",
      };
    }
    return { width: 2 };
  };

  const getMarkers = () => {
    if (type === "line" || type === "area") {
      return {
        size: 4,
        strokeWidth: 2,
        fillOpacity: 1,
        hover: { size: 6 },
      };
    }
    return { size: 0 };
  };

  const getFillOptions = () => {
    if (type === "area") {
      return {
        type: "gradient",
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.4,
          opacityTo: 0.1,
          stops: [0, 90, 100],
        },
      };
    }
    return { type: "solid", opacity: 1 };
  };

  const baseOptions = {
    chart: {
      type: type === "donut" ? "donut" : type,
      toolbar: { show: false },
      background: "transparent",
      animations: {
        enabled: true,
        easing: "easeout",
        speed: 600,
      },
      fontFamily: "Poppins, sans-serif",
    },
    colors: getChartColors(),
    plotOptions: getPlotOptions(),
    stroke: {
      ...getStrokeOptions(),
      width: type === "donut" || type === "pie" ? 2 : getStrokeOptions().width,
      colors: type === "donut" || type === "pie" ? ["#fff"] : undefined,
      lineCap:
        type === "donut" || type === "pie"
          ? "round"
          : getStrokeOptions().lineCap,
    },
    markers: getMarkers(),
    dataLabels: {
      enabled: type === "donut" || type === "pie",
      style: {
        fontSize: "12px",
        fontWeight: 600,
        colors: ["#FFFFFF"],
      },
      dropShadow: {
        enabled: true,
        top: 1,
        left: 1,
        blur: 1,
        opacity: 0.45,
      },
    },
    grid: {
      borderColor: "#F1F5F9",
      strokeDashArray: 4,
    },
    tooltip: {
      enabled: true,
      y: {
        formatter: (val) => `₱${val?.toLocaleString() || "0"}`,
      },
    },
    states: {
      hover: {
        filter: { type: "lighten", value: 0.1 },
      },
    },
    fill: getFillOptions(),
    noData: {
      text: "No data available",
      align: "center",
      verticalAlign: "middle",
      style: {
        color: "#64748B",
        fontSize: "14px",
      },
    },
  };

  if (type !== "donut" && type !== "pie") {
    baseOptions.xaxis = {
      categories: validCategories,
      labels: {
        style: { colors: "#64748B" },
        rotate: type === "bar" && validCategories.length > 6 ? -45 : 0,
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    };
    baseOptions.yaxis = {
      labels: {
        style: { colors: "#64748B" },
        formatter: (value) => value,

      },
    };
  } else {
    baseOptions.labels =
      validCategories.length > 0 ? validCategories : ["Data"];
    baseOptions.legend = {
      position: "bottom",
      horizontalAlign: "center",
      fontSize: "12px",
      markers: {
        width: 8,
        height: 8,
        radius: 4,
      },
    };

    baseOptions.stroke = {
      width: 2,
      colors: ["#fff"],
      lineCap: "round",
    };
  }

  const hasValidData = () => {
  if (type === "donut" || type === "pie") {
    return validSeries.some((val) => val > 0);
  }

  // For line/bar/area: at least one series must have valid data
  return validSeries.some(
    (s) =>
      Array.isArray(s.data) &&
      s.data.length > 0 &&
      s.data.some((v) => v !== undefined && v !== null)
  );
};


  if (!hasValidData()) {
    return (
      <div
        className={`p-6 rounded-2xl border border-gray-100 shadow-sm bg-white transition-all duration-700 ease-out overflow-hidden ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        {title && (
          <h3 className="text-lg font-semibold text-gray-800 mb-2 pl-1">
            {title}
          </h3>
        )}
        <div
          className="flex items-center justify-center"
          style={{ height: `${height}px` }}
        >
          <p className="text-gray-500 text-sm">No data available</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`p-6 rounded-2xl border border-gray-100 shadow-sm bg-white transition-all duration-700 ease-out overflow-hidden ${
        mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      }`}
    >
      {title && (
        <h3 className="text-lg font-semibold text-gray-800 mb-2 pl-1">
          {title}
        </h3>
      )}
      <div className={type === "donut" ? "flex justify-center" : ""}>
        <ReactApexChart
          key={chartKey}
          type={type === "donut" ? "donut" : type}
          series={validSeries}
          options={baseOptions}
          height={height}
        />
      </div>
    </div>
  );
}
