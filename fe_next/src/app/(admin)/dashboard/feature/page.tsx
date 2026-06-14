


import FeatureSection from "@/components/faetures/featureSection";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Quản lý chức năng",
    description:
        "Quản lý chức năng giúp superadmin có thể quản lý các tài khoản mà khách hàng đã dùng",
    keywords:
        "Quản lý chức năng phần mềm quản lý chức năng",
    alternates: {
        canonical: `http://localhost:3000/dashboard/feature`,
    },
};
const FeaturePage = async (props: IProps) => {

    return (
        <div>
            < FeatureSection searchParams={props.searchParams}></FeatureSection>
        </div >
    )
}

export default FeaturePage;