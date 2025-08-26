import React, { useState, useCallback, useEffect, useMemo } from "react";
import {
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  AlertCircle,
} from "lucide-react";
import { QueryParams } from "../../types/analytics";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { initialFilterValues } from "../Dashboard/Dashboard";

interface FiltersProps {
  params: QueryParams;
  onParamsChange: (params: Partial<QueryParams>) => void;
  onApply: () => void;
  loading?: boolean;
}

interface CompanyOption {
  value: string;
  label: string;
}

interface DateRangeOption {
  value: number;
  label: string;
}

const Filters: React.FC<FiltersProps> = ({
  params,
  onParamsChange,
  onApply,
}) => {
  const [localSearch, setLocalSearch] = useState(params.search);
  const [isExpanded, setIsExpanded] = useState(false);
  const [dateError, setDateError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [previousAppliedParams, setPreviousAppliedParams] =
    useState<QueryParams>(params);

  // Show success message briefly when filters are applied
  const handleApplyWithSuccess = () => {
    onApply();
    setPreviousAppliedParams({ ...params });
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  // Date range filter options
  const dateRangeOptions: DateRangeOption[] = [
    { value: 7, label: "Last 7 days" },
    { value: 30, label: "Last 30 days" },
    { value: 90, label: "Last 90 days" },
  ];

  // Company filter options
  const companyOptions: CompanyOption[] = [
    { value: "all", label: "All Companies" },
    { value: "1dace58b-24ab-4e2c-ad36-36676e67183d", label: "Sample Company" },
    { value: "081e763c-822b-41ed-b1a1-e23a9e2e8c7a", label: "Facebook" },
    { value: "332c6ce8-c0ab-4f32-964d-bb737ca0429d", label: "Assembly" },
    { value: "08378aac-7e60-4af9-a5c3-b9fa2b4a12bf", label: "GitHub" },
  ];

  // Get today's date in YYYY-MM-DD format for max date validation
  const getTodayString = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  // Validate dates
  const validateDates = useCallback(
    (fromDate: string, toDate: string): boolean => {
      if (!fromDate || !toDate) return true; // Allow empty dates

      const from = new Date(fromDate);
      const to = new Date(toDate);
      const today = new Date();

      // Check if dates are valid
      if (isNaN(from.getTime()) || isNaN(to.getTime())) return false;

      // Check if dates are in the future
      if (from > today || to > today) return false;

      // Check if from date is before to date
      if (from >= to) return false;

      return true;
    },
    []
  );

  // Handle search change
  const handleSearchChange = (value: string) => {
    setLocalSearch(value);
    onParamsChange({ search: value });
  };

  // Handle company change
  const handleCompanyChange = useCallback(
    (value: string) => {
      onParamsChange({ companyId: value });
    },
    [onParamsChange]
  );

  // Handle date range change
  const handleDateRangeChange = useCallback(
    (value: string) => {
      onParamsChange({ dateRange: parseInt(value) });
    },
    [onParamsChange]
  );

  // Handle from date change
  const handleFromDateChange = useCallback(
    (value: string) => {
      onParamsChange({ fromDate: value });
      setDateError(null);
    },
    [onParamsChange]
  );

  // Handle to date change
  const handleToDateChange = useCallback(
    (value: string) => {
      onParamsChange({ toDate: value });
      setDateError(null);
    },
    [onParamsChange]
  );

  // Handle search submit
  const handleSearchSubmit = useCallback(() => {
    onParamsChange({ search: localSearch });
  }, [localSearch, onParamsChange]);

  // Handle search key press
  const handleSearchKeyPress = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === "Enter") {
        handleSearchSubmit();
      }
    },
    [handleSearchSubmit]
  );

  // Handle clear filters
  const handleClearFilters = useCallback(() => {
    setDateError(null);
    setLocalSearch("");
    onParamsChange(initialFilterValues);
  }, [onParamsChange]);

  const toggleExpansion = () => setIsExpanded(!isExpanded);

  // Check if Apply button should be disabled
  const isApplyDisabled = dateError !== null;

  // Check if there are actual changes to apply
  const hasChangesToApply =
    previousAppliedParams.search !== params.search ||
    previousAppliedParams.companyId !== params.companyId ||
    previousAppliedParams.dateRange !== params.dateRange ||
    previousAppliedParams.fromDate !== params.fromDate ||
    previousAppliedParams.toDate !== params.toDate;

  // Check if any filter is currently active (different from defaults)
  const hasActiveFilters = useMemo(() => {
    return (
      params.search !== "" ||
      params.companyId !== "all" ||
      params.dateRange !== 90 ||
      params.fromDate !== "" ||
      params.toDate !== ""
    );
  }, [params]);

  // Validate dates when they change
  useEffect(() => {
    if (params.fromDate && params.toDate) {
      const isValid = validateDates(params.fromDate, params.toDate);
      if (!isValid) {
        setDateError("Invalid date range. Please check your dates.");
      } else {
        setDateError(null);
      }
    } else {
      setDateError(null);
    }
  }, [params.fromDate, params.toDate, validateDates]);

  // Update local search when params change externally
  useEffect(() => {
    setLocalSearch(params.search);
  }, [params.search]);

  return (
    <Card className="mb-4 shadow-xl border border-gray-200/50 bg-gradient-to-br from-white to-gray-50/30 hover:shadow-2xl transition-all duration-500">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-bold flex items-center text-gray-800">
            <div className="w-4 h-4 mr-2 bg-blue-500 rounded-full flex items-center justify-center">
              <Filter className="h-2 w-2 text-white" />
            </div>
            Filters
          </CardTitle>
          <div className="flex items-center space-x-2">
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearFilters}
                className="px-2 py-1 h-6 text-xs text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors duration-200 rounded"
              >
                Clear All
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleExpansion}
              className="p-1 h-6 w-6 hover:bg-gray-100 rounded text-gray-500"
            >
              {isExpanded ? (
                <ChevronUp className="h-3 w-3" />
              ) : (
                <ChevronDown className="h-3 w-3" />
              )}
            </Button>
          </div>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="pt-0 px-4 pb-4">
          {/* Minimal Filter Layout */}
          <div className="space-y-3">
            {/* Top Row - Search and Company */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Search Input */}
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                  <Input
                    className="pl-8 h-8 border border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 rounded text-sm shadow-sm hover:shadow-md focus:shadow-lg"
                    placeholder="Search..."
                    value={localSearch}
                    onChange={(event) => handleSearchChange(event.target.value)}
                    onKeyPress={handleSearchKeyPress}
                  />
                </div>
              </div>

              {/* Company Filter */}
              <div>
                <Select
                  value={params.companyId || "all"}
                  onValueChange={handleCompanyChange}
                >
                  <SelectTrigger className="h-8 border border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 rounded text-sm shadow-sm hover:shadow-md focus:shadow-lg">
                    <SelectValue placeholder="Company" />
                  </SelectTrigger>
                  <SelectContent>
                    {companyOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Second Row - Date Controls */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
              {/* Date Range Filter */}
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Range
                </label>
                <Select
                  value={params.dateRange?.toString() || "90"}
                  onValueChange={handleDateRangeChange}
                >
                  <SelectTrigger className="h-8 border border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 rounded text-sm shadow-sm hover:shadow-md focus:shadow-lg">
                    <SelectValue placeholder="Range" />
                  </SelectTrigger>
                  <SelectContent>
                    {dateRangeOptions.map((option) => (
                      <SelectItem
                        key={option.value}
                        value={option.value.toString()}
                      >
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* From Date */}
              <div>
                <label className="block text-xs text-gray-500 mb-1">From</label>
                <Input
                  type="date"
                  value={params.fromDate || ""}
                  onChange={(e) => handleFromDateChange(e.target.value)}
                  max={getTodayString()}
                  className="h-8 border border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 rounded text-sm shadow-sm hover:shadow-md focus:shadow-lg"
                />
              </div>

              {/* To Date */}
              <div>
                <label className="block text-xs text-gray-500 mb-1">To</label>
                <Input
                  type="date"
                  value={params.toDate || ""}
                  onChange={(e) => handleToDateChange(e.target.value)}
                  max={getTodayString()}
                  disabled={!params.fromDate}
                  className={`h-8 border transition-all duration-200 rounded text-sm ${
                    params.fromDate
                      ? "border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm hover:shadow-md focus:shadow-lg"
                      : "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
                  }`}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2">
                <Button
                  className="flex-1 h-8 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium transition-colors duration-200 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleApplyWithSuccess}
                  disabled={isApplyDisabled || !hasChangesToApply}
                >
                  Apply
                </Button>
              </div>
            </div>
          </div>

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
        </CardContent>
      )}
    </Card>
  );
};

export default Filters;
