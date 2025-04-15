import React from 'react';
import Layout from '../features/layout/Layout';
import Nearby from '../features/navigate/Nearby';

const NearbyPage = () => {
  return (
    <Layout>
      <Nearby />
    </Layout>
  )
};

export default NearbyPage

export const Head = () => <title>El Track - Nearby</title>
