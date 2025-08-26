import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { DashboardSummary } from "../../types/analytics";
import { BarChart3, Building2, TrendingUp, Calendar } from "lucide-react";

interface KeyInsightsProps {
  summary?: DashboardSummary;
  loading?: boolean;
}

const KeyInsights: React.FC<KeyInsightsProps> = ({
  summary,
  loading = false,
}) => {
  // Calculate average events per day based on actual data
  const averageEventsPerDay =
    summary?.totalEvents && summary.totalEvents > 0
      ? Math.round(summary.totalEvents / 30).toString() // Round to nearest integer
      : "0";

  if (loading) {
    return (
      <div className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-32 bg-gray-100 rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Check if there's no summary data
  if (!summary || (summary.totalEvents === 0 && summary.totalCompanies === 0)) {
    return (
      <Card className="mb-4 shadow-xl border border-gray-200/50 bg-gradient-to-br from-white to-gray-50/30">
        <CardHeader className="pb-1">
          <CardTitle className="text-base font-bold flex items-center text-gray-800">
            <div className="w-4 h-4 mr-2 bg-amber-500 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
            Key Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-2 px-3">
          <div className="flex items-center justify-center h-32">
            <p className="text-muted-foreground text-center">
              No insights data available
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-4 shadow-xl border border-gray-200/50 bg-gradient-to-br from-white to-gray-50/30 hover:shadow-2xl transition-all duration-500">
      <CardHeader className="pb-1">
        <CardTitle className="text-base font-bold flex items-center text-gray-800">
          <div className="w-4 h-4 mr-2 bg-amber-500 rounded-full flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>
          Key Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-2 px-3">
        <div className="grid grid-cols-2 gap-3">
          {/* Total Events */}
          <div className="p-1 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-lg border border-blue-200/30 hover:border-blue-300 hover:bg-blue-100/70 transition-all duration-300 group cursor-pointer">
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <BarChart3 className="w-3 h-3 text-blue-600 mr-1" />
                <p className="text-xs font-medium text-blue-700 opacity-80">
                  TOTAL EVENTS
                </p>
              </div>
              <p className="text-sm font-bold text-blue-800 group-hover:text-blue-900 transition-colors duration-300">
                {summary?.totalEvents?.toLocaleString() || "0"}
              </p>
            </div>
          </div>

          {/* Companies */}
          <div className="p-1 bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-lg border border-emerald-200/30 hover:border-emerald-300 hover:bg-emerald-100/70 transition-all duration-300 group cursor-pointer">
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <Building2 className="w-3 h-3 text-emerald-600 mr-1" />
                <p className="text-xs font-medium text-emerald-700 opacity-80">
                  COMPANIES
                </p>
              </div>
              <p className="text-sm font-bold text-emerald-800 group-hover:text-emerald-900 transition-colors duration-300">
                {summary?.totalCompanies || "0"}
              </p>
            </div>
          </div>

          {/* Average Events Per Day */}
          <div className="p-1 bg-gradient-to-br from-indigo-50 to-indigo-100/50 rounded-lg border border-indigo-200/30 hover:border-indigo-300 hover:bg-indigo-100/70 transition-all duration-300 group cursor-pointer">
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <TrendingUp className="w-3 h-3 text-indigo-600 mr-1" />
                <p className="text-xs font-medium text-indigo-700 opacity-80">
                  AVG EVENTS/DAY
                </p>
              </div>
              <p className="text-sm font-bold text-indigo-800 group-hover:text-indigo-900 transition-colors duration-300">
                {averageEventsPerDay}
              </p>
            </div>
          </div>

          {/* Peak Usage Day */}
          <div className="p-1 bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-lg border border-purple-200/30 hover:border-purple-300 hover:bg-purple-100/70 transition-all duration-300 group cursor-pointer">
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <Calendar className="w-3 h-3 text-purple-600 mr-1" />
                <p className="text-xs font-medium text-purple-700 opacity-80">
                  PEAK USAGE DAY
                </p>
              </div>
              <p className="text-sm font-bold text-purple-800 group-hover:text-purple-900 transition-colors duration-300 truncate">
                {summary?.peakUsageDay || "N/A"}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default KeyInsights;
