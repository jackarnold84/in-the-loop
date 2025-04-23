import { Input } from 'antd';
import Fuse from "fuse.js";
import React from 'react';
import { LuSearch, LuSearchX } from 'react-icons/lu';
import Container from '../../components/Container';
import { stationIndex } from '../../config/index';
import { useAppContext } from '../layout/AppContext';
import Placeholder from './Placeholder';
import StationList from './StationList';

const Search = () => {
  const {
    search: {
      searchValue, setSearchValue,
      searchResults, setSearchResults,
    },
  } = useAppContext();

  const data = Object.entries(stationIndex).map(([key, value]) => ({
    id: key,
    name: value.name,
  }));
  const fuse = new Fuse(data, { keys: ["name"], threshold: 0.3 });

  const onSearch = (value: string) => {
    setSearchValue(value);
    const result = fuse.search(value).slice(0, 15);
    setSearchResults(result.map((item) => item.item.id));
  };

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(event.target.value);
  };

  return (
    <Container width={500}>
      <Container>
        <Input.Search
          placeholder="Search for stops"
          value={searchValue}
          size="large"
          allowClear autoFocus
          onSearch={onSearch} onChange={onChange}
        />
      </Container>

      <Container size={16}>
        {searchValue === "" ? (
          <Placeholder description="Search for stops by name" icon={<LuSearch />} />
        ) : searchResults.length === 0 ? (
          <Placeholder description={`No stops found for "${searchValue}"`} icon={<LuSearchX />} />
        ) : (
          <StationList stationIds={searchResults} />
        )}
      </Container>
    </Container>
  );
};

export default Search;
