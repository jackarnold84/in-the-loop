import { stationIndex, trackIndex } from "../../config/index";
import { Coord, StationCoord } from "./Nearby";

const openStreetURL = "https://nominatim.openstreetmap.org/reverse"

type ReverseGeocodeResponse = {
  address: ReverseGeocodeAddress;
  display_name: string;
}

type ReverseGeocodeAddress = {
  road?: string;
  neighbourhood?: string;
  quarter?: string;
  suburb?: string;
  hamlet?: string;
  borough?: string;
  city?: string;
  town?: string;
  village?: string;
  state?: string;
};

type LocationDisplay = {
  locality: string;
  region: string;
}

export const pruneNearbyStations = (stations: StationCoord[], total = 25, uniq = 3): string[] => {
  const routeCount: Record<string, number> = {};
  const result: string[] = [];

  for (const stationCoord of stations) {
    const station = stationIndex[stationCoord.id];
    const tracks = Object.values(station.stops)
      .flat()
      .map((stopId) => trackIndex[stopId]);
    const routes = Array.from(new Set(tracks.map((track) => track.route)));
    const routeKey = JSON.stringify(routes);

    if ((routeCount[routeKey] || 0) < uniq) {
      result.push(stationCoord.id);
      routeCount[routeKey] = (routeCount[routeKey] || 0) + 1;
    }

    if (result.length >= total) {
      break;
    }
  }

  return result;
}

export const reverseGeocode = async (coord: Coord): Promise<ReverseGeocodeAddress> => {
  const url = `${openStreetURL}?format=jsonv2&lat=${coord.latitude}&lon=${coord.longitude}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: ReverseGeocodeResponse = await response.json();
    return data.address;
  } catch (error) {
    console.error("Error using reverse geocode API:", error);
    throw error;
  }
}

export const displayGeocode = (address: ReverseGeocodeAddress): LocationDisplay => {
  const road = address.road || '';
  const hood = address.neighbourhood || address.quarter || '';
  const burb = address.suburb || address.hamlet || address.borough || '';
  const city = address.city || address.town || address.village || '';
  const state = address.state || '';

  const locality = [road, hood].filter(Boolean).join(' - ');
  const cityState = [city, state].filter(Boolean).join(', ');
  const region = [burb, cityState].filter(Boolean).join(' - ');

  return { locality, region };
}
