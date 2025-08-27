import React from "react";
import CommonLineChart from "./CommonLineChart";
import CommonBarChart from "./CommonBarChart";
import { ViewMode, ChartType } from "../../../utils/usageTrendsUtils";
import { getCompanyColor } from "../../../utils/usageTrendsUtils";

interface ChartContentProps {
  chartType: ChartType;
  chartData: any[];
  showMultiline: boolean;
  companyNames: string[];
  viewMode: ViewMode;
  tooltip: React.ComponentType<any>;
}

const ChartContent: React.FC<ChartContentProps> = ({
  chartType,
  chartData,
  showMultiline,
  companyNames,
  viewMode,
  tooltip,
}) => {
  if (chartType === "line") {
    if (showMultiline) {
      // Render multiple lines for different companies
      const lines = companyNames.map((companyName, index) => ({
        dataKey: companyName,
        stroke: getCompanyColor(index),
        name: companyName,
        strokeWidth: 2,
        fill: `url(#color${companyName.replace(/\s+/g, "")})`,
        fillOpacity: 0.1,
        dot: {
          fill: getCompanyColor(index),
          stroke: "#FFFFFF",
          r: 3,
          strokeWidth: 1,
        },
        activeDot: {
          r: 5,
          stroke: "#FFFFFF",
          strokeWidth: 2,
          fill: getCompanyColor(index),
        },
      }));

      return (
        <CommonLineChart
          data={chartData}
          xAxisDataKey="date"
          lines={lines}
          tooltip={tooltip}
          legend={true}
          margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
          height="100%"
          viewMode={viewMode}
        />
      );
    } else {
      // Render single line for specific company
      const lines = [
        {
          dataKey: "events",
          stroke: "#3B82F6",
          name: "Events",
          strokeWidth: 3,
          fill: "url(#colorEvents)",
          fillOpacity: 0.3,
          dot: {
            fill: "#3B82F6",
            stroke: "#FFFFFF",
            r: 4,
            strokeWidth: 2,
          },
          activeDot: {
            r: 6,
            stroke: "#FFFFFF",
            strokeWidth: 3,
            fill: "#3B82F6",
          },
        },
      ];

      return (
        <CommonLineChart
          data={chartData}
          xAxisDataKey="date"
          lines={lines}
          tooltip={tooltip}
          legend={false}
          margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
          height="100%"
          viewMode={viewMode}
        />
      );
    }
  } else {
    // Bar chart
    if (showMultiline) {
      const bars = companyNames.map((companyName, index) => ({
        dataKey: companyName,
        fill: getCompanyColor(index),
        name: companyName,
        radius: [4, 4, 0, 0],
      }));

      return (
        <CommonBarChart
          data={chartData}
          xAxisDataKey="date"
          bars={bars}
          xAxisConfig={{
            angle: -45,
            height: 60,
            fontSize: 10,
          }}
          yAxisConfig={{
            tickFormatter: (value: any) => value.toLocaleString(),
          }}
          tooltip={tooltip}
          legend={true}
          margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
          barSize={30}
          height="100%"
          viewMode={viewMode}
          useDateFormatting={true}
        />
      );
    } else {
      const bars = [
        {
          dataKey: "events",
          fill: "#3B82F6",
          name: "Events",
          radius: [4, 4, 0, 0],
        },
      ];

      return (
        <CommonBarChart
          data={chartData}
          xAxisDataKey="date"
          bars={bars}
          xAxisConfig={{
            angle: -45,
            height: 60,
            fontSize: 10,
          }}
          yAxisConfig={{
            tickFormatter: (value: any) => value.toLocaleString(),
          }}
          tooltip={tooltip}
          legend={false}
          margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
          barSize={30}
          height="100%"
          viewMode={viewMode}
          useDateFormatting={true}
        />
      );
    }
  }
};

export default ChartContent;
