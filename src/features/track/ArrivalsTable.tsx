import { Table } from "antd";
import * as React from "react";
import { Arrival } from "../../api/track";
import Countdown from "../../components/Countdown";
import TimeDisplay from "../../components/TimeDisplay";
import TransitIcon from "../../components/TransitIcon";

type ArrivalsTableProps = {
  dataArray: Arrival[];
};

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

const ArrivalsTable: React.FC<ArrivalsTableProps> = ({ dataArray }) => {
  const [expandedRowKeys, setExpandedRowKeys] = React.useState<string[]>([]);

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

  return (
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
  );
};

export default ArrivalsTable;
