package services

import (
	"sort"
	"strings"
	"time"
	"usage-analytics-dashboard/internal/models"
)

// AnalyticsService handles analytics business logic
type AnalyticsService struct {
	events []models.UsageEvent
}

// NewAnalyticsService creates a new analytics service
func NewAnalyticsService(events []models.UsageEvent) *AnalyticsService {
	return &AnalyticsService{events: events}
}

// GenerateAnalytics generates comprehensive analytics based on query parameters
func (s *AnalyticsService) GenerateAnalytics(params models.QueryParams) models.AnalyticsResponse {
	// First, filter events based on all criteria (search, date range, company)
	filteredEvents := s.filterEvents(params)

	// Generate all analytics using the filtered data
	summary := s.getSummary(filteredEvents)
	trends := s.getTrends(filteredEvents, params)
	companies := s.getCompanyMetrics(filteredEvents)
	topUsers := s.getTopUsers(filteredEvents)

	return models.AnalyticsResponse{
		Summary:   summary,
		Trends:    trends,
		Companies: companies,
		TopUsers:  topUsers,
	}
}

// getSummary generates dashboard summary metrics
func (s *AnalyticsService) getSummary(events []models.UsageEvent) models.DashboardSummary {
	if len(events) == 0 {
		return models.DashboardSummary{}
	}

	companyCounts := make(map[string]int)
	dailyEventCounts := make(map[string]int)

	for _, event := range events {
		companyCounts[event.CompanyID]++

		// Count events per day for peak usage calculation
		dateStr := event.CreatedAt.Format("2006-01-02")
		dailyEventCounts[dateStr]++
	}

	// Find peak usage day
	peakUsageDay := ""
	maxDailyEvents := 0
	for date, count := range dailyEventCounts {
		if count > maxDailyEvents {
			maxDailyEvents = count
			peakUsageDay = date
		}
	}

	return models.DashboardSummary{
		TotalEvents:    len(events),
		TotalCompanies: len(companyCounts),
		PeakUsageDay:   peakUsageDay,
	}
}

// getTrends generates usage trends data
func (s *AnalyticsService) getTrends(events []models.UsageEvent, params models.QueryParams) models.UsageTrends {
	if len(events) == 0 {
		return models.UsageTrends{Trends: make(map[string][]models.UsageTrend)}
	}

	// Create trends map
	trends := make(map[string][]models.UsageTrend)

	if params.CompanyID == "" {
		// "All Companies" selected - generate trends for each company
		companyTrends := s.groupByDayAndCompany(events, params)

		// Group by company name
		companyMap := make(map[string][]models.UsageTrend)
		for _, trend := range companyTrends {
			companyName := trend.CompanyName
			if companyMap[companyName] == nil {
				companyMap[companyName] = []models.UsageTrend{}
			}
			companyMap[companyName] = append(companyMap[companyName], models.UsageTrend{
				Date:   trend.Date,
				Events: trend.Events,
			})
		}

		// Sort each company's trends by date and format company names as camelCase
		for companyName, companyTrends := range companyMap {
			sort.Slice(companyTrends, func(i, j int) bool {
				return companyTrends[i].Date < companyTrends[j].Date
			})
			// Convert company name to camelCase for property name
			camelCaseName := s.toCamelCase(companyName)
			trends[camelCaseName] = companyTrends
		}
	} else {
		// Specific company selected - generate trends for that company only
		dailyTrends := s.groupByDay(events, params)

		// Get company name for the selected company
		companyName := s.extractCompanyName(params.CompanyID, events)
		if companyName != "" {
			// Convert company name to camelCase for property name
			camelCaseName := s.toCamelCase(companyName)
			trends[camelCaseName] = dailyTrends
		}
	}

	return models.UsageTrends{Trends: trends}
}

// toCamelCase converts a company name to camelCase format
// e.g., "Sample Company" -> "sampleCompany", "Facebook" -> "facebook"
func (s *AnalyticsService) toCamelCase(name string) string {
	if name == "" {
		return name
	}

	// Split by spaces and convert to camelCase
	words := strings.Fields(name)
	if len(words) == 0 {
		return name
	}

	// First word should be lowercase
	result := strings.ToLower(words[0])

	// Subsequent words should be capitalized
	for i := 1; i < len(words); i++ {
		if len(words[i]) > 0 {
			result += strings.ToUpper(words[i][:1]) + strings.ToLower(words[i][1:])
		}
	}

	return result
}

// getCompanyMetrics generates company analytics data
func (s *AnalyticsService) getCompanyMetrics(events []models.UsageEvent) []models.Company {
	if len(events) == 0 {
		return []models.Company{}
	}

	companyMap := make(map[string]*models.Company)
	userMap := make(map[string]map[string]bool)

	for _, event := range events {
		companyID := event.CompanyID

		if company, exists := companyMap[companyID]; exists {
			company.EventCount++
			if event.CreatedAt.After(company.LastActivity) {
				company.LastActivity = event.CreatedAt
			}
		} else {
			companyMap[companyID] = &models.Company{
				ID:           companyID,
				Name:         s.extractCompanyName(companyID, events),
				EventCount:   1,
				ActiveUsers:  0,
				LastActivity: event.CreatedAt,
			}
		}

		// Track unique users per company
		if userMap[companyID] == nil {
			userMap[companyID] = make(map[string]bool)
		}
		userEmail := s.extractUserEmail(event.Content)
		if userEmail != "" {
			userMap[companyID][userEmail] = true
		}
	}

	// Convert to slice and calculate active users
	var companies []models.Company
	for _, company := range companyMap {
		company.ActiveUsers = len(userMap[company.ID])
		companies = append(companies, *company)
	}

	// Sort by event count descending
	sort.Slice(companies, func(i, j int) bool {
		return companies[i].EventCount > companies[j].EventCount
	})

	return companies
}

// getTopUsers generates top user activity data
func (s *AnalyticsService) getTopUsers(events []models.UsageEvent) []models.UserActivity {
	if len(events) == 0 {
		return []models.UserActivity{}
	}

	userMap := make(map[string]*models.UserActivity)
	companyMap := make(map[string]string)

	for _, event := range events {
		userEmail := s.extractUserEmail(event.Content)
		if userEmail == "" {
			continue
		}

		if user, exists := userMap[userEmail]; exists {
			user.EventCount++
		} else {
			userMap[userEmail] = &models.UserActivity{
				Email:      userEmail,
				EventCount: 1,
			}
		}

		// Store company association
		companyMap[userEmail] = event.CompanyID
	}

	// Convert to slice and add company names
	var users []models.UserActivity
	for _, user := range userMap {
		companyID := companyMap[user.Email]
		user.CompanyName = s.extractCompanyName(companyID, events)
		users = append(users, *user)
	}

	// Sort by event count descending
	sort.Slice(users, func(i, j int) bool {
		return users[i].EventCount > users[j].EventCount
	})

	// Return top 10 users
	if len(users) > 10 {
		return users[:10]
	}
	return users
}

// filterEvents applies all filters to events
func (s *AnalyticsService) filterEvents(params models.QueryParams) []models.UsageEvent {
	filtered := s.events

	// Filter by company ID
	if params.CompanyID != "" {
		var companyFiltered []models.UsageEvent
		for _, event := range filtered {
			if event.CompanyID == params.CompanyID {
				companyFiltered = append(companyFiltered, event)
			}
		}
		filtered = companyFiltered
	}

	// Filter by search term
	if params.Search != "" {
		var searchFiltered []models.UsageEvent
		for _, event := range filtered {
			content := strings.ToLower(event.Content)
			companyID := strings.ToLower(event.CompanyID)
			userEmail := strings.ToLower(s.extractUserEmail(event.Content))
			searchTerm := strings.ToLower(params.Search)

			if strings.Contains(content, searchTerm) ||
				strings.Contains(companyID, searchTerm) ||
				strings.Contains(userEmail, searchTerm) {
				searchFiltered = append(searchFiltered, event)
			}
		}
		filtered = searchFiltered
	}

	// Apply date filtering - this is the key fix
	filtered = s.applyDateFilter(filtered, params)

	return filtered
}

// applyDateFilter applies date range filtering to events
func (s *AnalyticsService) applyDateFilter(events []models.UsageEvent, params models.QueryParams) []models.UsageEvent {
	if len(events) == 0 {
		return events
	}

	var fromDate, toDate time.Time
	demoCurrentDate := s.getDemoCurrentDate()

	// Determine date range
	if params.FromDate != "" {
		// Parse fromDate
		if from, err := time.Parse("2006-01-02", params.FromDate); err == nil {
			fromDate = from
		} else {
			// If fromDate parsing fails, return all events
			return events
		}

		if params.ToDate != "" {
			// Use specific toDate if provided
			if to, err := time.Parse("2006-01-02", params.ToDate); err == nil {
				toDate = to
			} else {
				// If toDate parsing fails, use dateRange from fromDate
				if params.DateRange > 0 {
					toDate = fromDate.AddDate(0, 0, params.DateRange-1)
				} else {
					// Default to 30 days if no dateRange specified
					toDate = fromDate.AddDate(0, 0, 29)
				}
			}
		} else {
			// No toDate provided - go from fromDate to today (consistent with groupByDay)
			toDate = demoCurrentDate
		}
	} else if params.DateRange > 0 {
		// No fromDate provided, use dateRange from today backwards
		toDate = demoCurrentDate
		fromDate = toDate.AddDate(0, 0, -params.DateRange+1)
	} else {
		// No date filtering
		return events
	}

	// Filter events by date range
	var dateFiltered []models.UsageEvent
	for _, event := range events {
		if (event.CreatedAt.After(fromDate) || event.CreatedAt.Equal(fromDate)) &&
			(event.CreatedAt.Before(toDate) || event.CreatedAt.Equal(toDate)) {
			dateFiltered = append(dateFiltered, event)
		}
	}

	return dateFiltered
}

// groupByDay groups events by day for trend analysis
func (s *AnalyticsService) groupByDay(events []models.UsageEvent, params models.QueryParams) []models.UsageTrend {
	if len(events) == 0 {
		return []models.UsageTrend{}
	}

	// Get demo current date for demo purposes
	demoCurrentDate := s.getDemoCurrentDate()

	// Determine date range
	var fromDate, toDate time.Time

	if params.FromDate != "" && params.ToDate != "" {
		// Use specific date range
		if from, err := time.Parse("2006-01-02", params.FromDate); err == nil {
			fromDate = from
		}
		if to, err := time.Parse("2006-01-02", params.ToDate); err == nil {
			toDate = to
		}
	} else if params.FromDate != "" {
		// Only fromDate provided - start from specified date and go up to today
		if from, err := time.Parse("2006-01-02", params.FromDate); err == nil {
			fromDate = from
			toDate = demoCurrentDate
		}
	} else {
		// Use dateRange parameter
		toDate = demoCurrentDate
		fromDate = toDate.AddDate(0, 0, -params.DateRange+1)
	}

	// Generate date range with zero-filling
	dateMap := make(map[string]int)
	currentDate := fromDate

	for currentDate.Before(toDate) || currentDate.Equal(toDate) {
		dateStr := currentDate.Format("2006-01-02")
		dateMap[dateStr] = 0
		currentDate = currentDate.AddDate(0, 0, 1)
	}

	// Count events per day
	for _, event := range events {
		if (event.CreatedAt.After(fromDate) || event.CreatedAt.Equal(fromDate)) &&
			(event.CreatedAt.Before(toDate) || event.CreatedAt.Equal(toDate)) {
			dateStr := event.CreatedAt.Format("2006-01-02")
			dateMap[dateStr]++
		}
	}

	// Convert to slice and sort
	var trends []models.UsageTrend
	for date, count := range dateMap {
		trends = append(trends, models.UsageTrend{
			Date:   date,
			Events: count,
		})
	}

	sort.Slice(trends, func(i, j int) bool {
		return trends[i].Date < trends[j].Date
	})

	return trends
}

// groupByDayAndCompany groups events by day and company for multiline chart
func (s *AnalyticsService) groupByDayAndCompany(events []models.UsageEvent, params models.QueryParams) []models.CompanyTrend {
	if len(events) == 0 {
		return []models.CompanyTrend{}
	}

	// Get demo current date for demo purposes
	demoCurrentDate := s.getDemoCurrentDate()

	// Determine date range (same logic as groupByDay)
	var fromDate, toDate time.Time

	if params.FromDate != "" && params.ToDate != "" {
		if from, err := time.Parse("2006-01-02", params.FromDate); err == nil {
			fromDate = from
		}
		if to, err := time.Parse("2006-01-02", params.ToDate); err == nil {
			toDate = to
		}
	} else if params.FromDate != "" {
		if from, err := time.Parse("2006-01-02", params.FromDate); err == nil {
			fromDate = from
			toDate = demoCurrentDate
		}
	} else {
		toDate = demoCurrentDate
		fromDate = toDate.AddDate(0, 0, -params.DateRange+1)
	}

	if fromDate.IsZero() || toDate.IsZero() {
		return []models.CompanyTrend{}
	}

	// Generate date range with zero-filling for each company
	companyDateMap := make(map[string]map[string]int)
	companyNames := make(map[string]string)

	// Initialize all companies with zero counts for all dates
	for _, event := range events {
		companyID := event.CompanyID
		if companyDateMap[companyID] == nil {
			companyDateMap[companyID] = make(map[string]int)
			companyNames[companyID] = s.extractCompanyName(companyID, events)

			// Initialize all dates with zero
			currentDate := fromDate
			for currentDate.Before(toDate) || currentDate.Equal(toDate) {
				dateStr := currentDate.Format("2006-01-02")
				companyDateMap[companyID][dateStr] = 0
				currentDate = currentDate.AddDate(0, 0, 1)
			}
		}
	}

	// Count events per day per company
	for _, event := range events {
		if (event.CreatedAt.After(fromDate) || event.CreatedAt.Equal(fromDate)) &&
			(event.CreatedAt.Before(toDate) || event.CreatedAt.Equal(toDate)) {
			dateStr := event.CreatedAt.Format("2006-01-02")
			companyDateMap[event.CompanyID][dateStr]++
		}
	}

	// Convert to slice
	var trends []models.CompanyTrend
	for companyID, dateMap := range companyDateMap {
		companyName := companyNames[companyID]
		for date, count := range dateMap {
			trends = append(trends, models.CompanyTrend{
				Date:        date,
				CompanyID:   companyID,
				CompanyName: companyName,
				Events:      count,
			})
		}
	}

	// Sort by date, then by company name for consistent ordering
	sort.Slice(trends, func(i, j int) bool {
		if trends[i].Date != trends[j].Date {
			return trends[i].Date < trends[j].Date
		}
		return trends[i].CompanyName < trends[j].CompanyName
	})

	return trends
}

// getDemoCurrentDate returns current date but with year 2025 for demo purposes
func (s *AnalyticsService) getDemoCurrentDate() time.Time {
	currentTime := time.Now()
	// Use 2025 for demo purposes to align with CSV data
	return time.Date(2025, currentTime.Month(), currentTime.Day(), 0, 0, 0, 0, currentTime.Location())
}

// extractUserEmail extracts user email from content field
func (s *AnalyticsService) extractUserEmail(content string) string {
	parts := strings.Split(content, " ")
	for _, part := range parts {
		if strings.Contains(part, "@") {
			return part
		}
	}
	return ""
}

// extractCompanyName extracts company name from content field
func (s *AnalyticsService) extractCompanyName(companyID string, events []models.UsageEvent) string {
	// Look for company name in content field
	for _, event := range events {
		if event.CompanyID == companyID {
			// Extract company name from content
			// Format: "User active CMMS - Company Name user@email.com /path"
			content := event.Content
			if strings.Contains(content, " - ") {
				parts := strings.Split(content, " - ")
				if len(parts) >= 2 {
					companyPart := parts[1]

					// Find the first email address (contains @) to determine where company name ends
					emailIndex := strings.Index(companyPart, "@")
					if emailIndex > 0 {
						// Company name is everything before the email
						// Find the last space before the @ symbol to get just the company name
						companyNamePart := companyPart[:emailIndex]
						lastSpaceIndex := strings.LastIndex(companyNamePart, " ")
						if lastSpaceIndex > 0 {
							// Take everything before the last space (which is the company name)
							companyName := companyNamePart[:lastSpaceIndex]
							// Trim any trailing spaces
							companyName = strings.TrimSpace(companyName)
							return companyName
						} else {
							// No space found, return the whole part before @
							companyName := strings.TrimSpace(companyNamePart)
							return companyName
						}
					}

					// Fallback: if no email found, take everything before the first space
					if strings.Contains(companyPart, " ") {
						spaceIndex := strings.Index(companyPart, " ")
						if spaceIndex > 0 {
							companyName := companyPart[:spaceIndex]
							return companyName
						}
					}
					return companyPart
				}
			}
			break
		}
	}

	// Fallback to company ID if no name found
	return companyID
}
