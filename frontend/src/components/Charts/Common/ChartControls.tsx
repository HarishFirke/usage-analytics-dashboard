import React from "react";
import { TrendingUp, BarChart3 } from "lucide-react";
import { ViewMode, ChartType } from "../../../utils/usageTrendsUtils";

interface ChartControlsProps {
  viewMode: ViewMode;
  chartType: ChartType;
  onViewModeChange: (mode: ViewMode) => void;
  onChartTypeChange: (type: ChartType) => void;
}

const ChartControls: React.FC<ChartControlsProps> = ({
  viewMode,
  chartType,
  onViewModeChange,
  onChartTypeChange,
}) => {
  return (
    <div className="flex items-center justify-between mb-6">
      {/* View Mode Tabs - Minimal Design */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        {(["daily", "weekly", "monthly"] as ViewMode[]).map((mode) => (
          <button
            key={mode}
            onClick={() => onViewModeChange(mode)}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200 ${
              viewMode === mode
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            {mode.charAt(0).toUpperCase() + mode.slice(1)}
          </button>
        ))}
      </div>

      {/* Chart Type Toggle */}
      <div className="flex items-center space-x-2">
        <span className="text-xs text-gray-600 font-medium">Chart Type:</span>
        <div className="flex bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => onChartTypeChange("line")}
            className={`p-2 rounded-md transition-all duration-200 ${
              chartType === "line"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
            title="Line Chart"
          >
            <TrendingUp className="w-4 h-4" />
          </button>
          <button
            onClick={() => onChartTypeChange("bar")}
            className={`p-2 rounded-md transition-all duration-200 ${
              chartType === "bar"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
            title="Bar Chart"
          >
            <BarChart3 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChartControls;
