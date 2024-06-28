package api

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestTrainStopArrivals(t *testing.T) {
	arrivals, err := TrainStopArrivals("30075")
	assert.NoError(t, err)
	assert.NotEmpty(t, arrivals)

	for _, arrival := range arrivals {
		assert.NotEmpty(t, arrival.StopID)
		assert.NotEmpty(t, arrival.RunNumber)
	}
}

func TestTrainApiError(t *testing.T) {
	_, err := TrainFollowArrivals("invalid-run-number")
	assert.Error(t, err)
}
