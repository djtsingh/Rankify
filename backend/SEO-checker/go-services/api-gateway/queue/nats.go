// go-services/api-gateway/queue/nats.go

package queue

import (
	"encoding/json"
	"fmt"
	"log"
	"os"

	"github.com/nats-io/nats.go"
)

var nc *nats.Conn

// ScanJob represents the message we send to NATS
type ScanJob struct {
	ScanID string `json:"scan_id"`
	URL    string `json:"url"`
}

// InitNATS connects to NATS server
func InitNATS() error {
	natsURL := os.Getenv("NATS_URL")
	if natsURL == "" {
		natsURL = nats.DefaultURL // defaults to nats://localhost:4222
	}

	var err error
	nc, err = nats.Connect(natsURL)
	if err != nil {
		return fmt.Errorf("failed to connect to NATS: %w", err)
	}

	log.Println("✅ Connected to NATS server:", natsURL)
	return nil
}

// PublishScanJob sends a scan job to the queue
func PublishScanJob(scanID, url string) error {
	if nc == nil {
		return fmt.Errorf("NATS connection not initialized")
	}

	job := ScanJob{
		ScanID: scanID,
		URL:    url,
	}

	// Convert to JSON
	jobData, err := json.Marshal(job)
	if err != nil {
		return fmt.Errorf("failed to marshal job: %w", err)
	}

	// Publish to "scan.jobs" subject
	if err := nc.Publish("scan.jobs", jobData); err != nil {
		return fmt.Errorf("failed to publish job: %w", err)
	}

	log.Printf("📤 Published job to NATS: scan_id=%s, url=%s", scanID, url)
	return nil
}

// CloseNATS closes the NATS connection
func CloseNATS() {
	if nc != nil {
		nc.Close()
		log.Println("👋 NATS connection closed")
	}
}
