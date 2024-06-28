package api

import (
	"fmt"
	"multi-lambda/internal/env"
)

const (
	trainArrivalsURL = "http://lapi.transitchicago.com/api/1.0/ttarrivals.aspx"
	trainFollowURL   = "http://lapi.transitchicago.com/api/1.0/ttfollow.aspx"
)

type TrainArrival struct {
	StopID          string `json:"stpId"`
	Route           string `json:"rt"`
	RunNumber       string `json:"rn"`
	DirectionCode   string `json:"trDr"`
	StationName     string `json:"staNm"`
	DestinationName string `json:"destNm"`
	ArrivalTime     string `json:"arrT"`
	Approaching     string `json:"isApp"`
	Delayed         string `json:"isDly"`
}

type trainApiResponse struct {
	Resp trainArrivalResponse `json:"ctatt"`
}

type trainArrivalResponse struct {
	Data      []TrainArrival `json:"eta"`
	ErrorName string         `json:"errNm"`
}

func TrainStopArrivals(stopID string) ([]TrainArrival, error) {
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
	arrivals := response.Resp.Data

	return arrivals, nil
}

func TrainFollowArrivals(runNumber string) ([]TrainArrival, error) {
	params := map[string]string{
		"runnumber":  runNumber,
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
	arrivals := response.Resp.Data

	return arrivals, nil
}
