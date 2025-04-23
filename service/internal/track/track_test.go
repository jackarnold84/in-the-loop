package track

import (
	"fmt"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestGetTrips(t *testing.T) {
	t.Run("train", func(t *testing.T) {
		// green+pink lines clinton to clark/lake
		trips, err := TrackArrivals("train", []string{"Green", "Pink"}, "30221", "30074")
		assert.NoError(t, err)
		assert.NotEmpty(t, trips)

		for _, trip := range trips {
			assert.Equal(t, "Clinton", trip.Arrival.StopName)
			if trip.Departure != nil {
				assert.Equal(t, "Clark/Lake", trip.Departure.StopName)
				assert.True(t, trip.Departure.Time > trip.Arrival.Time)
			}
		}
	})

	t.Run("bus", func(t *testing.T) {
		// 9 bus ashland/adams to ashland/lake
		trips, err := TrackArrivals("bus", []string{"9"}, "17177", "14783")
		assert.NoError(t, err)
		assert.NotEmpty(t, trips)

		fmt.Println(trips)

		for _, trip := range trips {
			assert.Equal(t, "Ashland & Adams", trip.Arrival.StopName)
			if trip.Departure != nil {
				assert.Equal(t, "Ashland & Lake (Green Line)", trip.Departure.StopName)
				assert.True(t, trip.Departure.Time > trip.Arrival.Time)
			}
		}
	})
}

func TestFollowVehicle(t *testing.T) {
	t.Run("train", func(t *testing.T) {
		// brown line merchanise mart northbound
		trips, err := TrackArrivals("train", []string{"Brown"}, "30090", "30155")
		assert.NoError(t, err)
		assert.NotEmpty(t, trips)

		run := trips[0].Run
		vehicleRoute, err := FollowVehicle("train", run)
		assert.NoError(t, err)
		assert.NotEmpty(t, vehicleRoute.Arrivals)
	})

	t.Run("bus", func(t *testing.T) {
		// 20 bus madison/ashland to washington/clark
		trips, err := TrackArrivals("bus", []string{"20"}, "432", "18122")
		assert.NoError(t, err)
		assert.NotEmpty(t, trips)

		run := trips[0].Run
		vehicleRoute, err := FollowVehicle("bus", run)
		assert.NoError(t, err)
		assert.NotEmpty(t, vehicleRoute.Arrivals)
	})
}
