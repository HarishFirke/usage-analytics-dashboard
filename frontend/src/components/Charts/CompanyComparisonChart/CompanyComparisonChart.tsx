import React, { useMemo } from "react";
import { Company } from "../../../types/analytics";
import { Building2 } from "lucide-react";
import {
  processCompanyChartData,
  isChartDataEmpty,
  ChartDataItem,
} from "../../../utils/companyComparisonUtils";
import LoadingState from "../../../shared/components/LoadingState";
import EmptyState from "../../../shared/components/EmptyState";
import ChartContainer from "../Common/ChartContainer";
import ChartLegend from "../Common/ChartLegend";
import CompanyComparisonChartContent from "./CompanyComparisonChartContent";

interface CompanyComparisonChartProps {
  companies: Company[];
  loading?: boolean;
}

const CompanyComparisonChart: React.FC<CompanyComparisonChartProps> = ({
  companies,
  loading = false,
}) => {
  // Memoize chart data for performance and company name processing
  const chartData = useMemo((): ChartDataItem[] => {
    return processCompanyChartData(companies);
  }, [companies]);

  // Loading state
  if (loading) {
    return <LoadingState height="h-[400px]" />;
  }

  // Empty state
  if (isChartDataEmpty(chartData)) {
    return (
      <EmptyState
        title="Company Comparison"
        subtitle="Event counts by company"
        icon={Building2}
        iconBgColor="bg-emerald-500"
        message="No company data available"
      />
    );
  }

  // Legend items
  const legendItems = [
    { color: "#3B82F6", label: "Events" },
    { color: "#EF4444", label: "Users" },
  ];

  return (
    <ChartContainer
      title="Company Comparison"
      subtitle="Event counts by company"
      icon={Building2}
      iconBgColor="bg-emerald-500"
    >
      {/* Enhanced Legend */}
      <ChartLegend items={legendItems} />

      {/* Chart Content */}
      <CompanyComparisonChartContent chartData={chartData} />
    </ChartContainer>
  );
};

export default CompanyComparisonChart;
