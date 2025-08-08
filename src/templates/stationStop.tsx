import * as React from "react";
import BackButton from "../components/BackButton";
import { stationIndex, Track, trackIndex } from "../config/index";
import Layout from "../features/layout/Layout";
import Arrivals from "../features/track/Arrivals";

type PageContext = {
  stationId: string;
  stopId: string;
};

const getDirectionText = (tracks: Track[]) => {
  if (tracks[0].type === "bus") {
    const uniqueDirections = Array.from(new Set(tracks.map(track => track.direction)));
    return `${uniqueDirections.join(", ")}bound`;
  } else {
    const uniqueHeadsigns = Array.from(
      new Set(tracks.flatMap(track => track.headsign))
    ).sort((a, b) => a.length - b.length);
    return `${uniqueHeadsigns.slice(0, 3).join(", ")}${uniqueHeadsigns.length > 3 ? ", ..." : ""}`;
  }
}

const StationStopTrackPage = ({ pageContext }: { pageContext: PageContext }) => {
  const stationId = pageContext.stationId;
  const station = stationIndex[stationId];
  const stopId = pageContext.stopId;
  const trackIdList = station.stops[stopId];
  const tracks = trackIdList.map(trackId => trackIndex[trackId]);

  const trackInput = {
    transitType: tracks[0].type as 'train' | 'bus',
    routes: tracks.map(track => track.route),
    stopId: tracks[0].stop,
  }
  const routes = tracks.map(track => ({
    id: track.route,
    name: track.type == "bus" ? `${track.route} - ${track.routeName}` : track.routeName,
  }));
  const uniqueRoutes = Array.from(
    new Map(routes.map(item => [item.id, item])).values()
  );

  return (
    <Layout>
      <BackButton paths={[{ to: `/station/${stationId}`, text: "Select Stop" }]} />
      <Arrivals
        tracks={[trackInput]}
        title={station.name}
        subtitle={getDirectionText(tracks)}
        routeFilter={uniqueRoutes}
      />
    </Layout>
  );
};

export default StationStopTrackPage;

export const Head = () => <title>In The Loop</title>
