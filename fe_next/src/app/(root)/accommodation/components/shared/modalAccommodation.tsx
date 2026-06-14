import React from "react";
import SVGCancel from "../svgs/SVGCancel";
import SVGTick from "../svgs/SVGTick";


interface ModalProps {
    isOpen: boolean;
    type: "error" | "confirm" | "success";
    title: string;
    message: string;
    onClose: () => void;
    onConfirm?: () => void;
}

const ModalAccommodation: React.FC<ModalProps> = ({ isOpen, type, title, message, onClose, onConfirm }) => {
    if (!isOpen) return null;

    const icon =
        type === "error" ? (
            <SVGCancel className="w-12 h-12 text-red-500" />
        ) : (
            <SVGTick className={`w-12 h-12 ${type === "success" ? "text-green-500" : "text-blue-500"}`} />
        );

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-[350px] text-center">
                <div className="flex justify-center mb-4">{icon}</div>
                <h2 className="text-xl font-semibold mb-2">{title}</h2>
                <p className="text-gray-600 mb-4">{message}</p>
                <div className="flex justify-center gap-3">
                    {type === "confirm" ? (
                        <>
                            <button
                                onClick={onClose}
                                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 transition-colors"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={() => {
                                    onConfirm && onConfirm();
                                    onClose();
                                }}
                                className="px-4 py-2 rounded bg-green-500 text-white hover:bg-green-600 transition-colors"
                            >
                                Xác nhận
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={onClose}
                            className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                        >
                            Đóng
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ModalAccommodation;
