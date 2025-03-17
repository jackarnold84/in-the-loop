const endpointUrl = "https://w2blpi2104.execute-api.us-east-2.amazonaws.com/Prod/el-track";

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
  transitType: 'train' | 'bus';
}

export type ArrivalData = Arrival[];

export async function fetchArrivalData(
  transitType: string,
  routes: string[],
  arrival: string,
  departure: string
): Promise<ArrivalData> {
  const routesParam = routes.join(',');
  const url = `${endpointUrl}/track-arrivals?transit=${transitType}&routes=${routesParam}&arrival=${arrival}&departure=${departure}`;

  try {
    console.log(`fetching from: ${url}`);
    const response = await fetch(url);
    if (!response.ok) {
      console.error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      console.error(`Error response: ${JSON.stringify(data, null, 2)}`);
    }
    const data = await response.json();
    const arrivals: ArrivalData = data.arrivals;
    arrivals.sort((a, b) => new Date(a.arrival.time).getTime() - new Date(b.arrival.time).getTime());
    return arrivals;
  } catch (error) {
    console.error("Error fetching arrival data:", error);
    throw error;
  }
}
