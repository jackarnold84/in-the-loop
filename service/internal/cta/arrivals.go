package cta

import (
	"encoding/json"
	"multi-lambda/internal/env"
	"net/http"
	"net/url"
)

const (
	trainArrivalsURL = "http://lapi.transitchicago.com/api/1.0/ttarrivals.aspx"
	busArrivalsURL   = "https://ctabustracker.com/bustime/api/v3/getpredictions"
)

// train tracker documentation:
// https://www.transitchicago.com/developers/ttdocs/

// bus tracker documentation:
// https://www.ctabustracker.com/bustime/apidoc/docs/DeveloperAPIGuide3_0.pdf

func GetTrainArrivals(mapID string) (string, error) {
	trailURL, _ := url.Parse(trainArrivalsURL)
	q := trailURL.Query()
	q.Set("key", env.Cfg.TrainAPIKey)
	q.Set("outputType", "JSON")
	q.Set("mapid", mapID)
	trailURL.RawQuery = q.Encode()

	resp, err := http.Get(trailURL.String())
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	var data map[string]interface{}
	err = json.NewDecoder(resp.Body).Decode(&data)
	if err != nil {
		return "", err
	}
	jsonString, err := json.Marshal(data)
	if err != nil {
		return "", err
	}

	return string(jsonString), nil
}

func GetBusArrivals(stopID string) (string, error) {
	busURL, _ := url.Parse(busArrivalsURL)
	q := busURL.Query()
	q.Set("key", env.Cfg.BusAPIKey)
	q.Set("format", "json")
	q.Set("stpid", stopID)
	busURL.RawQuery = q.Encode()

	resp, err := http.Get(busURL.String())
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	var data map[string]interface{}
	err = json.NewDecoder(resp.Body).Decode(&data)
	if err != nil {
		return "", err
	}
	jsonString, err := json.Marshal(data)
	if err != nil {
		return "", err
	}

	return string(jsonString), nil
}
