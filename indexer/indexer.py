import json
import os
import sys
import zipfile

import pandas as pd
import requests

from .utils import (dir_map, get_identifier, haversine_distance, route_map,
                    route_to_number, train_routes)

gtfs_download_url = 'https://www.transitchicago.com/downloads/sch_data/google_transit.zip'
gtfs_out_dir = '.gtfs_data'
tracks_out_file = 'src/config/index/tracks.json'
stations_out_file = 'src/config/index/stations.json'

# download gtfs data
cmd = sys.argv[1] if len(sys.argv) > 1 else None

if cmd == 'download':
    print('--> downloading latest gtfs data')
    zip_path = os.path.join(gtfs_out_dir, 'google_transit.zip')
    os.makedirs(gtfs_out_dir, exist_ok=True)

    response = requests.get(gtfs_download_url)
    with open(zip_path, 'wb') as f:
        f.write(response.content)

    with zipfile.ZipFile(zip_path, 'r') as zip_ref:
        zip_ref.extractall(gtfs_out_dir)

    os.remove(zip_path)
else:
    print('--> using existing gtfs data')

# load gtfs data frames
# join attributes:
# stops <-stop_id*-> times <-*trip_id-> trips <-*route_id-> routes

print('--> loading gtfs data')
stops_df = pd.read_csv(
    filepath_or_buffer='.gtfs_data/stops.txt',
    usecols=['stop_id', 'stop_name', 'stop_lat', 'stop_lon'],
    dtype={'stop_id': str},
)
routes_df = pd.read_csv(
    filepath_or_buffer='.gtfs_data/routes.txt',
    usecols=['route_id', 'route_long_name'],
    dtype={'route_id': str},
)
trips_df = pd.read_csv(
    filepath_or_buffer='.gtfs_data/trips.txt',
    usecols=['route_id', 'trip_id', 'direction_id', 'direction'],
    dtype={'route_id': str, 'trip_id': str, 'direction_id': str}
)
times_df = pd.read_csv(
    filepath_or_buffer='.gtfs_data/stop_times.txt',
    usecols=['trip_id', 'stop_id', 'stop_headsign'],
    dtype={'trip_id': str, 'stop_id': str}
)

# join gtfs data
print('--> joining gtfs data')
res_df = stops_df.merge(
    right=times_df,
    how='left',
    on='stop_id',
    validate='one_to_many',
)

res_df = res_df.merge(
    right=trips_df,
    how='left',
    on='trip_id',
    validate='many_to_one',
)

res_df = res_df.merge(
    right=routes_df,
    how='left',
    on='route_id',
    validate='many_to_one',
)

res_df['route_id'] = res_df['route_id'].apply(lambda x: route_map.get(x, x))
res_df['direction'] = res_df['direction'].apply(lambda x: dir_map.get(x, x))
res_df['type'] = res_df['route_id'].apply(
    lambda x: 'train' if x in train_routes else 'bus'
)
res_df['track_id'] = res_df['route_id'] + '-' + \
    res_df['stop_id'] + '-' + res_df['direction_id']

col_select = [
    'track_id', 'type', 'route_id', 'route_long_name', 'stop_name',
    'direction', 'stop_headsign', 'stop_lat', 'stop_lon',
    'stop_id', 'direction_id',
]
res_df = res_df[col_select]
res_df = res_df.drop_duplicates()
res_df = res_df.dropna(subset=['route_id'])
res_df = res_df.sort_values(['type', 'track_id'])
res_df = res_df.reset_index(drop=True)

track_data = res_df.to_dict(orient='records')
track_data = sorted(
    track_data,
    key=lambda x: (x['type'][::-1], route_to_number(x['route_id']),
                   x['stop_id'], x['direction_id']),
)

# build track + station index json files
print('--> building index')
track_index = {}
station_index = {}
for x in track_data:
    track_id = x['track_id']
    station_id = get_identifier(x['stop_name'])

    if track_id not in track_index:
        track_index[track_id] = {
            'type': x['type'],
            'route': x['route_id'],
            'routeName': x['route_long_name'],
            'stop': x['stop_id'],
            'stopName': x['stop_name'],
            'direction': x['direction'],
            'headsign': [x['stop_headsign']] if pd.notna(x['stop_headsign']) else [],
        }
    elif pd.notna(x['stop_headsign']) and x['stop_headsign'] not in track_index[track_id]['headsign']:
        track_index[track_id]['headsign'].append(x['stop_headsign'])

    if station_id in station_index and haversine_distance(
        station_index[station_id]['latitude'],
        station_index[station_id]['longitude'],
        x['stop_lat'],
        x['stop_lon'],
    ) > 2000:
        station_id = get_identifier(x['stop_name'] + x['track_id'])

    if station_id not in station_index:
        station_index[station_id] = {
            'name': x['stop_name'],
            'stops': {x['stop_id']: [track_id]},
            'latitude': x['stop_lat'],
            'longitude': x['stop_lon'],
        }
    else:
        if x['stop_id'] not in station_index[station_id]['stops']:
            station_index[station_id]['stops'][x['stop_id']] = [track_id]
        elif track_id not in station_index[station_id]['stops'][x['stop_id']]:
            station_index[station_id]['stops'][x['stop_id']].append(track_id)

print(f'--> writing tracks index: {tracks_out_file}')
with open(tracks_out_file, 'w') as f:
    json.dump(track_index, f, indent=4)

print(f'--> writing stations index: {stations_out_file}')
with open(stations_out_file, 'w') as f:
    json.dump(station_index, f, indent=4)
