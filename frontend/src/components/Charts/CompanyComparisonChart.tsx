import React, { useMemo } from "react";
import { Company } from "../../types/analytics";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Loader2 } from "lucide-react";
import { Building2 } from "lucide-react";
import CommonBarChart from "./CommonBarChart";

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

    const result = companies.slice(0, MAX_COMPANIES).map((company) => ({
      name: company.name, // Use full company name
      events: company.eventCount,
      users: company.activeUsers,
      fullName: company.name,
    }));

    return result;
  }, [companies]);

  // Loading state
  if (loading) {
    return (
      <Card className="h-[400px] flex items-center justify-center">
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
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-bold flex items-center text-gray-800">
            <div className="w-7 h-7 mr-3 bg-emerald-500 rounded-lg flex items-center justify-center">
              <Building2 className="w-4 h-4 text-white" />
            </div>
            Company Comparison
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Event counts by company
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

  // Custom tooltip for company comparison
  const CompanyTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-800 mb-2">{label}</p>
          <div className="space-y-1">
            {payload.map((entry: any, index: number) => (
              <div key={index} className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: entry.color || entry.fill }}
                  ></div>
                  <span className="text-sm text-gray-600">
                    {entry.name === "events" ? "Events" : "Users"}:
                  </span>
                </div>
                <span className="text-sm font-semibold text-gray-800">
                  {entry.value?.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="h-[520px] shadow-xl border border-gray-200/50 bg-gradient-to-br from-white to-gray-50/30 hover:shadow-2xl transition-all duration-500">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-bold flex items-center text-gray-800">
          <div className="w-7 h-7 mr-3 bg-emerald-500 rounded-lg flex items-center justify-center">
            <Building2 className="w-4 h-4 text-white" />
          </div>
          Company Comparison
        </CardTitle>
        <p className="text-sm text-muted-foreground">Event counts by company</p>
      </CardHeader>
      <CardContent className="h-[480px] px-3 flex flex-col">
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

        {/* Chart using CommonBarChart component */}
        <div className="flex-1 overflow-hidden min-w-0">
          <CommonBarChart
            data={chartData}
            xAxisDataKey="name"
            bars={[
              {
                dataKey: "events",
                fill: "#3B82F6",
                name: "Events",
                radius: [4, 4, 0, 0],
              },
              {
                dataKey: "users",
                fill: "#EF4444",
                name: "Users",
                radius: [4, 4, 0, 0],
              },
            ]}
            xAxisConfig={{
              angle: -45,
              height: 80,
              fontSize: 14,
              tickFormatter: (value: string) => {
                // Show full company name without truncation
                return value;
              },
            }}
            yAxisConfig={{
              tickFormatter: (value: number) => value.toLocaleString(),
            }}
            tooltip={CompanyTooltip}
            margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
            barSize={40}
            height="100%"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default CompanyComparisonChart;
