"use client";

import { useEffect, useState } from "react";
import { TypeBuildingProp, TypeRoomProp } from "../../../types/accommodation";
import {
    handleAllBuildingByNameOrAddress,
    handleAllRoom
} from "../../../requests/accommodation.request";
import ModalAccommodation from "../../shared/modalAccommodation";
import { handleUpdateRoom } from "@/components/rooms/requests/room.requests";
import { handleUpdateUserAction, handleUserById } from "@/components/users/requests/user.requests";
import { handleBlogsByBuilding } from "@/app/(root)/blogs/requests/blog.request";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { handleElectricityBillByRoomID, handleUpdateElectricityBill } from "@/components/electricity_bills/requests/electricityBill.requests";
import { handleElWaterBillByRoomID, handleUpdateWaterBill } from "@/components/water_bills/requests/waterBill.requests";

const AccommodationSearch = (props: any) => {
    const { session } = props;
    const [modalOpen, setModalOpen] = useState(false);
    const [modalConfig, setModalConfig] = useState({
        type: "error" as "error" | "confirm" | "success",
        title: "",
        message: "",
        onConfirm: undefined as (() => void) | undefined
    });
    const [searchText, setSearchText] = useState("");
    const [results, setResults] = useState<TypeBuildingProp[]>([]);
    const [selectedBuilding, setSelectedBuilding] = useState<TypeBuildingProp | null>(null);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);
    const [rooms, setRooms] = useState<TypeRoomProp[]>([]);
    const [users, setUsers] = useState<any>([]);
    const [blogs, setBlogs] = useState<any>([]);
    const [selectedRoom, setSelectedRoom] = useState<TypeRoomProp | null>(null);
    const [months, setMonths] = useState(1);
    const newDate = new Date();
    const searchParams = useSearchParams();
    const buildingIdFromQuery = searchParams.get("buildingId");
    const [waterBills, setWaterBills] = useState<any>([]);
    const [electricityBills, setElectricityBills] = useState<any>([]);

    // Load tất cả nhà khi trang mở
    useEffect(() => {
        const loadAllBuildings = async () => {
            setLoading(true);
            try {
                const res = await handleAllBuildingByNameOrAddress("");
                setResults(Array.isArray(res?.data?.results) ? res.data.results : []);
            } catch (err) {
                console.error("Load buildings error:", err);
            }
            setLoading(false);
        };
        loadAllBuildings();
    }, []);

    // Fetch danh sách building theo search
    const handleSearch = async () => {
        setLoading(true);
        setSearched(true);
        try {
            const res = await handleAllBuildingByNameOrAddress(searchText.trim() || undefined);
            setResults(Array.isArray(res?.data?.results) ? res.data.results : []);
        } catch (err) {
            console.error("Search error:", err);
            setResults([]);
        }
        setLoading(false);
    };

    const fetchUser = async (userId: string) => {
        try {
            const res = await handleUserById(userId);
            const availableUser =
                res?.data?.results?.[0] || [];
            setUsers(availableUser);
        } catch (err) {
            console.error("Lỗi lấy lại user:", err);
        }
    };

    // Fetch danh sách phòng trống theo buildingId
    const fetchRooms = async (buildingId: string) => {
        try {
            const res = await handleAllRoom(buildingId);
            const availableRooms =
                res?.data?.results?.filter((r: TypeRoomProp) => r.status === false) || [];
            setRooms(availableRooms);
            setSelectedRoom(null);
        } catch (err) {
            console.error("Lỗi lấy phòng:", err);
        }
    };

    // Fetch danh sách blog theo buildingId
    const fetchBlogs = async (buildingId: string) => {
        try {
            const res = await handleBlogsByBuilding(buildingId);
            const availableBlogs =
                res?.data?.results?.[0];
            setBlogs(availableBlogs);
        } catch (err) {
            console.error("Lỗi lấy phòng:", err);
        }
    };

    const fetchWaterBills = async (roomId: string) => {
        try {
            const res = await handleElWaterBillByRoomID(roomId);
            const availableWater =
                res?.data?.results?.[0];
            setWaterBills(availableWater);
        } catch (err) {
            console.error("Lỗi lấy phòng:", err);
        }
    };

    const fetchElectricityBills = async (roomId: string) => {
        try {
            const res = await handleElectricityBillByRoomID(roomId);
            const availableElectricitys =
                res?.data?.results?.[0];
            setElectricityBills(availableElectricitys);
        } catch (err) {
            console.error("Lỗi lấy phòng:", err);
        }
    };
    useEffect(() => {
        if (selectedBuilding) {
            fetchUser(selectedBuilding.userId);
            fetchRooms(selectedBuilding._id);
            fetchBlogs(selectedBuilding._id);
        }
    }, [selectedBuilding]);
    useEffect(() => {
        if (selectedRoom) {
            fetchWaterBills(selectedRoom._id);
            fetchElectricityBills(selectedRoom._id);
        }
    }, [selectedRoom]);
    useEffect(() => {
        const fetchBuildingById = async () => {
            if (buildingIdFromQuery) {
                try {
                    const res = await handleAllBuildingByNameOrAddress("");
                    const allBuildings = res?.data?.results || [];
                    const found = allBuildings.find((b: TypeBuildingProp) => b._id === buildingIdFromQuery);
                    if (found) setSelectedBuilding(found);
                } catch (err) {
                    console.error("Lỗi lấy building:", err);
                }
            }
        };
        fetchBuildingById();
    }, [buildingIdFromQuery]);

    // Xử lý thuê phòng
    const handleRent = async () => {
        if (!session) {
            setModalConfig({
                type: "error",
                title: "Bạn chưa đăng nhập",
                message: "Vui lòng đăng nhập để tiếp tục thuê phòng.",
                onConfirm: undefined
            });
            setModalOpen(true);
            return;
        }
        try {
            const userId = session?.data?.results?.[0]._id;
            const res = await handleAllRoom(undefined, userId);
            // Tính cả phòng đang chờ xác nhận (status false) — miễn là phòng đang gắn với user này.
            // Chỉ cho thuê tiếp khi hợp đồng đã hết hạn (toDate đã qua).
            const activeRentedRooms = (res?.data?.results || []).filter((r: TypeRoomProp) => {
                if (!r.toDate) return true; // vừa thuê, chưa có hạn → vẫn đang giữ
                return new Date(r.toDate) > new Date(); // hợp đồng còn hạn
            });
            if (activeRentedRooms.length > 0) {
                const room = activeRentedRooms[0];
                const toDateStr = room.toDate
                    ? new Date(room.toDate).toLocaleDateString("vi-VN")
                    : "chưa xác định";
                setModalConfig({
                    type: "error",
                    title: "Bạn đã có phòng đang thuê",
                    message: `Bạn đang thuê phòng ${room.code} đến ngày ${toDateStr}. Vui lòng chấm dứt hợp đồng trước khi thuê phòng mới.`,
                    onConfirm: undefined
                });
                setModalOpen(true);
                return;
            }
            setModalConfig({
                type: "confirm",
                title: "Xác nhận thuê phòng",
                message: `Bạn có chắc muốn thuê phòng "${selectedRoom?.code}" nhà " ${selectedBuilding?.name}"trong "${months}" tháng?`,
                onConfirm: async () => {
                    try {
                        const updateData = {
                            _id: selectedRoom?._id,
                            totalMonth: months,
                            userId: session?.data?.results?.[0]._id,
                            statusPayment: '2',
                            fromDate: newDate,
                        };
                        const updateUser = {
                            _id: session?.data?.results?.[0]._id,
                            role: "USERS"
                        }
                        // Khách mới thuê: reset đồng hồ về 0 nhưng để trạng thái 'Chưa thanh toán' ('1')
                        // — chủ nhà nhập số điện/nước + giá sau, rồi flow xác nhận 1→2→3 chạy bình thường
                        // Dùng optional chaining: phòng nhà mới có thể CHƯA có hóa đơn điện/nước (undefined)
                        const updateWaterBill = {
                            _id: waterBills?._id,
                            toDate: newDate,
                            amount: '0',
                            status: '1',
                            payment: '0'
                        }
                        const electricityBill = {
                            _id: electricityBills?._id,
                            toDate: newDate,
                            amount: '0',
                            status: '1',
                            payment: '0'
                        }
                        const res = await handleUpdateRoom(updateData);

                        if (res?.statusCode === 200) {
                            await handleUpdateUserAction(updateUser)
                            if (waterBills?._id) {
                                await handleUpdateWaterBill(updateWaterBill);
                            }
                            if (electricityBills?._id) {
                                await handleUpdateElectricityBill(electricityBill);
                            }
                            window.location.reload();
                            setModalConfig({
                                type: "success",
                                title: "Thuê phòng thành công",
                                message: `Bạn đã thuê phòng ${selectedRoom?.code} thành công!`,
                                onConfirm: undefined
                            });
                            setModalOpen(true);
                        } else {
                            setModalConfig({
                                type: "error",
                                title: "Lỗi khi thuê phòng",
                                message:
                                    res?.message || "Không thể thuê phòng, vui lòng thử lại.",
                                onConfirm: undefined
                            });
                            setModalOpen(true);
                        }

                    } catch (err) {
                        setModalConfig({
                            type: "error",
                            title: "Lỗi khi thuê phòng",
                            message: "Có lỗi xảy ra trong quá trình thuê phòng.",
                            onConfirm: undefined
                        });
                        setModalOpen(true);
                    }
                }
            });
            setModalOpen(true);
        }
        catch (err) {
            console.error("Error checking rented rooms:", err);
            setModalConfig({
                type: "error",
                title: "Lỗi hệ thống",
                message: "Không kiểm tra được thông tin thuê phòng.",
                onConfirm: undefined
            });
            setModalOpen(true);
        }
    }

    return (
        <section className="container mx-auto py-12 flex items-center justify-center">
            <div className="bg-white max-w-[1240px] rounded-[20px] relative flex text-[#121314]">
                {/* Sidebar search */}
                <div className="w-[240px] h-[600px] p-4 flex flex-col border-r border-gray-300">
                    <input
                        type="text"
                        placeholder="Tìm kiếm..."
                        className="p-2 rounded mb-3 w-full bg-[#F5F5F7] border border-gray-300 focus:outline-none focus:border-blue-500"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    />
                    <button
                        onClick={handleSearch}
                        className="bg-blue-500 text-white px-3 py-2 rounded mb-3 hover:bg-blue-600 transition-colors"
                    >
                        Tìm kiếm
                    </button>

                    <div className="flex-1 overflow-y-auto">
                        {loading && <p className="text-sm text-gray-500">Đang tìm...</p>}
                        {!loading && searched && results.length === 0 && (
                            <p className="text-sm text-gray-500">Không tìm thấy</p>
                        )}
                        {!loading &&
                            results.map((building) => (
                                <div
                                    key={building._id}
                                    onClick={() => setSelectedBuilding(building)}
                                    className="p-2 hover:bg-gray-200 rounded cursor-pointer transition-colors"
                                >
                                    <p className="font-semibold">{building.name}</p>
                                    <p className="text-sm text-gray-600">{building.address}</p>
                                </div>
                            ))}
                    </div>
                </div>

                {/* Detail display */}
                <div className="flex-1 h-[600px] w-[1000px] py-4 overflow-y-auto">
                    {selectedBuilding ? (
                        <div className="flex">
                            {/* Building info */}
                            <div className="w-[500px] border-r border-gray-300 h-[550px] px-4">
                                <h2 className="text-2xl font-bold mb-2">
                                    {selectedBuilding.name}
                                </h2>
                                <div className="mt-4 p-4 bg-white rounded shadow h-[500px]">
                                    <p className="mb-2">Địa chỉ: {selectedBuilding.address}</p>
                                    <p className="mb-2">
                                        Giá TB mỗi phòng: {selectedBuilding.priceOfRoom}
                                    </p>
                                    <p className="mb-2">
                                        Tổng số phòng: {selectedBuilding.totalRooms}
                                    </p>
                                    <p className="mb-2">
                                        Phòng đã cho thuê:{" "}
                                        {selectedBuilding.numberOfRoomsRented}
                                    </p>
                                    <p className="mb-2">
                                        Số người tối đa/phòng:{" "}
                                        {selectedBuilding.numberOfPeopleRoom}
                                    </p>
                                    {blogs ? (
                                        <p className="mb-2"> Xem giới thiệu chi tiết về nhà: <span><Link
                                            href={`/blogs/${blogs._id}`}
                                            className="relative"
                                        >
                                            <p className="hover:text-blue-500 font-bold">{blogs.title}</p>
                                        </Link>
                                        </span>
                                        </p>
                                    ) : (
                                        <p className="mt-4 text-gray-500">Chưa có bài giới thiệu</p>
                                    )}
                                </div>
                            </div>

                            {/* Room info */}
                            <div className="w-[500px] h-[550px] px-4">
                                <h2 className="text-2xl font-bold mb-2">Tìm trọ</h2>
                                {(rooms.length > 0 && +selectedBuilding.numberOfRoomsRented <= +selectedBuilding.totalRooms) ? (
                                    <>
                                        <div className="mt-4">
                                            <label className="block mb-1 font-semibold">
                                                Chọn phòng:
                                            </label>
                                            <select
                                                className="border p-2 rounded w-full"
                                                value={selectedRoom?._id || ""}
                                                onChange={(e) => {
                                                    const room =
                                                        rooms.find(
                                                            (r) => r._id === e.target.value
                                                        ) || null;
                                                    setSelectedRoom(room);
                                                }}
                                            >
                                                <option value="">-- Chọn mã phòng --</option>
                                                {rooms.map((room) => (
                                                    <option key={room._id} value={room._id}>
                                                        {room.code}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        {selectedRoom && (
                                            <div className="mt-4 p-4 bg-white rounded shadow h-[416px]">
                                                <div className="flex pb-2">
                                                    <p className="w-[225px]">
                                                        Diện tích: {selectedRoom.acreage} m²
                                                    </p>
                                                    <p>
                                                        Phòng tắm:{" "}
                                                        {selectedRoom.toilet ? "Có" : "Không"}
                                                    </p>
                                                </div>
                                                <div className="flex pb-2">
                                                    <p className="w-[225px]">
                                                        Giá:{" "}
                                                        <span className="font-bold">
                                                            {selectedRoom.price}
                                                        </span>{" "}
                                                        VND/Tháng
                                                    </p>
                                                    <p>
                                                        Phòng bếp:{" "}
                                                        {selectedRoom.kitchen ? "Có" : "Không"}
                                                    </p>
                                                </div>
                                                <div className="flex pb-2">
                                                    <p className="w-[225px]">
                                                        Số người tối đa:{" "}
                                                        {selectedRoom.totalPeople} người
                                                    </p>
                                                    <p>
                                                        Phòng giặt:{" "}
                                                        {selectedRoom.washroom ? "Có" : "Không"}
                                                    </p>
                                                </div>
                                                <p className="pt-4">
                                                    Tiền cọc:<span className="font-bold"> {selectedRoom.payment || '0'} </span>VND
                                                </p>


                                                {/* Số tháng thuê */}
                                                <div className="my-4">
                                                    <label>Số tháng muốn thuê:</label>
                                                    <input
                                                        type="number"
                                                        min={1}
                                                        value={months}
                                                        onChange={(e) =>
                                                            setMonths(Number(e.target.value))
                                                        }
                                                        className="border p-2 rounded ml-2 w-20"
                                                    />
                                                </div>
                                                <p className="mb-2">
                                                    Thanh toán bằng cách chuyển khoản vào tài khoản: <span className="font-bold">{users.bankAccount}</span> ngân hàng: <span className="font-bold">{users.bank}</span>
                                                </p>
                                                <p className="mb-2">
                                                    Với nội dung: "Chuyển {selectedRoom.payment || '0'} tiền cọc phòng {selectedRoom.code} nhà {selectedBuilding.name}"
                                                </p>
                                                <button
                                                    onClick={handleRent}
                                                    className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
                                                >
                                                    Thuê
                                                </button>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <p className="mt-4 text-gray-500">Không có phòng trống</p>
                                )}
                            </div>
                        </div>
                    ) : (
                        <p className="text-gray-500 px-5">
                            Chọn một tòa nhà từ danh sách để xem chi tiết
                        </p>
                    )}
                </div>
            </div>

            {/* Modal */}
            <ModalAccommodation
                isOpen={modalOpen}
                type={modalConfig.type}
                title={modalConfig.title}
                message={modalConfig.message}
                onClose={() => setModalOpen(false)}
                onConfirm={modalConfig.onConfirm}
            />
        </section>
    );
};

export default AccommodationSearch;
