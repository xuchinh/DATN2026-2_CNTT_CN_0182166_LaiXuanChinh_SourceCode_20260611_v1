import type { Metadata } from "next";
import AccommodationSections from "./components/section/accommodationSections";


export const metadata: Metadata = {
    title: "Tìm trọ",
    description:
        "Phần mềm quản lý nhà trọ hàng đầu giúp chủ nhà tối ưu hóa quy trình quản lý phòng và nhà cho thuê. Trải nghiệm ngay công cụ quản lý hiện đại, dễ sử dụng.",
    keywords:
        "Phần mềm quản lý nhà trọ, Quản lý phòng trọ, Phần mềm cho thuê nhà, Giải pháp quản lý nhà trọ, Công cụ quản lý nhà trọ.",
    alternates: {
        canonical: `http://localhost:3000/accommodation`,
    },
};

export default function Accommodation() {
    return (
        <div className="bg-[#FAF9F6] ">
            <AccommodationSections />
        </div>
    );
}
