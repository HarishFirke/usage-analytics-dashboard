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

export interface UsageTrend {
  date: string;
  events: number;
}

export interface DashboardSummary {
  totalEvents: number;
  totalCompanies: number;
  peakUsageDay: string;
}

export interface UsageTrends {
  daily: UsageTrend[];
}

export interface AnalyticsResponse {
  summary: DashboardSummary;
  trends: UsageTrends;
  companies: Company[];
  topUsers: UserActivity[];
}

export interface QueryParams {
  dateRange: number;
  companyId: string;
  search: string;
  fromDate?: string;
  toDate?: string;
}
