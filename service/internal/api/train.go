package api

import (
	"fmt"
	"multi-lambda/internal/env"
	"multi-lambda/internal/model"
)

const (
	trainArrivalsURL = "http://lapi.transitchicago.com/api/1.0/ttarrivals.aspx"
	trainFollowURL   = "http://lapi.transitchicago.com/api/1.0/ttfollow.aspx"
)

type trainArrival struct {
	StopID          string `json:"stpId"`
	Route           string `json:"rt"`
	RunNumber       string `json:"rn"`
	DirectionCode   string `json:"trDr"`
	StationName     string `json:"staNm"`
	DestinationName string `json:"destNm"`
	ArrivalTime     string `json:"arrT"`
	Approaching     string `json:"isApp"`
	Delayed         string `json:"isDly"`
	Scheduled       string `json:"isSch"`
}

type trainApiResponse struct {
	Resp trainArrivalResponse `json:"ctatt"`
}

type trainArrivalResponse struct {
	Data      []trainArrival `json:"eta"`
	ErrorName string         `json:"errNm"`
}

func (a trainArrival) toVehicle() model.Vehicle {
	return model.Vehicle{
		TransitType: "train",
		Route:       toTrainRoute(a.Route),
		Run:         a.RunNumber,
		Destination: a.DestinationName,
		Direction:   toDirectionString(a.DirectionCode),
	}
}

func (a trainArrival) toArrival() model.Arrival {
	return model.Arrival{
		StopID:        a.StopID,
		StopName:      a.StationName,
		Time:          a.ArrivalTime,
		IsApproaching: a.Approaching == "1",
		IsDelayed:     a.Delayed == "1",
		IsLive:        a.Scheduled == "0",
	}
}

func trainStopArrivals(stopID string) ([]model.VehicleArrival, error) {
	params := map[string]string{
		"stpid":      stopID,
		"key":        env.Cfg.TrainAPIKey,
		"outputType": "JSON",
	}

	var response trainApiResponse
	err := getApiResponse(trainArrivalsURL, params, &response)
	if err != nil {
		return nil, err
	}
	if response.Resp.ErrorName != "" {
		return nil, fmt.Errorf("train API error: %s", response.Resp.ErrorName)
	}
	trainArrivals := response.Resp.Data

	var arrivals []model.VehicleArrival
	for _, train := range trainArrivals {
		arrivals = append(arrivals, model.VehicleArrival{
			Vehicle: train.toVehicle(),
			Arrival: train.toArrival(),
		})
	}
	return arrivals, nil
}

func trainFollowArrivals(run string) (model.VehicleRoute, error) {
	params := map[string]string{
		"runnumber":  run,
		"key":        env.Cfg.TrainAPIKey,
		"outputType": "JSON",
	}

	var response trainApiResponse
	err := getApiResponse(trainFollowURL, params, &response)
	if err != nil {
		return model.VehicleRoute{}, err
	}
	if response.Resp.ErrorName != "" {
		return model.VehicleRoute{}, fmt.Errorf("train API error: %s", response.Resp.ErrorName)
	}
	trainArrivals := response.Resp.Data
	if len(trainArrivals) == 0 {
		return model.VehicleRoute{}, fmt.Errorf("no arrivals found for vehicle %s", run)
	}

	vehicle := trainArrivals[0].toVehicle()
	var arrivals []model.Arrival
	for _, train := range trainArrivals {
		arrivals = append(arrivals, train.toArrival())
	}
	return model.VehicleRoute{
		Vehicle:  vehicle,
		Arrivals: arrivals,
	}, nil
}

func toDirectionString(directionCode string) string {
	switch directionCode {
	case "1":
		return "Northbound"
	case "5":
		return "Southbound"
	default:
		return directionCode
	}
}

func toTrainRoute(route string) string {
	switch route {
	case "Brn":
		return "Brown"
	case "G":
		return "Green"
	case "Org":
		return "Orange"
	case "P":
		return "Purple"
	default:
		return route
	}
}
