import { ArrowLeftOutlined } from "@ant-design/icons";
import { Button, Select, Table } from "antd";
import { Link, navigate } from "gatsby";
import * as React from "react";
import styled from "styled-components";
import { fetchArrivalData } from "../../api/track";
import Layout from "../../components/Layout";
import TransitIcon from "../../components/TransitIcon";
import Container from "../../components/common/Container";
import { tripCatalog } from "../../config/catalog";
import { displayTime, displayTimeUntil } from "../../utils/time";

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
`

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
    render: (text) => displayTime(text),
  },
  {
    dataIndex: ['arrival', 'time'],
    key: 'timeUntilArrival',
    width: 150,
    render: (text) => displayTimeUntil(text),
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
      render: (text) => `Arrive at ${displayTime(text)}`,
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
  }, [key, selectedDestination]);

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

  if (isLoading) {
    return <Layout>Loading...</Layout>;
  }

  if (isError) {
    return <Layout>Something went wrong</Layout>;
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
        {arrivalData.map((dataArray, index) => (
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
                  expandedRowRender: expandedRowRender,
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
        ))}
      </Container>
    </Layout>
  );
};

export default ArrivalsPage;

export const Head = () => <title>Arrivals</title>;
