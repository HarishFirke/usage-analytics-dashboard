import React from "react";
import { AnalyticsResponse } from "../../types/analytics";
import KeyInsights from "../Summary/KeyInsights/KeyInsights";
import TopUsers from "../Summary/TopUsers/TopUsers";
import UsageTrendsChart from "../Charts/UsageTrendsChart/UsageTrendsChart";
import CompanyComparisonChart from "../Charts/CompanyComparisonChart/CompanyComparisonChart";

interface DashboardGridProps {
  analytics: AnalyticsResponse | null;
  loading: boolean;
  companyId: string;
}

const DashboardGrid: React.FC<DashboardGridProps> = ({
  analytics,
  loading,
  companyId,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
      {/* Left Column - Key Insights & Top Users */}
      <div className="lg:col-span-3 space-y-6">
        {/* Key Insights */}
        <KeyInsights summary={analytics?.summary} loading={loading} />

        {/* Top Active Users */}
        <TopUsers topUsers={analytics?.topUsers || []} loading={loading} />
      </div>

      {/* Right Column - Charts */}
      <div className="lg:col-span-7 space-y-6">
        {/* Usage Trends Chart */}
        <UsageTrendsChart
          trends={analytics?.trends || { trends: {} }}
          loading={loading}
          companyId={companyId || "all"}
          companies={analytics?.companies || []}
        />

        {/* Company Comparison Chart */}
        <CompanyComparisonChart
          companies={analytics?.companies || []}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default DashboardGrid;
