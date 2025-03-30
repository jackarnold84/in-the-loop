import { navigate } from "gatsby";
import * as React from "react";
import { tripCatalog } from "../../config/catalog";
import Layout from "../../features/layout/Layout";
import Arrivals from "../../features/track/Arrivals";

type PathParams = {
  favorite: string;
};

const FavoriteTrackPage = ({ params }: { params: PathParams }) => {
  const tripKey = params.favorite;
  const trip = tripCatalog[tripKey];

  React.useEffect(() => {
    if (!trip) {
      navigate("/404");
    }
  }, [trip]);

  return (
    <Layout>
      {trip &&
        <Arrivals tracks={trip.options} title={trip.name} destinations={trip.destinations} />
      }
    </Layout>
  );
};

export default FavoriteTrackPage;

export const Head = () => <title>El Track</title>
