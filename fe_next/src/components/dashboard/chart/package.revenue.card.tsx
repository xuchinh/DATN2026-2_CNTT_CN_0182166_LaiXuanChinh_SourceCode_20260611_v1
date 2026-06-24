import { Card } from "antd";
import { handleUser } from "../../rooms/requests/room.requests";
import { handlePackage } from "../../packages/requests/package.requests";
import PackageRevenuePie from "./package.revenue.pie";

const formatFullVND = (value: number): string =>
    `${Math.round(Number(value) || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')} VNĐ`;

const PackageRevenueCard = async () => {
    const [usersRes, packagesRes] = await Promise.all([
        handleUser(),
        handlePackage({ current: 1, pageSize: 999999999 }),
    ]);

    const users = usersRes?.data?.results ?? [];
    const packages = packagesRes?.data?.results ?? [];

    // Gom toàn bộ entry doanh thu từ paymentHistory của mọi user (bất biến, không mất khi chuyển/hủy gói)
    const allEntries = users.flatMap((u: any) =>
        Array.isArray(u.paymentHistory) ? u.paymentHistory : []
    );

    // Doanh thu + số lượt mua theo từng gói (group theo packageId)
    const revenueByPackageId = new Map<string, number>();
    const countByPackageId = new Map<string, number>();
    for (const e of allEntries) {
        const key = String(e.packageId ?? "");
        revenueByPackageId.set(key, (revenueByPackageId.get(key) || 0) + (Number(e.amount) || 0));
        countByPackageId.set(key, (countByPackageId.get(key) || 0) + 1);
    }

    // Tổng doanh thu = toàn bộ entry (kể cả gói đã bị xóa → vẫn cộng vào tổng)
    const totalRevenue = allEntries.reduce(
        (sum: number, e: any) => sum + (Number(e.amount) || 0),
        0
    );

    // Tất cả gói hiện có (kể cả chưa có doanh thu) để hiển thị trong bảng
    const allPackageRevenue = packages.map((pkg: any) => ({
        name: pkg.name || pkg.code || "Gói",
        code: pkg.code || "—",
        value: revenueByPackageId.get(String(pkg._id)) || 0,
        count: countByPackageId.get(String(pkg._id)) || 0,
    }));

    // Pie chỉ hiển thị gói có doanh thu > 0
    const revenueByPackage = allPackageRevenue.filter((p: { value: number }) => p.value > 0);

    return (
        <div className="bg-white shadow rounded p-4 overflow-x-auto">
            <div className="mb-4 flex items-center justify-between">
                <span className="font-bold text-xl ml-2">
                    Doanh thu theo gói đăng ký
                </span>
                <span className="font-semibold text-emerald-700">
                    Tổng: {formatFullVND(totalRevenue)}
                </span>
            </div>

            <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
                {/* Biểu đồ tròn */}
                <div className="flex-1 min-w-0">
                    <PackageRevenuePie data={revenueByPackage} />
                </div>

                {/* Bảng doanh thu chi tiết */}
                <div className="lg:w-[380px] shrink-0">
                    <Card bordered={false} title={<span style={{ color: '#047857', fontWeight: 700 }}>Chi tiết doanh thu từng gói</span>}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                            <thead>
                                <tr style={{ background: '#ECFDF5' }}>
                                    <th style={{ border: '1px solid #A7F3D0', padding: '6px 10px', color: '#047857', textAlign: 'left' }}>Tên gói</th>
                                    <th style={{ border: '1px solid #A7F3D0', padding: '6px 10px', color: '#047857', textAlign: 'center' }}>Mã gói</th>
                                    <th style={{ border: '1px solid #A7F3D0', padding: '6px 10px', color: '#047857', textAlign: 'right' }}>Doanh thu (VNĐ)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {allPackageRevenue.map((row: { name: string; code: string; value: number }, i: number) => (
                                    <tr key={i} style={{ background: i % 2 === 0 ? '#fff' : '#F0FDF4' }}>
                                        <td style={{ border: '1px solid #D1FAE5', padding: '6px 10px', color: '#374151' }}>
                                            {row.name}
                                        </td>
                                        <td style={{ border: '1px solid #D1FAE5', padding: '6px 10px', color: '#374151', textAlign: 'center', fontFamily: 'monospace' }}>
                                            {row.code}
                                        </td>
                                        <td style={{
                                            border: '1px solid #D1FAE5',
                                            padding: '6px 10px',
                                            textAlign: 'right',
                                            fontWeight: 600,
                                            color: row.value > 0 ? '#059669' : '#9CA3AF',
                                        }}>
                                            {formatFullVND(row.value)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr style={{ background: '#ECFDF5' }}>
                                    <td colSpan={2} style={{ border: '1px solid #A7F3D0', padding: '6px 10px', fontWeight: 700, color: '#047857' }}>
                                        Tổng cộng
                                    </td>
                                    <td style={{ border: '1px solid #A7F3D0', padding: '6px 10px', fontWeight: 700, color: '#047857', textAlign: 'right' }}>
                                        {formatFullVND(totalRevenue)}
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default PackageRevenueCard;
