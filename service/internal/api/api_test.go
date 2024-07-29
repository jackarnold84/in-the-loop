package api

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestGetStopArrivals(t *testing.T) {
	t.Run("train", func(t *testing.T) {
		vehicleArrivals, err := GetStopArrivals("train", "30075")
		assert.NoError(t, err)
		assert.NotEmpty(t, vehicleArrivals)

		for _, va := range vehicleArrivals {
			assert.NotEmpty(t, va.Run)
			assert.NotEmpty(t, va.Arrival.StopID)
		}
	})

	t.Run("bus", func(t *testing.T) {
		vehicleArrivals, err := GetStopArrivals("bus", "17177")
		assert.NoError(t, err)
		assert.NotEmpty(t, vehicleArrivals)

		for _, va := range vehicleArrivals {
			assert.NotEmpty(t, va.Run)
			assert.NotEmpty(t, va.Arrival.StopID)
		}
	})
}

func TestGetVehicleArrivalsError(t *testing.T) {
	var err error

	_, err = GetVehicleArrivals("train", "invalid-run-number")
	assert.Error(t, err)

	_, err = GetVehicleArrivals("train", "invalid-run-number")
	assert.Error(t, err)

	_, err = GetVehicleArrivals("invalid-vehicle-type", "0")
	assert.Error(t, err)
}
