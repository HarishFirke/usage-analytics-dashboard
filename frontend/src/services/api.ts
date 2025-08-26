import { AnalyticsResponse, QueryParams } from "../types/analytics";

export interface ExportOptions {
  format: "csv" | "json" | "xlsx";
  includeCharts: boolean;
  dateRange: string;
}

const API_BASE_URL = "http://localhost:8080/api";

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

// Get analytics insights and trends
export const getAnalyticsInsights = async (
  params: QueryParams
): Promise<any> => {
  try {
    const response = await fetch(`${API_BASE_URL}/analytics/insights`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      throw new Error(`Insights failed: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Insights error:", error);
    throw error;
  }
};

// Export analytics data
export const exportData = async (
  params: QueryParams,
  options: ExportOptions
): Promise<Blob> => {
  try {
    const response = await fetch(`${API_BASE_URL}/analytics/export`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        params,
        options,
      }),
    });

    if (!response.ok) {
      throw new Error(`Export failed: ${response.statusText}`);
    }

    return await response.blob();
  } catch (error) {
    console.error("Export error:", error);
    throw error;
  }
};

// Download data as CSV
export const downloadCSV = (data: any[], filename: string): void => {
  const csvContent = convertToCSV(data);
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");

  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `${filename}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

// Convert data to CSV format
const convertToCSV = (data: any[]): string => {
  if (data.length === 0) return "";

  const headers = Object.keys(data[0]);
  const csvRows = [headers.join(",")];

  for (const row of data) {
    const values = headers.map((header) => {
      const value = row[header];
      return typeof value === "string"
        ? `"${value.replace(/"/g, '""')}"`
        : value;
    });
    csvRows.push(values.join(","));
  }

  return csvRows.join("\n");
};
