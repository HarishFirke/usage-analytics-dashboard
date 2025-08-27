import { UsageTrends } from "../types/analytics";
import {
  aggregateToWeekly,
  aggregateToMonthly,
  optimizeDailyData,
  aggregateToWeeklyCompany,
  aggregateToMonthlyCompany,
} from "./chartUtils";

export type ViewMode = "daily" | "weekly" | "monthly";
export type ChartType = "line" | "bar";

/**
 * Check if we should show multiline chart (when "All Companies" is selected)
 */
export const shouldShowMultiline = (
  companyId: string,
  trends: UsageTrends
): boolean => {
  return (
    companyId === "all" &&
    trends?.trends &&
    Object.keys(trends.trends).length > 1
  );
};

/**
 * Get company name from companyId
 */
export const getCompanyName = (
  id: string,
  companies: Array<{ id: string; name: string }>
): string => {
  if (id === "all") return "All Companies";
  const company = companies.find((c) => c.id === id);
  return company ? company.name : id;
};

/**
 * Get subtitle based on view mode and company selection
 */
export const getSubtitle = (
  showMultiline: boolean,
  companyId: string,
  companies: Array<{ id: string; name: string }>
): string => {
  if (showMultiline) {
    return "Usage patterns across all companies";
  }
  if (companyId === "all") {
    return "Aggregated usage patterns";
  }
  return `Usage patterns for ${getCompanyName(companyId, companies)}`;
};

/**
 * Process chart data for multiline chart (multiple companies)
 */
export const processMultilineChartData = (
  trends: UsageTrends,
  viewMode: ViewMode
): Array<{ date: string; [key: string]: any }> => {
  if (!trends?.trends || Object.keys(trends.trends).length === 0) {
    return [];
  }

  try {
    let result: Array<{ date: string; [key: string]: any }> = [];

    switch (viewMode) {
      case "daily":
        const dateMap = new Map<string, { date: string; [key: string]: any }>();

        Object.entries(trends.trends).forEach(
          ([companyName, companyTrends]) => {
            companyTrends.forEach((trend) => {
              if (!dateMap.has(trend.date)) {
                dateMap.set(trend.date, { date: trend.date });
              }
              const dateData = dateMap.get(trend.date)!;
              dateData[companyName] = trend.events;
            });
          }
        );

        result = Array.from(dateMap.values()).sort((a, b) =>
          a.date.localeCompare(b.date)
        );
        break;

      case "weekly":
        result = aggregateToWeeklyCompany(trends.trends);
        break;

      case "monthly":
        result = aggregateToMonthlyCompany(trends.trends);
        break;

      default:
        result = [];
    }
    return result;
  } catch (error) {
    console.error("Error processing multiline chart data:", error);
    return [];
  }
};

/**
 * Process chart data for single company chart
 */
export const processSingleCompanyChartData = (
  trends: UsageTrends,
  viewMode: ViewMode
): Array<{ date: string; events: number }> => {
  if (!trends?.trends || Object.keys(trends.trends).length === 0) {
    return [];
  }

  try {
    let result: Array<{ date: string; events: number }> = [];

    // Get the first (and only) company's trends
    const companyTrends = Object.values(trends.trends)[0];

    switch (viewMode) {
      case "daily":
        result = optimizeDailyData(companyTrends);
        break;
      case "weekly":
        result = aggregateToWeekly(companyTrends);
        break;
      case "monthly":
        result = aggregateToMonthly(companyTrends);
        break;
      default:
        result = [];
    }
    return result;
  } catch (error) {
    console.error("Error processing single line chart data:", error);
    return [];
  }
};

/**
 * Get unique company names for legend
 */
export const getCompanyNames = (
  showMultiline: boolean,
  trends: UsageTrends
): string[] => {
  if (!showMultiline || !trends?.trends) return [];
  return Object.keys(trends.trends).sort();
};

/**
 * Generate colors for different companies
 */
export const getCompanyColor = (index: number): string => {
  const colors = [
    "#3B82F6",
    "#EF4444",
    "#10B981",
    "#F59E0B",
    "#8B5CF6",
    "#F97316",
    "#06B6D4",
    "#84CC16",
  ];
  return colors[index % colors.length];
};

/**
 * Get chart data for the specified view mode
 */
export const getChartData = (
  trends: UsageTrends,
  viewMode: ViewMode,
  showMultiline: boolean
): Array<{ date: string; [key: string]: any }> => {
  try {
    // Validate input data
    if (!trends || !trends.trends) {
      console.warn("getChartData: No trends data provided");
      return [];
    }

    if (Object.keys(trends.trends).length === 0) {
      console.warn("getChartData: Empty trends data");
      return [];
    }

    console.log(
      `getChartData: Processing ${viewMode} view, multiline: ${showMultiline}`
    );

    if (showMultiline) {
      const result = processMultilineChartData(trends, viewMode);
      console.log(
        `getChartData: Multiline result - ${result.length} data points`
      );
      return result;
    } else {
      const result = processSingleCompanyChartData(trends, viewMode);
      console.log(
        `getChartData: Single company result - ${result.length} data points`
      );
      return result;
    }
  } catch (error) {
    console.error("getChartData: Error processing chart data:", error);
    console.error("Input data:", { trends, viewMode, showMultiline });
    return [];
  }
};
