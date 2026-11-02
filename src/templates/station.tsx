import * as React from "react";
import { useLocation } from '@reach/router';
import config from '../../gatsby-config';
import BackButton from "../components/BackButton";
import { nearbyBackPath } from '../components/navigation';
import Layout from "../features/layout/Layout";
import Station from "../features/navigate/Station";

type PageContext = {
  stationId: string;
};

const StationPage = ({ pageContext }: { pageContext: PageContext }) => {
  const stationId = pageContext.stationId;
  const location = useLocation();
  const source = (location.state as { source?: string } | null)?.source;

  return (
    <Layout>
      <BackButton
        paths={[
          { to: "/search", text: "Back to Search" },
          nearbyBackPath(source, config.pathPrefix),
        ]}
      />
      <Station stationId={stationId} />
    </Layout>
  );
};

export default StationPage;

export const Head = () => <title>In The Loop</title>
