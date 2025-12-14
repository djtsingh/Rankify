package main

import (
	"time"

	"github.com/gin-gonic/gin"
	"github.com/go-redis/redis/v8"
)

func main() {
	r := gin.Default()
	rdb := redis.NewClient(&redis.Options{
		Addr: "localhost:6379",
	})

	r.POST("/cache/set", func(c *gin.Context) {
		var req struct {
			Key   string `json:"key"`
			Value string `json:"value"`
			TTL   int    `json:"ttl"`
		}
		c.BindJSON(&req)

		// Set in Redis with TTL
		err := rdb.Set(ctx, req.Key, req.Value, time.Duration(req.TTL)*time.Second).Err()
		if err != nil {
			c.JSON(500, gin.H{"error": err.Error()})
			return
		}

		c.JSON(200, gin.H{"status": "cached"})
	})

	r.Run(":8081")
}
