import { useLocation } from '@reach/router';
import React from 'react';
import BackButton from '../components/BackButton';
import FollowVehicle from '../features/follow/FollowVehicle';
import Layout from '../features/layout/Layout';

type LocationState = {
  source?: string;
  fromArrivals?: boolean;
};

const FollowPage = () => {
  const location = useLocation();
  const state = location.state as LocationState;
  const fromArrivalsPage = state?.fromArrivals;
  const source = state?.source;

  return (
    <Layout>
      {fromArrivalsPage && source && <BackButton paths={[{ to: source, text: "Back to Stop" }]} />}
      <FollowVehicle showSearch={!fromArrivalsPage} />
    </Layout>
  )
};

export default FollowPage

export const Head = () => <title>In The Loop - Follow Vehicle</title>
