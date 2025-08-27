import React from "react";
import CommonBarChart from "../Common/CommonBarChart";
import CommonTooltip from "../Common/CommonTooltip";
import { ChartDataItem } from "../../../utils/companyComparisonUtils";

interface CompanyComparisonChartContentProps {
  chartData: ChartDataItem[];
}

const CompanyComparisonChartContent: React.FC<
  CompanyComparisonChartContentProps
> = ({ chartData }) => {
  // Get chart configuration
  const chartConfig = {
    bars: [
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
    ],
    xAxisConfig: {
      angle: -45,
      height: 80,
      fontSize: 14,
      tickFormatter: (value: string) => {
        // Show full company name without truncation
        return value;
      },
    },
    yAxisConfig: {
      tickFormatter: (value: number) => value.toLocaleString(),
    },
    margin: { top: 20, right: 30, left: 20, bottom: 80 },
    barSize: 40,
  };

  return (
    <div className="flex-1 overflow-hidden min-w-0">
      <CommonBarChart
        data={chartData}
        xAxisDataKey="name"
        bars={chartConfig.bars}
        xAxisConfig={chartConfig.xAxisConfig}
        yAxisConfig={chartConfig.yAxisConfig}
        tooltip={(props) => (
          <CommonTooltip {...props} isCompanyComparison={true} />
        )}
        margin={chartConfig.margin}
        barSize={chartConfig.barSize}
        height="100%"
        useDateFormatting={false}
      />
    </div>
  );
};

export default CompanyComparisonChartContent;
