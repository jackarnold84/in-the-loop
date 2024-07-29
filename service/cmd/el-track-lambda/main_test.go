package main

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"testing"

	"github.com/aws/aws-lambda-go/events"
	"github.com/stretchr/testify/assert"
)

func TestHealthCheck(t *testing.T) {
	req := events.APIGatewayProxyRequest{
		HTTPMethod: "GET",
		Path:       "/el-track/health",
	}
	res, err := handler(context.Background(), req)
	assert.NoError(t, err)
	assert.Equal(t, 200, res.StatusCode)
}

func TestDebugTrackArrivals(t *testing.T) {
	t.Skip("this test is for debugging purposes")

	req := events.APIGatewayProxyRequest{
		HTTPMethod: "GET",
		Path:       "/el-track/track-arrivals",
		QueryStringParameters: map[string]string{
			"transit":   "train",
			"routes":    "Green,Pink",
			"arrival":   "30221",
			"departure": "30074",
		},
	}
	res, err := handler(context.Background(), req)
	assert.NoError(t, err)
	assert.Equal(t, 200, res.StatusCode)

	prettyPrintJSON(res.Body)
	t.Fatal()
}

func prettyPrintJSON(s string) {
	var prettyJSON bytes.Buffer
	err := json.Indent(&prettyJSON, []byte(s), "", "  ")
	if err != nil {
		fmt.Println("Error formatting JSON:", err)
		return
	}
	fmt.Println(prettyJSON.String())
}
