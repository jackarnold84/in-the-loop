import { ArrowLeftOutlined, WarningFilled } from "@ant-design/icons";
import { Button, Empty, Result, Select, Skeleton, Table } from "antd";
import { Link, navigate, PageProps } from "gatsby";
import * as React from "react";
import { GiParkBench } from "react-icons/gi";
import styled from "styled-components";
import { Arrival, ArrivalData, fetchArrivalData } from "../../api/track";
import Container from "../../components/Container";
import Countdown from "../../components/Countdown";
import Live from "../../components/Live";
import TimeDisplay from "../../components/TimeDisplay";
import TransitIcon from "../../components/TransitIcon";
import { tripCatalog } from "../../config/catalog";
import Layout from '../../features/layout/Layout';

const { Option } = Select;

const StyledLabel = styled.label`
  font-size: 12px;
  display: block;
  margin-bottom: 4px;
`;

const StyledButton = styled(Button)`
  display: inline;
  align-items: center;
  justify-content: flex-start;
  padding: 8px 16px 8px 0px;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  display: block;
  width: fit-content;
`;

const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

// table setup
const columns = [
  {
    dataIndex: 'route',
    key: 'route',
    width: 75,
    render: (text: string, record: Arrival) => (
      <TransitIcon type={record.transitType} route={text} />
    )
  },
  {
    dataIndex: ['arrival', 'time'],
    key: 'arrivalTime',
    width: 150,
    render: (text: string) => <TimeDisplay dateStr={text} />,
  },
  {
    dataIndex: ['arrival', 'time'],
    key: 'timeUntilArrival',
    width: 150,
    render: (text: string, record: Arrival) => (
      <Countdown dateStr={text} isApproaching={record.arrival.isApproaching} />
    ),
  },
];

const expandedRowRender = (record: Arrival) => {
  const expandedColumns = [
    {
      dataIndex: 'run',
      key: 'run',
      width: 75,
      render: (text: string) => `#${text}`,
    },
    {
      dataIndex: ['departure', 'time'],
      key: 'reachDestination',
      width: 225,
      render: (text: string) => <span>
        Arrive at <TimeDisplay dateStr={text} />
      </span>,
    },
  ];

  const expandedData = [{ ...record }];
  return (
    <Table
      columns={expandedColumns}
      dataSource={expandedData}
      pagination={false}
      showHeader={false}
      size="small"
      rowKey="run"
    />
  );
};

type ArrivalsPageParams = {
  key?: string | null;
};

const ArrivalsPage: React.FC<PageProps> = ({ location }) => {
  const searchParams = new URLSearchParams(location.search);
  const urlParams: ArrivalsPageParams = {
    key: searchParams.get('key'),
  };
  const key = urlParams.key || '';

  const [isKeySet, setIsKeySet] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isError, setIsError] = React.useState(false);
  const [arrivalData, setArrivalData] = React.useState<ArrivalData[]>([]);
  const [expandedRowKeys, setExpandedRowKeys] = React.useState<string[]>([]);
  const [selectedDestination, setSelectedDestination] = React.useState('');
  const [lastUpdated, setLastUpdated] = React.useState<Date | null>(null);
  const [isLive, setIsLive] = React.useState(false);
  const [counter, setCounter] = React.useState(0);

  // fetch from api
  const fetchData = React.useCallback(async () => {
    try {
      const trip = tripCatalog[key];
      const data: ArrivalData[] = [];
      for (const option of trip.options) {
        const { transitType, stopId, routes } = option;
        const arrivalData = await fetchArrivalData(transitType, routes, stopId, selectedDestination);
        data.push(arrivalData);
      }
      setArrivalData(data);
      setIsLoading(false);
      setLastUpdated(new Date());
    } catch (error) {
      setIsError(true);
      setIsLoading(false);
    }
  }, [key, selectedDestination]);

  // initial setup based on key
  React.useEffect(() => {
    if (!key || !tripCatalog[key]) {
      navigate("/track/");
      return;
    }
    setSelectedDestination(tripCatalog[key].destinations[0].stopId);
    setIsKeySet(true);
  }, [key]);

  // fetch every 20 seconds up to 10 times
  React.useEffect(() => {
    if (isKeySet) {
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
    }
  }, [key, isKeySet, selectedDestination, counter, fetchData]);

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

  const handleRowClick = (record: Arrival) => {
    setExpandedRowKeys((prevKeys) =>
      prevKeys.includes(record.run)
        ? prevKeys.filter((key) => key !== record.run)
        : [...prevKeys, record.run]
    );
  };

  const handleExpand = (_: boolean, record: Arrival) => {
    handleRowClick(record);
  };

  const handleDestinationChange = (value: string) => {
    setSelectedDestination(value);
  };

  if (!isKeySet) {
    return <Layout> </Layout>;
  }

  return (
    <Layout>
      <Container>
        <Container top={0}>
          <StyledLink to="/track/">
            <StyledButton type="link" icon={<ArrowLeftOutlined />}>
              Select New Trip
            </StyledButton>
          </StyledLink>
        </Container>
        <Container bottom={16}>
          <TitleContainer>
            <h2>{tripCatalog[key].name}</h2>
            <Live isLive={isLive} onClick={handleLiveClick} />
          </TitleContainer>
        </Container>
        <Container bottom={16}>
          <StyledLabel>Destination Stop:</StyledLabel>
          <Select
            id="destination-select"
            defaultValue={tripCatalog[key].destinations[0].stopId}
            style={{ width: '100%' }}
            onChange={handleDestinationChange}
          >
            {tripCatalog[key].destinations.map((destination) => (
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
                <span style={{ fontSize: '24px' }}>Something went wrong</span>
              }
              subTitle="We were unable to retrieve live CTA tracking data"
              icon={
                <WarningFilled style={{ fontSize: '48px', color: '#faad14' }} />
              }
            />
          </Container>
        ) : isLoading ? (
          <Container>
            <Skeleton active />
          </Container>
        ) : arrivalData[0].length === 0 ? (
          <Container>
            <Empty description="No upcoming arrivals found" image={<GiParkBench size={84} />} />
          </Container>
        ) : (
          arrivalData.map((dataArray, index) => (
            dataArray.length > 0 && (
              <Container size={16} key={index}>
                <h4 style={{ textAlign: "left" }}>{dataArray[0]?.arrival?.stopName}</h4>
                <Table
                  columns={columns}
                  dataSource={dataArray}
                  showHeader={false}
                  pagination={false}
                  rowKey="run"
                  expandable={{
                    expandedRowRender: (record) => expandedRowRender(record),
                    rowExpandable: () => true,
                    expandedRowKeys: expandedRowKeys,
                    onExpand: handleExpand,
                  }}
                  onRow={(record) => ({
                    style: { cursor: 'pointer' },
                    onClick: () => handleRowClick(record),
                  })}
                />
              </Container>
            )
          ))
        )}
      </Container>
    </Layout>
  );
};

export default ArrivalsPage;

export const Head = () => <title>El Track - Arrivals</title>;
