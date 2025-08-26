package utils

import (
	"encoding/csv"
	"fmt"
	"os"
	"strconv"
	"strings"
	"time"
	"usage-analytics-dashboard/internal/models"
)

// CSVParser handles CSV file operations
type CSVParser struct {
	filePath string
}

// NewCSVParser creates a new CSV parser instance
func NewCSVParser(filePath string) *CSVParser {
	return &CSVParser{
		filePath: filePath,
	}
}

// ParseEvents reads and parses CSV data into UsageEvent structs
func (p *CSVParser) ParseEvents() ([]models.UsageEvent, error) {
	file, err := os.Open(p.filePath)
	if err != nil {
		return nil, fmt.Errorf("failed to open CSV file: %w", err)
	}
	defer file.Close()

	reader := csv.NewReader(file)
	reader.LazyQuotes = true
	reader.FieldsPerRecord = -1

	records, err := reader.ReadAll()
	if err != nil {
		return nil, fmt.Errorf("failed to read CSV file: %w", err)
	}

	if len(records) < 2 {
		return nil, fmt.Errorf("CSV file is empty or missing data")
	}

	events := make([]models.UsageEvent, 0, len(records)-1)

	for i, record := range records[1:] {
		if len(record) < 9 {
			fmt.Printf("Warning: Row %d has insufficient columns (%d), skipping\n", i+1, len(record))
			continue
		}

		event, err := p.parseRow(record, i+1)
		if err != nil {
			fmt.Printf("Warning: Failed to parse row %d: %v\n", i+1, err)
			continue
		}

		events = append(events, event)
	}

	return events, nil
}

// parseRow converts a CSV row to UsageEvent
func (p *CSVParser) parseRow(record []string, rowNum int) (models.UsageEvent, error) {
	createdAt, err := time.Parse("2006-01-02 15:04:05.999999999-07", record[1])
	if err != nil {
		return models.UsageEvent{}, fmt.Errorf("invalid created_at format: %w", err)
	}

	updatedAt, err := time.Parse("2006-01-02 15:04:05.999999999-07", record[7])
	if err != nil {
		return models.UsageEvent{}, fmt.Errorf("invalid updated_at format: %w", err)
	}

	var originalTimestamp time.Time
	if record[8] != "null" && record[8] != "" {
		originalTimestamp, err = time.Parse("2006-01-02 15:04:05.999999999-07", record[8])
		if err != nil {
			return models.UsageEvent{}, fmt.Errorf("invalid original_timestamp format: %w", err)
		}
	} else {
		originalTimestamp = createdAt
	}

	var value *string
	if len(record) > 9 && record[9] != "null" && record[9] != "" {
		if v, err := strconv.ParseFloat(record[9], 64); err == nil {
			valueStr := strconv.FormatFloat(v, 'f', -1, 64)
			value = &valueStr
		}
	}

	return models.UsageEvent{
		ID:                record[0],
		CreatedAt:         createdAt,
		CompanyID:         record[2],
		Type:              record[3],
		Content:           record[4],
		Attribute:         record[5],
		UpdatedAt:         updatedAt,
		OriginalTimestamp: originalTimestamp,
		Value:             value,
	}, nil
}

// extractUserEmail extracts user email from content field
func (p *CSVParser) extractUserEmail(content string) string {
	// Simple email extraction - can be enhanced with regex
	parts := strings.Split(content, " ")
	for _, part := range parts {
		if strings.Contains(part, "@") {
			return part
		}
	}
	return ""
}

// extractCompanyName extracts company name from content field
func (p *CSVParser) extractCompanyName(content string) string {
	// Simple company name extraction - can be enhanced
	parts := strings.Split(content, " ")
	if len(parts) > 0 {
		return parts[0]
	}
	return ""
}
