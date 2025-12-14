// go-services/api-gateway/handlers/scans.go

package handlers

import (
	"context"
	"net/http"

	"rankify/api-gateway/database"
	"rankify/api-gateway/queue"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// CreateScanRequest represents the request body for creating a scan
type CreateScanRequest struct {
	URL string `json:"url" binding:"required"`
}

// CreateScan handles POST /api/v1/scans
func CreateScan(c *gin.Context) {
	var req CreateScanRequest

	// Validate request body
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "Invalid request",
			"message": err.Error(),
		})
		return
	}

	// TODO: Add URL validation here
	// TODO: Check rate limits
	// TODO: Check cache

	// Create scan in database
	ctx := context.Background()
	scanID, err := database.CreateScan(ctx, req.URL, nil)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Failed to create scan",
			"message": err.Error(),
		})
		return
	}

	// Publish job to NATS queue
	if err := queue.PublishScanJob(scanID, req.URL); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Failed to queue scan job",
			"message": err.Error(),
		})
		return
	}

	// Return scan ID immediately
	c.JSON(http.StatusAccepted, gin.H{
		"scan_id": scanID,
		"status":  "pending",
		"message": "Scan queued successfully",
		"url":     req.URL,
	})
}

// GetScan handles GET /api/v1/scans/:id
func GetScan(c *gin.Context) {
	scanID := c.Param("id")

	// Validate UUID format
	if _, err := uuid.Parse(scanID); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "Invalid scan ID format",
			"message": "Scan ID must be a valid UUID",
		})
		return
	}

	// Get complete scan data from database
	ctx := context.Background()
	scanData, err := database.GetCompleteScanData(ctx, scanID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error":   "Scan not found",
			"message": "No scan exists with this ID",
			"scan_id": scanID,
		})
		return
	}

	// Return scan data
	c.JSON(http.StatusOK, scanData)
}

// HealthCheck handles GET /health
func HealthCheck(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"status":  "healthy",
		"service": "rankify-api-gateway",
	})
}
