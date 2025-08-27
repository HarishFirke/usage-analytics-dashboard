import React from "react";
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
import { formatDateForDisplay } from "../../../utils/chartUtils";
import { ViewMode } from "../../../utils/usageTrendsUtils";

interface LineData {
  dataKey: string;
  stroke: string;
  name: string;
  fill?: string;
  fillOpacity?: number;
  strokeWidth?: number;
  dot?: {
    fill: string;
    stroke: string;
    r: number;
    strokeWidth: number;
  };
  activeDot?: {
    r: number;
    stroke: string;
    strokeWidth: number;
    fill: string;
  };
}

interface CommonLineChartProps {
  data: any[];
  xAxisDataKey: string;
  lines: LineData[];
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
  height?: string | number;
  viewMode?: ViewMode;
}

const CommonLineChart: React.FC<CommonLineChartProps> = ({
  data,
  xAxisDataKey,
  lines,
  xAxisConfig = {},
  yAxisConfig = {},
  tooltip,
  legend = false,
  margin = { top: 20, right: 30, left: 20, bottom: 60 },
  height = "100%",
  viewMode = "daily",
}) => {
  const defaultXAxisConfig = {
    angle: -45,
    height: 60,
    fontSize: 10,
    interval: viewMode === "daily" ? 2 : 0,
    tickFormatter: (value: any) => formatDateForDisplay(value, viewMode),
    ...xAxisConfig,
  };

  const defaultYAxisConfig = {
    tickFormatter: (value: any) => value.toLocaleString(),
    ...yAxisConfig,
  };

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={margin}>
        <defs>
          {lines.map((line) => (
            <linearGradient
              key={line.dataKey}
              id={`color${line.dataKey.replace(/\s+/g, "")}`}
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop offset="5%" stopColor={line.stroke} stopOpacity={0.8} />
              <stop offset="95%" stopColor={line.stroke} stopOpacity={0.1} />
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
        {lines.map((line) => (
          <Line
            key={line.dataKey}
            type="monotone"
            dataKey={line.dataKey}
            stroke={line.stroke}
            strokeWidth={line.strokeWidth || 2}
            fill={line.fill || `url(#color${line.dataKey.replace(/\s+/g, "")})`}
            fillOpacity={line.fillOpacity || 0.1}
            name={line.name}
            dot={
              line.dot || {
                fill: line.stroke,
                stroke: "#FFFFFF",
                r: 3,
                strokeWidth: 1,
              }
            }
            activeDot={
              line.activeDot || {
                r: 5,
                stroke: "#FFFFFF",
                strokeWidth: 2,
                fill: line.stroke,
              }
            }
          />
        ))}
        {legend && <Legend />}
      </LineChart>
    </ResponsiveContainer>
  );
};

export default CommonLineChart;
