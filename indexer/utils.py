import hashlib
import math

train_routes = [
    'Blue', 'Brown', 'Green', 'Orange',
    'Pink', 'Purple', 'Red', 'Yellow',
]

route_map = {
    'Brn': 'Brown',
    'G': 'Green',
    'Org': 'Orange',
    'P': 'Purple',
    'Y': 'Yellow',
}

dir_map = {
    '0': 'South',
    '1': 'North',
}


def route_to_number(route: str) -> float:
    if route in train_routes:
        return train_routes.index(route)
    elif route[0].isalpha():
        return int(route[1:]) + 0.1
    elif route[-1].isalpha():
        return int(route[:-1]) + 0.2
    else:
        return int(route)


def get_identifier(input: str, length=12) -> str:
    hash_object = hashlib.sha256(input.encode())
    hex_dig = hash_object.hexdigest()
    return hex_dig[:length]


def haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    R = 20925524.9
    lat1 = math.radians(lat1)
    lon1 = math.radians(lon1)
    lat2 = math.radians(lat2)
    lon2 = math.radians(lon2)

    dlat = lat2 - lat1
    dlon = lon2 - lon1

    a = math.sin(dlat / 2)**2 + math.cos(lat1) * \
        math.cos(lat2) * math.sin(dlon / 2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c
