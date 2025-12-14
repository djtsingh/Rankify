/*
Start a fast Web Server (using Fiber - the fastest Go framework).
Connect to Redis.
Accept a URL -> Push to Redis -> Return "Job ID".
*/
package main

import (
    "github.com/gin-gonic/gin"
    "github.com/go-redis/redis/v8"
    "github.com/nats-io/nats.go"
)

func main() {
    r := gin.Default()
    
    // Initialize connections
    redisClient := initRedis()
    natsConn := initNATS()
    
    r.POST("/api/v1/scans", func(c *gin.Context) {
        var req ScanRequest
        c.BindJSON(&req)
        
        // 1. Validate URL
        if !isValidURL(req.URL) {
            c.JSON(400, gin.H{"error": "Invalid URL"})
            return
        }
        
        // 2. Check rate limit (Redis)
        if isRateLimited(req.UserID, redisClient) {
            c.JSON(429, gin.H{"error": "Rate limit exceeded"})
            return
        }
        
        // 3. Check cache (Redis)
        urlHash := hashURL(req.URL)
        if cachedResult, err := getCachedResult(urlHash, redisClient); err == nil {
            c.JSON(200, cachedResult)
            return
        }
        
        // 4. Create scan record (PostgreSQL via Go)
        scanID := uuid.New().String()
        scan := createScanRecord(scanID, req.URL, req.UserID)
        
        // 5. Publish job to NATS queue
        jobPayload := JobPayload{
            ScanID: scanID,
            URL:    req.URL,
        }
        publishJob(natsConn, jobPayload)
        
        // 6. Return immediately
        c.JSON(202, gin.H{
            "scan_id": scanID,
            "status": "pending",
            "message": "Scan queued successfully"
        })
    })
    
    r.Run(":8080")
}   