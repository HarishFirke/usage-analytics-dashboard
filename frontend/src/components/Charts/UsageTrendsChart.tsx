import React, { useState, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { UsageTrends } from "../../types/analytics";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

import { Loader2, TrendingUp } from "lucide-react";
import {
  aggregateToWeekly,
  aggregateToMonthly,
  optimizeDailyData,
  formatDateForDisplay,
} from "../../utils/chartUtils";

interface UsageTrendsChartProps {
  trends: UsageTrends;
  loading?: boolean;
}

type ViewMode = "daily" | "weekly" | "monthly";

const UsageTrendsChart: React.FC<UsageTrendsChartProps> = ({
  trends,
  loading = false,
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>("daily");

  // Get subtitle based on view mode
  const getSubtitle = () => {
    switch (viewMode) {
      case "daily":
        return "Daily usage patterns";
      case "weekly":
        return "Weekly aggregated usage";
      case "monthly":
        return "Monthly aggregated usage";
      default:
        return "";
    }
  };

  // Memoize chart data for performance and view mode processing
  const chartData = useMemo(() => {
    if (!trends?.daily || trends.daily.length === 0) {
      return [];
    }

    try {
      let result: Array<{ date: string; events: number }> = [];
      switch (viewMode) {
        case "daily":
          const optimizedDaily = optimizeDailyData(trends.daily, 50); // Increased from 25 to 50 for more data points
          result = optimizedDaily.map((trend) => ({
            ...trend,
            date: new Date(trend.date).toISOString().split("T")[0],
          }));
          break;

        case "weekly":
          result = aggregateToWeekly(trends.daily).map((trend) => ({
            ...trend,
            date: formatDateForDisplay(
              trend.date,
              "weekly",
              trend.startDate,
              trend.endDate
            ),
          }));
          break;

        case "monthly":
          result = aggregateToMonthly(trends.daily).map((trend) => ({
            ...trend,
            date: formatDateForDisplay(trend.date, "monthly"),
          }));
          break;

        default:
          result = [];
      }

      return result;
    } catch (error) {
      console.error("Error processing chart data:", error);
      return [];
    }
  }, [trends, viewMode]);

  // Handle view mode change
  const handleViewModeChange = (mode: ViewMode) => setViewMode(mode);

  // Loading state
  if (loading) {
    return (
      <Card className="h-[500px] flex items-center justify-center">
        <CardContent>
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  // Empty state
  if (!chartData || chartData.length === 0) {
    return (
      <Card className="h-[520px] shadow-xl border border-gray-200/50 bg-gradient-to-br from-white to-gray-50/30 hover:shadow-2xl transition-all duration-500">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl font-bold flex items-center text-gray-800">
            <div className="w-6 h-6 mr-3 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-md">
              <TrendingUp className="h-4 w-4 text-white" />
            </div>
            Usage Trends
          </CardTitle>
          <p className="text-sm text-gray-600 font-medium">{getSubtitle()}</p>
        </CardHeader>
        <CardContent className="h-[370px] px-6 flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground mb-2">
              No trend data available
            </p>
            <p className="text-xs text-gray-400">
              Check your filters or try a different date range
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-[520px] shadow-xl border border-gray-200/50 bg-gradient-to-br from-white to-gray-50/30 hover:shadow-2xl transition-all duration-500">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-bold flex items-center text-gray-800">
          <div className="w-6 h-6 mr-3 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-md">
            <TrendingUp className="h-4 w-4 text-white" />
          </div>
          Usage Trends
        </CardTitle>
        <p className="text-sm text-gray-600 font-medium">{getSubtitle()}</p>
      </CardHeader>

      <CardContent className="h-[370px] px-6">
        {/* Enhanced Tabs */}
        <div className="flex space-x-1 mb-6 bg-gray-100/50 p-1 rounded-lg border border-gray-200/30">
          {(["daily", "weekly", "monthly"] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => handleViewModeChange(mode)}
              className={`flex-1 py-2 px-4 text-sm font-semibold rounded-md transition-all duration-300 ${
                viewMode === mode
                  ? "bg-white text-blue-700 shadow-md border border-blue-200/50 transform scale-105"
                  : "text-gray-600 hover:text-gray-800 hover:bg-white/50"
              }`}
            >
              {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </button>
          ))}
        </div>

        {/* Enhanced Chart */}
        <div className="h-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
            >
              <defs>
                <linearGradient id="colorEvents" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#E5E7EB"
                strokeWidth={0.5}
                opacity={0.6}
              />
              <XAxis
                dataKey="date"
                stroke="#6B7280"
                fontSize={10}
                tickLine={false}
                axisLine={{ stroke: "#E5E7EB", strokeWidth: 1 }}
                interval="preserveStartEnd"
                minTickGap={20}
                tickFormatter={(value) => {
                  if (viewMode === "daily") {
                    try {
                      const date = new Date(value);
                      if (!isNaN(date.getTime())) {
                        return date.toLocaleDateString("en-US", {
                          month: "short",
                          day: "2-digit",
                        });
                      }
                    } catch (error) {
                      // Fallback to original value if date parsing fails
                    }
                  } else if (viewMode === "weekly") {
                    // For weekly, the date is already formatted as "Jul 01 - Jul 07"
                    return value;
                  } else if (viewMode === "monthly") {
                    // For monthly, the date is already formatted as "Jul 2025"
                    return value;
                  }
                  return value;
                }}
              />
              <YAxis
                stroke="#6B7280"
                fontSize={12}
                tickLine={false}
                axisLine={{ stroke: "#E5E7EB", strokeWidth: 1 }}
                tickFormatter={(value) => value.toLocaleString()}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  border: "1px solid #E5E7EB",
                  borderRadius: "8px",
                  boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
                  backdropFilter: "blur(10px)",
                }}
                labelStyle={{ fontWeight: "bold", color: "#374151" }}
                formatter={(value: any) => [value.toLocaleString(), "Events"]}
                labelFormatter={(label) => `Date: ${label}`}
              />
              <Line
                type="monotone"
                dataKey="events"
                stroke="#3B82F6"
                strokeWidth={3}
                fill="url(#colorEvents)"
                fillOpacity={0.3}
                dot={{
                  fill: "#3B82F6",
                  stroke: "#FFFFFF",
                  r: 4,
                  strokeWidth: 2,
                }}
                activeDot={{
                  r: 6,
                  stroke: "#FFFFFF",
                  strokeWidth: 3,
                  fill: "#3B82F6",
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default UsageTrendsChart;
