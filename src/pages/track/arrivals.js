import { ArrowLeftOutlined, WarningFilled } from "@ant-design/icons";
import { Button, Empty, Result, Select, Skeleton, Table } from "antd";
import { Link, navigate } from "gatsby";
import * as React from "react";
import { GiParkBench } from "react-icons/gi";
import styled from "styled-components";
import { fetchArrivalData } from "../../api/track";
import Countdown from "../../components/Countdown";
import Layout from "../../components/Layout";
import TimeDisplay from "../../components/TimeDisplay";
import TransitIcon from "../../components/TransitIcon";
import Container from "../../components/common/Container";
import { tripCatalog } from "../../config/catalog";

const { Option } = Select;

const StyledLabel = styled.label`
  font-size: 12px;
  display: block;
  margin-bottom: 4px;
`;

const StyledButton = styled(Button)`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 8px 16px 8px 0px;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  display: block;
  width: fit-content;
`;

// table setup
const columns = [
  {
    dataIndex: 'route',
    key: 'route',
    width: 75,
    render: (text, record) => (
      <TransitIcon type={record.transitType} route={text} />
    )
  },
  {
    dataIndex: ['arrival', 'time'],
    key: 'arrivalTime',
    width: 150,
    render: (text) => <TimeDisplay dateStr={text} />,
  },
  {
    dataIndex: ['arrival', 'time'],
    key: 'timeUntilArrival',
    width: 150,
    render: (text, record) => (
      <Countdown dateStr={text} isApproaching={record.arrival.isApproaching} />
    ),
  },
];

const expandedRowRender = (record) => {
  const expandedColumns = [
    {
      dataIndex: 'run',
      key: 'run',
      width: 75,
      render: (text) => `#${text}`,
    },
    {
      dataIndex: ['departure', 'time'],
      key: 'reachDestination',
      width: 225,
      render: (text) => <span>
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

const ArrivalsPage = ({ location }) => {
  const urlParams = new Proxy(new URLSearchParams(location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
  });
  const key = urlParams.key;

  const [isKeySet, setIsKeySet] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isError, setIsError] = React.useState(false);
  const [arrivalData, setArrivalData] = React.useState([]);
  const [expandedRowKeys, setExpandedRowKeys] = React.useState([]);
  const [selectedDestination, setSelectedDestination] = React.useState('');

  React.useEffect(() => {
    if (!key || !tripCatalog[key]) {
      navigate("/track/");
      return;
    }
    setSelectedDestination(tripCatalog[key].destinations[0].stopId);
    setIsKeySet(true);
  }, [key]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const trip = tripCatalog[key];
        const data = [];
        for (const option of trip.options) {
          const { transitType, stopId, routes } = option;
          const arrivalData = await fetchArrivalData(transitType, routes, stopId, selectedDestination);
          data.push(arrivalData);
        }
        console.log(data);
        setArrivalData(data);
        setIsLoading(false);
      } catch (error) {
        setIsError(true);
        setIsLoading(false);
      }
    };

    if (isKeySet) {
      fetchData();
    }
  }, [key, isKeySet, selectedDestination]);

  const handleRowClick = (record) => {
    setExpandedRowKeys((prevKeys) =>
      prevKeys.includes(record.run)
        ? prevKeys.filter((key) => key !== record.run)
        : [...prevKeys, record.run]
    );
  };

  const handleExpand = (_, record) => {
    handleRowClick(record);
  };

  const handleDestinationChange = (value) => {
    setSelectedDestination(value);
  };

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
          <h2>{tripCatalog[key].name}</h2>
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

export const Head = () => <title>Arrivals</title>;
