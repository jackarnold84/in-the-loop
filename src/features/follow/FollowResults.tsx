import { Empty, Result, Skeleton, Table } from "antd";
import { ColumnType } from "antd/lib/table";
import * as React from "react";
import { FaTimesCircle } from "react-icons/fa";
import { GiParkBench } from "react-icons/gi";
import useSWR from "swr";
import Container from "../../components/Container";
import Countdown from "../../components/Countdown";
import Live from "../../components/Live";
import Link from "../../components/Link";
import Span from "../../components/Span";
import TimeDisplay from "../../components/TimeDisplay";
import TransitIcon from "../../components/TransitIcon";
import * as styles from "./follow.module.css";
import { followVehicleFetcher, Stop } from "./followApi";
import { FollowStop, getFollowRows } from './followRows';

const REFRESH_INTERVAL = 15000;
const LIVE_THRESHOLD = 30000;

const isRecentUpdate = (lastUpdated: Date | undefined) => {
  return !!lastUpdated && (new Date().getTime() - lastUpdated.getTime()) < LIVE_THRESHOLD;
}

type FollowResultsProps = {
  runNumber: string;
  transitType: 'train' | 'bus';
};

const columns: ColumnType<FollowStop>[] = [
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
  const [expandedRowKeys, setExpandedRowKeys] = React.useState<React.Key[]>([]);

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
  const rows = React.useMemo(() => getFollowRows(vehicleData?.arrivals || []), [vehicleData?.arrivals]);

  React.useEffect(() => {
    const keys = new Set(rows.map(row => row.rowKey));
    setExpandedRowKeys(previous => previous.filter(key => keys.has(String(key))));
  }, [rows]);

  const toggleRow = (record: FollowStop) => {
    setExpandedRowKeys(previous => previous.includes(record.rowKey)
      ? previous.filter(key => key !== record.rowKey)
      : [...previous, record.rowKey]);
  };

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
            <Table<FollowStop>
              columns={columns}
              dataSource={rows}
              pagination={false}
              rowKey="rowKey"
              size="middle"
              showHeader={false}
              expandable={{
                expandedRowKeys,
                onExpand: (_, record) => toggleRow(record),
                expandedRowRender: record => (
                  <Link
                    to={`/nearby?${new URLSearchParams({ stop: record.stopId, run: runNumber })}`}
                    className={styles.transferLink}
                    onClick={event => event.stopPropagation()}
                  >
                    Transfer
                  </Link>
                ),
              }}
              onRow={record => ({
                style: { cursor: 'pointer' },
                onClick: () => toggleRow(record),
              })}
            />
          </Container>
        </>
      )}
    </Container>
  );
};

export default FollowResults;
