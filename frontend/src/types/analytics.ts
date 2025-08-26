// Analytics data types matching backend models
export interface UsageEvent {
  id: string;
  created_at: string;
  company_id: string;
  type: string;
  content: string;
  attribute: string;
  updated_at: string;
  original_timestamp: string;
  value?: number;
}

export interface UsageTrend {
  date: string;
  events: number;
}

export interface UsageTrends {
  // Company-keyed trends object
  // Key: Company Name (camelCase), Value: Array of daily trends for that company
  trends: { [companyName: string]: UsageTrend[] };
}

export interface Company {
  id: string;
  name: string;
  eventCount: number;
  activeUsers: number;
  lastActivity: string;
}

export interface UserActivity {
  email: string;
  eventCount: number;
  companyName: string;
}

export interface DashboardSummary {
  totalEvents: number;
  totalCompanies: number;
  peakUsageDay: string;
}

export interface AnalyticsResponse {
  summary: DashboardSummary;
  trends: UsageTrends;
  companies: Company[];
  topUsers: UserActivity[];
}

export interface QueryParams {
  search?: string;
  fromDate?: string;
  toDate?: string;
  dateRange?: number;
  companyId?: string;
}
