
import VehicleSection from "@/components/vehicles/vehicleSection";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Quản lý phương tiện",
    description:
        "Quản lý phương tiện giúp superadmin có thể quản lý các tài khoản mà khách hàng đã dùng",
    keywords:
        "Quản lý phương tiện phần mềm quản lý phương tiện",
    alternates: {
        canonical: `http://localhost:3000/dashboard/vehicles`,
    },
};
const VehicleSectionPage = async (props: IProps) => {

    return (
        <div>
            < VehicleSection searchParams={props.searchParams}></VehicleSection>
        </div >
    )
}

export default VehicleSectionPage;