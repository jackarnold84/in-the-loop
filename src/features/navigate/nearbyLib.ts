import { stationIndex, trackIndex } from "../../config/index";
import { StationCoord } from "./Nearby";

export const pruneNearbyStations = (stations: StationCoord[], total = 20, uniq = 3): string[] => {
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
