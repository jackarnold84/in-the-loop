import { ArrowLeftOutlined, WarningFilled } from "@ant-design/icons";
import { Button, Empty, Result, Select, Skeleton } from "antd";
import { Link } from "gatsby";
import * as React from "react";
import { GiParkBench } from "react-icons/gi";
import useSWR from "swr";
import Container from "../../components/Container";
import Live from "../../components/Live";
import { tripCatalog } from "../../config/catalog";
import ArrivalsTable from "./ArrivalsTable";
import * as styles from "./track.module.css";
import { trackArrivalsFetcher } from "./trackApi";

const REFRESH_INTERVAL = 15000;
const LIVE_THRESHOLD = 30000;

const isRecentUpdate = (lastUpdated: Date | undefined) => {
  return !!lastUpdated && (new Date().getTime() - lastUpdated.getTime()) < LIVE_THRESHOLD;
}

type ArrivalsProps = {
  tripKey: string;
};

const Arrivals: React.FC<ArrivalsProps> = ({ tripKey }) => {
  const trip = tripCatalog[tripKey];
  const [selectedDestination, setSelectedDestination] = React.useState(trip.destinations[0].stopId);
  const [isLive, setIsLive] = React.useState(false);
  const [isFirstLoad, setIsFirstLoad] = React.useState(true);

  const trackReqs = trip.options.map(option => ({
    transitType: option.transitType,
    routes: option.routes,
    arrival: option.stopId,
    departure: selectedDestination,
  }));

  const { data, error, isValidating, mutate } = useSWR(trackReqs, trackArrivalsFetcher, {
    refreshInterval: REFRESH_INTERVAL,
    keepPreviousData: true,
  });
  const nextArrivalsList = data?.response;
  const lastUpdated = data?.lastUpdated;
  const hasArrivals = nextArrivalsList && nextArrivalsList.length > 0 && nextArrivalsList[0].length > 0;

  React.useEffect(() => {
    if (!isValidating && isFirstLoad) {
      setIsFirstLoad(false);
    }
  }, [isValidating]);

  // live data indicator
  React.useEffect(() => {
    setIsLive(isRecentUpdate(lastUpdated));
    const intervalId = setInterval(() => {
      setIsLive(isRecentUpdate(lastUpdated));
    }, 1000);

    return () => clearInterval(intervalId);
  }, [lastUpdated]);

  const handleLiveClick = () => {
    mutate();
  };

  const handleDestinationChange = (value: string) => {
    setSelectedDestination(value);
  };

  return (
    <Container>
      <Container top={0}>
        <Link to="/track/" className={styles.backLink}>
          <Button type="link" icon={<ArrowLeftOutlined />} className={styles.backButton}>
            Select New Trip
          </Button>
        </Link>
      </Container>

      <Container bottom={16}>
        <div className={styles.titleContainer}>
          <h2>{trip.name}</h2>
          <Live isLive={isLive} onClick={handleLiveClick} />
        </div>
      </Container>

      <Container bottom={16}>
        <label className={styles.dropdownLabel}>Destination Stop:</label>
        <Select
          id="destination-select"
          defaultValue={trip.destinations[0].stopId}
          className={styles.fullWidth}
          onChange={handleDestinationChange}
        >
          {trip.destinations.map((destination) => (
            <Select.Option key={destination.stopId} value={destination.stopId}>
              {destination.name}
            </Select.Option>
          ))}
        </Select>
      </Container>

      {error ? (
        <Container>
          <Result
            status="warning"
            title={
              <span className={styles.errorTitle}>Something went wrong</span>
            }
            subTitle="We were unable to retrieve live CTA tracking data"
            icon={
              <WarningFilled className={styles.warningIcon} />
            }
          />
        </Container>

      ) : isFirstLoad ? (
        <Container>
          <Skeleton active />
        </Container>

      ) : !hasArrivals ? (
        <Container>
          <Empty description="No upcoming arrivals found" image={<GiParkBench size={84} />} />
        </Container>

      ) : (
        nextArrivalsList?.map((arrivalData, index) => (
          arrivalData.length > 0 && (
            <Container size={16} key={index}>
              <h4 className={styles.alignLeft}>{arrivalData[0]?.arrival?.stopName}</h4>
              <ArrivalsTable nextArrivals={arrivalData} />
            </Container>
          )
        ))
      )}
    </Container>
  );
};

export default Arrivals;
