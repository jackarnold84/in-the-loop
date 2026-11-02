import { orderByDistance } from 'geolib';
import { Coord, stationIndex, stopIndex, trackIndex } from "../../config/index";

export type StationCoord = Coord & { id: string };

const stationCoords: StationCoord[] = Object.entries(stationIndex).map(([id, station]) => ({
  id, latitude: station.latitude, longitude: station.longitude,
}));

const stationByStop = new Map<string, string>();
for (const [id, station] of Object.entries(stationIndex)) {
  for (const stopId of Object.keys(station.stops)) {
    if (!stationByStop.has(stopId)) stationByStop.set(stopId, id);
  }
}

export const getTransferOrigin = (stopId: string | null) => {
  if (!stopId || !/^\d+$/.test(stopId)) return undefined;
  return stopIndex[stopId];
};

export const getTransferRequest = (search: string) => {
  const params = new URLSearchParams(search);
  if (!params.has('stop')) return null;
  const run = params.get('run') || '';
  return {
    stopId: params.get('stop') || '',
    run: /^\d+$/.test(run) ? run : '',
  };
};

export const getNearbyStations = (origin: Coord, stopId?: string, total = 25): string[] => {
  if (total <= 0) return [];
  const sorted = orderByDistance(origin, stationCoords) as StationCoord[];
  const originStation = stopId ? stationByStop.get(stopId) : undefined;
  // Include connections within the arrival station before surrounding stations.
  const ordered = originStation
    ? [stationCoords.find(station => station.id === originStation)!, ...sorted.filter(station => station.id !== originStation)]
    : sorted;
  return pruneNearbyStations(ordered, total);
};

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
    const routes = Array.from(new Set(tracks.map((track) => track.route))).sort();
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
