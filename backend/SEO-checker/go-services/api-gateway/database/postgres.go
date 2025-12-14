// go-services/api-gateway/database/postgres.go

package database

import (
	"context"
	"fmt"
	"log"
	"os"

	"github.com/jackc/pgx/v5/pgxpool"
)

var DB *pgxpool.Pool

// InitDB initializes database connection pool
func InitDB() error {
	dbHost := getEnv("DB_HOST", "localhost")
	dbPort := getEnv("DB_PORT", "5432")
	dbName := getEnv("DB_NAME", "rankify")
	dbUser := getEnv("DB_USER", "rankify_user")
	dbPassword := getEnv("DB_PASSWORD", "your_secure_password_here")

	// Connection string
	connString := fmt.Sprintf(
		"postgres://%s:%s@%s:%s/%s?sslmode=disable",
		dbUser, dbPassword, dbHost, dbPort, dbName,
	)

	// Create connection pool
	config, err := pgxpool.ParseConfig(connString)
	if err != nil {
		return fmt.Errorf("unable to parse config: %v", err)
	}

	// Configure pool
	config.MaxConns = 25
	config.MinConns = 5

	// Connect
	pool, err := pgxpool.NewWithConfig(context.Background(), config)
	if err != nil {
		return fmt.Errorf("unable to create connection pool: %v", err)
	}

	// Test connection
	err = pool.Ping(context.Background())
	if err != nil {
		return fmt.Errorf("unable to ping database: %v", err)
	}

	DB = pool
	log.Println("✅ Database connected successfully")
	return nil
}

// CloseDB closes database connection
func CloseDB() {
	if DB != nil {
		DB.Close()
		log.Println("Database connection closed")
	}
}

// getEnv gets environment variable with fallback
func getEnv(key, fallback string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}
	return fallback
}
