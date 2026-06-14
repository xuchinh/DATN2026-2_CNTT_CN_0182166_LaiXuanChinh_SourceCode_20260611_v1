import UserSection from "@/components/users/userSection";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Quản lý người dùng",
    description:
        "Quản lý người dùng giúp superadmin có thể quản lý các tài khoản mà khách hàng đã dùng",
    keywords:
        "Quản lý người dùng phần mềm quản lý nhà trọ",
    alternates: {
        canonical: `http://localhost:3000/dashboard/user`,
    },
};
const UserPage = async (props: IProps) => {

    return (
        <div>
            <UserSection searchParams={props.searchParams}></UserSection>
        </div>
    )
}

export default UserPage;