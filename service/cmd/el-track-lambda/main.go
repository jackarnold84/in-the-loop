package main

import (
	"context"
	"fmt"
	"multi-lambda/common/lamb"
	"multi-lambda/internal/cta"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
)

type inputQuery struct {
	City string `json:"city" validate:"required"`
}

type outputBody struct {
	Message string `json:"message"`
}

func handler(ctx context.Context, request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	var input inputQuery
	if err := lamb.ParseQueryStrings(request.QueryStringParameters, &input); err != nil {
		return lamb.BadRequest(err), nil
	}

	// test calling the train API
	trainArrivals, err := cta.GetTrainArrivals("41160")
	if err != nil {
		return lamb.Error(err), nil
	}
	fmt.Println("\n\n\n", trainArrivals)

	// test calling the bus API
	busArrivals, err := cta.GetBusArrivals("17177")
	if err != nil {
		return lamb.Error(err), nil
	}
	fmt.Println("\n\n\n", busArrivals)

	output := outputBody{
		Message: "done",
	}
	return lamb.Success(output), nil
}

func main() {
	lambda.Start(handler)
}
