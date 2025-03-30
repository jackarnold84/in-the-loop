import { navigate } from "gatsby";
import * as React from "react";
import { stationIndex, trackIndex } from "../../../config/index";
import Layout from "../../../features/layout/Layout";
import Arrivals from "../../../features/track/Arrivals";

type PathParams = {
  station: string;
  stop: string;
};

const StationStopTrackPage = ({ params }: { params: PathParams }) => {
  const stationId = params.station;
  const station = stationIndex[stationId];
  const stopId = params.stop;
  const trackIdList = station?.stops[stopId] || [];
  const tracks = trackIdList.map(trackId => trackIndex[trackId]);
  const isValid = station && trackIdList.length > 0 && tracks.every(track => track);

  const trackInput = {
    transitType: tracks[0]?.type as 'train' | 'bus',
    routes: tracks.map(track => track.route),
    stopId: tracks[0]?.stop,
  }
  const routeFilter = tracks.map(track => ({ id: track.route, name: track.routeName }));

  React.useEffect(() => {
    if (!isValid) {
      navigate("/404");
    }
  }, [isValid]);

  return (
    <Layout>
      {isValid &&
        <Arrivals tracks={[trackInput]} title={tracks[0].stopName} routeFilter={routeFilter} />
      }
    </Layout>
  );
};

export default StationStopTrackPage;

export const Head = () => <title>El Track</title>
