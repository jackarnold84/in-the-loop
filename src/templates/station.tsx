import * as React from "react";
import BackButton from "../components/BackButton";
import Layout from "../features/layout/Layout";
import Station from "../features/navigate/Station";

type PageContext = {
  stationId: string;
};

const StationPage = ({ pageContext }: { pageContext: PageContext }) => {
  const stationId = pageContext.stationId;

  return (
    <Layout>
      <BackButton to="/" text="Return Home" />
      <Station stationId={stationId} />
    </Layout>
  );
};

export default StationPage;

export const Head = () => <title>El Track</title>
