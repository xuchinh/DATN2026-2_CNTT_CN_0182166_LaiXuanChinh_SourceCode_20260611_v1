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
import { CloseOutlined, EnvironmentOutlined, MailOutlined, PhoneOutlined, ReadOutlined, UserOutlined, BankOutlined } from "@ant-design/icons";
import { Select } from "antd";

const AccommodationSearch = (props: any) => {
    const { session } = props;

    const [modalOpen, setModalOpen] = useState(false);
    const [modalConfig, setModalConfig] = useState({
        type: "error" as "error" | "confirm" | "success",
        title: "",
        message: "",
        onConfirm: undefined as (() => void) | undefined,
        loginRequired: false,
    });

    const [contactOpen, setContactOpen] = useState(false);

    const [searchText, setSearchText] = useState("");
    const [results, setResults] = useState<TypeBuildingProp[]>([]);
    const [selectedBuilding, setSelectedBuilding] = useState<TypeBuildingProp | null>(null);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);
    const [rooms, setRooms] = useState<TypeRoomProp[]>([]);
    const [users, setUsers] = useState<any>({});
    const [blogs, setBlogs] = useState<any>(null);
    const [selectedRoom, setSelectedRoom] = useState<TypeRoomProp | null>(null);
    const [months, setMonths] = useState(1);
    const newDate = new Date();
    const searchParams = useSearchParams();
    const buildingIdFromQuery = searchParams.get("buildingId");
    const [waterBills, setWaterBills] = useState<any>(null);
    const [electricityBills, setElectricityBills] = useState<any>(null);

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
            setUsers(res?.data?.results?.[0] || {});
        } catch (err) {
            console.error("Lỗi lấy user:", err);
        }
    };

    const fetchRooms = async (buildingId: string) => {
        try {
            const res = await handleAllRoom(buildingId);
            const availableRooms = res?.data?.results?.filter((r: TypeRoomProp) => r.status === false) || [];
            setRooms(availableRooms);
            setSelectedRoom(null);
        } catch (err) {
            console.error("Lỗi lấy phòng:", err);
        }
    };

    const fetchBlogs = async (buildingId: string) => {
        try {
            const res = await handleBlogsByBuilding(buildingId);
            setBlogs(res?.data?.results?.[0] || null);
        } catch (err) {
            console.error("Lỗi lấy blog:", err);
        }
    };

    const fetchWaterBills = async (roomId: string) => {
        try {
            const res = await handleElWaterBillByRoomID(roomId);
            setWaterBills(res?.data?.results?.[0] || null);
        } catch (err) {
            console.error("Lỗi lấy water bill:", err);
        }
    };

    const fetchElectricityBills = async (roomId: string) => {
        try {
            const res = await handleElectricityBillByRoomID(roomId);
            setElectricityBills(res?.data?.results?.[0] || null);
        } catch (err) {
            console.error("Lỗi lấy electricity bill:", err);
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

    const showLoginModal = () => {
        setModalConfig({
            type: "error",
            title: "Bạn chưa đăng nhập",
            message: "Vui lòng đăng nhập để tiếp tục.",
            onConfirm: undefined,
            loginRequired: true,
        });
        setModalOpen(true);
    };

    const handleContact = () => {
        if (!session) { showLoginModal(); return; }
        setContactOpen(true);
    };

    const handleRent = async () => {
        if (!session) { showLoginModal(); return; }
        try {
            const userId = session?.data?.results?.[0]._id;
            const res = await handleAllRoom(undefined, userId);
            const activeRentedRooms = (res?.data?.results || []).filter((r: TypeRoomProp) => {
                if (!r.toDate) return true;
                return new Date(r.toDate) > new Date();
            });
            if (activeRentedRooms.length > 0) {
                const room = activeRentedRooms[0];
                const toDateStr = room.toDate ? new Date(room.toDate).toLocaleDateString("vi-VN") : "chưa xác định";
                setModalConfig({ type: "error", title: "Bạn đã có phòng đang thuê", message: `Bạn đang thuê phòng ${room.code} đến ngày ${toDateStr}. Vui lòng chấm dứt hợp đồng trước khi thuê phòng mới.`, onConfirm: undefined, loginRequired: false });
                setModalOpen(true);
                return;
            }
            setModalConfig({
                type: "confirm",
                title: "Xác nhận thuê phòng",
                message: `Bạn có chắc muốn thuê phòng "${selectedRoom?.code}" nhà "${selectedBuilding?.name}" trong "${months}" tháng?`,
                loginRequired: false,
                onConfirm: async () => {
                    try {
                        const updateData = { _id: selectedRoom?._id, totalMonth: months, userId: session?.data?.results?.[0]._id, statusPayment: '2', fromDate: newDate };
                        const updateUser = { _id: session?.data?.results?.[0]._id, role: "USERS" };
                        const updateWaterBill = { _id: waterBills?._id, toDate: newDate, amount: '0', status: '1', payment: '0' };
                        const electricityBill = { _id: electricityBills?._id, toDate: newDate, amount: '0', status: '1', payment: '0' };
                        const res = await handleUpdateRoom(updateData);
                        if (res?.statusCode === 200) {
                            await handleUpdateUserAction(updateUser);
                            if (waterBills?._id) await handleUpdateWaterBill(updateWaterBill);
                            if (electricityBills?._id) await handleUpdateElectricityBill(electricityBill);
                            window.location.reload();
                            setModalConfig({ type: "success", title: "Thuê phòng thành công", message: `Bạn đã thuê phòng ${selectedRoom?.code} thành công!`, onConfirm: undefined, loginRequired: false });
                            setModalOpen(true);
                        } else {
                            setModalConfig({ type: "error", title: "Lỗi khi thuê phòng", message: res?.message || "Không thể thuê phòng, vui lòng thử lại.", onConfirm: undefined, loginRequired: false });
                            setModalOpen(true);
                        }
                    } catch {
                        setModalConfig({ type: "error", title: "Lỗi khi thuê phòng", message: "Có lỗi xảy ra trong quá trình thuê phòng.", onConfirm: undefined, loginRequired: false });
                        setModalOpen(true);
                    }
                }
            });
            setModalOpen(true);
        } catch {
            setModalConfig({ type: "error", title: "Lỗi hệ thống", message: "Không kiểm tra được thông tin thuê phòng.", onConfirm: undefined, loginRequired: false });
            setModalOpen(true);
        }
    };

    const fmt = (v: any) => {
        const n = Number(v);
        return Number.isFinite(n) ? n.toLocaleString("vi-VN") : "0";
    };

    const availCount = (b: TypeBuildingProp) =>
        Math.max(0, (Number(b.totalRooms) || 0) - (Number(b.numberOfRoomsRented) || 0));

    return (
        <section className="relative z-10 mx-auto -mt-16 w-11/12 max-w-[1280px] pb-16">
            <div className="flex min-h-[620px] overflow-hidden rounded-[20px] border border-[#E5E7EB] bg-white text-[#121314] shadow-[0_8px_40px_rgba(5,150,105,0.10)]">

                {/* ── Sidebar ── */}
                <div className="relative z-10 flex w-[260px] flex-shrink-0 flex-col border-r border-[#E5E7EB] bg-[#FAFAFA]">
                    <div className="border-b border-[#E5E7EB] px-4 py-5">
                        <h2 className="mb-3 font-playfair text-[17px] font-bold text-[#064E3B]">Tìm nhà trọ</h2>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="Tên hoặc địa chỉ..."
                                className="h-9 min-w-0 flex-1 rounded-lg border border-[#E5E7EB] bg-white px-3 text-[13px] transition focus:border-[#059669] focus:outline-none focus:ring-2 focus:ring-[#059669]/15"
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                            />
                            <button
                                onClick={handleSearch}
                                className="h-9 flex-shrink-0 rounded-lg bg-[#059669] px-3 text-[13px] font-semibold text-white transition hover:bg-[#047857]"
                            >
                                Tìm
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto py-2">
                        {loading && <p className="px-4 py-3 text-[13px] text-gray-400">Đang tìm...</p>}
                        {!loading && searched && results.length === 0 && (
                            <p className="px-4 py-3 text-[13px] text-gray-400">Không tìm thấy kết quả</p>
                        )}
                        {!loading && results.map((building) => {
                            const isSelected = selectedBuilding?._id === building._id;
                            const avail = availCount(building);
                            return (
                                <div
                                    key={building._id}
                                    onClick={() => setSelectedBuilding(building)}
                                    className={`mx-2 mb-1 cursor-pointer rounded-[10px] border px-3 py-3 transition-all ${isSelected
                                        ? "border-[#A7F3D0] bg-[#ECFDF5]"
                                        : "border-transparent hover:bg-[#F0FDF4]"
                                        }`}
                                >
                                    <p className={`text-[13px] font-semibold leading-snug ${isSelected ? "text-[#047857]" : "text-[#111827]"}`}>
                                        {building.name}
                                    </p>
                                    <p className="mt-0.5 line-clamp-1 text-[12px] text-gray-500">{building.address}</p>
                                    <span className={`mt-1.5 inline-block rounded-full px-2 py-0.5 text-[11px] font-medium ${avail > 0 ? "bg-[#D1FAE5] text-[#047857]" : "bg-gray-100 text-gray-400"}`}>
                                        {avail > 0 ? `${avail} phòng trống` : "Hết phòng"}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* ── Detail panel ── */}
                <div className="flex flex-1 overflow-hidden">
                    {selectedBuilding ? (
                        <div className="flex w-full">
                            {/* Building info */}
                            <div className="flex w-1/2 flex-col border-r border-[#E5E7EB]">
                                <div className="bg-gradient-to-r from-[#047857] to-[#059669] px-6 py-5">
                                    <p className="mb-1 text-[11px] font-bold uppercase tracking-widest text-[#A7F3D0]">Thông tin nhà trọ</p>
                                    <h2 className="font-playfair text-[20px] font-bold leading-tight text-white">{selectedBuilding.name}</h2>
                                </div>

                                <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-5 py-5">
                                    <div className="flex items-start gap-2 text-[14px] text-[#374151]">
                                        <EnvironmentOutlined className="mt-0.5 text-[#059669]" />
                                        <span>{selectedBuilding.address}</span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="rounded-[10px] bg-[#ECFDF5] px-3 py-2.5">
                                            <p className="mb-0.5 text-[11px] text-gray-500">Giá trung bình</p>
                                            <p className="font-bold text-[#059669]">{fmt(selectedBuilding.priceOfRoom)} đ/tháng</p>
                                        </div>
                                        <div className="rounded-[10px] bg-[#ECFDF5] px-3 py-2.5">
                                            <p className="mb-0.5 text-[11px] text-gray-500">Phòng trống</p>
                                            <p className="font-bold text-[#059669]">{availCount(selectedBuilding)} / {selectedBuilding.totalRooms}</p>
                                        </div>
                                        <div className="rounded-[10px] bg-[#F9FAFB] px-3 py-2.5">
                                            <p className="mb-0.5 text-[11px] text-gray-500">Tổng số phòng</p>
                                            <p className="font-semibold text-[#111827]">{selectedBuilding.totalRooms}</p>
                                        </div>
                                        <div className="rounded-[10px] bg-[#F9FAFB] px-3 py-2.5">
                                            <p className="mb-0.5 text-[11px] text-gray-500">Người tối đa/phòng</p>
                                            <p className="font-semibold text-[#111827]">{selectedBuilding.numberOfPeopleRoom}</p>
                                        </div>
                                    </div>

                                    {blogs ? (
                                        <Link
                                            href={`/blogs/${blogs._id}`}
                                            className="inline-flex items-center gap-2 rounded-[10px] border border-[#A7F3D0] bg-[#ECFDF5] px-3 py-2.5 text-[13px] font-medium text-[#047857] transition hover:bg-[#D1FAE5]"
                                        >
                                            <ReadOutlined />
                                            {blogs.title}
                                        </Link>
                                    ) : (
                                        <p className="text-[13px] italic text-gray-400">Chưa có bài giới thiệu</p>
                                    )}
                                </div>
                            </div>

                            {/* Room info */}
                            <div className="flex w-1/2 flex-col">
                                <div className="border-b border-[#E5E7EB] px-5 py-4">
                                    <p className="mb-2 text-[11px] font-bold uppercase tracking-widest text-gray-400">Chọn phòng</p>
                                    {(rooms.length > 0 && +selectedBuilding.numberOfRoomsRented <= +selectedBuilding.totalRooms) ? (
                                        <Select
                                            className="w-full"
                                            style={{ height: 40 }}
                                            placeholder="-- Chọn mã phòng --"
                                            value={selectedRoom?._id || null}
                                            onChange={(value) => {
                                                const room = rooms.find((r) => r._id === value) || null;
                                                setSelectedRoom(room);
                                            }}
                                            options={rooms.map((room) => ({ value: room._id, label: room.code }))}
                                        />
                                    ) : (
                                        <div className="flex items-center gap-2 text-[14px] text-gray-400">
                                            <span>🏚️</span>
                                            <span>Không có phòng trống</span>
                                        </div>
                                    )}
                                </div>

                                {selectedRoom ? (
                                    <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-5 py-5">
                                        <div className="grid grid-cols-2 gap-2">
                                            <div className="rounded-[10px] bg-[#ECFDF5] px-3 py-2.5">
                                                <p className="mb-0.5 text-[11px] text-gray-500">Giá phòng</p>
                                                <p className="font-bold text-[#059669]">{fmt(selectedRoom.price)} đ/tháng</p>
                                            </div>
                                            <div className="rounded-[10px] bg-[#ECFDF5] px-3 py-2.5">
                                                <p className="mb-0.5 text-[11px] text-gray-500">Tiền cọc</p>
                                                <p className="font-bold text-[#059669]">{fmt(selectedRoom.payment || '0')} đ</p>
                                            </div>
                                            <div className="rounded-[10px] bg-[#F9FAFB] px-3 py-2.5">
                                                <p className="mb-0.5 text-[11px] text-gray-500">Diện tích</p>
                                                <p className="font-semibold text-[#111827]">{selectedRoom.acreage} m²</p>
                                            </div>
                                            <div className="rounded-[10px] bg-[#F9FAFB] px-3 py-2.5">
                                                <p className="mb-0.5 text-[11px] text-gray-500">Số người tối đa</p>
                                                <p className="font-semibold text-[#111827]">{selectedRoom.totalPeople} người</p>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-2">
                                            {selectedRoom.toilet && <span className="rounded-full bg-[#ECFDF5] px-3 py-1 text-[12px] font-medium text-[#047857]">🚿 Phòng tắm</span>}
                                            {selectedRoom.kitchen && <span className="rounded-full bg-[#ECFDF5] px-3 py-1 text-[12px] font-medium text-[#047857]">🍳 Bếp</span>}
                                            {selectedRoom.washroom && <span className="rounded-full bg-[#ECFDF5] px-3 py-1 text-[12px] font-medium text-[#047857]">🧺 Phòng giặt</span>}
                                        </div>

                                        <div className="flex items-center gap-3 rounded-[10px] border border-[#E5E7EB] px-4 py-2.5">
                                            <label className="whitespace-nowrap text-[13px] font-medium text-gray-600">Số tháng thuê:</label>
                                            <input
                                                type="number"
                                                min={1}
                                                value={months}
                                                onChange={(e) => setMonths(Number(e.target.value))}
                                                className="w-16 rounded-lg border border-[#E5E7EB] px-2 py-1 text-center text-[14px] transition focus:border-[#059669] focus:outline-none"
                                            />
                                        </div>

                                        <div className="rounded-[10px] border border-[#FDE68A] bg-[#FFFBEB] px-4 py-3 text-[13px] text-[#92400E]">
                                            <p className="mb-1 font-semibold">Thông tin chuyển khoản</p>
                                            <p>Tài khoản: <b>{users.bankAccount}</b> — Ngân hàng: <b>{users.bank}</b></p>
                                            <p className="mt-1 italic">
                                                &quot;Chuyển {fmt(selectedRoom.payment || '0')} tiền cọc phòng {selectedRoom.code} nhà {selectedBuilding.name}&quot;
                                            </p>
                                        </div>

                                        {/* Action buttons */}
                                        <div className="flex gap-3">
                                            <button
                                                onClick={handleContact}
                                                className="flex-1 rounded-[12px] border-2 border-[#059669] py-3 font-semibold text-[#059669] transition-all hover:bg-[#ECFDF5]"
                                            >
                                                Liên hệ
                                            </button>
                                            <button
                                                onClick={handleRent}
                                                className="flex-[2] rounded-[12px] bg-gradient-to-r from-[#10B981] to-[#059669] py-3 font-semibold text-white shadow-[0_4px_14px_rgba(5,150,105,0.28)] transition-all hover:scale-[1.01] hover:shadow-[0_6px_20px_rgba(5,150,105,0.38)]"
                                            >
                                                Thuê ngay
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    rooms.length > 0 && (
                                        <div className="flex flex-1 flex-col items-center justify-center gap-2 py-10 text-gray-400">
                                            <span className="text-4xl">🔍</span>
                                            <p className="text-[14px]">Chọn phòng để xem chi tiết</p>
                                        </div>
                                    )
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-1 flex-col items-center justify-center gap-3 text-gray-400">
                            <span className="text-[56px]">🏠</span>
                            <p className="text-[15px] font-medium text-gray-500">Chọn một nhà trọ từ danh sách</p>
                            <p className="text-[13px]">để xem thông tin chi tiết và phòng trống</p>
                        </div>
                    )}
                </div>
            </div>

            {/* ── Modal liên hệ chủ trọ ── */}
            {contactOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 px-4">
                    <div className="w-full max-w-[420px] overflow-hidden rounded-[20px] bg-white shadow-[0_20px_60px_rgba(0,0,0,0.18)]">
                        {/* Header */}
                        <div className="flex items-center justify-between bg-gradient-to-r from-[#047857] to-[#059669] px-6 py-4">
                            <div>
                                <p className="text-[11px] font-bold uppercase tracking-widest text-[#A7F3D0]">Thông tin liên hệ</p>
                                <h3 className="font-playfair text-[18px] font-bold text-white">{selectedBuilding?.name}</h3>
                            </div>
                            <button
                                onClick={() => setContactOpen(false)}
                                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white transition hover:bg-white/30"
                            >
                                <CloseOutlined className="text-[14px]" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex flex-col gap-3 px-6 py-5">
                            {[
                                { icon: <UserOutlined />, label: "Chủ trọ", value: users.name || "—" },
                                { icon: <PhoneOutlined />, label: "Điện thoại", value: users.phone || "—", href: users.phone ? `tel:${users.phone}` : undefined },
                                { icon: <MailOutlined />, label: "Email", value: users.email || "—", href: users.email ? `mailto:${users.email}` : undefined },
                                { icon: <BankOutlined />, label: "Ngân hàng", value: users.bank ? `${users.bankAccount} — ${users.bank}` : "—" },
                            ].map((item) => (
                                <div key={item.label} className="flex items-center gap-3 rounded-[12px] border border-[#E5E7EB] px-4 py-3">
                                    <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#34D399] to-[#059669] text-white text-[15px]">
                                        {item.icon}
                                    </div>
                                    <div>
                                        <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">{item.label}</p>
                                        {item.href ? (
                                            <a href={item.href} className="text-[14px] font-medium text-[#059669] hover:underline">{item.value}</a>
                                        ) : (
                                            <p className="text-[14px] font-medium text-[#111827]">{item.value}</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="border-t border-[#E5E7EB] px-6 py-4">
                            <button
                                onClick={() => setContactOpen(false)}
                                className="w-full rounded-[12px] border border-[#E5E7EB] py-2.5 text-[14px] font-medium text-gray-600 transition hover:bg-gray-50"
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Modal thông báo ── */}
            <ModalAccommodation
                isOpen={modalOpen}
                type={modalConfig.type}
                title={modalConfig.title}
                message={modalConfig.message}
                onClose={() => setModalOpen(false)}
                onConfirm={modalConfig.onConfirm}
                loginRequired={modalConfig.loginRequired}
            />
        </section>
    );
};

export default AccommodationSearch;
