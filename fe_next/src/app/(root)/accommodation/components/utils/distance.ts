import { getGeocodeFromAddress } from './geocode';

function haversine(lat1: number, lng1: number, lat2: number, lng2: number) {
    const R = 6371000;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLng = (lng2 - lng1) * (Math.PI / 180);
    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export const findNearestCompany = async (
    origin: string,
    destinations: string[]
): Promise<number> => {
    const originCoord = await getGeocodeFromAddress(origin);
    if (!originCoord) return 0;

    const destCoords = await Promise.all(destinations.map(getGeocodeFromAddress));

    let minDist = Infinity;
    let nearestIndex = 0;

    destCoords.forEach((coord, i) => {
        if (!coord) return;
        const dist = haversine(originCoord.lat, originCoord.lng, coord.lat, coord.lng);
        if (dist < minDist) {
            minDist = dist;
            nearestIndex = i;
        }
    });

    return nearestIndex;
};
