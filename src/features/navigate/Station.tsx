import { Link } from 'gatsby';
import React from 'react';
import Container from '../../components/Container';
import Span from '../../components/Span';
import TransitIcon from '../../components/TransitIcon';
import { stationIndex, trackIndex } from '../../config/index';
import * as styles from "./navigate.module.css";

type StationProps = {
  stationId: string;
};

const Station: React.FC<StationProps> = ({ stationId }) => {
  const station = stationIndex[stationId];

  return (
    <Container>
      <Container>
        <h2>{station.name}</h2>
      </Container>

      <Container>
        <Container>
          <h4>Select a stop direction:</h4>
        </Container>

        {Object.entries(station.stops).map(([stopId, trackIds]) => {
          const tracks = trackIds.map(tid => trackIndex[tid]);
          return (
            <Link to={stopId} key={stopId} className={styles.rowLink}>
              {tracks.map((track, trackIdx) => (
                <div key={trackIdx} className={styles.iconTextWrapper}>
                  <Span size={10} className={styles.iconHolder}>
                    <TransitIcon type={track.type as 'train' | 'bus'} route={track.route} />
                  </Span>
                  {track.type === "train" ? (
                    <span>{track.headsign.join(", ")}</span>
                  ) : (
                    <span>{`${track.routeName} ${track.direction}bound`}</span>
                  )}
                </div>
              ))}
            </Link>
          );
        })}
      </Container>
    </Container>
  );
};

export default Station
