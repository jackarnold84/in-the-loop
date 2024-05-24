package env

import (
	"os"
	"strings"
)

type Config struct {
	Env         string
	TrainAPIKey string
	BusAPIKey   string
}

var Cfg = Config{
	Env:         getEnvOrDefault("ENV", "dev"),
	TrainAPIKey: getEnvOrDefault("TRAIN_API_KEY", ""),
	BusAPIKey:   getEnvOrDefault("BUS_API_KEY", ""),
}

func getEnvOrDefault(key string, def string) string {
	value, ok := os.LookupEnv(key)
	if !ok {
		return def
	}
	return value
}

func (c Config) IsLocal() bool {
	return strings.EqualFold(c.Env, "local") || strings.EqualFold(c.Env, "test")
}
