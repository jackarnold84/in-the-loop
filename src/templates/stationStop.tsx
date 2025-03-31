import * as React from "react";
import { stationIndex, trackIndex } from "../config/index";
import Layout from "../features/layout/Layout";
import Arrivals from "../features/track/Arrivals";

type PageContext = {
  stationId: string;
  stopId: string;
};

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
  const routeFilter = tracks.map(track => ({ id: track.route, name: track.routeName }));

  return (
    <Layout>
      <Arrivals tracks={[trackInput]} title={station.name} routeFilter={routeFilter} />
    </Layout>
  );
};

export default StationStopTrackPage;

export const Head = () => <title>El Track</title>
