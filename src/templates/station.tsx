import * as React from "react";
import Layout from "../features/layout/Layout";
import Station from "../features/navigate/Station";

type PageContext = {
  stationId: string;
};

const StationPage = ({ pageContext }: { pageContext: PageContext }) => {
  const stationId = pageContext.stationId;

  return (
    <Layout>
      <Station stationId={stationId} />
    </Layout>
  );
};

export default StationPage;

export const Head = () => <title>El Track</title>
