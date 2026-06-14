

import OfferSection from "@/components/offers/offerSection";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Quản lý Khuyến mãi",
    description:
        "Quản lý Khuyến mãi giúp superadmin có thể quản lý các tài khoản mà khách hàng đã dùng",
    keywords:
        "Quản lý Khuyến mãi phần mềm quản lý Khuyến mãi",
    alternates: {
        canonical: `http://localhost:3000/dashboard/offer`,
    },
};
const OfferPage = async (props: IProps) => {

    return (
        <div>
            < OfferSection searchParams={props.searchParams}></OfferSection>
        </div >
    )
}

export default OfferPage;