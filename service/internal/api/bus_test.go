package api

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestBusStopArrivals(t *testing.T) {
	arrivals, err := BusStopArrivals("17177")
	assert.NoError(t, err)
	assert.NotEmpty(t, arrivals)

	for _, arrival := range arrivals {
		assert.NotEmpty(t, arrival.StopID)
		assert.NotEmpty(t, arrival.VehicleID)
		assert.Equal(t, "A", arrival.Type)
	}
}

func TestBusApiError(t *testing.T) {
	_, err := BusFollowArrivals("invalid-vehicle-id")
	assert.Error(t, err)
}
