import React, { useState, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { UsageTrends } from "../../types/analytics";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { TrendingUp, BarChart3 } from "lucide-react";
import {
  aggregateToWeekly,
  aggregateToMonthly,
  optimizeDailyData,
  formatDateForDisplay,
  aggregateToWeeklyCompany,
  aggregateToMonthlyCompany,
} from "../../utils/chartUtils";
import CommonBarChart from "./CommonBarChart";

interface UsageTrendsChartProps {
  trends: UsageTrends;
  loading?: boolean;
  companyId: string;
}

type ViewMode = "daily" | "weekly" | "monthly";
type ChartType = "line" | "bar";

const UsageTrendsChart: React.FC<UsageTrendsChartProps> = ({
  trends,
  loading = false,
  companyId,
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>("daily");
  const [chartType, setChartType] = useState<ChartType>("line");

  // Check if we should show multiline (when "All Companies" is selected)
  const showMultiline =
    companyId === "all" &&
    trends?.trends &&
    Object.keys(trends.trends).length > 1;

  // Get subtitle based on view mode
  const getSubtitle = () => {
    if (showMultiline) {
      return "Usage patterns across all companies";
    }
    if (companyId === "all") {
      return "Aggregated usage patterns";
    }
    return `Usage patterns for ${companyId}`;
  };

  // Memoize chart data for performance and view mode processing
  const chartData = useMemo(() => {
    if (showMultiline) {
      // Process company-specific trends for multiline chart
      if (!trends?.trends || Object.keys(trends.trends).length === 0) {
        return [];
      }

      try {
        let result: Array<{ date: string; [key: string]: any }> = [];

        switch (viewMode) {
          case "daily":
            const dateMap = new Map<
              string,
              { date: string; [key: string]: any }
            >();

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
    } else {
      // Process single company trends
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
    }
  }, [trends, viewMode, showMultiline]);

  // Get unique company names for legend
  const companyNames = useMemo(() => {
    if (!showMultiline || !trends?.trends) return [];
    return Object.keys(trends.trends).sort();
  }, [trends, showMultiline]);

  // Generate colors for different companies
  const getCompanyColor = (index: number) => {
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

  // Reusable tooltip component for both chart types
  const CustomTooltip = ({
    active,
    payload,
    label,
  }: {
    active?: boolean;
    payload?: Array<{
      value?: number;
      name?: string;
      color?: string;
      payload?: any;
    }>;
    label?: string;
  }) => {
    if (active && payload && payload.length) {
      if (showMultiline) {
        // Calculate total events for this date
        const totalEvents = payload.reduce((sum: number, entry) => {
          if (entry.value && typeof entry.value === "number") {
            return sum + entry.value;
          }
          return sum;
        }, 0);

        return (
          <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
            <p className="font-semibold text-gray-800 mb-2">
              {formatDateForDisplay(label || "", viewMode)}
            </p>
            <div className="space-y-1">
              {payload.map((entry, index: number) => {
                // Get the company name and color
                const companyName = entry.name || `Company ${index + 1}`;
                const companyColor = entry.color || getCompanyColor(index);

                return (
                  <div
                    key={index}
                    className="flex justify-between items-center"
                  >
                    <div className="flex items-center space-x-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{
                          backgroundColor: companyColor,
                        }}
                      ></div>
                      <span className="text-sm text-gray-600">
                        {companyName}:
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-gray-800">
                      {entry.value?.toLocaleString()}
                    </span>
                  </div>
                );
              })}
              <div className="border-t pt-1 mt-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-gray-800">
                    Total:
                  </span>
                  <span className="text-sm font-bold text-blue-600">
                    {totalEvents.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      } else {
        // Default tooltip for single line/bar
        return (
          <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
            <p className="font-semibold text-gray-800 mb-2">
              {formatDateForDisplay(label || "", viewMode)}
            </p>
            <p className="text-sm text-gray-600">
              Events:{" "}
              <span className="font-semibold text-gray-800">
                {payload[0]?.value?.toLocaleString()}
              </span>
            </p>
          </div>
        );
      }
    }
    return null;
  };

  if (loading) {
    return (
      <Card className="h-[600px] shadow-xl border border-gray-200/50 bg-gradient-to-br from-white to-gray-50/30">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-bold flex items-center text-gray-800">
            <div className="w-7 h-7 mr-3 bg-blue-500 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            Usage Trends
          </CardTitle>
          <p className="text-sm text-muted-foreground">{getSubtitle()}</p>
        </CardHeader>
        <CardContent className="h-[450px] px-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!chartData || chartData.length === 0) {
    return (
      <Card className="h-[580px] shadow-xl border border-gray-200/50 bg-gradient-to-br from-white to-gray-50/30">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-bold flex items-center text-gray-800">
            <div className="w-7 h-7 mr-3 bg-blue-500 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            Usage Trends
          </CardTitle>
          <p className="text-sm text-muted-foreground">{getSubtitle()}</p>
        </CardHeader>
        <CardContent className="h-[450px] px-6 flex items-center justify-center">
          <p className="text-muted-foreground text-center">
            No trend data available
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-[580px] shadow-xl border border-gray-200/50 bg-gradient-to-br from-white to-gray-50/30 hover:shadow-2xl transition-all duration-500">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-bold flex items-center text-gray-800">
          <div className="w-7 h-7 mr-3 bg-blue-500 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-white" />
          </div>
          Usage Trends
        </CardTitle>
        <p className="text-sm text-muted-foreground">{getSubtitle()}</p>
      </CardHeader>
      <CardContent className="h-[450px] px-6">
        {/* Chart Type Toggle */}
        <div className="flex items-center justify-between mb-6">
          {/* View Mode Tabs - Minimal Design */}
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            {(["daily", "weekly", "monthly"] as ViewMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200 ${
                  viewMode === mode
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </button>
            ))}
          </div>

          {/* Chart Type Toggle */}
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-600 font-medium">
              Chart Type:
            </span>
            <div className="flex bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setChartType("line")}
                className={`p-2 rounded-md transition-all duration-200 ${
                  chartType === "line"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
                title="Line Chart"
              >
                <TrendingUp className="w-4 h-4" />
              </button>
              <button
                onClick={() => setChartType("bar")}
                className={`p-2 rounded-md transition-all duration-200 ${
                  chartType === "bar"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
                title="Bar Chart"
              >
                <BarChart3 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="h-full">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === "line" ? (
              <LineChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
              >
                <defs>
                  {companyNames.map((companyName, index) => (
                    <linearGradient
                      key={companyName}
                      id={`color${companyName.replace(/\s+/g, "")}`}
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor={getCompanyColor(index)}
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="95%"
                        stopColor={getCompanyColor(index)}
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                  ))}
                  <linearGradient id="colorEvents" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#E5E7EB"
                  strokeWidth={1}
                />
                <XAxis
                  dataKey="date"
                  stroke="#6B7280"
                  fontSize={10}
                  tickLine={false}
                  axisLine={{ stroke: "#E5E7EB", strokeWidth: 1 }}
                  interval={viewMode === "daily" ? 2 : 0}
                  minTickGap={15}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                  tickFormatter={(value) =>
                    formatDateForDisplay(value, viewMode)
                  }
                />
                <YAxis
                  stroke="#6B7280"
                  fontSize={10}
                  tickLine={false}
                  axisLine={{ stroke: "#E5E7EB", strokeWidth: 1 }}
                  tickFormatter={(value) => value.toLocaleString()}
                />
                <Tooltip content={CustomTooltip} />
                {showMultiline ? (
                  // Render multiple lines for different companies
                  companyNames.map((companyName, index) => (
                    <Line
                      key={companyName}
                      type="monotone"
                      dataKey={companyName}
                      stroke={getCompanyColor(index)}
                      strokeWidth={2}
                      fill={`url(#color${companyName.replace(/\s+/g, "")})`}
                      fillOpacity={0.1}
                      name={companyName}
                      dot={{
                        fill: getCompanyColor(index),
                        stroke: "#FFFFFF",
                        r: 3,
                        strokeWidth: 1,
                      }}
                      activeDot={{
                        r: 5,
                        stroke: "#FFFFFF",
                        strokeWidth: 2,
                        fill: getCompanyColor(index),
                      }}
                    />
                  ))
                ) : (
                  // Render single line for specific company
                  <Line
                    type="monotone"
                    dataKey="events"
                    stroke="#3B82F6"
                    strokeWidth={3}
                    fill="url(#colorEvents)"
                    fillOpacity={0.3}
                    name="Events"
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
                )}
                {showMultiline && <Legend />}
              </LineChart>
            ) : (
              <CommonBarChart
                data={chartData}
                xAxisDataKey="date"
                bars={
                  showMultiline
                    ? companyNames.map((companyName, index) => ({
                        dataKey: companyName,
                        fill: getCompanyColor(index),
                        name: companyName,
                        radius: [4, 4, 0, 0],
                      }))
                    : [
                        {
                          dataKey: "events",
                          fill: "#3B82F6",
                          name: "Events",
                          radius: [4, 4, 0, 0],
                        },
                      ]
                }
                xAxisConfig={{
                  angle: -45,
                  height: 60,
                  fontSize: 10,
                  tickFormatter: (value) =>
                    formatDateForDisplay(value, viewMode),
                }}
                yAxisConfig={{
                  tickFormatter: (value) => value.toLocaleString(),
                }}
                tooltip={CustomTooltip}
                legend={showMultiline}
                margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                barSize={30}
                height="100%"
              />
            )}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default UsageTrendsChart;
