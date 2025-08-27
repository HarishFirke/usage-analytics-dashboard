import React from "react";

interface NoDataAlertProps {
  type: "no-data" | "empty-date-range";
  onResetToDefault: () => void;
  onTryLastYear: () => void;
}

const NoDataAlert: React.FC<NoDataAlertProps> = ({
  type,
  onResetToDefault,
  onTryLastYear,
}) => {
  if (type === "no-data") {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-medium text-blue-800">
              No data available in the system
            </h3>
            <p className="text-sm text-blue-700 mt-1">
              There are no companies, events, or user activities recorded yet
              for the time range you selected. Consider changing the date range
              or company filter to see more data.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <div className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center">
            <svg
              className="w-4 h-4 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-medium text-amber-800">
            No data available for selected date range
          </h3>
          <p className="text-sm text-amber-700 mt-1">
            Try adjusting your date range or company filter to see more data.
            The selected period may not have any activity.
          </p>
          <div className="mt-3 flex space-x-3">
            <button
              onClick={onResetToDefault}
              className="inline-flex items-center px-3 py-2 border border-amber-300 shadow-sm text-xs font-medium rounded-md text-amber-700 bg-white hover:bg-amber-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-colors"
            >
              Reset to Default (90 days)
            </button>
            <button
              onClick={onTryLastYear}
              className="inline-flex items-center px-3 py-2 border border-amber-300 shadow-sm text-xs font-medium rounded-md text-amber-700 bg-white hover:bg-amber-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-colors"
            >
              Try Last Year
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoDataAlert;
