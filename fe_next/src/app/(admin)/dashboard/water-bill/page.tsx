import WaterBillSection from "@/components/water_bills/waterBillSection";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Quản lý nước",
    description:
        "Quản lý nước giúp superadmin có thể quản lý các tài khoản mà khách hàng đã dùng",
    keywords:
        "Quản lý nước phần mềm quản lý nước",
    alternates: {
        canonical: `http://localhost:3000/dashboard/water-bill`,
    },
};
const WaterBillSectionPage = async (props: IProps) => {

    return (
        <div>
            < WaterBillSection searchParams={props.searchParams}></WaterBillSection>
        </div >
    )
}

export default WaterBillSectionPage;