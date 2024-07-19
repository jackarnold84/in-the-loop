package main

import (
	"context"
	"fmt"
	"multi-lambda/common/lamb"
	"multi-lambda/internal/model"
	"multi-lambda/internal/track"
	"strings"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
)

type trackArrivalsQuery struct {
	Transit   string `json:"transit" validate:"oneof=bus train"`
	Routes    string `json:"routes" validate:"required"`
	Arrival   string `json:"arrival" validate:"numeric"`
	Departure string `json:"departure" validate:"numeric"`
}

type followVehicleQuery struct {
	TransitType string `json:"transit" validate:"oneof=bus train"`
	Run         string `json:"run" validate:"numeric"`
}

type healthCheckResponse struct {
	Message string `json:"message"`
}

type trackArrivalsResponse struct {
	Arrivals []model.VehicleTrip `json:"arrivals"`
}

type followVehicleResponse struct {
	Follow model.VehicleRoute `json:"follow"`
}

func handler(ctx context.Context, request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	if request.HTTPMethod != "GET" {
		return lamb.BadRequest(fmt.Errorf("invalid method: %s", request.HTTPMethod)), nil
	}

	switch request.Path {
	case "/health":
		return lamb.Success(healthCheckResponse{Message: "healthy"}), nil

	case "/track-arrivals":
		var input trackArrivalsQuery
		if err := lamb.ParseQueryStrings(request.QueryStringParameters, &input); err != nil {
			return lamb.BadRequest(err), nil
		}

		vehicleTrips, err := track.TrackArrivals(input.Transit, toSlice(input.Routes), input.Arrival, input.Departure)
		if err != nil {
			return lamb.Error(err, "failed to track arrivals"), nil
		}
		return lamb.Success(trackArrivalsResponse{Arrivals: vehicleTrips}), nil

	case "/follow-vehicle":
		var input followVehicleQuery
		if err := lamb.ParseQueryStrings(request.QueryStringParameters, &input); err != nil {
			return lamb.BadRequest(err), nil
		}

		vehicleRoute, err := track.FollowVehicle(input.TransitType, input.Run)
		if err != nil {
			return lamb.Error(err, "failed to follow vehicle"), nil
		}
		return lamb.Success(followVehicleResponse{Follow: vehicleRoute}), nil

	default:
		return lamb.BadRequest(fmt.Errorf("invalid path: '%s'", request.Path)), nil
	}
}

func toSlice(s string) []string {
	return strings.Split(s, ",")
}

func main() {
	lambda.Start(handler)
}
