import { Button } from "antd";
import * as React from "react";
import { BsRecord2 } from "react-icons/bs";
import styled, { css, keyframes } from "styled-components";
import { palette } from "../styles/palette";

const fadeOpacity = keyframes`
  0% {
    opacity: 1;
  }
  40% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
  }
`;

const PulsingIcon = styled(BsRecord2)`
  animation: ${css`${fadeOpacity} 2s infinite`};
`;

const LiveButton = styled(Button)`
  border: none;
  background: transparent;
  padding: 2px;
  box-shadow: none;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover, &:focus {
    background: transparent;
  }
`;

const Live = ({ isLive = false, onClick = () => { } }) => {
  return (
    <LiveButton onClick={onClick}>
      {isLive ?
        <PulsingIcon size={24} color={palette.primary} />
        :
        <BsRecord2 size={24} color="grey" />
      }
    </LiveButton>
  );
};

export default Live;
