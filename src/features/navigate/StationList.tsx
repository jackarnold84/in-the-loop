import { Link } from 'gatsby';
import React from 'react';
import TransitIcon from '../../components/TransitIcon';
import { stationIndex, trackIndex } from '../../config/index';
import * as styles from "./navigate.module.css";

type StationListProps = {
  stationIds: string[];
  source?: string | null;
};

const StationList: React.FC<StationListProps> = ({ stationIds, source }) => {
  const sourceParam = source ? `?source=${source}` : "";
  return (
    <>
      {stationIds.map((stationId) => {
        const station = stationIndex[stationId];
        const tracks = Object.values(station.stops)
          .flat()
          .map((stopId) => trackIndex[stopId]);
        const type = tracks[0].type as 'train' | 'bus';
        const routes = Array.from(new Set(tracks.map((track) => track.route)));

        return (
          <Link
            to={`/station/${stationId}${sourceParam}`}
            key={stationId}
            className={`${styles.rowLink} ${styles.slimRow}`}
          >
            <div>{station.name}</div>
            <div className={styles.iconFlexHolder}>
              {routes.map(route => (
                <TransitIcon key={route} type={type} route={route} />
              ))}
            </div>
          </Link>
        )
      })}
    </>
  );
};

export default StationList
