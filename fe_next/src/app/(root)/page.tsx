import type { Metadata } from "next";

import HomePageFeture from "@/app/(root)/components/section/home-page-feture/HomePageFeture";
import HomePageInterest from "@/app/(root)/components/section/home-page-interest/HomePageInterest";
import HomePageIntro from "@/app/(root)/components/section/home-page-intro/HomePageIntro";
import HomePageReview from "@/app/(root)/components/section/home-page-review/HomePageReview";
import HomePageSolutions from "@/app/(root)/components/section/home-page-solution/HomePageSolutions";
import HomePageWorkMethod from "@/app/(root)/components/section/home-page-work-method/HomePageWorkMethod";


export const metadata: Metadata = {
    title: "Trang Chủ",
    description:
        "Phần mềm quản lý nhà trọ hàng đầu giúp chủ nhà tối ưu hóa quy trình quản lý phòng và nhà cho thuê. Trải nghiệm ngay công cụ quản lý hiện đại, dễ sử dụng.",
    keywords:
        "Phần mềm quản lý nhà trọ, Quản lý phòng trọ, Phần mềm cho thuê nhà, Giải pháp quản lý nhà trọ, Công cụ quản lý nhà trọ.",
    alternates: {
        canonical: `http://localhost:3000/`,
    },
};

export default function Home() {
    return (
        <div className="bg-[#FAF9F6] ">
            <HomePageIntro />
            <HomePageSolutions />
            <HomePageFeture />
            <HomePageInterest />
            <HomePageWorkMethod />
            <HomePageReview />
        </div>
    );
}
