const endpointUrl = "https://9fqgf0uli3.execute-api.us-east-2.amazonaws.com/Prod/in-the-loop";

export interface Stop {
  stopId: string;
  stopName: string;
  time: string;
  isApproaching?: boolean;
  isDelayed?: boolean;
  isLive?: boolean;
}

export interface FollowVehicleResponse {
  transitType: 'train' | 'bus';
  route: string;
  run: string;
  destination?: string;
  direction?: string;
  arrivals: Stop[];
}

interface FollowVehicleRequest {
  run: string;
  transitType: 'train' | 'bus';
}

export async function followVehicleFetcher(
  req: FollowVehicleRequest
): Promise<{ response: FollowVehicleResponse, lastUpdated: Date }> {
  const { run, transitType } = req;
  const url = new URL(`${endpointUrl}/follow-vehicle`);
  url.searchParams.set('run', run);
  url.searchParams.set('transit', transitType);

  try {
    console.log(`fetch follow-vehicle: ${transitType} run ${run}`);
    const response = await fetch(url);
    if (!response.ok) {
      console.error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      console.error(`Error response: ${JSON.stringify(data, null, 2)}`);
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log('Follow vehicle API response:', data);
    return { response: data.follow, lastUpdated: new Date() };
  } catch (error) {
    console.error("Error fetching follow vehicle data:", error);
    throw error;
  }
}
