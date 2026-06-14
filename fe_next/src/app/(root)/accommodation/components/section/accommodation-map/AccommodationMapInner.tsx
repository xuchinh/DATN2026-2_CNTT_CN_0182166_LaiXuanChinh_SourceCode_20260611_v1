"use client";

import { useEffect, useRef, useState } from "react";
import { getGeocodeFromAddress } from "../../utils/geocode";

type LatLng = { lat: number; lng: number };
type BuildingWithCoord = {
    _id: string;
    name: string;
    address: string;
    priceOfRoom: number;
    totalRooms: number;
    numberOfRoomsRented: number;
    coord: LatLng;
};

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

const MIN_KM = 1;
const MAX_KM = 20;

export default function AccommodationMapInner() {
    const mapDivRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<any>(null);
    const userMarkerRef = useRef<any>(null);
    const radiusCircleRef = useRef<any>(null);
    const buildingMarkersRef = useRef<any[]>([]);
    // Lưu vị trí tìm kiếm gần nhất để vẽ lại khi đổi bán kính
    const lastLocRef = useRef<LatLng | null>(null);

    const [userAddress, setUserAddress] = useState("");
    const [radiusKm, setRadiusKm] = useState(4);
    const [isSearching, setIsSearching] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [loadingBuildings, setLoadingBuildings] = useState(true);
    const [buildingCount, setBuildingCount] = useState(0);
    const [foundCount, setFoundCount] = useState<number | null>(null);

    const buildingsRef = useRef<BuildingWithCoord[]>([]);

    // Khởi tạo map và pre-load buildings khi mount
    useEffect(() => {
        if (!mapDivRef.current || mapRef.current) return;

        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        document.head.appendChild(link);

        link.onload = async () => {
            const L = (await import("leaflet")).default;

            delete (L.Icon.Default.prototype as any)._getIconUrl;
            L.Icon.Default.mergeOptions({
                iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
                iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
                shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
            });

            const map = L.map(mapDivRef.current!).setView([21.0278, 105.8342], 13);
            mapRef.current = map;

            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            }).addTo(map);

            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/buildings?current=1&pageSize=9999`
                );
                const data = await res.json();
                const buildings: any[] = data.data?.results || [];

                const results: BuildingWithCoord[] = [];
                for (const b of buildings) {
                    const coord = await getGeocodeFromAddress(b.address);
                    if (coord) results.push({ ...b, coord });
                    await new Promise((r) => setTimeout(r, 200));
                }
                buildingsRef.current = results;
                setBuildingCount(results.length);
            } catch {
                // bản đồ vẫn dùng được
            } finally {
                setLoadingBuildings(false);
            }
        };

        return () => {
            mapRef.current?.remove();
            mapRef.current = null;
            if (document.head.contains(link)) document.head.removeChild(link);
        };
    }, []);

    // Vẽ lại vòng tròn + lọc lại nhà trọ khi đổi bán kính (chỉ khi đã search)
    useEffect(() => {
        const loc = lastLocRef.current;
        if (!loc || !mapRef.current) return;
        applyRadius(loc, radiusKm);
    }, [radiusKm]);

    const applyRadius = async (loc: LatLng, km: number) => {
        const L = (await import("leaflet")).default;
        const map = mapRef.current;
        if (!map) return;

        radiusCircleRef.current?.remove();
        buildingMarkersRef.current.forEach((m) => m.remove());
        buildingMarkersRef.current = [];

        radiusCircleRef.current = L.circle([loc.lat, loc.lng], {
            radius: km * 1000,
            color: "#6366F1",
            fillColor: "#A5B4FC",
            fillOpacity: 0.12,
            weight: 2,
            dashArray: "6 4",
        }).addTo(map);

        map.fitBounds(radiusCircleRef.current.getBounds(), { padding: [40, 40] });

        const inRange = buildingsRef.current.filter((b) =>
            haversine(loc.lat, loc.lng, b.coord.lat, b.coord.lng) <= km * 1000
        );

        setFoundCount(inRange.length);

        const greenIcon = L.divIcon({
            html: `<div style="background:#16A34A;border:2px solid #fff;width:14px;height:14px;border-radius:50%;box-shadow:0 1px 4px rgba(0,0,0,0.4)"></div>`,
            iconSize: [14, 14],
            iconAnchor: [7, 7],
            className: "",
        });

        inRange.forEach((b) => {
            const available = b.totalRooms - b.numberOfRoomsRented;
            const marker = L.marker([b.coord.lat, b.coord.lng], { icon: greenIcon })
                .addTo(map)
                .bindPopup(`
                    <div style="min-width:180px">
                        <b style="font-size:13px">${b.name}</b><br/>
                        <span style="color:#6B7280;font-size:11px">${b.address}</span><br/>
                        <hr style="margin:4px 0"/>
                        <span>💰 ${Number(b.priceOfRoom).toLocaleString("vi-VN")}đ/tháng</span><br/>
                        <span>${available > 0 ? `✅ Còn ${available} phòng trống` : "❌ Hết phòng"}</span>
                    </div>
                `);
            buildingMarkersRef.current.push(marker);
        });
    };

    const handleSearch = async () => {
        const trimmed = userAddress.trim();
        if (!trimmed) { setErrorMessage("Vui lòng nhập tên đường hoặc trường học."); return; }

        setIsSearching(true);
        setErrorMessage("");
        setFoundCount(null);

        try {
            const L = (await import("leaflet")).default;
            const map = mapRef.current;
            if (!map) return;

            const userLoc = await getGeocodeFromAddress(trimmed);
            if (!userLoc) { setErrorMessage("Không tìm thấy địa điểm bạn vừa nhập."); return; }

            lastLocRef.current = userLoc;

            userMarkerRef.current?.remove();
            userMarkerRef.current = L.marker([userLoc.lat, userLoc.lng])
                .addTo(map)
                .bindPopup(`<b>${trimmed}</b>`)
                .openPopup();

            await applyRadius(userLoc, radiusKm);
        } catch {
            setErrorMessage("Có lỗi xảy ra khi tìm kiếm.");
        } finally {
            setIsSearching(false);
        }
    };

    const changeRadius = (delta: number) => {
        setRadiusKm((prev) => Math.min(MAX_KM, Math.max(MIN_KM, prev + delta)));
    };

    return (
        <div className="relative">
            {/* Thanh tìm kiếm + điều chỉnh bán kính */}
            <div className="absolute top-3 left-1/2 -translate-x-1/2 z-[1000] flex gap-2 w-[calc(100%-32px)] max-w-2xl bg-white/95 p-2 rounded-lg shadow-md">
                <input
                    type="text"
                    value={userAddress}
                    onChange={(e) => setUserAddress(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    placeholder="Nhập tên đường, trường học, khu vực..."
                    className="flex-1 border rounded p-2 text-sm focus:outline-none focus:border-indigo-400"
                />

                {/* Bán kính tùy chỉnh */}
                <div className="flex items-center border rounded overflow-hidden text-sm bg-white select-none">
                    <button
                        onClick={() => changeRadius(-1)}
                        disabled={radiusKm <= MIN_KM}
                        className="px-2 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed font-bold"
                        title="Giảm bán kính"
                    >
                        ▼
                    </button>
                    <div className="px-2 text-center min-w-[54px] border-x text-gray-700 font-medium text-sm">
                        {radiusKm} km
                    </div>
                    <button
                        onClick={() => changeRadius(1)}
                        disabled={radiusKm >= MAX_KM}
                        className="px-2 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed font-bold"
                        title="Tăng bán kính"
                    >
                        ▲
                    </button>
                </div>

                <button
                    onClick={handleSearch}
                    disabled={isSearching || loadingBuildings}
                    className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded text-sm disabled:opacity-60 transition-colors whitespace-nowrap"
                >
                    {isSearching ? "Đang tìm..." : "Tìm kiếm"}
                </button>
            </div>

            {/* Status bar */}
            <div className="absolute bottom-3 left-3 z-[1000] flex flex-col gap-1">
                {loadingBuildings && (
                    <div className="bg-white/90 text-gray-500 text-xs px-3 py-1.5 rounded shadow">
                        ⏳ Đang tải dữ liệu nhà trọ...
                    </div>
                )}
                {!loadingBuildings && buildingCount > 0 && foundCount === null && (
                    <div className="bg-white/90 text-gray-500 text-xs px-3 py-1.5 rounded shadow">
                        🏠 Đã tải {buildingCount} nhà trọ — tìm kiếm để xem nhà gần bạn
                    </div>
                )}
                {foundCount !== null && (
                    <div className={`text-xs px-3 py-1.5 rounded shadow font-medium ${foundCount > 0 ? "bg-green-50 text-green-700" : "bg-orange-50 text-orange-600"}`}>
                        {foundCount > 0
                            ? `🏠 Tìm thấy ${foundCount} nhà trọ trong ${radiusKm}km`
                            : `😔 Không có nhà trọ nào trong ${radiusKm}km`}
                    </div>
                )}
            </div>

            {/* Legend */}
            <div className="absolute bottom-3 right-3 z-[1000] bg-white/90 text-xs px-3 py-2 rounded shadow flex flex-col gap-1">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-600 border border-white shadow-sm" />
                    <span>Nhà trọ trong khu vực</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-indigo-500 border border-white shadow-sm opacity-30" />
                    <span>Bán kính {radiusKm}km</span>
                </div>
            </div>

            {errorMessage && (
                <div className="absolute top-16 left-1/2 -translate-x-1/2 z-[1000] bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded text-sm whitespace-nowrap">
                    {errorMessage}
                </div>
            )}

            <div
                ref={mapDivRef}
                style={{ height: "520px", width: "100%", borderRadius: "12px" }}
            />
        </div>
    );
}
