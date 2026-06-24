"use client"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface IProps {
    data: { month: string; [key: string]: any }[];
    dataKeyes: string;
}

// Tạo 5 tháng gần nhất với giá trị 0 khi không có dữ liệu
const generateEmptyMonths = (): { month: string; [key: string]: number }[] => {
    const now = new Date();
    return Array.from({ length: 5 }, (_, i) => {
        const d = new Date(now.getFullYear(), now.getMonth() - (4 - i), 1);
        const month = `${String(d.getMonth() + 1).padStart(2, '0')}-${d.getFullYear()}`;
        return { month, income: 0, incomeWater: 0, incomeElectricity: 0, incomeVehicle: 0 };
    });
};

// Trục Y: rút gọn để vừa không bị cắt
const formatAxisVND = (value: number): string => {
    if (value === 0) return '0';
    if (value >= 1_000_000_000_000) return `${+(value / 1_000_000_000_000).toFixed(1)} nghìn tỷ`;
    if (value >= 1_000_000_000)     return `${+(value / 1_000_000_000).toFixed(1)} tỷ`;
    if (value >= 1_000_000)         return `${+(value / 1_000_000).toFixed(1)} triệu`;
    if (value >= 1_000)             return `${+(value / 1_000).toFixed(1)} nghìn`;
    return value.toString();
};

// Định dạng tiền đầy đủ: 3.000.000 VNĐ
const formatFullVND = (value: number): string =>
    `${Math.round(Number(value) || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')} VNĐ`;

const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
        <div style={{
            background: '#fff',
            border: '1px solid #A7F3D0',
            borderRadius: 8,
            padding: '8px 14px',
            fontSize: 13,
        }}>
            <p style={{ color: '#047857', fontWeight: 700, marginBottom: 4 }}>{label}</p>
            {payload.map((p: any) => (
                <p key={p.dataKey} style={{ color: '#059669', margin: 0 }}>
                    {formatFullVND(p.value)}
                </p>
            ))}
        </div>
    );
};

const Chart = ({ data, dataKeyes }: IProps) => {
    const chartData = (!data || data.length === 0) ? generateEmptyMonths() : data;

    return (
        <div>
            <ResponsiveContainer width="100%" height={260}>
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis
                        width={90}
                        tickFormatter={formatAxisVND}
                        tick={{ fontSize: 12 }}
                        domain={[0, 'auto']}
                        allowDataOverflow={false}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar dataKey={dataKeyes} fill="#059669" radius={[6, 6, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>

            {/* Bảng số liệu chính xác */}
            <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                marginTop: 8,
                fontSize: 12,
            }}>
                <thead>
                    <tr style={{ background: '#ECFDF5' }}>
                        <th style={{ border: '1px solid #A7F3D0', padding: '4px 8px', color: '#047857', textAlign: 'left' }}>Tháng</th>
                        <th style={{ border: '1px solid #A7F3D0', padding: '4px 8px', color: '#047857', textAlign: 'right' }}>Doanh thu (VNĐ)</th>
                    </tr>
                </thead>
                <tbody>
                    {chartData.map((row, i) => (
                        <tr key={i} style={{ background: i % 2 === 0 ? '#fff' : '#F0FDF4' }}>
                            <td style={{ border: '1px solid #D1FAE5', padding: '4px 8px', color: '#374151' }}>{row.month}</td>
                            <td style={{ border: '1px solid #D1FAE5', padding: '4px 8px', color: '#059669', textAlign: 'right', fontWeight: 600 }}>
                                {formatFullVND(row[dataKeyes] ?? 0)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Chart;
