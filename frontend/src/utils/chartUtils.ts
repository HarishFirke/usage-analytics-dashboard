import { UsageTrend } from "../types/analytics";

// Aggregate daily data to weekly data
export const aggregateToWeekly = (dailyData: UsageTrend[]) => {
  if (dailyData.length === 0) return [];

  const weeklyMap = new Map<string, { date: string; events: number }>();

  dailyData.forEach((trend) => {
    const date = new Date(trend.date);
    const weekStart = getWeekStart(date);
    const weekKey = weekStart.toISOString().split("T")[0];

    if (!weeklyMap.has(weekKey)) {
      weeklyMap.set(weekKey, { date: weekKey, events: 0 });
    }

    const weekData = weeklyMap.get(weekKey)!;
    weekData.events += trend.events;
  });

  return Array.from(weeklyMap.values()).sort((a, b) =>
    a.date.localeCompare(b.date)
  );
};

// Aggregate daily data to monthly data
export const aggregateToMonthly = (dailyData: UsageTrend[]) => {
  if (dailyData.length === 0) return [];

  const monthlyMap = new Map<string, { date: string; events: number }>();

  dailyData.forEach((trend) => {
    const date = new Date(trend.date);
    const monthKey = `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}`;

    if (!monthlyMap.has(monthKey)) {
      monthlyMap.set(monthKey, { date: monthKey, events: 0 });
    }

    const monthData = monthlyMap.get(monthKey)!;
    monthData.events += trend.events;
  });

  return Array.from(monthlyMap.values()).sort((a, b) =>
    a.date.localeCompare(b.date)
  );
};

// Optimize daily data for chart display
export const optimizeDailyData = (dailyData: UsageTrend[]) => {
  if (dailyData.length === 0) return [];

  // If we have too many data points, sample them for better readability
  if (dailyData.length > 30) {
    const step = Math.ceil(dailyData.length / 30);
    return dailyData.filter((_, index) => index % step === 0);
  }

  return dailyData;
};

// Aggregate company trends to weekly data
export const aggregateToWeeklyCompany = (companyTrends: {
  [companyName: string]: UsageTrend[];
}) => {
  const weeklyMap = new Map<string, { date: string; [key: string]: any }>();

  Object.entries(companyTrends).forEach(([companyName, trends]) => {
    trends.forEach((trend) => {
      const date = new Date(trend.date);
      const weekStart = getWeekStart(date);
      const weekKey = weekStart.toISOString().split("T")[0];

      if (!weeklyMap.has(weekKey)) {
        weeklyMap.set(weekKey, { date: weekKey });
      }

      const weekData = weeklyMap.get(weekKey)!;
      if (!weekData[companyName]) {
        weekData[companyName] = 0;
      }
      weekData[companyName] += trend.events;
    });
  });

  return Array.from(weeklyMap.values()).sort((a, b) =>
    a.date.localeCompare(b.date)
  );
};

// Aggregate company trends to monthly data
export const aggregateToMonthlyCompany = (companyTrends: {
  [companyName: string]: UsageTrend[];
}) => {
  const monthlyMap = new Map<string, { date: string; [key: string]: any }>();

  Object.entries(companyTrends).forEach(([companyName, trends]) => {
    trends.forEach((trend) => {
      const date = new Date(trend.date);
      const monthKey = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;

      if (!monthlyMap.has(monthKey)) {
        monthlyMap.set(monthKey, { date: monthKey });
      }

      const monthData = monthlyMap.get(monthKey)!;
      if (!monthData[companyName]) {
        monthData[companyName] = 0;
      }
      monthData[companyName] += trend.events;
    });
  });

  return Array.from(monthlyMap.values()).sort((a, b) =>
    a.date.localeCompare(b.date)
  );
};

// Helper function to get week start
const getWeekStart = (date: Date): Date => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
};

// Format date for display
export const formatDateForDisplay = (
  dateString: string,
  viewMode: "daily" | "weekly" | "monthly"
) => {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;

    switch (viewMode) {
      case "daily":
        return date.toLocaleDateString("en-US", {
          month: "short",
          day: "2-digit",
        });
      case "weekly":
        const endDate = new Date(date);
        endDate.setDate(date.getDate() + 6);
        const startStr = date.toLocaleDateString("en-US", {
          month: "short",
          day: "2-digit",
        });
        const endStr = endDate.toLocaleDateString("en-US", {
          month: "short",
          day: "2-digit",
        });
        return `${startStr} - ${endStr}`;
      case "monthly":
        return date.toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        });
      default:
        return dateString;
    }
  } catch (error) {
    return dateString;
  }
};
