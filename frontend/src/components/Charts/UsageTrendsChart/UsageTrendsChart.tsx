import React, { useState, useMemo } from "react";
import { UsageTrends } from "../../../types/analytics";
import { TrendingUp } from "lucide-react";
import {
  shouldShowMultiline,
  getSubtitle,
  getCompanyNames,
  getCompanyColor,
  ViewMode,
  ChartType,
  getChartData,
} from "../../../utils/usageTrendsUtils";
import CommonTooltip from "../Common/CommonTooltip";
import ChartControls from "../Common/ChartControls";
import ChartContent from "../Common/ChartContent";
import ChartContainer from "../Common/ChartContainer";
import LoadingState from "../../../shared/components/LoadingState";
import EmptyState from "../../../shared/components/EmptyState";

interface UsageTrendsChartProps {
  trends: UsageTrends;
  loading?: boolean;
  companyId: string;
  companies?: Array<{ id: string; name: string }>;
}

const UsageTrendsChart: React.FC<UsageTrendsChartProps> = ({
  trends,
  loading = false,
  companyId,
  companies = [],
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>("daily");
  const [chartType, setChartType] = useState<ChartType>("line");

  // Check if we should show multiline (when "All Companies" is selected)
  const showMultiline = shouldShowMultiline(companyId, trends);

  // Get subtitle based on view mode
  const subtitle = getSubtitle(showMultiline, companyId, companies);

  // Memoize chart data for performance and view mode processing
  const chartData = useMemo(() => {
    return getChartData(trends, viewMode, showMultiline);
  }, [trends, viewMode, showMultiline]);

  // Get unique company names for legend
  const companyNames = getCompanyNames(showMultiline, trends);

  // Create tooltip component with proper props
  const CustomTooltip = (props: any) => (
    <CommonTooltip
      {...props}
      viewMode={viewMode}
      showMultiline={showMultiline}
      getCompanyColor={getCompanyColor}
    />
  );

  // Loading state
  if (loading) {
    return (
      <LoadingState
        height="h-[580px]"
        contentHeight="h-[500px]"
        showSkeleton={true}
      />
    );
  }

  // No data state
  if (!chartData || chartData.length === 0) {
    return (
      <EmptyState
        title="Usage Trends"
        subtitle={subtitle}
        icon={TrendingUp}
        iconBgColor="bg-blue-500"
        message="No trend data available"
        height="h-[580px]"
        contentHeight="h-[500px]"
      />
    );
  }

  // Chart content
  return (
    <ChartContainer
      title="Usage Trends"
      subtitle={subtitle}
      icon={TrendingUp}
      iconBgColor="bg-blue-500"
      height="h-[580px]"
      contentHeight="h-[500px]"
      hoverEffect={true}
    >
      {/* Chart Controls */}
      <ChartControls
        viewMode={viewMode}
        chartType={chartType}
        onViewModeChange={setViewMode}
        onChartTypeChange={setChartType}
      />

      {/* Chart Content */}
      <div className="h-full">
        <ChartContent
          chartType={chartType}
          chartData={chartData}
          showMultiline={showMultiline}
          companyNames={companyNames}
          viewMode={viewMode}
          tooltip={CustomTooltip}
        />
      </div>
    </ChartContainer>
  );
};

export default UsageTrendsChart;
