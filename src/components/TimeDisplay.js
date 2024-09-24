import * as React from "react";
import styled from "styled-components";

const SmallCaps = styled.span`
  font-size: 0.7em;
  margin-left: 2px;
`;

const TimeDisplay = ({ dateStr }) => {
  const toTime = (dateStr) => {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      return { time: "--", period: "" };
    }

    const timeString = date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });

    const [time, period] = timeString.split(' ');

    return { time, period };
  }

  const { time, period } = toTime(dateStr);

  return (
    <span>
      <span>{time}</span>
      <SmallCaps>{period}</SmallCaps>
    </span>
  );
};

export default TimeDisplay;
