import * as React from "react";
import BackButton from "../components/BackButton";
import Layout from "../features/layout/Layout";
import Station from "../features/navigate/Station";

type PageContext = {
  stationId: string;
};

type StationPageParams = {
  source?: string | null;
};

const StationPage = ({ pageContext }: { pageContext: PageContext }) => {
  const searchParams = new URLSearchParams(location.search);
  const urlParams: StationPageParams = {
    source: searchParams.get('source'),
  };
  const source = urlParams.source;
  const backPath = source === "search" ? "/search" : "/";
  const backText = source === "search" ? "Back to Search" : "";

  const stationId = pageContext.stationId;

  return (
    <Layout>
      {source && <BackButton to={backPath} text={backText} />}
      <Station stationId={stationId} />
    </Layout>
  );
};

export default StationPage;

export const Head = () => <title>El Track</title>
