export const getGeocodeFromAddress = async (address: string) => {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`;
    const res = await fetch(url, {
        headers: { 'User-Agent': 'RoomHub/1.0' },
    });
    const data = await res.json();
    if (data.length > 0) {
        return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
    }
    return null;
};
