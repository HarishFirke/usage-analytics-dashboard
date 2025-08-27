import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  iconBgColor: string;
  message: string;
  height?: string;
  className?: string;
  contentHeight?: string;
  showHeader?: boolean;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  subtitle,
  icon: Icon,
  iconBgColor,
  message,
  height = "h-[520px]",
  className = "",
  contentHeight = "h-[410px]",
  showHeader = true,
}) => {
  return (
    <Card
      className={`${height} shadow-xl border border-gray-200/50 bg-gradient-to-br from-white to-gray-50/30 ${className}`}
    >
      {showHeader && (
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
      )}
      <CardContent
        className={`${contentHeight} px-6 flex items-center justify-center`}
      >
        <p className="text-muted-foreground text-center">{message}</p>
      </CardContent>
    </Card>
  );
};

export default EmptyState;
