import type { Stop } from './followApi';

export type FollowStop = Stop & { rowKey: string };

export const getFollowRows = (stops: Stop[]): FollowStop[] => {
  const occurrences = new Map<string, number>();
  for (const stop of stops) {
    occurrences.set(stop.stopId, (occurrences.get(stop.stopId) || 0) + 1);
  }
  return stops.map(stop => {
    // Count from the end so removing a passed stop preserves later occurrences.
    const occurrence = occurrences.get(stop.stopId)! - 1;
    occurrences.set(stop.stopId, occurrence);
    return { ...stop, rowKey: `${stop.stopId}:${occurrence}` };
  });
};
