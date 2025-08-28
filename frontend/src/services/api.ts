import { AnalyticsResponse, QueryParams } from "../types/analytics";

export interface ExportOptions {
  format: "csv" | "json" | "xlsx";
  includeCharts: boolean;
  dateRange: string;
}

// Use environment variable with fallback to localhost
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

// Basic analytics API
export const getAnalytics = async (
  params: QueryParams
): Promise<AnalyticsResponse> => {
  try {
    const queryParams = new URLSearchParams();

    if (params.dateRange) {
      queryParams.append("dateRange", params.dateRange.toString());
    }

    if (params.companyId) {
      queryParams.append("companyId", params.companyId);
    }

    if (params.search) {
      queryParams.append("search", params.search);
    }

    // Handle date filtering with proper formatting
    if (params.fromDate) {
      // Convert to ISO string and take only the date part for consistent formatting
      const fromDate = new Date(params.fromDate);
      if (!isNaN(fromDate.getTime())) {
        const formattedFromDate = fromDate.toISOString().split("T")[0];
        queryParams.append("fromDate", formattedFromDate);
      }
    }

    if (params.toDate) {
      // Convert to ISO string and take only the date part for consistent formatting
      const toDate = new Date(params.toDate);
      if (!isNaN(toDate.getTime())) {
        const formattedToDate = toDate.toISOString().split("T")[0];
        queryParams.append("toDate", formattedToDate);
      }
    }

    const response = await fetch(`${API_BASE_URL}/analytics?${queryParams}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching analytics:", error);
    throw error;
  }
};
