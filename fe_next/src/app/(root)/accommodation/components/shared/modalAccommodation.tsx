import React from "react";
import Link from "next/link";
import SVGCancel from "../svgs/SVGCancel";
import SVGTick from "../svgs/SVGTick";
import { LockOutlined } from "@ant-design/icons";

interface ModalProps {
    isOpen: boolean;
    type: "error" | "confirm" | "success";
    title: string;
    message: string;
    onClose: () => void;
    onConfirm?: () => void;
    loginRequired?: boolean;
}

const ModalAccommodation: React.FC<ModalProps> = ({
    isOpen, type, title, message, onClose, onConfirm, loginRequired
}) => {
    if (!isOpen) return null;

    const icon = loginRequired ? (
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#ECFDF5]">
            <LockOutlined className="text-[28px] text-[#059669]" />
        </div>
    ) : type === "error" ? (
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
            <SVGCancel className="h-8 w-8 text-red-500" />
        </div>
    ) : (
        <div className={`flex h-14 w-14 items-center justify-center rounded-full ${type === "success" ? "bg-[#ECFDF5]" : "bg-[#ECFDF5]"}`}>
            <SVGTick className={`h-8 w-8 ${type === "success" ? "text-[#059669]" : "text-[#059669]"}`} />
        </div>
    );

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 px-4">
            <div className="w-full max-w-[380px] overflow-hidden rounded-[20px] bg-white shadow-[0_20px_60px_rgba(0,0,0,0.18)]">
                {/* Header accent */}
                <div className="h-1 w-full bg-gradient-to-r from-[#10B981] to-[#059669]" />

                <div className="px-8 py-7 text-center">
                    <div className="mb-4 flex justify-center">{icon}</div>
                    <h2 className="mb-2 font-playfair text-[20px] font-bold text-[#064E3B]">{title}</h2>
                    <p className="mb-6 text-[14px] leading-relaxed text-gray-500">{message}</p>

                    <div className="flex justify-center gap-3">
                        {type === "confirm" ? (
                            <>
                                <button
                                    onClick={onClose}
                                    className="rounded-[10px] border border-[#E5E7EB] px-5 py-2.5 text-[14px] font-medium text-gray-600 transition hover:bg-gray-50"
                                >
                                    Hủy
                                </button>
                                <button
                                    onClick={() => { onConfirm?.(); onClose(); }}
                                    className="rounded-[10px] bg-gradient-to-r from-[#10B981] to-[#059669] px-6 py-2.5 text-[14px] font-semibold text-white shadow-[0_4px_12px_rgba(5,150,105,0.28)] transition hover:shadow-[0_6px_16px_rgba(5,150,105,0.38)]"
                                >
                                    Xác nhận
                                </button>
                            </>
                        ) : loginRequired ? (
                            <>
                                <Link
                                    href="/login"
                                    className="rounded-[10px] bg-gradient-to-r from-[#10B981] to-[#059669] px-6 py-2.5 text-[14px] font-semibold text-white shadow-[0_4px_12px_rgba(5,150,105,0.28)] transition hover:shadow-[0_6px_16px_rgba(5,150,105,0.38)]"
                                >
                                    Đăng nhập
                                </Link>
                                <button
                                    onClick={onClose}
                                    className="rounded-[10px] border border-[#E5E7EB] px-5 py-2.5 text-[14px] font-medium text-gray-600 transition hover:bg-gray-50"
                                >
                                    Đóng
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={onClose}
                                className="rounded-[10px] bg-gradient-to-r from-[#10B981] to-[#059669] px-8 py-2.5 text-[14px] font-semibold text-white shadow-[0_4px_12px_rgba(5,150,105,0.28)] transition hover:shadow-[0_6px_16px_rgba(5,150,105,0.38)]"
                            >
                                Đóng
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModalAccommodation;
