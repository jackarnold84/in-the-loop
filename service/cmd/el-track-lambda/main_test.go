package main

import (
	"context"
	"fmt"
	"multi-lambda/internal/env"
	"testing"

	"github.com/aws/aws-lambda-go/events"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

var testEvent = events.APIGatewayProxyRequest{
	HTTPMethod: "GET",
	QueryStringParameters: map[string]string{
		"city": "Chicago",
	},
}

func TestDebug(t *testing.T) {
	t.Skip("this test is for debugging purposes")

	// env vars must be set (TRAIN_API_KEY, BUS_API_KEY)
	require.NotEmpty(t, env.Cfg.TrainAPIKey)
	require.NotEmpty(t, env.Cfg.BusAPIKey)

	env.Cfg.Env = "test"
	res, err := handler(context.Background(), testEvent)
	assert.NoError(t, err)
	fmt.Println(res.StatusCode)
	fmt.Println(res.Body)

	t.Fatal()
}
