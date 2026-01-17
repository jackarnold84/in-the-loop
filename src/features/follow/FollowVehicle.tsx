import { useLocation } from '@reach/router';
import { Input } from 'antd';
import { navigate } from 'gatsby';
import React from 'react';
import { FaRoute } from 'react-icons/fa';
import Container from '../../components/Container';
import Placeholder from '../navigate/Placeholder';
import FollowResults from './FollowResults';

type FollowVehicleProps = {
  showSearch?: boolean;
};

const FollowVehicle: React.FC<FollowVehicleProps> = ({ showSearch = true }) => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const runNumberFromUrl = params.get('run') || '';

  const [runNumber, setRunNumber] = React.useState(runNumberFromUrl);
  const [searchValue, setSearchValue] = React.useState(runNumberFromUrl);

  // Derive transit type from run number
  const transitType: 'train' | 'bus' = runNumber && runNumber.length > 3 ? 'bus' : 'train';

  // Determine transit type and format run number based on length
  const determineTransitTypeAndFormat = (value: string): { transitType: 'train' | 'bus'; formattedRun: string } => {
    const numericValue = value.replace(/\D/g, ''); // Remove non-digits

    if (numericValue.length === 0) {
      return { transitType: 'train', formattedRun: '' };
    }

    if (numericValue.length <= 3) {
      // Train: pad with leading zeros to make it 3 digits
      return {
        transitType: 'train',
        formattedRun: numericValue.padStart(3, '0')
      };
    } else {
      // Bus: more than 3 digits
      return {
        transitType: 'bus',
        formattedRun: numericValue
      };
    }
  };

  React.useEffect(() => {
    const params = new URLSearchParams(location.search);
    const urlRun = params.get('run') || '';
    setRunNumber(urlRun);
    setSearchValue(urlRun);
  }, [location.search]);

  const onSearch = (value: string) => {
    const { formattedRun } = determineTransitTypeAndFormat(value);

    if (formattedRun) {
      navigate(`/follow?run=${encodeURIComponent(formattedRun)}`);
    } else {
      navigate('/follow');
    }
  };

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    // Only allow numeric digits
    const numericValue = value.replace(/\D/g, '');
    setSearchValue(numericValue);
  };

  return (
    <Container width={600}>
      {showSearch && (
        <Container>
          <Input.Search
            placeholder="Enter run number"
            value={searchValue}
            size="large"
            allowClear autoFocus
            onSearch={onSearch} onChange={onChange}
            inputMode="numeric"
          />
        </Container>
      )}

      <Container size={16}>
        {runNumber === "" ? (
          <Placeholder
            description="Enter a train or bus run number to follow its location"
            icon={<FaRoute />}
          />
        ) : (
          <FollowResults runNumber={runNumber} transitType={transitType} />
        )}
      </Container>
    </Container>
  );
};

export default FollowVehicle;
