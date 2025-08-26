package models

import "time"

// UsageEvent represents a single usage event from the CSV
type UsageEvent struct {
	ID                string    `json:"id"`
	CreatedAt         time.Time `json:"created_at"`
	CompanyID         string    `json:"company_id"`
	Type              string    `json:"type"`
	Content           string    `json:"content"`
	Attribute         string    `json:"attribute"`
	UpdatedAt         time.Time `json:"updated_at"`
	OriginalTimestamp time.Time `json:"original_timestamp"`
	Value             *string   `json:"value"`
}

// Company represents company analytics data
type Company struct {
	ID           string    `json:"id"`
	Name         string    `json:"name"`
	EventCount   int       `json:"eventCount"`
	ActiveUsers  int       `json:"activeUsers"`
	LastActivity time.Time `json:"lastActivity"`
}

// UserActivity represents user activity data
type UserActivity struct {
	Email       string `json:"email"`
	EventCount  int    `json:"eventCount"`
	CompanyName string `json:"companyName"`
}

// UsageTrend represents daily usage trend data
type UsageTrend struct {
	Date   string `json:"date"`
	Events int    `json:"events"`
}

// CompanyTrend represents company-specific daily usage trend data (used internally)
type CompanyTrend struct {
	Date        string `json:"date"`
	CompanyID   string `json:"companyId"`
	CompanyName string `json:"companyName"`
	Events      int    `json:"events"`
}

// UsageTrends represents usage trends data
type UsageTrends struct {
	// Company-keyed trends object
	// Key: Company Name, Value: Array of daily trends for that company
	Trends map[string][]UsageTrend `json:"trends"`
}

// DashboardSummary represents dashboard summary metrics
type DashboardSummary struct {
	TotalEvents    int    `json:"totalEvents"`
	TotalCompanies int    `json:"totalCompanies"`
	PeakUsageDay   string `json:"peakUsageDay"`
}

// AnalyticsResponse represents the complete analytics response
type AnalyticsResponse struct {
	Summary   DashboardSummary `json:"summary"`
	Trends    UsageTrends      `json:"trends"`
	Companies []Company        `json:"companies"`
	TopUsers  []UserActivity   `json:"topUsers"`
}

// QueryParams represents query parameters for analytics requests
type QueryParams struct {
	DateRange int    `json:"dateRange"`
	CompanyID string `json:"companyId"`
	Search    string `json:"search"`
	FromDate  string `json:"fromDate"`
	ToDate    string `json:"toDate"`
}
