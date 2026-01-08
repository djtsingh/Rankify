//go:build ignore
// +build ignore

// go-services/api-gateway/test_db.go
// This file is excluded from normal builds.
// Run manually with: go run test_db.go

package main

import (
	"context"
	"fmt"
	"log"

	"rankify/api-gateway/database"

	"github.com/joho/godotenv"
)

func main() {
	// Load environment variables
	err := godotenv.Load()
	if err != nil {
		log.Println("No .env file found, using system environment")
	}

	// Initialize database
	err = database.InitDB()
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}
	defer database.CloseDB()

	ctx := context.Background()

	// Test 1: Create scan
	fmt.Println("\n1️⃣ Creating scan...")
	scanID, err := database.CreateScan(ctx, "https://example.com", nil)
	if err != nil {
		log.Fatal("Failed to create scan:", err)
	}
	fmt.Printf("✅ Scan created: %s\n", scanID)

	// Test 2: Get scan
	fmt.Println("\n2️⃣ Retrieving scan...")
	scan, err := database.GetScan(ctx, scanID)
	if err != nil {
		log.Fatal("Failed to get scan:", err)
	}
	fmt.Printf("✅ Scan retrieved:\n")
	fmt.Printf("   ID: %s\n", scan.ID)
	fmt.Printf("   URL: %s\n", scan.URL)
	fmt.Printf("   Status: %s\n", scan.Status)
	fmt.Printf("   Created: %v\n", scan.CreatedAt)

	fmt.Println("\n✅ All Go database tests passed!")
}
