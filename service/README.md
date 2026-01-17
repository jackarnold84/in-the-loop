# in-the-loop service

- Deployed to AWS via SAM using [template](./template.yaml)

## API Specification

Base URL: `/in-the-loop`

### Endpoints

#### 1. Health Check

**GET** `/in-the-loop/health`

Check the health status of the API service.

**Query Parameters:** None

**Response:**
```json
{
  "message": "healthy"
}
```

**Status Codes:**
- `200 OK` - Service is healthy

---

#### 2. Track Arrivals

**GET** `/in-the-loop/track-arrivals`

Track vehicle arrivals at specified stops for given routes. Useful for monitoring when vehicles on specific routes will arrive at your origin stop and optionally when they will arrive at your destination stop.

**Query Parameters:**

| Parameter   | Type   | Required | Description                                                                 |
|-------------|--------|----------|-----------------------------------------------------------------------------|
| `transit`   | string | Yes      | Type of transit vehicle. Must be either `bus` or `train`                   |
| `routes`    | string | Yes      | Comma-separated list of route identifiers (e.g., "Red,Blue" or "22,36")   |
| `arrival`   | string | Yes      | Stop ID for the arrival/origin stop (numeric)                              |
| `departure` | string | No       | Stop ID for the departure/destination stop (numeric). Optional             |

**Response:**
```json
{
  "arrivals": [
    {
      "transitType": "train",
      "route": "Red",
      "run": "123",
      "destination": "95th/Dan Ryan",
      "direction": "S",
      "arrival": {
        "stopId": "30001",
        "stopName": "Clark/Lake",
        "time": "2026-01-03T14:30:00Z",
        "isApproaching": false,
        "isDelayed": false,
        "isLive": true
      },
      "departure": {
        "stopId": "30002",
        "stopName": "Monroe",
        "time": "2026-01-03T14:35:00Z",
        "isApproaching": false,
        "isDelayed": false,
        "isLive": true
      }
    }
  ]
}
```

**Status Codes:**
- `200 OK` - Successfully retrieved arrivals
- `400 Bad Request` - Invalid query parameters
- `500 Internal Server Error` - Failed to track arrivals

**Notes:**
- The `departure` field in the response will be `null` if no departure stop ID was provided in the request
- Only vehicles on the specified routes that are arriving at the given stops will be included

---

#### 3. Follow Vehicle

**GET** `/in-the-loop/follow-vehicle`

Follow a specific vehicle and get all its upcoming stop arrivals along its route.

**Query Parameters:**

| Parameter | Type   | Required | Description                                              |
|-----------|--------|----------|----------------------------------------------------------|
| `transit` | string | Yes      | Type of transit vehicle. Must be either `bus` or `train` |
| `run`     | string | Yes      | Run number/identifier of the vehicle (numeric)           |

**Response:**
```json
{
  "follow": {
    "transitType": "bus",
    "route": "22",
    "run": "456",
    "destination": "Howard Station",
    "direction": "N",
    "arrivals": [
      {
        "stopId": "1234",
        "stopName": "Clark & Division",
        "time": "2026-01-03T14:25:00Z",
        "isApproaching": true,
        "isDelayed": false,
        "isLive": true
      },
      {
        "stopId": "1235",
        "stopName": "Clark & North",
        "time": "2026-01-03T14:28:00Z",
        "isApproaching": false,
        "isDelayed": false,
        "isLive": true
      }
    ]
  }
}
```

**Status Codes:**
- `200 OK` - Successfully retrieved vehicle route
- `400 Bad Request` - Invalid query parameters
- `500 Internal Server Error` - Failed to follow vehicle

---

### Data Models

#### Vehicle
```go
{
  "transitType": string,  // Type of transit: "bus" or "train"
  "route": string,        // Route identifier (e.g., "Red", "22")
  "run": string,          // Unique run number for the vehicle
  "destination": string,  // Final destination name
  "direction": string     // Direction of travel (e.g., "N", "S", "E", "W")
}
```

#### Arrival
```go
{
  "stopId": string,        // Unique identifier for the stop
  "stopName": string,      // Human-readable name of the stop
  "time": string,          // Estimated arrival time (ISO 8601 format)
  "isApproaching": bool,   // Whether the vehicle is currently approaching
  "isDelayed": bool,       // Whether the arrival is delayed
  "isLive": bool          // Whether the data is from live tracking
}
```

#### VehicleTrip
```go
{
  ...Vehicle,              // Vehicle information (embedded)
  "arrival": Arrival,      // Arrival information at origin stop
  "departure": Arrival?    // Optional departure information at destination stop
}
```

#### VehicleRoute
```go
{
  ...Vehicle,              // Vehicle information (embedded)
  "arrivals": []Arrival   // Array of all upcoming stop arrivals
}
```

---

### Error Responses

All error responses follow this format:

```json
{
  "error": "Error message description"
}
```

**Common Error Scenarios:**
- Invalid transit type (must be "bus" or "train")
- Missing required query parameters
- Invalid stop IDs
- Invalid run numbers
- External API failures

---

### External Data Sources

This API integrates with CTA (Chicago Transit Authority) data sources:

- **Train Tracker API**: [CTA Train Tracker Documentation](https://www.transitchicago.com/developers/ttdocs/)
- **Bus Tracker API**: [CTA Bus Tracker Documentation](https://www.ctabustracker.com/bustime/apidoc/docs/DeveloperAPIGuide3_0.pdf)
