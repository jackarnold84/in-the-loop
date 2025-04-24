package model

type Vehicle struct {
	TransitType string `json:"transitType"`
	Route       string `json:"route"`
	Run         string `json:"run"`
	Destination string `json:"destination"`
	Direction   string `json:"direction"`
}

type Arrival struct {
	StopID        string `json:"stopId"`
	StopName      string `json:"stopName"`
	Time          string `json:"time"`
	IsApproaching bool   `json:"isApproaching"`
	IsDelayed     bool   `json:"isDelayed"`
	IsLive        bool   `json:"isLive"`
}

type VehicleArrival struct {
	Vehicle
	Arrival Arrival `json:"arrival"`
}

type VehicleRoute struct {
	Vehicle
	Arrivals []Arrival `json:"arrivals"`
}

type VehicleTrip struct {
	Vehicle
	Arrival   Arrival  `json:"arrival"`
	Departure *Arrival `json:"departure,omitempty"`
}
