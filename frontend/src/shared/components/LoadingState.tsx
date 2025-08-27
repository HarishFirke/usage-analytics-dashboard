import React from "react";
import { Card, CardContent } from "../ui/card";
import { Loader2 } from "lucide-react";

interface LoadingStateProps {
  height?: string;
  className?: string;
  contentHeight?: string;
  showSkeleton?: boolean;
}

const LoadingState: React.FC<LoadingStateProps> = ({
  height = "h-[400px]",
  className = "",
  contentHeight = "h-[450px]",
  showSkeleton = false,
}) => {
  if (showSkeleton) {
    return (
      <Card className={`${height} ${className}`}>
        <CardContent className={`${contentHeight} px-6`}>
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`${height} flex items-center justify-center ${className}`}>
      <CardContent>
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </CardContent>
    </Card>
  );
};

export default LoadingState;
