import { orderByDistance } from 'geolib';
import React from 'react';
import { FaLocationArrow } from "react-icons/fa6";
import { MdOutlineWrongLocation } from "react-icons/md";
import useSWR from 'swr';
import Container from '../../components/Container';
import { stationIndex } from '../../config/index';
import { useAppContext } from '../layout/AppContext';
import { MenuButton } from '../layout/Navigation';
import Placeholder from './Placeholder';
import StationList from './StationList';
import { displayGeocode, pruneNearbyStations, reverseGeocode } from './nearbyLib';

export type Coord = {
  latitude: number;
  longitude: number;
};

export type StationCoord = Coord & {
  id: string;
};

const Nearby = () => {
  const {
    nearby: {
      location, setLocation,
      results, setResults,
    },
  } = useAppContext();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const stationCoords = Object.entries(stationIndex).map(([key, value]) => ({
    id: key,
    latitude: value.latitude,
    longitude: value.longitude,
  })) as StationCoord[];

  const { data: geocodeAddress, isLoading: geocodeLoading } = useSWR(
    location ? ['reverseGeocode', location] : null,
    () => reverseGeocode(location!)
  );
  const locationDisplay = geocodeAddress ? displayGeocode(geocodeAddress) : null;

  const fetchLocation = () => {
    setError(null);
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(position => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setLoading(false);
      },
        (error) => {
          if (error.code === error.PERMISSION_DENIED) {
            setError("Permission to access location was denied");
          } else {
            setError("Unable to retrieve location");
          }
          console.error(error);
          setLoading(false);
        }
      );
    } else {
      setError("Location services are not supported by this browser");
      console.error(error)
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchLocation();
  }, []);

  React.useEffect(() => {
    if (location) {
      const sortedStations = orderByDistance(location, stationCoords) as StationCoord[];
      const res = pruneNearbyStations(sortedStations, 25);

      setResults(res);
    }
  }, [location]);

  return (
    <Container width={500}>
      <Container centered flex>
        <MenuButton
          icon={<FaLocationArrow />}
          size="large"
          onClick={fetchLocation}
          loading={loading || geocodeLoading}
        >
          Nearby Stops
        </MenuButton>
      </Container>

      {locationDisplay && (
        <Container centered style={{ fontSize: '14px' }}>
          <div>{locationDisplay.locality}</div>
          <div>{locationDisplay.region}</div>
        </Container>
      )}

      <Container>
        {error && (
          <Placeholder description={error} icon={<MdOutlineWrongLocation />} />
        )}
        {!error && !geocodeLoading && (
          <StationList stationIds={results} />
        )}
      </Container>
    </Container>
  );
};

export default Nearby;
