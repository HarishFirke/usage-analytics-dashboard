import { DashboardSummary } from "../types/analytics";

// Calculate average events per day based on actual data
export const calculateAverageEventsPerDay = (
  summary?: DashboardSummary
): string => {
  if (summary?.totalEvents && summary.totalEvents > 0) {
    return Math.round(summary.totalEvents / 30).toString(); // Round to nearest integer
  }
  return "0";
};

// Format peak usage day for better display
export const formatPeakUsageDay = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    if (!isNaN(date.getTime())) {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    }
  } catch (error) {
    // Fallback to original string if parsing fails
  }
  return dateString;
};

// Check if there's no summary data
export const hasNoSummaryData = (summary?: DashboardSummary): boolean => {
  return (
    !summary || (summary.totalEvents === 0 && summary.totalCompanies === 0)
  );
};

// Insight card data configuration
export interface InsightCardData {
  id: string;
  title: string;
  value: string | number;
  icon: "BarChart3" | "Building2" | "TrendingUp" | "Calendar";
  bgColor: string;
  borderColor: string;
  textColor: string;
  hoverBgColor: string;
  hoverBorderColor: string;
  hoverTextColor: string;
}

export const getInsightCardsData = (
  summary?: DashboardSummary
): InsightCardData[] => {
  const averageEventsPerDay = calculateAverageEventsPerDay(summary);
  const peakUsageDay = summary?.peakUsageDay
    ? formatPeakUsageDay(summary.peakUsageDay)
    : "N/A";

  return [
    {
      id: "total-events",
      title: "TOTAL EVENTS",
      value: summary?.totalEvents?.toLocaleString() || "0",
      icon: "BarChart3",
      bgColor: "from-blue-50 to-blue-100/50",
      borderColor: "border-blue-200/30",
      textColor: "text-blue-800",
      hoverBgColor: "hover:bg-blue-100/70",
      hoverBorderColor: "hover:border-blue-300",
      hoverTextColor: "group-hover:text-blue-900",
    },
    {
      id: "companies",
      title: "COMPANIES",
      value: summary?.totalCompanies || "0",
      icon: "Building2",
      bgColor: "from-emerald-50 to-emerald-100/50",
      borderColor: "border-emerald-200/30",
      textColor: "text-emerald-800",
      hoverBgColor: "hover:bg-emerald-100/70",
      hoverBorderColor: "hover:border-emerald-300",
      hoverTextColor: "group-hover:text-emerald-900",
    },
    {
      id: "avg-events-per-day",
      title: "AVG EVENTS/DAY",
      value: averageEventsPerDay,
      icon: "TrendingUp",
      bgColor: "from-indigo-50 to-indigo-100/50",
      borderColor: "border-indigo-200/30",
      textColor: "text-indigo-800",
      hoverBgColor: "hover:bg-indigo-100/70",
      hoverBorderColor: "hover:border-indigo-300",
      hoverTextColor: "group-hover:text-indigo-900",
    },
    {
      id: "peak-usage-day",
      title: "PEAK USAGE DAY",
      value: peakUsageDay,
      icon: "Calendar",
      bgColor: "from-purple-50 to-purple-100/50",
      borderColor: "border-purple-200/30",
      textColor: "text-purple-800",
      hoverBgColor: "hover:bg-purple-100/70",
      hoverBorderColor: "hover:border-purple-300",
      hoverTextColor: "group-hover:text-purple-900",
    },
  ];
};
