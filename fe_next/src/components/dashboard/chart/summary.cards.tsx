import {
    fetchElectricityStatistics,
    fetchIncomeStatistics,
    fetchVehiclesStatistics,
    fetchWaterStatistics,
} from '@/components/buildings/requests/building.requests';

const formatFullVND = (value: number): string =>
    `${Math.round(Number(value) || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')} VNĐ`;

// Lấy tổng tháng hiện tại (phần tử cuối mảng) của tất cả nhà
const sumCurrentMonth = (data: any[], key: string): number =>
    data.reduce((total, building) => {
        const last = building.incomeData?.[building.incomeData.length - 1];
        return total + (Number(last?.[key]) || 0);
    }, 0);

const SummaryCards = async () => {
    const [incomeRes, waterRes, electricityRes, vehiclesRes] = await Promise.all([
        fetchIncomeStatistics(),
        fetchWaterStatistics(),
        fetchElectricityStatistics(),
        fetchVehiclesStatistics(),
    ]);

    const totalRoom        = sumCurrentMonth(incomeRes,       'income');
    const totalWater       = sumCurrentMonth(waterRes,        'incomeWater');
    const totalElectricity = sumCurrentMonth(electricityRes,  'incomeElectricity');
    const totalVehicles    = sumCurrentMonth(vehiclesRes,     'incomeVehicle');
    const grandTotal       = totalRoom + totalWater + totalElectricity + totalVehicles;

    const cards = [
        { label: 'Tiền phòng',  value: totalRoom,        color: '#059669', bg: '#ECFDF5', border: '#A7F3D0', icon: '🏠' },
        { label: 'Tiền nước',   value: totalWater,       color: '#0284C7', bg: '#F0F9FF', border: '#BAE6FD', icon: '💧' },
        { label: 'Tiền điện',   value: totalElectricity, color: '#D97706', bg: '#FFFBEB', border: '#FDE68A', icon: '⚡' },
        { label: 'Phí gửi xe',  value: totalVehicles,    color: '#7C3AED', bg: '#F5F3FF', border: '#DDD6FE', icon: '🚗' },
    ];

    return (
        <div className="mb-6">
            {/* 4 thẻ nhỏ */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                {cards.map((card) => (
                    <div
                        key={card.label}
                        style={{
                            background: card.bg,
                            border: `1px solid ${card.border}`,
                            borderRadius: 12,
                            padding: '16px 20px',
                        }}
                    >
                        <div style={{ fontSize: 24 }}>{card.icon}</div>
                        <div style={{ color: '#6B7280', fontSize: 12, marginTop: 6 }}>
                            {card.label} — tháng này
                        </div>
                        <div style={{ color: card.color, fontWeight: 700, fontSize: 15, marginTop: 4 }}>
                            {formatFullVND(card.value)}
                        </div>
                    </div>
                ))}
            </div>

            {/* Thẻ tổng nổi bật */}
            <div
                style={{
                    background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                    borderRadius: 12,
                    padding: '18px 28px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    color: '#fff',
                }}
            >
                <div>
                    <div style={{ fontSize: 13, opacity: 0.85 }}>
                        Tổng doanh thu tháng này (tiền phòng + nước + điện + xe)
                    </div>
                    <div style={{ fontSize: 26, fontWeight: 700, marginTop: 4, letterSpacing: 0.5 }}>
                        {formatFullVND(grandTotal)}
                    </div>
                </div>
                <div style={{ textAlign: 'right', fontSize: 12, opacity: 0.75 }}>
                    <div>Phòng: {formatFullVND(totalRoom)}</div>
                    <div>Nước: {formatFullVND(totalWater)}</div>
                    <div>Điện: {formatFullVND(totalElectricity)}</div>
                    <div>Xe: {formatFullVND(totalVehicles)}</div>
                </div>
            </div>
        </div>
    );
};

export default SummaryCards;
