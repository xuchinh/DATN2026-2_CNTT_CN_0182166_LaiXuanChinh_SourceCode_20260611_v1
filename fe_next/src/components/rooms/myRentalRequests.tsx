'use client';

import { useCallback, useEffect, useState } from "react";
import { Modal, Empty, Tag, Button, Popconfirm, message } from "antd";
import Link from "next/link";
import {
    EnvironmentOutlined,
    PhoneOutlined,
    MailOutlined,
    UserOutlined,
    BankOutlined,
    ReadOutlined,
    HomeOutlined,
    DeleteOutlined,
} from "@ant-design/icons";
import { handleCancelRentalRequest, handleMyRentalRequests } from "./requests/room.requests";

const statusMap: Record<string, { label: string; color: string }> = {
    pending: { label: "Đang chờ duyệt", color: "gold" },
    accepted: { label: "Đã được duyệt", color: "green" },
    rejected: { label: "Đã bị từ chối", color: "red" },
};

interface IProps {
    isOpen: boolean;
    onClose: () => void;
    userId?: string;
}

const MyRentalRequests = ({ isOpen, onClose, userId }: IProps) => {
    const [loading, setLoading] = useState(false);
    const [requests, setRequests] = useState<any[]>([]);
    const [landlord, setLandlord] = useState<any>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const loadRequests = useCallback(async () => {
        if (!userId) return;
        setLoading(true);
        try {
            const res = await handleMyRentalRequests(userId);
            setRequests(res?.data?.results ?? []);
        } catch {
            setRequests([]);
        }
        setLoading(false);
    }, [userId]);

    useEffect(() => {
        if (isOpen) loadRequests();
    }, [isOpen, loadRequests]);

    const onDelete = async (roomId: string) => {
        if (!userId) return;
        setDeletingId(roomId);
        try {
            const res = await handleCancelRentalRequest({ roomId, userId });
            if (res?.statusCode === 200 || res?.statusCode === 201) {
                message.success("Đã xóa yêu cầu");
                setRequests((prev) => prev.filter((r) => r.roomId !== roomId));
            } else {
                message.error(res?.message || "Không xóa được, vui lòng thử lại.");
            }
        } catch {
            message.error("Có lỗi xảy ra khi xóa yêu cầu.");
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <>
            <Modal
                title="Các yêu cầu đã gửi"
                open={isOpen}
                onCancel={onClose}
                footer={null}
                width={580}
            >
                {loading ? (
                    <p className="text-gray-400">Đang tải...</p>
                ) : requests.length === 0 ? (
                    <Empty description="Bạn chưa gửi yêu cầu thuê nào" />
                ) : (
                    <div className="flex max-h-[60vh] flex-col gap-3 overflow-y-auto overscroll-contain pr-1">
                        {requests.map((req) => {
                            const st = statusMap[req.status] ?? { label: req.status, color: "default" };
                            return (
                                <div key={req.roomId} className="rounded-lg border border-gray-200 p-3 shadow-sm">
                                    <div className="mb-1 flex items-center justify-between">
                                        <span className="flex items-center gap-2 font-semibold text-emerald-700">
                                            <HomeOutlined /> {req.buildingName || "Nhà trọ"} · Phòng {req.roomCode}
                                        </span>
                                        <Tag color={st.color}>{st.label}</Tag>
                                    </div>
                                    <div className="flex items-start gap-2 text-sm text-gray-600">
                                        <EnvironmentOutlined className="mt-0.5" /> <span>{req.buildingAddress || "—"}</span>
                                    </div>
                                    <div className="mt-1 text-sm text-gray-600">
                                        Số tháng muốn thuê: <b>{req.desiredMonths || "—"}</b>
                                    </div>
                                    {req.message && (
                                        <div className="mt-1 text-sm italic text-gray-500">“{req.message}”</div>
                                    )}
                                    <div className="mt-2 flex flex-wrap items-center gap-3">
                                        {req.blogId && (
                                            <Link
                                                href={`/blogs/${req.blogId}`}
                                                target="_blank"
                                                className="inline-flex items-center gap-1 text-sm text-emerald-600 hover:underline"
                                            >
                                                <ReadOutlined /> {req.blogTitle || "Xem bài giới thiệu"}
                                            </Link>
                                        )}
                                        <Button size="small" icon={<UserOutlined />} onClick={() => setLandlord(req)}>
                                            Thông tin chủ trọ
                                        </Button>
                                        <Popconfirm
                                            title="Xóa yêu cầu này?"
                                            description="Yêu cầu sẽ bị gỡ khỏi danh sách và khỏi trang chủ trọ."
                                            okText="Xóa"
                                            cancelText="Hủy"
                                            okButtonProps={{ danger: true }}
                                            onConfirm={() => onDelete(req.roomId)}
                                        >
                                            <Button size="small" danger icon={<DeleteOutlined />} loading={deletingId === req.roomId}>
                                                Xóa yêu cầu
                                            </Button>
                                        </Popconfirm>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </Modal>

            <Modal
                title="Thông tin chủ trọ"
                open={!!landlord}
                onCancel={() => setLandlord(null)}
                footer={null}
                width={420}
            >
                {landlord && (
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-3 rounded-lg border border-gray-200 px-3 py-2">
                            <UserOutlined className="text-emerald-600" />
                            <span>{landlord.landlordName || "—"}</span>
                        </div>
                        <div className="flex items-center gap-3 rounded-lg border border-gray-200 px-3 py-2">
                            <PhoneOutlined className="text-emerald-600" />
                            {landlord.landlordPhone ? (
                                <a href={`tel:${landlord.landlordPhone}`} className="text-emerald-600">{landlord.landlordPhone}</a>
                            ) : "—"}
                        </div>
                        <div className="flex items-center gap-3 rounded-lg border border-gray-200 px-3 py-2">
                            <MailOutlined className="text-emerald-600" />
                            {landlord.landlordEmail ? (
                                <a href={`mailto:${landlord.landlordEmail}`} className="text-emerald-600">{landlord.landlordEmail}</a>
                            ) : "—"}
                        </div>
                        <div className="flex items-center gap-3 rounded-lg border border-gray-200 px-3 py-2">
                            <BankOutlined className="text-emerald-600" />
                            <span>{landlord.landlordBank ? `${landlord.landlordBankAccount} — ${landlord.landlordBank}` : "—"}</span>
                        </div>
                    </div>
                )}
            </Modal>
        </>
    );
};

export default MyRentalRequests;
