package api

import (
	"encoding/json"
	"errors"
	"multi-lambda/internal/model"
	"net/http"
	"net/url"
)

// train tracker documentation:
// https://www.transitchicago.com/developers/ttdocs/

// bus tracker documentation:
// https://www.ctabustracker.com/bustime/apidoc/docs/DeveloperAPIGuide3_0.pdf

// GetStopArrivals returns an array of VehicleArrivals, which contains all the upcoming arrivals for a given stop
func GetStopArrivals(transitType string, stopID string) ([]model.VehicleArrival, error) {
	if transitType == "train" {
		return trainStopArrivals(stopID)
	} else if transitType == "bus" {
		return busStopArrivals(stopID)
	}
	return nil, errors.New("invalid vehicle type")
}

// GetVehicleArrivals returns VehicleRoute, which contains all the upcoming stop arrivals for a given vehicle
func GetVehicleArrivals(transitType string, run string) (model.VehicleRoute, error) {
	if transitType == "train" {
		return trainFollowArrivals(run)
	} else if transitType == "bus" {
		return busFollowArrivals(run)
	}
	return model.VehicleRoute{}, errors.New("invalid vehicle type")
}

func getApiResponse(baseURL string, queryParams map[string]string, output interface{}) error {
	u, _ := url.Parse(baseURL)
	q := u.Query()
	for k, v := range queryParams {
		q.Set(k, v)
	}
	u.RawQuery = q.Encode()

	resp, err := http.Get(u.String())
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	err = json.NewDecoder(resp.Body).Decode(output)
	if err != nil {
		return err
	}

	return nil
}
