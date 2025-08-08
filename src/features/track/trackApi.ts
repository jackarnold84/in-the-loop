const endpointUrl = "https://w2blpi2104.execute-api.us-east-2.amazonaws.com/Prod/in-the-loop";

export interface Arrival {
  arrival: {
    time: string;
    stopName?: string;
    isApproaching?: boolean;
  };
  departure?: {
    time: string;
  };
  run: string;
  route: string;
  transitType: 'train' | 'bus';
}

export type NextArrivals = Arrival[];

interface TrackArrivalsRequest {
  transitType: string;
  routes: string[];
  arrival: string;
  departure?: string;
}

export async function trackArrivalsFetcher(
  trackReqs: TrackArrivalsRequest[]
): Promise<{ response: NextArrivals[], lastUpdated: Date }> {
  const fetchPromises = trackReqs.map(async ({ transitType, routes, arrival, departure }) => {
    const routesParam = routes.join(',');
    const url = new URL(`${endpointUrl}/track-arrivals`);
    url.searchParams.set('transit', transitType);
    url.searchParams.set('routes', routesParam);
    url.searchParams.set('arrival', arrival);
    departure && url.searchParams.set('departure', departure);

    try {
      console.log(`fetch track-arrivals: ${transitType} ${routesParam} ${arrival} to ${departure}`);
      const response = await fetch(url);
      if (!response.ok) {
        console.error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        console.error(`Error response: ${JSON.stringify(data, null, 2)}`);
      }
      const data = await response.json();
      const arrivals: NextArrivals = data.arrivals;
      arrivals.sort((a, b) => new Date(a.arrival.time).getTime() - new Date(b.arrival.time).getTime());
      return arrivals;
    } catch (error) {
      console.error("Error fetching arrival data:", error);
      throw error;
    }
  });

  const nextArrivalsList = await Promise.all(fetchPromises);
  return { response: nextArrivalsList, lastUpdated: new Date() };
}
