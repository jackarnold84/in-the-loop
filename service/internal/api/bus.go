package api

import (
	"fmt"
	"multi-lambda/internal/env"
)

const (
	busArrivalsURL = "https://ctabustracker.com/bustime/api/v3/getpredictions"
	busFollowURL   = "https://ctabustracker.com/bustime/api/v3/getpredictions"
)

type BusArrival struct {
	StopID      string `json:"stpid"`
	Route       string `json:"rt"`
	VehicleID   string `json:"vid"`
	Direction   string `json:"rtdir"`
	StopName    string `json:"stpnm"`
	Destination string `json:"des"`
	Type        string `json:"typ"`
	ArrivalTime string `json:"prdtm"`
	Countdown   string `json:"prdctdn"`
	Delayed     bool   `json:"dly"`
}

type busApiResponse struct {
	Resp busArrivalResponse `json:"bustime-response"`
}

type busArrivalResponse struct {
	Data []BusArrival  `json:"prd"`
	Err  []busApiError `json:"error"`
}

type busApiError struct {
	Msg string `json:"msg"`
}

func BusStopArrivals(stopID string) ([]BusArrival, error) {
	params := map[string]string{
		"stpid":  stopID,
		"key":    env.Cfg.BusAPIKey,
		"format": "json",
		"tmres":  "s",
	}

	var response busApiResponse
	err := getApiResponse(busArrivalsURL, params, &response)
	if err != nil {
		return nil, err
	}
	if len(response.Resp.Err) > 0 {
		return nil, fmt.Errorf("bus API error: %s", response.Resp.Err[0].Msg)
	}

	arrivals := response.Resp.Data

	return filterArrivals(arrivals), nil
}

func BusFollowArrivals(vehicleID string) ([]BusArrival, error) {
	params := map[string]string{
		"vid":    vehicleID,
		"key":    env.Cfg.BusAPIKey,
		"format": "json",
		"tmres":  "s",
	}

	var response busApiResponse
	err := getApiResponse(busArrivalsURL, params, &response)
	if err != nil {
		return nil, err
	}
	if len(response.Resp.Err) > 0 {
		return nil, fmt.Errorf("bus API error: %s", response.Resp.Err[0].Msg)
	}
	arrivals := response.Resp.Data

	return filterArrivals(arrivals), nil
}

func filterArrivals(arrivals []BusArrival) []BusArrival {
	var filtered []BusArrival
	for _, arrival := range arrivals {
		if arrival.Type == "A" {
			filtered = append(filtered, arrival)
		}
	}
	return filtered
}
