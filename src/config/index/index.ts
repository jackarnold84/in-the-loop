import stationData from "./stations.json";
import trackData from "./tracks.json";

type Track = {
  type: string;
  route: string;
  routeName: string;
  stop: string;
  stopName: string;
  direction: string;
  headsign: string[];
}

type Station = {
  name: string;
  stops: StopTracks;
}

type StopTracks = {
  [stopId: string]: string[];
}

export const trackIndex: { [trackId: string]: Track } = trackData;
export const stationIndex: { [stationId: string]: Station } = stationData;
