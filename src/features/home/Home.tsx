import { Link } from "gatsby"
import { StaticImage } from "gatsby-plugin-image"
import * as React from "react"
import { FaTrainSubway } from "react-icons/fa6"
import styled from "styled-components"
import Container from "../../components/Container"
import { MenuButton } from "../layout/Navigation"

const NavLink = styled(Link)`
  margin: auto;
  width: 100%;
  margin: 8px 0;
`;

const BetaText = styled.div`
  font-size: 12px;
  font-weight: 800;
`;

const Home = () => {
  const links = [
    { to: "/track", icon: <FaTrainSubway />, text: "Track" },
  ]

  return (
    <>
      <Container size={16} centered>
        <StaticImage
          src="../../images/ctabanner.jpg"
          alt="CTA train banner"
          placeholder="blurred"
          layout="fullWidth"
        />

        <Container size={24}>
          <div>Track arrivals of elevated trains and busses in Chicago</div>
          <BetaText>BETA</BetaText>
        </Container>
      </Container>

      <Container width={500}>
        {links.map(link => (
          <Container key={link.to}>
            <NavLink to={link.to}>
              <MenuButton type="primary" icon={link.icon} size="large" block>
                {link.text}
              </MenuButton>
            </NavLink>
          </Container>
        ))}
      </Container>
    </>
  )
}

export default Home
