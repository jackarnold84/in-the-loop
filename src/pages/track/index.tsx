import React from 'react';
import Layout from '../../features/layout/Layout';
import Favorites from '../../features/track/Favorites';

const TrackIndexPage = () => {
  return (
    <Layout>
      <Favorites />
    </Layout>
  )
};

export default TrackIndexPage

export const Head = () => <title>El Track</title>
