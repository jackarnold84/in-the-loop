import { Select, Table } from "antd";
import * as React from "react";
import styled from "styled-components";
import { fetchArrivalData } from "../../api/track";
import Layout from "../../components/Layout";
import TransitIcon from "../../components/TransitIcon";
import Container from "../../components/common/Container";
import { displayTime, displayTimeUntil } from "../../utils/time";

const { Option } = Select;

const StyledLabel = styled.label`
  font-size: 12px;
  display: block;
  margin-bottom: 4px;
`;

const tripCatalog = {
  "clinton-to-loop": {
    "name": "Clinton to Loop",
    "options": [
      {
        "transitType": "train",
        "stopId": "30221",
        "routes": ["Pink", "Green"],
      }
    ],
    "destinations": [
      {
        "name": "Clark/Lake",
        "stopId": "30074"
      },
    ],
  },
  "ashland-adams-northbound": {
    "name": "Ashland & Adams Northbound",
    "options": [
      {
        "transitType": "bus",
        "stopId": "17177",
        "routes": ["9"],
      },
      {
        "transitType": "bus",
        "stopId": "17076",
        "routes": ["X9"],
      },
    ],
    "destinations": [
      {
        "name": "Ashland & Lake",
        "stopId": "14783"
      },
      {
        "name": "Ashland & Milwaukee",
        "stopId": "6252"
      },
    ],
  },
};

const targetTrip = "ashland-adams-northbound";

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

const ArrivalsPage = () => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [isError, setIsError] = React.useState(false);
  const [arrivalData, setArrivalData] = React.useState([]);
  const [expandedRowKeys, setExpandedRowKeys] = React.useState([]);
  const [selectedDestination, setSelectedDestination] = React.useState(tripCatalog[targetTrip].destinations[0].stopId);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const trip = tripCatalog[targetTrip];
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

    fetchData();
  }, [selectedDestination]);

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
      <Container size={16}>
        <Container bottom={16}>
          <h2>{tripCatalog[targetTrip].name}</h2>
        </Container>
        <Container bottom={16}>
          <StyledLabel>Destination Stop:</StyledLabel>
          <Select
            id="destination-select"
            defaultValue={tripCatalog[targetTrip].destinations[0].stopId}
            style={{ width: '100%' }}
            onChange={handleDestinationChange}
          >
            {tripCatalog[targetTrip].destinations.map((destination) => (
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
