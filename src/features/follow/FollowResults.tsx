import { Empty, Result, Skeleton, Table } from "antd";
import { ColumnType } from "antd/lib/table";
import * as React from "react";
import { FaTimesCircle } from "react-icons/fa";
import { GiParkBench } from "react-icons/gi";
import useSWR from "swr";
import Container from "../../components/Container";
import Countdown from "../../components/Countdown";
import Live from "../../components/Live";
import Span from "../../components/Span";
import TimeDisplay from "../../components/TimeDisplay";
import TransitIcon from "../../components/TransitIcon";
import * as styles from "./follow.module.css";
import { followVehicleFetcher, Stop } from "./followApi";

const REFRESH_INTERVAL = 15000;
const LIVE_THRESHOLD = 30000;

const isRecentUpdate = (lastUpdated: Date | undefined) => {
  return !!lastUpdated && (new Date().getTime() - lastUpdated.getTime()) < LIVE_THRESHOLD;
}

type FollowResultsProps = {
  runNumber: string;
  transitType: 'train' | 'bus';
};

const columns: ColumnType<Stop>[] = [
  {
    title: 'Stop',
    dataIndex: 'stopName',
    key: 'stopName',
    width: '50%',
  },
  {
    title: 'Arrival Time',
    dataIndex: 'time',
    key: 'time',
    width: '25%',
    render: (text: string) => <TimeDisplay dateStr={text} />,
  },
  {
    title: 'Countdown',
    dataIndex: 'time',
    key: 'countdown',
    width: '25%',
    render: (text: string, record: Stop) => (
      <Countdown dateStr={text} isApproaching={record.isApproaching} />
    ),
  },
];

const FollowResults: React.FC<FollowResultsProps> = ({ runNumber, transitType }) => {
  const [isLive, setIsLive] = React.useState(false);
  const [isFirstLoad, setIsFirstLoad] = React.useState(true);

  const { data, error, isValidating, mutate } = useSWR(
    runNumber ? { run: runNumber, transitType } : null,
    followVehicleFetcher,
    {
      refreshInterval: REFRESH_INTERVAL,
      keepPreviousData: true,
    }
  );

  const vehicleData = data?.response;
  const lastUpdated = data?.lastUpdated;
  const hasArrivals = vehicleData?.arrivals && vehicleData.arrivals.length > 0;

  React.useEffect(() => {
    console.log('=== FollowResults Debug ===');
    console.log('data:', data);
    console.log('vehicleData:', vehicleData);
    console.log('hasArrivals:', hasArrivals);
    console.log('arrivals array:', vehicleData?.arrivals);
    console.log('isValidating:', isValidating);
    console.log('isFirstLoad:', isFirstLoad);
    console.log('error:', error);
  }, [data, vehicleData, hasArrivals, isValidating, isFirstLoad, error]);

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

  if (!runNumber) {
    return null;
  }

  return (
    <Container>
      {error ? (
        <Container>
          <Result
            status="warning"
            title={
              <span className={styles.errorTitle}>No Results</span>
            }
            subTitle="We were unable to follow that vehicle"
            icon={
              <FaTimesCircle className={styles.errorIcon} />
            }
          />
        </Container>

      ) : isFirstLoad ? (
        <Container>
          <Skeleton active />
        </Container>

      ) : !hasArrivals ? (
        <Container>
          <Empty description="No vehicle found with this run number" image={<GiParkBench size={84} />} />
        </Container>

      ) : (
        <>
          <Container bottom={16}>
            <div className={styles.titleContainer}>
              <Span size={0}>
                <h2 className={styles.titleText}>
                  <TransitIcon type={vehicleData.transitType} route={vehicleData.route} />
                  <span className={styles.runNumber}>Run #{vehicleData.run}</span>
                </h2>
                <div>
                  {vehicleData.transitType === 'train' ? (
                    <>
                      {vehicleData.route}
                      {vehicleData.destination && ` to ${vehicleData.destination}`}
                    </>
                  ) : (
                    <>
                      {vehicleData.route} Bus
                      {vehicleData.destination && ` to ${vehicleData.destination}`}
                      {vehicleData.direction && ` (${vehicleData.direction})`}
                    </>
                  )}
                </div>
              </Span>
              <Span left={10} right={0}>
                <Live isLive={isLive} onClick={handleLiveClick} />
              </Span>
            </div>
          </Container>

          <Container>
            <h4 className={styles.alignLeft}>Upcoming Stops</h4>
            <Table
              columns={columns}
              dataSource={vehicleData.arrivals}
              pagination={false}
              rowKey={(record) => record.stopId}
              size="middle"
              showHeader={false}
            />
          </Container>
        </>
      )}
    </Container>
  );
};

export default FollowResults;
