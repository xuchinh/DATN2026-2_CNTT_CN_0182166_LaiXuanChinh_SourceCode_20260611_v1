import ElectricityBillSection from "@/components/electricity_bills/electricityBillSection";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Quản lý điện",
    description:
        "Quản lý điện giúp superadmin có thể quản lý các tài khoản mà khách hàng đã dùng",
    keywords:
        "Quản lý điện phần mềm quản lý điện",
    alternates: {
        canonical: `http://localhost:3000/dashboard/electricity-bill`,
    },
};
const ElectricityBillSectionPage = async (props: IProps) => {

    return (
        <div>
            < ElectricityBillSection searchParams={props.searchParams}></ElectricityBillSection>
        </div >
    )
}

export default ElectricityBillSectionPage;