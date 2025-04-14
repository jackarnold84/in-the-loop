import { ArrowLeftOutlined } from '@ant-design/icons';
import { useLocation } from '@reach/router';
import { Button } from 'antd';
import { navigate } from 'gatsby';
import React from 'react';
import styled from 'styled-components';
import Container from './Container';

type Path = {
  to: string;
  text: string;
};

type BackButtonProps = {
  paths: [Path, ...Path[]];
};

type LocationState = {
  source?: string;
};

const normalizePath = (path: string) =>
  path?.endsWith('/') ? path.slice(0, -1) : path;

const PaddedButton = styled(Button)`
  padding: 8px 16px 8px 0px;
`;

const BackButton: React.FC<BackButtonProps> = ({ paths }) => {
  const location = useLocation();
  const state = location.state as LocationState;
  const source = state?.source;

  const matchedPath = source
    ? paths.find((path) => normalizePath(path.to) === normalizePath(source))
    : undefined;
  const path = matchedPath || paths[0];

  const onClick = () => {
    if (matchedPath) {
      navigate(-1);
    } else {
      navigate(path.to);
    }
  };

  return (
    <Container top={10} bottom={2}>
      <PaddedButton type="link" icon={<ArrowLeftOutlined />} onClick={onClick}>
        {path.text}
      </PaddedButton>
    </Container>
  );
};

export default BackButton
