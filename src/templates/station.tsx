import * as React from "react";
import Layout from "../features/layout/Layout";

type PageContext = {
  stationId: string;
};

const StationPage = ({ pageContext }: { pageContext: PageContext }) => {
  const stationId = pageContext.stationId;

  // TODO: implement station stop selection
  return (
    <Layout>
      <h1>Station ID: {stationId}</h1>
    </Layout>
  );
};

export default StationPage;

export const Head = () => <title>El Track</title>
