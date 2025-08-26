import { UsageTrend } from "../types/analytics";

/**
 * Aggregates daily data into weekly view
 * @param dailyData - Array of daily usage trends
 * @returns Array of weekly aggregated trends with date range labels
 */
export const aggregateToWeekly = (
  dailyData: UsageTrend[]
): (UsageTrend & { startDate: string; endDate: string })[] => {
  if (!dailyData || dailyData.length === 0) {
    return [];
  }

  const weeklyData: {
    [key: string]: { events: number; startDate: string; endDate: string };
  } = {};

  dailyData.forEach((trend) => {
    const date = new Date(trend.date);
    if (isNaN(date.getTime())) return;

    // Create week key in format: MMM DD - MMM DD (e.g., Jul 01 - Jul 07) for internal grouping
    const year = date.getFullYear();
    const startOfYear = new Date(year, 0, 1);
    const days = Math.floor(
      (date.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000)
    );
    const weekNumber = Math.ceil((days + startOfYear.getDay() + 1) / 7);
    const weekKey = `${year}-W${weekNumber < 10 ? "0" : ""}${weekNumber}`;

    if (!weeklyData[weekKey]) {
      weeklyData[weekKey] = {
        events: 0,
        startDate: trend.date,
        endDate: trend.date,
      };
    } else {
      weeklyData[weekKey].events += trend.events;
      // Update start and end dates for the week
      if (trend.date < weeklyData[weekKey].startDate) {
        weeklyData[weekKey].startDate = trend.date;
      }
      if (trend.date > weeklyData[weekKey].endDate) {
        weeklyData[weekKey].endDate = trend.date;
      }
    }
  });

  // Convert to array and sort
  return Object.keys(weeklyData)
    .map((weekKey) => ({
      date: weekKey,
      events: weeklyData[weekKey].events,
      startDate: weeklyData[weekKey].startDate,
      endDate: weeklyData[weekKey].endDate,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
};

/**
 * Aggregates daily data into monthly view
 * @param dailyData - Array of daily usage trends
 * @returns Array of monthly aggregated trends
 */
export const aggregateToMonthly = (dailyData: UsageTrend[]): UsageTrend[] => {
  if (!dailyData || dailyData.length === 0) {
    return [];
  }

  const monthlyData: { [key: string]: number } = {};

  dailyData.forEach((trend) => {
    const date = new Date(trend.date);
    if (isNaN(date.getTime())) return;

    // Create month key in format: YYYY-MM (e.g., 2025-05)
    const monthKey = date.toISOString().slice(0, 7);
    monthlyData[monthKey] = (monthlyData[monthKey] || 0) + trend.events;
  });

  // Convert to array and sort
  return Object.keys(monthlyData)
    .map((date) => ({ date, events: monthlyData[date] }))
    .sort((a, b) => a.date.localeCompare(b.date));
};

/**
 * Optimizes daily data for better chart display by reducing data points when necessary
 * @param dailyData - Array of daily usage trends
 * @param maxPoints - Maximum number of data points to display (default: 30)
 * @returns Optimized array of daily trends
 */
export const optimizeDailyData = (
  dailyData: UsageTrend[],
  maxPoints: number = 30
): UsageTrend[] => {
  if (!dailyData || dailyData.length <= maxPoints) {
    return dailyData;
  }

  // If we have too many data points, sample them intelligently
  const step = Math.ceil(dailyData.length / maxPoints);
  const optimizedData: UsageTrend[] = [];

  for (let i = 0; i < dailyData.length; i += step) {
    optimizedData.push(dailyData[i]);
  }

  // Always include the last data point
  if (
    optimizedData[optimizedData.length - 1] !== dailyData[dailyData.length - 1]
  ) {
    optimizedData.push(dailyData[dailyData.length - 1]);
  }

  return optimizedData;
};

/**
 * Formats date for display based on view mode
 * @param dateString - Date string to format
 * @param viewMode - Current view mode (daily, weekly, monthly)
 * @param startDate - Start date for weekly view
 * @param endDate - End date for weekly view
 * @returns Formatted date string
 */
export const formatDateForDisplay = (
  dateString: string,
  viewMode: "daily" | "weekly" | "monthly",
  startDate?: string,
  endDate?: string
): string => {
  try {
    if (viewMode === "daily") {
      const date = new Date(dateString);
      if (!isNaN(date.getTime())) {
        return date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
      }
    } else if (viewMode === "weekly") {
      // Format: "Jul 01 - Jul 07" using startDate and endDate from weekly data
      if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
          const startFormatted = start.toLocaleDateString("en-US", {
            month: "short",
            day: "2-digit",
          });
          const endFormatted = end.toLocaleDateString("en-US", {
            month: "short",
            day: "2-digit",
          });
          return `${startFormatted} - ${endFormatted}`;
        }
      }
      // Fallback to week key if date parsing fails
      return dateString;
    } else if (viewMode === "monthly") {
      // Format: "May 2025", "Jun 2025", etc.
      const date = new Date(dateString + "-01");
      if (!isNaN(date.getTime())) {
        return date.toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        });
      }
    }
  } catch (error) {
    // Fallback to original string if parsing fails
  }

  return dateString;
};
