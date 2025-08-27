import React from "react";
import { Card, CardContent } from "../../../shared/ui/card";
import { DashboardSummary } from "../../../types/analytics";
import { hasNoSummaryData } from "../../../utils/keyInsightsUtils";
import EmptyState from "../../../shared/components/EmptyState";
import KeyInsightsHeader from "./KeyInsightsHeader";
import InsightsGrid from "./InsightsGrid";
import { AlertCircle } from "lucide-react";
import LoadingState from "../../../shared/components/LoadingState";

interface KeyInsightsProps {
  summary?: DashboardSummary;
  loading?: boolean;
}

const KeyInsights: React.FC<KeyInsightsProps> = ({
  summary,
  loading = false,
}) => {
  if (loading) {
    return (
      <LoadingState
        height="h-[420px]"
        contentHeight="h-[300px]"
        showSkeleton={true}
      />
    );
  }

  // Check if there's no summary data
  if (hasNoSummaryData(summary)) {
    return (
      <EmptyState
        title="Key Insights"
        subtitle="Key metrics and performance indicators"
        icon={AlertCircle}
        iconBgColor="bg-amber-500"
        message="No insights data available"
        height="h-[420px]"
        contentHeight="h-[300px]"
      />
    );
  }

  return (
    <Card className="h-[420px] shadow-xl border border-gray-200/50 bg-gradient-to-br from-white to-gray-50/30 hover:shadow-2xl transition-all duration-500">
      <KeyInsightsHeader />
      <CardContent className="h-[300px] pt-2 px-6 pb-6">
        <InsightsGrid summary={summary} />
      </CardContent>
    </Card>
  );
};

export default KeyInsights;
