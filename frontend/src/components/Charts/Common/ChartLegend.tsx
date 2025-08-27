import React from "react";

interface LegendItem {
  color: string;
  label: string;
}

interface ChartLegendProps {
  items: LegendItem[];
  className?: string;
}

const ChartLegend: React.FC<ChartLegendProps> = ({ items, className = "" }) => {
  return (
    <div className={`flex items-center justify-center space-x-6 mb-0 ${className}`}>
      {items.map((item, index) => (
        <div key={index} className="flex items-center space-x-2">
          <div
            className="w-4 h-4 rounded shadow-sm"
            style={{ backgroundColor: item.color }}
          ></div>
          <span className="text-sm font-semibold text-gray-700">{item.label}</span>
        </div>
      ))}
    </div>
  );
};

export default ChartLegend;
