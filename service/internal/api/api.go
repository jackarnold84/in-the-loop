package api

import (
	"encoding/json"
	"net/http"
	"net/url"
)

// train tracker documentation:
// https://www.transitchicago.com/developers/ttdocs/

// bus tracker documentation:
// https://www.ctabustracker.com/bustime/apidoc/docs/DeveloperAPIGuide3_0.pdf

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
