package handlers

import (
	"net/http"
	"strconv"
	"strings"
	"usage-analytics-dashboard/internal/models"
	"usage-analytics-dashboard/internal/services"

	"github.com/gin-gonic/gin"
)

// AnalyticsHandler handles HTTP requests for analytics
type AnalyticsHandler struct {
	analyticsService *services.AnalyticsService
}

// NewAnalyticsHandler creates a new analytics handler
func NewAnalyticsHandler(analyticsService *services.AnalyticsService) *AnalyticsHandler {
	return &AnalyticsHandler{
		analyticsService: analyticsService,
	}
}

// GetAnalytics handles GET /api/analytics requests
func (h *AnalyticsHandler) GetAnalytics(c *gin.Context) {
	params, err := h.parseQueryParams(c)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "Invalid query parameters",
			"details": err.Error(),
		})
		return
	}

	// Generate analytics using filtered data
	response := h.analyticsService.GenerateAnalytics(*params)

	c.JSON(http.StatusOK, response)
}

// HealthCheck handles GET /health requests
func (h *AnalyticsHandler) HealthCheck(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"status":  "healthy",
		"service": "usage-analytics-dashboard",
	})
}

// parseQueryParams extracts and validates query parameters
func (h *AnalyticsHandler) parseQueryParams(c *gin.Context) (*models.QueryParams, error) {
	params := &models.QueryParams{}

	// Parse dateRange parameter
	dateRangeStr := c.DefaultQuery("dateRange", "30")
	dateRange, err := strconv.Atoi(dateRangeStr)
	if err != nil || dateRange <= 0 || dateRange > 365 {
		dateRange = 30 // Default to 30 days if invalid
	}
	params.DateRange = dateRange

	// Parse companyId parameter
	companyID := strings.TrimSpace(c.Query("companyId"))
	params.CompanyID = companyID

	// Parse search parameter
	search := strings.TrimSpace(c.Query("search"))
	params.Search = search

	// Parse fromDate parameter
	fromDate := strings.TrimSpace(c.Query("fromDate"))
	params.FromDate = fromDate

	// Parse toDate parameter
	toDate := strings.TrimSpace(c.Query("toDate"))
	params.ToDate = toDate

	return params, nil
}
