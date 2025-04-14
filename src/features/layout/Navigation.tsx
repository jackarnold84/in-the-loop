import { Button, List } from "antd"
import * as React from "react"
import { FaHeart, FaHome, FaSearch } from "react-icons/fa"
import styled from "styled-components"
import Link from "../../components/Link"
import * as styles from "./layout.module.css"

export const MenuButton = styled(Button)`
  display: inline-flex;
  align-items: center;
  justify-content: center;

  & > span {
    margin-left: 6px;
  }
`;

interface NavigationProps {
  closeMenu: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ closeMenu }) => {
  const links = [
    { to: "/", icon: <FaHome style={{ verticalAlign: 'middle' }} />, text: "Home" },
    { to: "/favorites", icon: <FaHeart style={{ verticalAlign: 'middle' }} />, text: "Favorites" },
    { to: "/search", icon: <FaSearch style={{ verticalAlign: 'middle' }} />, text: "Search" },
  ]

  return (
    <>
      <List
        size="small"
        dataSource={links}
        renderItem={item => (
          <List.Item>
            <Link to={item.to} className={styles.navLink}>
              <MenuButton type="text" icon={item.icon} size="large" block onClick={closeMenu} >
                {item.text}
              </MenuButton>
            </Link>
          </List.Item>
        )}
      />
    </>
  )
}

export default Navigation
