import React, { useState, useEffect } from "react";
import { Card, CardContent } from "../ui/card";
import { AnalyticsResponse, QueryParams } from "../../types/analytics";
import { getAnalytics } from "../../services/api";
import KeyInsights from "../Summary/KeyInsights";
import TopActiveUsers from "../Summary/TopActiveUsers";
import UsageTrendsChart from "../Charts/UsageTrendsChart";
import CompanyComparisonChart from "../Charts/CompanyComparisonChart";
import Filters from "../Filters/Filters";

export const initialFilterValues: QueryParams = {
  search: "",
  fromDate: "",
  toDate: "",
  dateRange: 90,
  companyId: "all",
};

const Dashboard: React.FC = () => {
  const [analytics, setAnalytics] = useState<AnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Separate state for current filter inputs vs applied filters
  const [filterInputs, setFilterInputs] =
    useState<QueryParams>(initialFilterValues);

  const [appliedFilters, setAppliedFilters] =
    useState<QueryParams>(initialFilterValues);

  // Initial data fetch
  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  // Fetch data when applied filters change
  useEffect(() => {
    if (
      appliedFilters.dateRange ||
      appliedFilters.companyId ||
      appliedFilters.search ||
      appliedFilters.fromDate ||
      appliedFilters.toDate
    ) {
      fetchAnalyticsData();
    }
  }, [appliedFilters]);

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

  const handleFilterChange = (newFilters: Partial<QueryParams>) => {
    setFilterInputs((prev) => ({ ...prev, ...newFilters }));
  };

  const handleApplyFilters = () => {
    setAppliedFilters(filterInputs);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
        <div className="max-w-7xl mx-auto">
          <Card className="shadow-xl border border-red-200 bg-gradient-to-br from-red-50 to-red-100">
            <CardContent className="p-8 text-center">
              <div className="text-red-600 text-6xl mb-4">⚠️</div>
              <h2 className="text-2xl font-bold text-red-800 mb-2">
                Error Loading Dashboard
              </h2>
              <p className="text-red-700 mb-4">{error}</p>
              <button
                onClick={fetchAnalyticsData}
                className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Filters */}
        <Filters
          params={filterInputs}
          onParamsChange={handleFilterChange}
          onApply={handleApplyFilters}
          loading={loading}
        />

        {/* Dashboard Grid */}
        <div className="grid grid-cols-10 gap-6">
          {/* Left Column - Key Insights & Top Users */}
          <div className="col-span-3 space-y-6">
            {/* Key Insights */}
            <KeyInsights summary={analytics?.summary} loading={loading} />

            {/* Top Active Users */}
            <TopActiveUsers
              topUsers={analytics?.topUsers || []}
              loading={loading}
            />
          </div>

          {/* Right Column - Charts */}
          <div className="col-span-7 space-y-6">
            {/* Usage Trends Chart */}
            <UsageTrendsChart
              trends={analytics?.trends || { trends: {} }}
              loading={loading}
              companyId={appliedFilters.companyId || "all"}
            />

            {/* Company Comparison Chart */}
            <CompanyComparisonChart
              companies={analytics?.companies || []}
              loading={loading}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
