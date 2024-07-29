package api

import (
	"fmt"
	"multi-lambda/internal/env"
	"multi-lambda/internal/model"
	"time"
)

const (
	busArrivalsURL = "https://ctabustracker.com/bustime/api/v3/getpredictions"
	busFollowURL   = "https://ctabustracker.com/bustime/api/v3/getpredictions"
)

type busArrival struct {
	StopID        string `json:"stpid"`
	Route         string `json:"rt"`
	VehicleID     string `json:"vid"`
	Direction     string `json:"rtdir"`
	StopName      string `json:"stpnm"`
	Destination   string `json:"des"`
	Type          string `json:"typ"`
	PredictedTime string `json:"prdtm"`
	Countdown     string `json:"prdctdn"`
	Delayed       bool   `json:"dly"`
}

type busApiResponse struct {
	Resp busArrivalResponse `json:"bustime-response"`
}

type busArrivalResponse struct {
	Data []busArrival  `json:"prd"`
	Err  []busApiError `json:"error"`
}

type busApiError struct {
	Msg string `json:"msg"`
}

func (a busArrival) toVehicle() model.Vehicle {
	return model.Vehicle{
		TransitType: "bus",
		Route:       a.Route,
		Run:         a.VehicleID,
		Destination: a.Destination,
		Direction:   a.Direction,
	}
}

func (a busArrival) toArrival() model.Arrival {
	return model.Arrival{
		StopID:        a.StopID,
		StopName:      a.StopName,
		Time:          busToISOTime(a.PredictedTime),
		IsApproaching: a.Countdown == "DUE",
		IsDelayed:     a.Delayed,
		IsLive:        true,
	}
}

func busStopArrivals(stopID string) ([]model.VehicleArrival, error) {
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

	busArrivals := response.Resp.Data
	var arrivals []model.VehicleArrival
	for _, bus := range busArrivals {
		if bus.Type == "A" {
			arrivals = append(arrivals, model.VehicleArrival{
				Vehicle: bus.toVehicle(),
				Arrival: bus.toArrival(),
			})
		}
	}

	return arrivals, nil
}

func busFollowArrivals(run string) (model.VehicleRoute, error) {
	params := map[string]string{
		"vid":    run,
		"key":    env.Cfg.BusAPIKey,
		"format": "json",
		"tmres":  "s",
	}

	var response busApiResponse
	err := getApiResponse(busArrivalsURL, params, &response)
	if err != nil {
		return model.VehicleRoute{}, err
	}
	if len(response.Resp.Err) > 0 {
		return model.VehicleRoute{}, fmt.Errorf("bus API error: %s", response.Resp.Err[0].Msg)
	}
	busArrivals := response.Resp.Data
	if len(busArrivals) == 0 {
		return model.VehicleRoute{}, fmt.Errorf("no arrivals found for vehicle %s", run)
	}

	vehicle := busArrivals[0].toVehicle()
	var arrivals []model.Arrival
	for _, bus := range busArrivals {
		if bus.Type == "A" {
			arrivals = append(arrivals, bus.toArrival())
		}
	}
	return model.VehicleRoute{
		Vehicle:  vehicle,
		Arrivals: arrivals,
	}, nil
}

func busToISOTime(timeStr string) string {
	t, err := time.Parse("20060102 15:04:05", timeStr)
	if err != nil {
		return ""
	}
	return t.Format("2006-01-02T15:04:05")
}
