// go-services/api-gateway/main.go

package main

import (
	"log"
	"os"

	"rankify/api-gateway/database"
	"rankify/api-gateway/handlers"
	"rankify/api-gateway/queue"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	// Load environment variables
	if err := godotenv.Load(); err != nil {
		log.Println("⚠️  No .env file found, using system environment")
	}

	// Initialize database
	if err := database.InitDB(); err != nil {
		log.Fatal("❌ Failed to initialize database:", err)
	}
	defer database.CloseDB()

	// Initialize NATS
	if err := queue.InitNATS(); err != nil {
		log.Fatal("❌ Failed to initialize NATS:", err)
	}
	defer queue.CloseNATS()

	// Setup Gin router
	r := gin.Default()

	// CORS middleware (allow all origins for now)
	r.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	})

	// API routes
	api := r.Group("/api/v1")
	{
		// Health check
		api.GET("/health", handlers.HealthCheck)

		// Scans
		api.POST("/scans", handlers.CreateScan)
		api.GET("/scans/:id", handlers.GetScan)
	}

	// Start server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("🚀 Server starting on port %s...\n", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatal("❌ Failed to start server:", err)
	}
}
