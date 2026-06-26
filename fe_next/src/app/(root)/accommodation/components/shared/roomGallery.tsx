'use client';

import { useEffect, useState } from "react";
import { Image } from "antd";
import { LeftOutlined, RightOutlined, PictureOutlined, ZoomInOutlined, ZoomOutOutlined } from "@ant-design/icons";

interface IProps {
    images?: string[];
}

// Gallery ảnh của phòng: ảnh chính lớn + counter "i/N" góc trên phải + dải thumbnail + nút ◀▶.
// Bấm ảnh chính để phóng to toàn màn hình (antd Image.PreviewGroup duyệt được tất cả ảnh).
const RoomGallery = ({ images }: IProps) => {
    const list = images ?? [];
    const [active, setActive] = useState(0);

    // Đổi phòng (đổi mảng ảnh) → về ảnh đầu tiên.
    useEffect(() => { setActive(0); }, [images]);

    if (list.length === 0) {
        return (
            <div className="flex h-[320px] w-full flex-col items-center justify-center gap-2 rounded-[14px] border border-dashed border-gray-200 bg-gray-50 text-gray-400">
                <PictureOutlined className="text-4xl" />
                <span className="text-sm">Phòng chưa có ảnh</span>
            </div>
        );
    }

    const safeActive = Math.min(active, list.length - 1);
    const prev = () => setActive((i) => (i - 1 + list.length) % list.length);
    const next = () => setActive((i) => (i + 1) % list.length);

    return (
        <div className="w-full">
            {/* Ảnh chính */}
            <div className="relative flex items-center justify-center overflow-hidden rounded-[14px] bg-[#0b0b0b]">
                <Image.PreviewGroup
                    preview={{
                        // Chỉ giữ phóng to / thu nhỏ — bỏ lật (mirror) và xoay.
                        toolbarRender: (
                            _node: React.ReactNode,
                            { transform: { scale }, actions: { onZoomOut, onZoomIn } }: any,
                        ) => (
                            <div
                                style={{
                                    display: "flex",
                                    gap: 16,
                                    alignItems: "center",
                                    padding: "8px 18px",
                                    background: "rgba(0,0,0,0.45)",
                                    borderRadius: 100,
                                }}
                            >
                                <ZoomOutOutlined
                                    style={{
                                        fontSize: 20,
                                        color: "#fff",
                                        cursor: scale <= 1 ? "not-allowed" : "pointer",
                                        opacity: scale <= 1 ? 0.4 : 1,
                                    }}
                                    onClick={onZoomOut}
                                />
                                <ZoomInOutlined
                                    style={{ fontSize: 20, color: "#fff", cursor: "pointer" }}
                                    onClick={onZoomIn}
                                />
                            </div>
                        ),
                    }}
                >
                    {list.map((src, i) => (
                        <Image
                            key={i}
                            src={src}
                            alt={`Ảnh ${i + 1}`}
                            height={360}
                            wrapperStyle={{ display: i === safeActive ? "flex" : "none", width: "100%", justifyContent: "center" }}
                            style={{ height: 360, width: "100%", objectFit: "contain" }}
                        />
                    ))}
                </Image.PreviewGroup>

                {/* Counter i/N góc trên bên phải */}
                <span className="pointer-events-none absolute right-3 top-3 z-10 rounded-full bg-black/60 px-3 py-1 text-[13px] font-semibold text-white">
                    {safeActive + 1}/{list.length}
                </span>

                {/* Nút điều hướng */}
                {list.length > 1 && (
                    <>
                        <button
                            type="button"
                            onClick={prev}
                            aria-label="Ảnh trước"
                            className="absolute left-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-gray-700 shadow transition hover:bg-white"
                        >
                            <LeftOutlined />
                        </button>
                        <button
                            type="button"
                            onClick={next}
                            aria-label="Ảnh sau"
                            className="absolute right-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-gray-700 shadow transition hover:bg-white"
                        >
                            <RightOutlined />
                        </button>
                    </>
                )}
            </div>

            {/* Dải thumbnail */}
            {list.length > 1 && (
                <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                    {list.map((src, i) => (
                        <button
                            type="button"
                            key={i}
                            onClick={() => setActive(i)}
                            className={`relative h-16 w-20 flex-shrink-0 overflow-hidden rounded-lg border-2 transition ${i === safeActive ? "border-[#059669]" : "border-transparent opacity-70 hover:opacity-100"
                                }`}
                        >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={src} alt={`thumbnail ${i + 1}`} className="h-full w-full object-cover" />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default RoomGallery;
