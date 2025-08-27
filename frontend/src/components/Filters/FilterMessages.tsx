import React from "react";
import { AlertCircle } from "lucide-react";

interface FilterMessagesProps {
  dateError: string | null;
  showSuccess: boolean;
}

const FilterMessages: React.FC<FilterMessagesProps> = ({
  dateError,
  showSuccess,
}) => {
  return (
    <>
      {/* Date Validation Error */}
      {dateError && (
        <div className="mt-3 flex items-center space-x-2 text-xs text-red-600 bg-red-50/50 p-2 rounded">
          <AlertCircle className="h-3 w-3" />
          <span>{dateError}</span>
        </div>
      )}

      {/* Success Message */}
      {showSuccess && (
        <div className="mt-3 flex items-center space-x-2 text-xs text-green-600 bg-green-50/50 p-2 rounded">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-3 w-3"
          >
            <path
              fillRule="evenodd"
              d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.06-1.06L11.78 14.87l-2.22-2.22a.75.75 0 00-1.06 1.06l2.75 2.75a.75.75 0 001.06 0l6.25-6.25z"
              clipRule="evenodd"
            />
          </svg>
          <span>Applied</span>
        </div>
      )}
    </>
  );
};

export default FilterMessages;
