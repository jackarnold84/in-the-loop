package main

import (
	"context"
	"multi-lambda/common/lamb"

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

	output := outputBody{
		Message: "done",
	}
	return lamb.Success(output), nil
}

func main() {
	lambda.Start(handler)
}
