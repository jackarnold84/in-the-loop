import React from 'react';
import FollowVehicle from '../features/follow/FollowVehicle';
import Layout from '../features/layout/Layout';

const FollowPage = () => {
  return (
    <Layout>
      <FollowVehicle />
    </Layout>
  )
};

export default FollowPage

export const Head = () => <title>In The Loop - Follow Vehicle</title>
