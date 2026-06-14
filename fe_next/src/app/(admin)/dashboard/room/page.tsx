import RoomSection from "@/components/rooms/roomSection";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Quản lý phòng",
    description:
        "Quản lý phòng giúp superadmin có thể quản lý các tài khoản mà khách hàng đã dùng",
    keywords:
        "Quản lý phòng phần mềm quản lý phòng",
    alternates: {
        canonical: `http://localhost:3000/dashboard/room`,
    },
};
const RoomPage = async (props: IProps) => {

    return (
        <div>
            < RoomSection searchParams={props.searchParams}></RoomSection>
        </div >
    )
}

export default RoomPage;