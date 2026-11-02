import React from 'react';
import { useLocation } from '@reach/router';
import BackButton from '../components/BackButton';
import Layout from '../features/layout/Layout';
import Nearby, { TransferNearby } from '../features/navigate/Nearby';
import { getTransferRequest } from '../features/navigate/nearbyLib';

const NearbyPage = () => {
  const location = useLocation();
  const transfer = getTransferRequest(location.search);
  return (
    <Layout>
      {transfer ? (
        <>
          <BackButton paths={[{
            to: transfer.run ? `/follow?run=${encodeURIComponent(transfer.run)}` : '/follow',
            text: transfer.run ? `Back to Run #${transfer.run}` : 'Back to Follow',
          }]} />
          <TransferNearby stopId={transfer.stopId} />
        </>
      ) : <Nearby />}
    </Layout>
  )
};

export default NearbyPage

export const Head = ({ location }: { location: { search: string } }) => (
  <title>In The Loop - {getTransferRequest(location.search) ? 'Transfers' : 'Nearby'}</title>
);
