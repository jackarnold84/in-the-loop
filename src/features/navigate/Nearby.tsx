import React from 'react';
import { FaLocationArrow } from "react-icons/fa6";
import { MdOutlineWrongLocation } from "react-icons/md";
import useSWR from 'swr';
import Container from '../../components/Container';
import { useAppContext } from '../layout/AppContext';
import { MenuButton } from '../layout/Navigation';
import Placeholder from './Placeholder';
import StationList from './StationList';
import { displayGeocode, getNearbyStations, getTransferOrigin, reverseGeocode } from './nearbyLib';

export const TransferNearby = ({ stopId }: { stopId: string }) => {
  const origin = getTransferOrigin(stopId);
  const results = React.useMemo(
    () => origin ? getNearbyStations(origin, stopId) : [],
    [origin, stopId]
  );

  return (
    <Container width={500}>
      {origin ? (
        <>
          <Container><h2>Transfers near {origin.name}</h2></Container>
          <Container><StationList stationIds={results} /></Container>
        </>
      ) : (
        <Placeholder
          description="The location of this transfer stop is unavailable"
          icon={<MdOutlineWrongLocation />}
        />
      )}
    </Container>
  );
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

  const { data: geocodeAddress, isLoading } = useSWR(
    location ? ['reverseGeocode', location] : null,
    () => reverseGeocode(location!)
  );
  const geocodeLoading = !geocodeAddress && isLoading;
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
      setResults(getNearbyStations(location));
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
