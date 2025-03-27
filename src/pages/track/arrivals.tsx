import { navigate, PageProps } from "gatsby";
import * as React from "react";
import { tripCatalog } from "../../config/catalog";
import { trackIndex } from "../../config/index";
import Layout from '../../features/layout/Layout';
import Arrivals from "../../features/track/Arrivals";

type ArrivalsPageParams = {
  trip?: string | null;
  track?: string | null;
};

const ArrivalsPage: React.FC<PageProps> = ({ location }) => {
  const searchParams = new URLSearchParams(location.search);
  const urlParams: ArrivalsPageParams = {
    trip: searchParams.get('trip'),
    track: searchParams.get('track'),
  };
  const tripKey = urlParams.trip || '';
  const trackIdList = urlParams.track ? urlParams.track.split(',') : [];

  const [isQuerySet, setIsQuerySet] = React.useState(false);

  // validate query
  React.useEffect(() => {
    const isValidTrip = tripKey && tripCatalog[tripKey];
    const isValidTracks = trackIdList.length &&
      trackIdList.every(trackId => trackIndex[trackId]) &&
      trackIdList.every(trackId => trackIndex[trackId].stop === trackIndex[trackIdList[0]].stop);

    if (!isValidTrip && !isValidTracks) {
      navigate(tripKey ? "/track/" : "/");
      return;
    }

    setIsQuerySet(true);
  }, [tripKey, trackIdList]);

  if (!isQuerySet) {
    return <Layout> </Layout>;
  }

  if (tripKey) {
    const trip = tripCatalog[tripKey];
    return (
      <Layout>
        <Arrivals tracks={trip.options} title={trip.name} destinations={trip.destinations} />
      </Layout>
    );
  }

  if (trackIdList.length) {
    const tracks = trackIdList.map(trackId => trackIndex[trackId]);
    const trackInput = {
      transitType: tracks[0].type as 'train' | 'bus',
      routes: tracks.map(track => track.route),
      stopId: tracks[0].stop,
    }
    const routeFilter = tracks.map(track => ({ id: track.route, name: track.routeName }));
    return (
      <Layout>
        <Arrivals tracks={[trackInput]} title={tracks[0].stopName} routeFilter={routeFilter} />
      </Layout>
    );
  }
};

export default ArrivalsPage;

export const Head = () => <title>El Track - Arrivals</title>;
