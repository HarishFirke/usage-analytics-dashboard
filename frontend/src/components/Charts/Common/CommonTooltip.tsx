import React from "react";
import { formatDateForDisplay } from "../../../utils/chartUtils";
import { ViewMode } from "../../../utils/usageTrendsUtils";

interface TooltipPayload {
  value?: number;
  name?: string;
  color?: string;
  fill?: string;
  payload?: any;
}

interface CommonTooltipProps {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string;
  viewMode?: ViewMode;
  showMultiline?: boolean;
  getCompanyColor?: (index: number) => string;
  isCompanyComparison?: boolean;
}

const CommonTooltip: React.FC<CommonTooltipProps> = ({
  active,
  payload,
  label,
  viewMode = "daily",
  showMultiline = false,
  getCompanyColor,
  isCompanyComparison = false,
}) => {
  if (!active || !payload || !payload.length) {
    return null;
  }

  if (showMultiline) {
    // Calculate total events for this date
    const totalEvents = payload.reduce((sum: number, entry) => {
      if (entry.value && typeof entry.value === "number") {
        return sum + entry.value;
      }
      return sum;
    }, 0);

    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-semibold text-gray-800 mb-2">
          {formatDateForDisplay(label || "", viewMode)}
        </p>
        <div className="space-y-1">
          {payload.map((entry, index: number) => {
            // Get the company name and color
            const companyName = entry.name || `Company ${index + 1}`;
            const companyColor =
              entry.color ||
              entry.fill ||
              getCompanyColor?.(index) ||
              "#3B82F6";

            return (
              <div key={index} className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{
                      backgroundColor: companyColor,
                    }}
                  ></div>
                  <span className="text-sm text-gray-600">{companyName}:</span>
                </div>
                <span className="text-sm font-semibold text-gray-800">
                  {entry.value?.toLocaleString()}
                </span>
              </div>
            );
          })}
          <div className="border-t pt-1 mt-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-gray-800">
                Total:
              </span>
              <span className="text-sm font-bold text-blue-600">
                {totalEvents.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  } else if (isCompanyComparison) {
    // Special handling for Company Comparison Chart
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-semibold text-gray-800 mb-2">{label}</p>
        <div className="space-y-1">
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: entry.color || entry.fill }}
                ></div>
                <span className="text-sm text-gray-600">
                  {entry.name === "events" ? "Events" : "Users"}:
                </span>
              </div>
              <span className="text-sm font-semibold text-gray-800">
                {entry.value?.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  } else {
    // Default tooltip for single line/bar
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-semibold text-gray-800 mb-2">
          {formatDateForDisplay(label || "", viewMode)}
        </p>
        <p className="text-sm text-gray-600">
          Events:{" "}
          <span className="font-semibold text-gray-800">
            {payload[0]?.value?.toLocaleString()}
          </span>
        </p>
      </div>
    );
  }
};

export default CommonTooltip;
