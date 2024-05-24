import { MenuOutlined } from "@ant-design/icons"
import { Button, ConfigProvider, Drawer } from "antd"
import { Link } from "gatsby"
import * as React from "react"
import styled from "styled-components"
import '../styles/global.css'
import '../styles/icons.css'
import { palette } from "../utils/palette"
import Navigation from "./Navigation"
import BootIcon from "./common/BootIcon"
import Span from "./common/Span"

const Header = styled.div`
  padding: 24px;
  background-color: ${palette.primary};
  color: white;
  text-align: center;
`

const HeaderContent = styled.div`
  margin: auto;
  max-width: 600px;
  text-align: center;
`

const BodyContainer = styled.div`
  margin: auto;
  max-width: 600px;
  min-height: calc(-152px + 100vh);;
  padding: 16px;
`

const Footer = styled.div`
  padding: 8px 0;
  text-align: center;
  background-color: ${palette.primary};
`

const MenuButtonHolder = styled.div`
  float: left;
  padding: 0px 12px;
  position: absolute;
`

const Layout = ({ children }) => {
  const [openMenu, setOpenMenu] = React.useState(false);

  const showMenu = () => {
    setOpenMenu(true);
  };

  const closeMenu = () => {
    setOpenMenu(false);
  };

  return (
    <>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: palette.primary,
            fontFamily: "'Source Sans Pro', sans-serif",
            fontSize: 16,
          },
        }}
      >
        <div>
          <Header>
            <HeaderContent>
              <MenuButtonHolder>
                <Button type="primary" icon={<MenuOutlined />} onClick={showMenu} />
              </MenuButtonHolder>
              <Link to="/" className="plain-link white-text">
                <h3>Gatsby Template</h3>
              </Link>
            </HeaderContent>
          </Header>
        </div>

        <BodyContainer>
          {children}
        </BodyContainer>

        <Footer>
          <div className="white-text subtext">
            <Span style={{ fontSize: "14px" }}>
              Created by Jack Arnold
            </Span>
            <Span>
              <Button
                type="text"
                size="small"
                style={{ color: "white", fontSize: "14px" }}
                icon={<BootIcon name="github" />}
                href="https://github.com/jackarnold84/gatsby-template"
              >
                Github
              </Button>
            </Span>
          </div>
        </Footer>
      </ConfigProvider>

      <Drawer title="Gatsby Template" onClose={closeMenu} open={openMenu} placement="top">
        <Navigation closeMenu={closeMenu} />
      </Drawer >
    </>
  )
}

export default Layout
