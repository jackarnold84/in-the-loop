package track

import (
	"multi-lambda/internal/api"
	"multi-lambda/internal/model"
	"slices"
)

func TrackArrivals(transitType string, routes []string, arrStopID string, depStopID string) ([]model.VehicleTrip, error) {
	arrVehicles, err := api.GetStopArrivals(transitType, arrStopID)
	if err != nil {
		return nil, err
	}
	destVehicles, err := api.GetStopArrivals(transitType, depStopID)
	if err != nil {
		return nil, err
	}

	tripMap := map[string]model.VehicleTrip{}

	for _, av := range arrVehicles {
		if slices.Contains(routes, av.Route) {
			tripMap[av.Run] = model.VehicleTrip{
				Vehicle: av.Vehicle,
				Arrival: av.Arrival,
			}
		}
	}

	for _, dv := range destVehicles {
		if trip, ok := tripMap[dv.Run]; ok && slices.Contains(routes, dv.Route) {
			trip.Departure = dv.Arrival
			tripMap[dv.Run] = trip
		}
	}

	trips := []model.VehicleTrip{}
	for _, av := range arrVehicles {
		if trip, ok := tripMap[av.Run]; ok {
			trips = append(trips, trip)
		}
	}

	return trips, nil
}

func FollowVehicle(transitType string, run string) (model.VehicleRoute, error) {
	return api.GetVehicleArrivals(transitType, run)
}
