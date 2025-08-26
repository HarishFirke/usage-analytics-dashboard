import React, { useState, useCallback, useEffect, useRef } from "react";
import { QueryParams, AnalyticsResponse } from "../../types/analytics";
import { getAnalytics } from "../../services/api";
import Filters from "../Filters/Filters";
import UsageTrendsChart from "../Charts/UsageTrendsChart";
import CompanyComparisonChart from "../Charts/CompanyComparisonChart";
import KeyInsights from "../Summary/KeyInsights";
import TopActiveUsers from "../Summary/TopActiveUsers";
import { Alert, AlertDescription } from "../ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";

// Main dashboard component - handles all business logic, API calls, and UI
const Dashboard: React.FC = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsResponse | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [queryParams, setQueryParams] = useState<QueryParams>({
    dateRange: 90,
    companyId: "all",
    search: "",
    fromDate: "",
    toDate: "",
  });
  const hasInitialized = useRef(false);
  const previousParams = useRef<QueryParams>({
    dateRange: 30,
    companyId: "all",
    search: "",
    fromDate: "",
    toDate: "",
  });

  // Fetch analytics data from API
  const fetchAnalytics = useCallback(async (params: QueryParams) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAnalytics(params);
      setAnalyticsData(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch analytics data"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // Handle parameter changes from filters
  const handleParamsChange = useCallback((params: Partial<QueryParams>) => {
    setQueryParams((prev) => ({ ...prev, ...params }));
  }, []);

  // Handle Apply button click - only fetch if params actually changed
  const handleApply = useCallback(() => {
    const hasChanged =
      previousParams.current.dateRange !== queryParams.dateRange ||
      previousParams.current.companyId !== queryParams.companyId ||
      previousParams.current.search !== queryParams.search ||
      previousParams.current.fromDate !== queryParams.fromDate ||
      previousParams.current.toDate !== queryParams.toDate;

    if (hasChanged) {
      // Convert "all" to empty string for API compatibility
      const apiParams = {
        ...queryParams,
        companyId: queryParams.companyId === "all" ? "" : queryParams.companyId,
      };

      previousParams.current = { ...queryParams };
      fetchAnalytics(apiParams);
    }
  }, [fetchAnalytics, queryParams]);

  // Initial data fetch - only once on mount, even in Strict Mode
  useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      // Convert "all" to empty string for API compatibility
      const apiParams = {
        ...queryParams,
        companyId: queryParams.companyId === "all" ? "" : queryParams.companyId,
      };
      fetchAnalytics(apiParams);
    }
  }, [fetchAnalytics, queryParams]);

  // Loading state
  if (loading && !analyticsData) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  // Error state
  if (error && !analyticsData) {
    return (
      <div className="mt-6">
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Search and Filters */}
      <Filters
        params={queryParams}
        onParamsChange={handleParamsChange}
        onApply={handleApply}
        loading={loading}
      />

      {/* Main Dashboard Layout - 3 Column */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Left Section - Key Insights + Top Users (3 columns) */}
        <div className="xl:col-span-3 space-y-4">
          {/* Key Insights Section */}
          <KeyInsights summary={analyticsData?.summary} loading={loading} />

          {/* Top Users Section */}
          <TopActiveUsers
            topUsers={analyticsData?.topUsers || []}
            loading={loading}
          />
        </div>

        {/* Middle Section - Usage Trends (6 columns) */}
        <div className="xl:col-span-6">
          <UsageTrendsChart
            trends={analyticsData?.trends || { daily: [] }}
            loading={loading}
          />
        </div>

        {/* Right Section - Company Comparison (3 columns) */}
        <div className="xl:col-span-3">
          <CompanyComparisonChart
            companies={analyticsData?.companies || []}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
