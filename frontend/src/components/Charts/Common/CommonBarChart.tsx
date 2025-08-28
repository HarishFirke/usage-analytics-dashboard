import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { formatDateForDisplay } from "../../../utils/chartUtils";
import { ViewMode } from "../../../utils/usageTrendsUtils";

interface CommonBarChartProps {
  data: any[];
  xAxisDataKey: string;
  bars: Array<{
    dataKey: string;
    fill: string;
    name: string;
    radius?: number[];
  }>;
  xAxisConfig?: {
    angle?: number;
    height?: number;
    fontSize?: number;
    interval?: number;
    tickFormatter?: (value: any) => string;
  };
  yAxisConfig?: {
    tickFormatter?: (value: any) => string;
  };
  tooltip?: React.ComponentType<any>;
  legend?: boolean;
  margin?: { top: number; right: number; left: number; bottom: number };
  barSize?: number;
  height?: string | number;
  viewMode?: ViewMode;
  useDateFormatting?: boolean;
}

const CommonBarChart: React.FC<CommonBarChartProps> = ({
  data,
  xAxisDataKey,
  bars,
  xAxisConfig = {},
  yAxisConfig = {},
  tooltip,
  legend = false,
  margin = { top: 20, right: 30, left: 20, bottom: 60 },
  barSize = 30,
  height = "100%",
  viewMode = "daily",
  useDateFormatting = false,
}) => {
  const defaultXAxisConfig = {
    angle: -45,
    height: 60,
    fontSize: 10,
    interval: useDateFormatting && viewMode === "daily" ? 1 : 0,
    tickFormatter: useDateFormatting
      ? (value: any) => formatDateForDisplay(value, viewMode)
      : (value: any) => value,
    ...xAxisConfig,
  };

  const defaultYAxisConfig = {
    tickFormatter: (value: any) => value.toLocaleString(),
    ...yAxisConfig,
  };

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={margin}>
        <defs>
          {bars.map((bar) => (
            <linearGradient
              key={bar.dataKey}
              id={`barColor${bar.dataKey}`}
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop offset="5%" stopColor={bar.fill} stopOpacity={0.8} />
              <stop offset="95%" stopColor={bar.fill} stopOpacity={0.6} />
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" strokeWidth={1} />
        <XAxis
          dataKey={xAxisDataKey}
          stroke="#6B7280"
          fontSize={defaultXAxisConfig.fontSize}
          tickLine={false}
          axisLine={{ stroke: "#E5E7EB", strokeWidth: 1 }}
          interval={defaultXAxisConfig.interval}
          minTickGap={15}
          angle={defaultXAxisConfig.angle}
          textAnchor="end"
          height={defaultXAxisConfig.height}
          tickFormatter={defaultXAxisConfig.tickFormatter}
        />
        <YAxis
          stroke="#6B7280"
          fontSize={10}
          tickLine={false}
          axisLine={{ stroke: "#E5E7EB", strokeWidth: 1 }}
          tickFormatter={defaultYAxisConfig.tickFormatter}
        />
        {tooltip && <Tooltip content={tooltip as any} />}
        {bars.map((bar) => (
          <Bar
            key={bar.dataKey}
            dataKey={bar.dataKey}
            fill={bar.fill}
            name={bar.name}
            barSize={barSize}
          />
        ))}
        {legend && <Legend />}
      </BarChart>
    </ResponsiveContainer>
  );
};

export default CommonBarChart;
