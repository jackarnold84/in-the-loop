import { Button } from "antd";
import { Link } from "gatsby";
import { StaticImage } from "gatsby-plugin-image";
import * as React from "react";
import { FaTrainSubway } from "react-icons/fa6";
import styled from "styled-components";
import Container from "../components/Container";
import Layout from '../features/layout/Layout';

const StyledButton = styled(Button)`
  width: 100%;
  max-width: 400px;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  & > span {
    margin-left: 6px;
  }
`;

const StyledLink = styled(Link)`
  display: inline-block;
  width: 100%;
  max-width: 400px;
  text-decoration: none;
`;

const IndexPage = () => {
  return (
    <Layout>
      <Container size={16} centered>
        <StaticImage src="../images/ctabanner.jpg" alt="Train" style={{ width: '100%', height: 'auto' }} />
        <Container size={24}>
          Track arrivals of elevated trains and busses in Chicago
          <div style={{ fontSize: '12px', fontWeight: '800' }}>BETA</div>
        </Container>
        <StyledLink to="/track">
          <StyledButton type="primary" size="large" icon={<FaTrainSubway />}>
            Track
          </StyledButton>
        </StyledLink>
      </Container>
    </Layout>
  );
};

export default IndexPage;

export const Head = () => <title>El Track</title>;
