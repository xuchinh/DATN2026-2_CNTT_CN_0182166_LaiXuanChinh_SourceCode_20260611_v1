import DashboardSection from "@/components/dashboard/dashboardSection";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Trang chủ",
    description:
        "Trang chủ giúp superadmin có thể các tài khoản mà khách hàng đã dùng",
    keywords:
        "Trang chủ phần mềm trang chủ",
    alternates: {
        canonical: `http://localhost:3000/dashboard`,
    },
};
const dashboardPage = async (props: IProps) => {

    return (
        <div className="bg-white shadow rounded p-4 overflow-x-auto h-[calc(100vh-182px)]">
            <DashboardSection />
        </div >
    )
}

export default dashboardPage;
