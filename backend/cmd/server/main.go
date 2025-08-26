package main

import (
	"log"
	"os"
	"usage-analytics-dashboard/internal/handlers"
	"usage-analytics-dashboard/internal/services"
	"usage-analytics-dashboard/internal/utils"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	// Get port from environment or use default
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	// Initialize CSV parser
	csvParser := utils.NewCSVParser("./data/assembly-takehome2.csv")

	// Parse CSV events
	events, err := csvParser.ParseEvents()
	if err != nil {
		log.Fatalf("Failed to parse CSV events: %v", err)
	}

	log.Printf("Successfully loaded %d events from CSV", len(events))

	// Initialize analytics service
	analyticsService := services.NewAnalyticsService(events)

	// Initialize HTTP handler
	analyticsHandler := handlers.NewAnalyticsHandler(analyticsService)

	// Setup Gin router
	router := gin.Default()

	// Add CORS middleware
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000", "http://localhost:5173", "http://127.0.0.1:3000", "http://127.0.0.1:5173"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))

	// Setup routes
	api := router.Group("/api")
	{
		api.GET("/analytics", analyticsHandler.GetAnalytics)
	}

	// Health check endpoint
	router.GET("/health", analyticsHandler.HealthCheck)

	// Start server
	log.Printf("Server starting on port %s...", port)
	if err := router.Run(":" + port); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
