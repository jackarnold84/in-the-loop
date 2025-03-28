import * as React from "react";
import Layout from "../../../features/layout/Layout";

type PathParams = {
  station: string;
};

const StationPage = ({ params }: { params: PathParams }) => {
  const stationId = params.station;

  // TODO: implement station stop selection
  return (
    <Layout>
      <h1>Station ID: {stationId}</h1>
    </Layout>
  );
};

export default StationPage;

export const Head = () => <title>El Track</title>
