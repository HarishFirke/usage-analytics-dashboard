import React from "react";
import { useAnalytics } from "../../hooks/useAnalytics";
import {
  isEmptyDueToDateRange,
  isNoDataAtAll,
} from "../../utils/dashboardUtils";
import Filters from "../Filters/Filters";
import ErrorDisplay from "./ErrorDisplay";
import NoDataAlert from "./NoDataAlert";
import DashboardGrid from "./DashboardGrid";

const Dashboard: React.FC = () => {
  const {
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
  } = useAnalytics();

  // Early return for error state
  if (error) {
    return <ErrorDisplay error={error} onRetry={fetchAnalyticsData} />;
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

        {/* No Data Alert - When there's no data at all in the system */}
        {!loading && isNoDataAtAll(analytics) && (
          <NoDataAlert
            type="no-data"
            onResetToDefault={resetToDefault}
            onTryLastYear={tryLastYear}
          />
        )}

        {/* Empty Data Alert - When data exists but not for selected date range */}
        {!loading && isEmptyDueToDateRange(analytics) && (
          <NoDataAlert
            type="empty-date-range"
            onResetToDefault={resetToDefault}
            onTryLastYear={tryLastYear}
          />
        )}

        {/* Dashboard Grid */}
        <DashboardGrid
          analytics={analytics}
          loading={loading}
          companyId={appliedFilters.companyId || "all"}
        />
      </div>
    </div>
  );
};

export default Dashboard;
