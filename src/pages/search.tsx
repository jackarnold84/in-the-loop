import React from 'react';
import Layout from '../features/layout/Layout';
import Search from '../features/navigate/Search';

const SearchPage = () => {
  return (
    <Layout>
      <Search />
    </Layout>
  )
};

export default SearchPage

export const Head = () => <title>El Track - Search</title>
