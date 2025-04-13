import { Input } from 'antd';
import React from 'react';
import Container from '../../components/Container';
import { stationIndex } from '../../config/index';
import StationList from './StationList';

const Search = () => {

  const randomStationKeys = Object.keys(stationIndex)
    .sort(() => 0.5 - Math.random())
    .slice(0, 15);

  const onSearch = (value: string) => {
    console.log(value);
  }

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(event.target.value);
  };

  return (
    <Container width={500}>
      <Container>
        <Input.Search
          placeholder="Search for stops"
          size="large" allowClear
          onSearch={onSearch} onChange={onChange}
        />
      </Container>

      <Container size={16}>
        <StationList stationIds={randomStationKeys} />
      </Container>
    </Container>
  );
};

export default Search
