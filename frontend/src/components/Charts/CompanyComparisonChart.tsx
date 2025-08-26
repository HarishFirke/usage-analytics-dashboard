import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Company } from "../../types/analytics";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Loader2 } from "lucide-react";
import { BarChart3 } from "lucide-react";

interface CompanyComparisonChartProps {
  companies: Company[];
  loading?: boolean;
}

interface ChartDataItem {
  name: string;
  events: number;
  users: number;
  fullName: string;
}

const CompanyComparisonChart: React.FC<CompanyComparisonChartProps> = ({
  companies,
  loading = false,
}) => {
  // Memoize chart data for performance and company name processing
  const chartData = useMemo((): ChartDataItem[] => {
    if (!companies || companies.length === 0) {
      return [];
    }

    const MAX_COMPANIES = 5;
    const MAX_NAME_LENGTH = 15;

    const result = companies.slice(0, MAX_COMPANIES).map((company) => ({
      name:
        company.name.length > MAX_NAME_LENGTH
          ? `${company.name.substring(0, MAX_NAME_LENGTH)}...`
          : company.name,
      events: company.eventCount,
      users: company.activeUsers,
      fullName: company.name,
    }));

    return result;
  }, [companies]);

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
      <Card className="h-[520px] shadow-xl border border-gray-200/50 bg-gradient-to-br from-white to-gray-50/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl font-bold flex items-center text-gray-800">
            <div className="w-6 h-6 mr-3 bg-gradient-to-br from-green-600 to-emerald-600 rounded-lg flex items-center justify-center shadow-md">
              <BarChart3 className="h-4 w-4 text-white" />
            </div>
            Company Comparison
          </CardTitle>
          <p className="text-sm text-gray-600 font-medium">
            Top 5 companies by event count
          </p>
        </CardHeader>
        <CardContent className="h-[410px] px-3 flex items-center justify-center">
          <p className="text-muted-foreground text-center">
            No company data available
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-[520px] shadow-xl border border-gray-200/50 bg-gradient-to-br from-white to-gray-50/30 hover:shadow-2xl transition-all duration-500">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-bold flex items-center text-gray-800">
          <div className="w-6 h-6 mr-3 bg-gradient-to-br from-green-600 to-emerald-600 rounded-lg flex items-center justify-center shadow-md">
            <BarChart3 className="h-4 w-4 text-white" />
          </div>
          Company Comparison
        </CardTitle>
        <p className="text-sm text-gray-600 font-medium">
          Top 5 companies by event count
        </p>
      </CardHeader>
      <CardContent className="h-[410px] px-3 flex flex-col">
        {/* Enhanced Legend */}
        <div className="flex items-center justify-center space-x-6 mb-0">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-blue-600 rounded shadow-sm"></div>
            <span className="text-sm font-semibold text-gray-700">Events</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-500 rounded shadow-sm"></div>
            <span className="text-sm font-semibold text-gray-700">Users</span>
          </div>
        </div>

        {/* Enhanced Chart */}
        <div className="flex-1 overflow-hidden min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 15, bottom: 10 }}
            >
              <defs>
                <linearGradient id="colorEvents" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.9} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.7} />
                </linearGradient>
                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EF4444" stopOpacity={0.9} />
                  <stop offset="95%" stopColor="#EF4444" stopOpacity={0.7} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#E5E7EB"
                strokeWidth={0.5}
                opacity={0.6}
              />
              <XAxis
                dataKey="name"
                stroke="#6B7280"
                fontSize={9}
                tickLine={false}
                axisLine={{ stroke: "#E5E7EB", strokeWidth: 1 }}
                interval={0}
                minTickGap={5}
                angle={-45}
                textAnchor="end"
                height={40}
                tick={{ fill: "#6B7280", fontSize: 8 }}
                tickFormatter={(value) => {
                  // Truncate long company names to fit better
                  if (value.length > 8) {
                    return value.substring(0, 6) + "...";
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
                  backgroundColor: "rgba(255, 255, 255, 0.98)",
                  border: "1px solid #E5E7EB",
                  borderRadius: "6px",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                  backdropFilter: "blur(8px)",
                  maxWidth: "120px",
                  padding: "6px 8px",
                  fontSize: "10px",
                }}
                labelStyle={{
                  fontWeight: "600",
                  color: "#374151",
                  fontSize: "10px",
                  marginBottom: "2px",
                }}
                formatter={(value: any, name: string) => [
                  value.toLocaleString(),
                  name === "events" ? "Events" : "Users",
                ]}
                labelFormatter={(label) => label}
                wrapperStyle={{ maxWidth: "120px" }}
              />
              <Bar
                dataKey="events"
                fill="url(#colorEvents)"
                radius={[4, 4, 0, 0]}
                className="hover:opacity-80 transition-opacity duration-200"
                barSize={18}
              />
              <Bar
                dataKey="users"
                fill="url(#colorUsers)"
                radius={[4, 4, 0, 0]}
                className="hover:opacity-80 transition-opacity duration-200"
                barSize={18}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default CompanyComparisonChart;
