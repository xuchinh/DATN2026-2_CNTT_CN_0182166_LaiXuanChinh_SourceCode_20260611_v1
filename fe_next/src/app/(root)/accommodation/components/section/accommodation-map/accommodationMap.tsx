"use client";

import dynamic from "next/dynamic";

const AccommodationMapInner = dynamic(() => import("./AccommodationMapInner"), {
    ssr: false,
    loading: () => (
        <div className="h-[500px] flex items-center justify-center bg-gray-100 rounded-xl text-gray-400 text-sm">
            Đang tải bản đồ...
        </div>
    ),
});

export default function AccommodationMap() {
    return (
        // isolation: isolate tạo stacking context mới, giam z-index nội bộ của Leaflet
        // không cho chúng vượt qua navbar (z-[100])
        <section className="container mx-auto px-4 py-10" style={{ isolation: "isolate" }}>
            <AccommodationMapInner />
        </section>
    );
}
