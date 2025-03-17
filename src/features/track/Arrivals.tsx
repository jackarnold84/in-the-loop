import { ArrowLeftOutlined, WarningFilled } from "@ant-design/icons";
import { Button, Empty, Result, Select, Skeleton } from "antd";
import { Link } from "gatsby";
import * as React from "react";
import { GiParkBench } from "react-icons/gi";
import { ArrivalData, fetchArrivalData } from "../../api/track";
import Container from "../../components/Container";
import Live from "../../components/Live";
import { tripCatalog } from "../../config/catalog";
import ArrivalsTable from "./ArrivalsTable";
import * as styles from "./track.module.css";

const { Option } = Select;

type ArrivalsProps = {
  tripKey: string;
};

const Arrivals: React.FC<ArrivalsProps> = ({ tripKey }) => {
  const trip = tripCatalog[tripKey];
  const [isLoading, setIsLoading] = React.useState(true);
  const [isError, setIsError] = React.useState(false);
  const [arrivalsResponse, setArrivalsResponse] = React.useState<ArrivalData[]>([]);
  const [selectedDestination, setSelectedDestination] = React.useState(trip.destinations[0].stopId);
  const [lastUpdated, setLastUpdated] = React.useState<Date | null>(null);
  const [isLive, setIsLive] = React.useState(false);
  const [counter, setCounter] = React.useState(0);

  // fetch from api
  const fetchData = React.useCallback(async () => {
    try {
      const data: ArrivalData[] = [];
      for (const option of trip.options) {
        const { transitType, stopId, routes } = option;
        const arrivalData = await fetchArrivalData(transitType, routes, stopId, selectedDestination);
        data.push(arrivalData);
      }
      setArrivalsResponse(data);
      setIsLoading(false);
      setLastUpdated(new Date());
    } catch (error) {
      setIsError(true);
      setIsLoading(false);
    }
  }, [tripKey, selectedDestination]);

  // fetch every 20 seconds up to 10 times
  React.useEffect(() => {
    fetchData();
    const intervalId = setInterval(() => {
      if (counter < 10) {
        fetchData();
        setCounter(prevCounter => prevCounter + 1);
      } else {
        clearInterval(intervalId);
      }
    }, 20000);

    return () => clearInterval(intervalId);
  }, [tripKey, selectedDestination, counter, fetchData]);

  // check if data is live
  React.useEffect(() => {
    const intervalId = setInterval(() => {
      setIsLive(!!lastUpdated && (new Date().getTime() - lastUpdated.getTime()) < 30000);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [lastUpdated]);

  // refresh data on live click
  const handleLiveClick = () => {
    setCounter(0);
    fetchData();
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
            <Option key={destination.stopId} value={destination.stopId}>
              {destination.name}
            </Option>
          ))}
        </Select>
      </Container>

      {isError ? (
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

      ) : isLoading ? (
        <Container>
          <Skeleton active />
        </Container>

      ) : arrivalsResponse[0].length === 0 ? (
        <Container>
          <Empty description="No upcoming arrivals found" image={<GiParkBench size={84} />} />
        </Container>

      ) : (
        arrivalsResponse.map((arrivalData, index) => (
          arrivalData.length > 0 && (
            <Container size={16} key={index}>
              <h4 className={styles.alignLeft}>{arrivalData[0]?.arrival?.stopName}</h4>
              <ArrivalsTable dataArray={arrivalData} />
            </Container>
          )
        ))
      )}
    </Container>
  );
};

export default Arrivals;
