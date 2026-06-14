import PackageSection from "@/components/packages/packageSection";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Quản lý gói chức năng",
    description:
        "Quản lý gói chức năng giúp superadmin có thể quản lý các tài khoản mà khách hàng đã dùng",
    keywords:
        "Quản lý gói chức năng phần mềm quản lý gói chức năng",
    alternates: {
        canonical: `http://localhost:3000/dashboard/package`,
    },
};
const PackagePage = async (props: IProps) => {

    return (
        <div>
            < PackageSection searchParams={props.searchParams}></PackageSection>
        </div >
    )
}

export default PackagePage;