// go-services/api-gateway/database/operations.go

package database

import (
	"context"
	"crypto/md5"
	"encoding/hex"
	"time"

	"github.com/google/uuid"
)

// Scan represents a scan record
type Scan struct {
	ID          string     `json:"id"`
	UserID      *string    `json:"user_id"`
	URL         string     `json:"url"`
	URLHash     string     `json:"url_hash"`
	Status      string     `json:"status"`
	ErrorMsg    *string    `json:"error_message"`
	CreatedAt   time.Time  `json:"created_at"`
	CompletedAt *time.Time `json:"completed_at"`
}

// ScanResult represents scan result
type ScanResult struct {
	ScanID  string                 `json:"scan_id"`
	Score   int                    `json:"score"`
	Metrics map[string]interface{} `json:"metrics"`
}

// Issue represents an SEO issue
type Issue struct {
	Type                string                 `json:"type"`
	Severity            string                 `json:"severity"`
	Title               string                 `json:"title"`
	Description         string                 `json:"description"`
	Recommendation      string                 `json:"recommendation"`
	ImpactScore         float64                `json:"impact_score"`
	ExpectedImprovement *string                `json:"expected_improvement"`
	TimeToFixHours      *int                   `json:"time_to_fix_hours"`
	Data                map[string]interface{} `json:"data"`
}

// CreateScan creates a new scan record
func CreateScan(ctx context.Context, url string, userID *string) (string, error) {
	scanID := uuid.New().String()
	urlHash := hashURL(url)

	query := `
		INSERT INTO scans (id, user_id, url, url_hash, status)
		VALUES ($1, $2, $3, $4, $5)
		RETURNING id
	`

	var id string
	err := DB.QueryRow(ctx, query, scanID, userID, url, urlHash, "pending").Scan(&id)
	if err != nil {
		return "", err
	}

	return id, nil
}

// GetScan retrieves scan by ID
func GetScan(ctx context.Context, scanID string) (*Scan, error) {
	query := `
		SELECT id, user_id, url, url_hash, status, error_message, created_at, completed_at
		FROM scans
		WHERE id = $1
	`

	var scan Scan
	err := DB.QueryRow(ctx, query, scanID).Scan(
		&scan.ID,
		&scan.UserID,
		&scan.URL,
		&scan.URLHash,
		&scan.Status,
		&scan.ErrorMsg,
		&scan.CreatedAt,
		&scan.CompletedAt,
	)

	if err != nil {
		return nil, err
	}

	return &scan, nil
}

// GetScanResult retrieves scan result
func GetScanResult(ctx context.Context, scanID string) (*ScanResult, error) {
	query := `
		SELECT scan_id, score, metrics
		FROM scan_results
		WHERE scan_id = $1
	`

	var result ScanResult
	err := DB.QueryRow(ctx, query, scanID).Scan(
		&result.ScanID,
		&result.Score,
		&result.Metrics,
	)

	if err != nil {
		return nil, err
	}

	return &result, nil
}

// GetIssues retrieves all issues for a scan
func GetIssues(ctx context.Context, scanID string) ([]Issue, error) {
	query := `
		SELECT type, severity, title, description, recommendation,
		       impact_score, expected_improvement, time_to_fix_hours, data
		FROM issues
		WHERE scan_id = $1
		ORDER BY impact_score DESC
	`

	rows, err := DB.Query(ctx, query, scanID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var issues []Issue
	for rows.Next() {
		var issue Issue
		err := rows.Scan(
			&issue.Type,
			&issue.Severity,
			&issue.Title,
			&issue.Description,
			&issue.Recommendation,
			&issue.ImpactScore,
			&issue.ExpectedImprovement,
			&issue.TimeToFixHours,
			&issue.Data,
		)
		if err != nil {
			return nil, err
		}
		issues = append(issues, issue)
	}

	return issues, nil
}

// GetCompleteScanData retrieves complete scan data
func GetCompleteScanData(ctx context.Context, scanID string) (map[string]interface{}, error) {
	// Get scan
	scan, err := GetScan(ctx, scanID)
	if err != nil {
		return nil, err
	}

	response := map[string]interface{}{
		"scan_id":    scan.ID,
		"url":        scan.URL,
		"status":     scan.Status,
		"created_at": scan.CreatedAt,
	}

	// If completed, get result and issues
	if scan.Status == "completed" {
		result, err := GetScanResult(ctx, scanID)
		if err == nil {
			response["score"] = result.Score
			response["metrics"] = result.Metrics
		}

		issues, err := GetIssues(ctx, scanID)
		if err == nil {
			response["issues"] = issues
		}

		response["completed_at"] = scan.CompletedAt
	}

	if scan.ErrorMsg != nil {
		response["error_message"] = *scan.ErrorMsg
	}

	return response, nil
}

// hashURL creates MD5 hash of URL
func hashURL(url string) string {
	hash := md5.Sum([]byte(url))
	return hex.EncodeToString(hash[:])
}
