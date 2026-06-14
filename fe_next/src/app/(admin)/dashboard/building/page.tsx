

import BuildingSection from "@/components/buildings/buildingSection";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Quản lý nhà trọ",
    description:
        "Quản lý nhà trọ giúp superadmin có thể quản lý các tài khoản mà khách hàng đã dùng",
    keywords:
        "Quản lý nhà trọ phần mềm quản lý nhà trọ",
    alternates: {
        canonical: `http://localhost:3000/dashboard/building`,
    },
};
const BuildingPage = async (props: IProps) => {

    return (
        <div>
            < BuildingSection searchParams={props.searchParams}></BuildingSection>
        </div >
    )
}

export default BuildingPage;