import { QueryParams } from "../types/analytics";

export interface CompanyOption {
  value: string;
  label: string;
}

export interface DateRangeOption {
  value: number;
  label: string;
}

// Date range filter options
export const dateRangeOptions: DateRangeOption[] = [
  { value: 7, label: "Last 7 days" },
  { value: 30, label: "Last 30 days" },
  { value: 90, label: "Last 90 days" },
];

// Company filter options
export const companyOptions: CompanyOption[] = [
  { value: "all", label: "All Companies" },
  { value: "1dace58b-24ab-4e2c-ad36-36676e67183d", label: "Sample Company" },
  { value: "081e763c-822b-41ed-b1a1-e23a9e2e8c7a", label: "Facebook" },
  { value: "332c6ce8-c0ab-4f32-964d-bb737ca0429d", label: "Assembly" },
  { value: "08378aac-7e60-4af9-a5c3-b9fa2b4a12bf", label: "GitHub" },
];

// Get today's date in YYYY-MM-DD format for max date validation
export const getTodayString = (): string => {
  const today = new Date();
  return today.toISOString().split("T")[0];
};

// Validate dates
const validateDates = (fromDate: string, toDate: string): boolean => {
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
};

// Check if there are actual changes to apply
export const hasChangesToApply = (
  currentParams: QueryParams,
  previousParams: QueryParams
): boolean => {
  return (
    previousParams.search !== currentParams.search ||
    previousParams.companyId !== currentParams.companyId ||
    previousParams.dateRange !== currentParams.dateRange ||
    previousParams.fromDate !== currentParams.fromDate ||
    previousParams.toDate !== currentParams.toDate
  );
};

// Check if any filter is currently active (different from defaults)
export const hasActiveFilters = (params: QueryParams): boolean => {
  return (
    params.search !== "" ||
    params.companyId !== "all" ||
    params.dateRange !== 90 ||
    params.fromDate !== "" ||
    params.toDate !== ""
  );
};

// Get date validation error message
export const getDateValidationError = (
  fromDate: string,
  toDate: string
): string | null => {
  if (fromDate && toDate) {
    const isValid = validateDates(fromDate, toDate);
    if (!isValid) {
      return "Invalid date range. Please check your dates.";
    }
  }
  return null;
};
