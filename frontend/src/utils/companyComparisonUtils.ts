import { Company } from "../types/analytics";

export interface ChartDataItem {
  name: string;
  events: number;
  users: number;
  fullName: string;
}

/**
 * Process company data for chart display
 */
export const processCompanyChartData = (
  companies: Company[]
): ChartDataItem[] => {
  if (!companies || companies.length === 0) {
    return [];
  }

  const MAX_COMPANIES = 5;

  const result = companies.slice(0, MAX_COMPANIES).map((company) => ({
    name: company.name, // Use full company name
    events: company.eventCount,
    users: company.activeUsers,
    fullName: company.name,
  }));

  return result;
};

/**
 * Check if chart data is empty
 */
export const isChartDataEmpty = (chartData: ChartDataItem[]): boolean => {
  return !chartData || chartData.length === 0;
};
