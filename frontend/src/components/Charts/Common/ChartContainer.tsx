import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../shared/ui/card";
import { LucideIcon } from "lucide-react";

interface ChartContainerProps {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  iconBgColor: string;
  children: React.ReactNode;
  height?: string;
  className?: string;
  hoverEffect?: boolean;
  contentHeight?: string;
}

const ChartContainer: React.FC<ChartContainerProps> = ({
  title,
  subtitle,
  icon: Icon,
  iconBgColor,
  children,
  height = "h-[520px]",
  className = "",
  hoverEffect = true,
  contentHeight = "h-[480px]",
}) => {
  const hoverClasses = hoverEffect
    ? "hover:shadow-2xl transition-all duration-500"
    : "";

  return (
    <Card
      className={`${height} shadow-xl border border-gray-200/50 bg-gradient-to-br from-white to-gray-50/30 ${hoverClasses} ${className}`}
    >
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-bold flex items-center text-gray-800">
          <div
            className={`w-7 h-7 mr-3 ${iconBgColor} rounded-lg flex items-center justify-center`}
          >
            <Icon className="w-4 h-4 text-white" />
          </div>
          {title}
        </CardTitle>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </CardHeader>
      <CardContent className={`${contentHeight} px-6 flex flex-col`}>
        {children}
      </CardContent>
    </Card>
  );
};

export default ChartContainer;
