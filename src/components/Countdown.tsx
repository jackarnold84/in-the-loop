import * as React from "react";
import styled from "styled-components";
import { palette } from "../styles/palette";

const TimeSpan = styled.span`
  font-weight: 800;
  margin-right: 2px;
`;

interface CountdownProps {
  dateStr: string;
  isApproaching?: boolean;
}

const Countdown: React.FC<CountdownProps> = ({ dateStr, isApproaching = false }) => {
  const getTimeComponents = ({ dateStr, currentTime }: { dateStr: string; currentTime: Date }): [string, string] => {
    const targetTime = new Date(dateStr);
    const diff = targetTime.getTime() - currentTime.getTime();

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

  const [currentTime, setCurrentTime] = React.useState<Date>(new Date());
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
