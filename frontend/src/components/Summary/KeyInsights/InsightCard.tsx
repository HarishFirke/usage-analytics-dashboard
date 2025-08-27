import React from "react";
import { BarChart3, Building2, TrendingUp, Calendar } from "lucide-react";
import { InsightCardData } from "../../../utils/keyInsightsUtils";

interface InsightCardProps {
  data: InsightCardData;
}

const InsightCard: React.FC<InsightCardProps> = ({ data }) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "BarChart3":
        return <BarChart3 className="w-5 h-5 text-blue-600" />;
      case "Building2":
        return <Building2 className="w-5 h-5 text-emerald-600" />;
      case "TrendingUp":
        return <TrendingUp className="w-5 h-5 text-indigo-600" />;
      case "Calendar":
        return <Calendar className="w-5 h-5 text-purple-600" />;
      default:
        return <BarChart3 className="w-5 h-5 text-blue-600" />;
    }
  };

  return (
    <div
      className={`p-4 bg-gradient-to-br ${data.bgColor} rounded-xl border ${data.borderColor} ${data.hoverBgColor} ${data.hoverBorderColor} transition-all duration-300 group cursor-pointer transform hover:scale-105`}
    >
      <div className="text-center">
        <div className="flex items-center justify-center mb-2">
          {getIcon(data.icon)}
        </div>
        <p
          className={`text-sm font-semibold ${data.textColor} opacity-90 mb-2`}
        >
          {data.title}
        </p>
        <p
          className={`text-2xl font-bold ${data.textColor} ${data.hoverTextColor} transition-colors duration-300 leading-tight`}
        >
          {data.value}
        </p>
      </div>
    </div>
  );
};

export default InsightCard;
