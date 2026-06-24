"use client";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface PackageRevenue {
    name: string;
    value: number;
    count?: number;
}

interface IProps {
    data: PackageRevenue[];
}

// Bảng màu xanh lá (đồng bộ theme) + vài tông phụ để phân biệt các gói
const COLORS = ["#059669", "#10B981", "#34D399", "#047857", "#6EE7B7", "#065F46", "#A7F3D0"];

const formatCurrency = (value: number) =>
    `${(Number.isFinite(value) ? value : 0).toLocaleString("vi-VN")} VNĐ`;

const PackageRevenuePie = ({ data }: IProps) => {
    if (!data || data.length === 0) {
        return (
            <div className="flex h-[300px] items-center justify-center text-gray-400">
                Chưa có doanh thu gói đăng ký nào được ghi nhận.
            </div>
        );
    }

    // Tổng doanh thu để tính phần trăm cho tooltip
    const total = data.reduce((s, d) => s + (Number(d.value) || 0), 0);

    // Tooltip: Tên gói: phần trăm + Số lượng lượt mua
    const CustomTooltip = ({ active, payload }: any) => {
        if (!active || !payload || !payload.length) return null;
        const item = payload[0];
        const value = Number(item.value) || 0;
        const percent = total > 0 ? ((value / total) * 100).toFixed(1) : "0";
        const count = item.payload?.count ?? 0;
        return (
            <div
                style={{
                    background: "#fff",
                    border: "1px solid #A7F3D0",
                    borderRadius: 8,
                    padding: "8px 12px",
                    boxShadow: "0 2px 8px rgba(16,24,40,0.08)",
                }}
            >
                <div style={{ color: "#047857", fontWeight: 600 }}>
                    {item.name}: {percent}%
                </div>
                <div style={{ color: "#374151", marginTop: 2 }}>
                    Số lượng: {count} lượt mua
                </div>
            </div>
        );
    };

    return (
        <ResponsiveContainer width="100%" height={360}>
            <PieChart>
                <Pie
                    data={data}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    label={(entry: any) => `${entry.name}: ${formatCurrency(entry.value)}`}
                >
                    {data.map((_, index) => (
                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend />
            </PieChart>
        </ResponsiveContainer>
    );
};

export default PackageRevenuePie;
