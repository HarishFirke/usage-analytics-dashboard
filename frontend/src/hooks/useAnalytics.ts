import { useState, useEffect, useRef } from "react";
import { AnalyticsResponse, QueryParams } from "../types/analytics";
import { getAnalytics } from "../services/api";

export const initialFilterValues: QueryParams = {
  search: "",
  fromDate: "",
  toDate: "",
  dateRange: 90,
  companyId: "all",
};

export const useAnalytics = () => {
  const [analytics, setAnalytics] = useState<AnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isInitialLoad = useRef(true);
  const lastAppliedFilters = useRef<QueryParams>(initialFilterValues);

  // Separate state for current filter inputs vs applied filters
  const [filterInputs, setFilterInputs] =
    useState<QueryParams>(initialFilterValues);
  const [appliedFilters, setAppliedFilters] =
    useState<QueryParams>(initialFilterValues);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Convert "all" to empty string for API compatibility
      const apiParams = {
        ...appliedFilters,
        companyId:
          appliedFilters.companyId === "all" ? "" : appliedFilters.companyId,
      };

      const data = await getAnalytics(apiParams);
      setAnalytics(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch analytics"
      );
    } finally {
      setLoading(false);
    }
  };

  // Combined useEffect for initial load and filter changes
  useEffect(() => {
    if (isInitialLoad.current) {
      // Initial load - fetch data once
      isInitialLoad.current = false;
      fetchAnalyticsData();
    } else {
      // Check if filters have actually changed from the last applied filters
      // This allows users to reset to defaults and still get fresh data
      const hasFilterChanges =
        appliedFilters.dateRange !== lastAppliedFilters.current.dateRange ||
        appliedFilters.companyId !== lastAppliedFilters.current.companyId ||
        appliedFilters.search !== lastAppliedFilters.current.search ||
        appliedFilters.fromDate !== lastAppliedFilters.current.fromDate ||
        appliedFilters.toDate !== lastAppliedFilters.current.toDate;

      if (hasFilterChanges) {
        // Update the last applied filters reference
        lastAppliedFilters.current = { ...appliedFilters };
        fetchAnalyticsData();
      }
    }
  }, [appliedFilters]);

  const handleFilterChange = (newFilters: Partial<QueryParams>) => {
    setFilterInputs((prev) => ({ ...prev, ...newFilters }));
  };

  const handleApplyFilters = () => {
    setAppliedFilters(filterInputs);
  };

  const resetToDefault = () => {
    setFilterInputs(initialFilterValues);
    setAppliedFilters(initialFilterValues);
  };

  const tryLastYear = () => {
    const newFilters = { ...filterInputs, dateRange: 365 };
    setFilterInputs(newFilters);
    setAppliedFilters(newFilters);
  };

  return {
    analytics,
    loading,
    error,
    filterInputs,
    appliedFilters,
    fetchAnalyticsData,
    handleFilterChange,
    handleApplyFilters,
    resetToDefault,
    tryLastYear,
  };
};
