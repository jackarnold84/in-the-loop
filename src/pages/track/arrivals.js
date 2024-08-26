import { Table } from "antd";
import * as React from "react";
import Layout from "../../components/Layout";
import TransitIcon from "../../components/TransitIcon";
import Container from "../../components/common/Container";
import { displayTime, displayTimeUntil } from "../../utils/time";

// sample data
const arrivalData = [
  [
    {
      "transitType": "train",
      "route": "Pink",
      "run": "312",
      "destination": "Loop",
      "direction": "Southbound",
      "arrival": {
        "stopId": "30221",
        "stopName": "Clinton",
        "time": "2024-07-29T14:26:59",
        "isApproaching": false,
        "isDelayed": false,
        "isLive": true
      },
      "departure": {
        "stopId": "30074",
        "stopName": "Clark/Lake",
        "time": "2024-07-29T14:28:59",
        "isApproaching": false,
        "isDelayed": false,
        "isLive": true
      },
    },
    {
      "transitType": "train",
      "route": "Green",
      "run": "611",
      "destination": "Cottage Grove",
      "direction": "Southbound",
      "arrival": {
        "stopId": "30221",
        "stopName": "Clinton",
        "time": "2024-07-29T14:27:54",
        "isApproaching": false,
        "isDelayed": false,
        "isLive": true
      },
      "departure": {
        "stopId": "30074",
        "stopName": "Clark/Lake",
        "time": "2024-07-29T14:29:54",
        "isApproaching": false,
        "isDelayed": false,
        "isLive": true
      },
    },
  ],
  [
    {
      "transitType": "bus",
      "route": "20",
      "run": "1429",
      "destination": "Irving Park",
      "direction": "Northbound",
      "arrival": {
        "stopId": "17177",
        "stopName": "Ashland & Adams",
        "time": "2024-07-29T17:12:38",
        "isApproaching": false,
        "isDelayed": false,
        "isLive": true
      },
      "departure": {
        "stopId": "14783",
        "stopName": "Ashland & Lake (Green Line)",
        "time": "2024-07-29T17:17:29",
        "isApproaching": false,
        "isDelayed": false,
        "isLive": true
      }
    },
  ]
];

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
  const [expandedRowKeys, setExpandedRowKeys] = React.useState([]);

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

  return (
    <Layout>
      <Container size={16} centered>
        {arrivalData.map((dataArray, index) => (
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
        ))}
      </Container>
    </Layout>
  );
};

export default ArrivalsPage;

export const Head = () => <title>Arrivals</title>;