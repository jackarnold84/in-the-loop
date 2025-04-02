import { ArrowLeftOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { Link } from 'gatsby';
import React from 'react';
import styled from 'styled-components';
import Container from './Container';

type BackButtonProps = {
  to: string;
  text?: string;
};

const PaddedButton = styled(Button)`
  padding: 8px 16px 8px 0px;
`;

const BackButton: React.FC<BackButtonProps> = ({ to, text }) => {
  const buttonText = text || "Back";
  return (
    <Container top={10} bottom={2}>
      <Link to={to}>
        <PaddedButton type="link" icon={<ArrowLeftOutlined />}>
          {buttonText}
        </PaddedButton>
      </Link>
    </Container>
  );
};

export default BackButton
