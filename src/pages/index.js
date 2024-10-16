import { Button } from "antd";
import { Link } from "gatsby";
import * as React from "react";
import { FaTrainSubway } from "react-icons/fa6";
import styled from "styled-components";
import Layout from "../components/Layout";
import Container from "../components/common/Container";
import ctaBanner from "../images/ctabanner.jpg";

const StyledButton = styled(Button)`
  width: 100%;
  max-width: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledLink = styled(Link)`
  display: inline-block;
  width: 100%;
  max-width: 400px;
  text-decoration: none;
`;

const StyledImage = styled.img`
  width: 100%;
  height: auto;
`;

const IndexPage = () => {
  return (
    <Layout>
      <Container size={16} centered>
        <StyledImage src={ctaBanner} alt="Train" />
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
