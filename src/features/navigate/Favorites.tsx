import { List, Tabs } from 'antd';
import { Link } from 'gatsby';
import React from 'react';
import styled from 'styled-components';
import TransitIcon from '../../components/TransitIcon';
import { tripCatalog, tripIndex } from '../../config/catalog';
import { useAppContext } from '../layout/AppContext';

const IconHolder = styled.div`
  min-width: 60px;
  display: flex;
  gap: 4px;
`;

const StyledLink = styled(Link)`
  display: block;
  text-decoration: none;
  cursor: pointer;

  .list-item {
    transition: background-color 0.3s;
    padding: 10px;
    border-bottom: 1px solid rgba(5, 5, 5, 0.06) !important;

    &:hover {
      background-color: #fafafa;
    }
  }
`;

const renderTripItem = (tripKey: string) => {
  const trip = tripCatalog[tripKey];
  return (
    <StyledLink
      to={`/favorites/${tripKey}`}
    >
      <List.Item className="list-item">
        <List.Item.Meta
          avatar={
            <IconHolder>
              <TransitIcon type={trip.options[0].transitType} route={trip.options[0].routes[0]} />
              {trip.options[0].routes.length > 1 && (
                <TransitIcon type={trip.options[0].transitType} route={trip.options[0].routes[1]} />
              )}
            </IconHolder>
          }
          title={trip.name}
        />
      </List.Item>
    </StyledLink>
  );
};

const Favorites = () => {
  const { favoritesTab: { activeTab, setActiveTab } } = useAppContext();

  const tabItems = [
    {
      key: '1',
      label: 'Outbound',
      children: (
        <List
          itemLayout="horizontal"
          dataSource={tripIndex.outbound}
          renderItem={renderTripItem}
        />
      ),
    },
    {
      key: '2',
      label: 'Inbound',
      children: (
        <List
          itemLayout="horizontal"
          dataSource={tripIndex.inbound}
          renderItem={renderTripItem}
        />
      ),
    },
  ];

  return (
    <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabItems} />
  );
};

export default Favorites
