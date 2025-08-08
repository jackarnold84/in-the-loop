import React from 'react';
import Layout from '../features/layout/Layout';
import Favorites from '../features/navigate/Favorites';

const FavoritesPage = () => {
  return (
    <Layout>
      <Favorites />
    </Layout>
  )
};

export default FavoritesPage

export const Head = () => <title>In The Loop - Favorites</title>
