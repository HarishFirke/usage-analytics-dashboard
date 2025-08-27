import React from "react";
import { DashboardSummary } from "../../../types/analytics";
import { getInsightCardsData } from "../../../utils/keyInsightsUtils";
import InsightCard from "./InsightCard";

interface InsightsGridProps {
  summary?: DashboardSummary;
}

const InsightsGrid: React.FC<InsightsGridProps> = ({ summary }) => {
  const insightCardsData = getInsightCardsData(summary);

  return (
    <div className="grid grid-cols-2 gap-4">
      {insightCardsData.map((cardData) => (
        <InsightCard key={cardData.id} data={cardData} />
      ))}
    </div>
  );
};

export default InsightsGrid;
