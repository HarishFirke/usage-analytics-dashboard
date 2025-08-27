import React from "react";
import { Input } from "../../shared/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../shared/ui/select";
import { dateRangeOptions, getTodayString } from "../../utils/filtersUtils";

interface DateFiltersProps {
  dateRange: number;
  fromDate: string;
  toDate: string;
  onDateRangeChange: (value: string) => void;
  onFromDateChange: (value: string) => void;
  onToDateChange: (value: string) => void;
}

const DateFilters: React.FC<DateFiltersProps> = ({
  dateRange,
  fromDate,
  toDate,
  onDateRangeChange,
  onFromDateChange,
  onToDateChange,
}) => {
  return (
    <div className="grid grid-cols-3 gap-4 items-end w-full">
      {/* Date Range Filter */}
      <div className="flex flex-col w-full">
        <label className="block text-xs text-gray-500 mb-1">Range</label>
        <Select
          value={dateRange?.toString() || "90"}
          onValueChange={onDateRangeChange}
        >
          <SelectTrigger className="h-10 w-full border border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 rounded text-sm shadow-sm hover:shadow-md focus:shadow-lg">
            <SelectValue placeholder="Range" />
          </SelectTrigger>
          <SelectContent>
            {dateRangeOptions.map((option) => (
              <SelectItem key={option.value} value={option.value.toString()}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* From Date */}
      <div className="flex flex-col w-full">
        <label className="block text-xs text-gray-500 mb-1">From</label>
        <Input
          type="date"
          value={fromDate || ""}
          onChange={(e) => onFromDateChange(e.target.value)}
          max={getTodayString()}
          className="h-10 w-full border border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 rounded text-sm shadow-sm hover:shadow-md focus:shadow-lg"
        />
      </div>

      {/* To Date */}
      <div className="flex flex-col w-full">
        <label className="block text-xs text-gray-500 mb-1">To</label>
        <Input
          type="date"
          value={toDate || ""}
          onChange={(e) => onToDateChange(e.target.value)}
          max={getTodayString()}
          disabled={!fromDate}
          className={`h-10 w-full border transition-all duration-200 rounded text-sm ${
            fromDate
              ? "border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm hover:shadow-md focus:shadow-lg"
              : "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
          }`}
        />
      </div>
    </div>
  );
};

export default DateFilters;
