import * as React from "react";
import BackButton from "../components/BackButton";
import { tripCatalog } from "../config/catalog";
import Layout from "../features/layout/Layout";
import Arrivals from "../features/track/Arrivals";

type PageContext = {
  tripKey: string;
};

const FavoriteTrackPage = ({ pageContext }: { pageContext: PageContext }) => {
  const tripKey = pageContext.tripKey;
  const trip = tripCatalog[tripKey];

  return (
    <Layout>
      <BackButton paths={[{ to: "/favorites", text: "Select New Trip" }]} />
      <Arrivals tracks={trip.options} title={trip.name} destinations={trip.destinations} />
    </Layout>
  );
};

export default FavoriteTrackPage;

export const Head = () => <title>El Track</title>
