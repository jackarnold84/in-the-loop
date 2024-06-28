package env

import (
	_ "embed"
	"encoding/json"
	"log"
	"os"
	"strings"
)

type Config struct {
	Env         string
	TrainAPIKey string
	BusAPIKey   string
}

//go:embed credentials.json
var credsJSON string

var Cfg Config

func init() {
	creds := getCredentials()
	Cfg = Config{
		Env:         getEnvOrDefault("ENV", "dev"),
		TrainAPIKey: creds["trainApiKey"],
		BusAPIKey:   creds["busApiKey"],
	}
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

// getCredentials reads the credentials from the embedded JSON file at 'internal/env/credentials.json'
// it must be created if it doesn't exist
func getCredentials() map[string]string {
	var creds map[string]string
	err := json.Unmarshal([]byte(credsJSON), &creds)
	if err != nil {
		log.Fatalf("failed to read credentials from internal/env/credentials.json: %v", err)
	}
	return creds
}
