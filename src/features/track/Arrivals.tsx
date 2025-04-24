import { WarningFilled } from "@ant-design/icons";
import { Empty, Result, Select, Skeleton } from "antd";
import * as React from "react";
import { GiParkBench } from "react-icons/gi";
import useSWR from "swr";
import Container from "../../components/Container";
import Live from "../../components/Live";
import Span from "../../components/Span";
import { Destination, TransitOption } from "../../config/catalog";
import ArrivalsTable from "./ArrivalsTable";
import * as styles from "./track.module.css";
import { trackArrivalsFetcher } from "./trackApi";

const REFRESH_INTERVAL = 15000;
const LIVE_THRESHOLD = 30000;

const isRecentUpdate = (lastUpdated: Date | undefined) => {
  return !!lastUpdated && (new Date().getTime() - lastUpdated.getTime()) < LIVE_THRESHOLD;
}

type Route = {
  id: string;
  name: string;
}

type ArrivalsProps = {
  tracks: TransitOption[];
  title: string;
  subtitle?: string;
  destinations?: Destination[];
  routeFilter?: Route[];
};

const Arrivals: React.FC<ArrivalsProps> = ({ tracks, title, subtitle, destinations, routeFilter }) => {
  const [selectedDestination, setSelectedDestination] = React.useState(destinations?.[0]?.stopId || '');
  const [selectedRoutes, setSelectedRoutes] = React.useState(routeFilter?.map(route => route.id) || []);
  const [isLive, setIsLive] = React.useState(false);
  const [isFirstLoad, setIsFirstLoad] = React.useState(true);

  const trackReqs = tracks.map(track => ({
    transitType: track.transitType,
    routes: track.routes,
    arrival: track.stopId,
    departure: selectedDestination || undefined,
  }));

  const { data, error, isValidating, mutate } = useSWR(trackReqs, trackArrivalsFetcher, {
    refreshInterval: REFRESH_INTERVAL,
    keepPreviousData: true,
  });

  const nextArrivalsList = data?.response?.map(arrivalData =>
    arrivalData.filter(arrival =>
      !routeFilter || selectedRoutes.includes(arrival.route)
    )
  );

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

  const handleRouteFilterChange = (selectedRoutes: string[]) => {
    setSelectedRoutes(selectedRoutes);
  };

  return (
    <Container>
      <Container bottom={16}>
        <div className={styles.titleContainer}>
          <Span size={0}>
            <h2 className={styles.titleText}>{title}</h2>
            {subtitle && <div>{subtitle}</div>}
          </Span>
          <Span left={10} right={0}>
            <Live isLive={isLive} onClick={handleLiveClick} />
          </Span>
        </div>
      </Container>

      {destinations && destinations.length && (
        <Container bottom={16}>
          <label className={styles.dropdownLabel}>Destination Stop:</label>
          <Select
            id="destination-select"
            className={styles.fullWidth}
            value={selectedDestination}
            onChange={handleDestinationChange}
          >
            {destinations.map((destination) => (
              <Select.Option key={destination.stopId} value={destination.stopId}>
                {destination.name}
              </Select.Option>
            ))}
          </Select>
        </Container>
      )}

      {routeFilter && routeFilter.length > 1 && (
        <Container bottom={16}>
          <label className={styles.dropdownLabel}>Routes:</label>
          <Select
            mode="multiple"
            id="route-filter-select"
            className={styles.fullWidth}
            value={selectedRoutes}
            onChange={handleRouteFilterChange}
            optionLabelProp="value"
            allowClear showArrow showSearch={false}
          >
            {routeFilter.map(route => (
              <Select.Option key={route.id} value={route.id}>
                {route.name}
              </Select.Option>
            ))}
          </Select>
        </Container>
      )}

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
