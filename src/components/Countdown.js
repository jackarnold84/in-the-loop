import * as React from "react";
import styled from "styled-components";
import { palette } from "../utils/palette";

const TimeSpan = styled.span`
  font-weight: 800;
  margin-right: 2px;
`;

const Countdown = ({ dateStr, isApproaching = false }) => {
  const getTimeComponents = ({ dateStr, currentTime }) => {
    const targetTime = new Date(dateStr);
    const diff = targetTime - currentTime;

    if (diff <= 0) {
      return ["0:00", ""];
    }

    const minutes = Math.floor(diff / 1000 / 60);
    const hours = Math.floor(minutes / 60);
    const seconds = Math.floor((diff / 1000) % 60);

    if (hours >= 1) {
      return ["1", "hr+"];
    } else if (minutes >= 5) {
      return [`${minutes}`, "min"];
    }

    return [`${minutes}:${seconds.toString().padStart(2, '0')}`, ""];
  };

  const [currentTime, setCurrentTime] = React.useState(new Date());
  const [time, unit] = getTimeComponents({ dateStr, currentTime });

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={isApproaching ? { color: palette.alertRed } : {}}>
      <TimeSpan>{time}</TimeSpan>
      <span>{unit}</span>
    </div>
  );
};

export default Countdown;
