import * as React from "react";
import { FaTrainSubway } from "react-icons/fa6";
import styled from 'styled-components';
import { getTrainColor, palette } from '../utils/palette';

const BusIcon = styled.span`
  display: inline-block;
  background-color: ${palette.bus};
  color: white;
  padding: 0px 2px;
  border-radius: 4px;
  font-weight: 600;
  text-align: center;
  min-width: 24px;
`;

const TrainIcon = styled(FaTrainSubway)`
  vertical-align: middle;
  font-size: 20px;
`

const TransitIcon = ({ type, route }) => {
  if (type === 'bus') {
    return (
      <BusIcon>{route}</BusIcon>
    );
  } else {
    return (
      <span>
        <TrainIcon color={getTrainColor(route)} />
      </span>
    );
  }
}

export default TransitIcon
