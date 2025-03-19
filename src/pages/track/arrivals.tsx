import { navigate, PageProps } from "gatsby";
import * as React from "react";
import { tripCatalog } from "../../config/catalog";
import Layout from '../../features/layout/Layout';
import Arrivals from "../../features/track/Arrivals";

type ArrivalsPageParams = {
  key?: string | null;
};

const ArrivalsPage: React.FC<PageProps> = ({ location }) => {
  const searchParams = new URLSearchParams(location.search);
  const urlParams: ArrivalsPageParams = {
    key: searchParams.get('key'),
  };
  const tripKey = urlParams.key || '';
  const [isKeySet, setIsKeySet] = React.useState(false);

  // set trip key
  React.useEffect(() => {
    if (!tripKey || !tripCatalog[tripKey]) {
      navigate("/track/");
      return;
    }
    setIsKeySet(true);
  }, [tripKey]);

  if (!isKeySet) {
    return <Layout> </Layout>;
  }

  return (
    <Layout>
      <Arrivals tripKey={tripKey} />
    </Layout>
  );
};

export default ArrivalsPage;

export const Head = () => <title>El Track - Arrivals</title>;
