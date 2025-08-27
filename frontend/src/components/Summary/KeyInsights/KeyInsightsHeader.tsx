import React from "react";
import { CardHeader, CardTitle } from "../../../shared/ui/card";

const KeyInsightsHeader: React.FC = () => {
  return (
    <CardHeader className="pb-3">
      <CardTitle className="text-lg font-bold flex items-center text-gray-800">
        <div className="w-6 h-6 mr-2 bg-amber-500 rounded-lg flex items-center justify-center">
          <div className="w-3 h-3 bg-white rounded-full"></div>
        </div>
        Key Insights
      </CardTitle>
      <p className="text-xs text-muted-foreground">
        Key metrics and performance indicators
      </p>
    </CardHeader>
  );
};

export default KeyInsightsHeader;
