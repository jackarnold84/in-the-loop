import { Button, List } from "antd"
import { Link } from "gatsby"
import * as React from "react"
import { FaHome } from "react-icons/fa"
import { FaTrainSubway } from "react-icons/fa6"
import styled from "styled-components"

const NavLink = styled(Link)`
  margin: auto;
  width: 100%;
`

const Navigation = ({ closeMenu }) => {
  const links = [
    { to: "/", icon: <FaHome style={{ verticalAlign: 'middle' }} />, text: "Home" },
    { to: "/track", icon: <FaTrainSubway style={{ verticalAlign: 'middle' }} />, text: "Track" },
  ]

  return (
    <>
      <List
        size="small"
        dataSource={links}
        renderItem={item => (
          <List.Item>
            <NavLink to={item.to}>
              <Button type="text" icon={item.icon} size="large" block onClick={closeMenu} >
                {item.text}
              </Button>
            </NavLink>
          </List.Item>
        )}
      />
    </>
  )
}

export default Navigation
