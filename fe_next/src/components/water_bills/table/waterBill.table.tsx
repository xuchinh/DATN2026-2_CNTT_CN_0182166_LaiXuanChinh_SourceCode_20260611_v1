'use client'

import {
    CheckOutlined,
    CloseOutlined,
    DislikeOutlined,
    EditTwoTone,
    LikeOutlined,
    SwapOutlined,
} from '@ant-design/icons';
import {
    Button,
    Input,
    Popconfirm,
    Select,
    Table,
    Tooltip,
} from 'antd';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
    handleBuilding,
    handleConfirmWaterBill,
    handleConfirmWaterBillNotDate,
    handleRoom,
} from '../requests/waterBill.requests';
import dayjs from 'dayjs';
import WasterBillUpdate from './waterBill.update';

const { Option } = Select;

interface IProps {
    waterBills: any;
    meta: {
        current: number;
        pageSize: number;
        pages: number;
        total: number;
    };
}

const WasterBillTable = (props: IProps) => {
    const { waterBills, meta } = props;
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false);
    const [dataUpdate, setDataUpdate] = useState<any>(null);
    const [buildingOptions, setBuildingOptions] = useState<any[]>([]);
    const [roomOptions, setRoomOptions] = useState<any[]>([]);

    const [searchRoom, setSearchRoom] = useState<string | undefined>(undefined);
    const [searchBuilding, setSearchBuilding] = useState<string | undefined>(undefined);
    const [searchStatus, setSearchStatus] = useState<string | undefined>(undefined);
    useEffect(() => {
        const fetchbuildingOptions = async () => {
            const resRoom = await handleRoom();
            const resBuilding = await handleBuilding();
            const resultsBuilding = resBuilding?.data?.results ?? [];
            const resultsRoom = resRoom?.data.results ?? [];

            setBuildingOptions(resultsBuilding);
            setRoomOptions(resultsRoom);
        };
        fetchbuildingOptions();
    }, []);

    const formatCurrency = (value: string | number) =>
        `${Number(value).toLocaleString()} VNĐ`;
    const columns = [
        {
            title: 'STT',
            render: (_: any, record: any, index: any) => {
                return <>{index + 1 + (meta.current - 1) * meta.pageSize}</>;
            },
        },
        {
            title: 'Phòng',
            render: (record: any) => {
                const found = roomOptions.find((f) => f._id === record.roomId);
                return <span>{found?.code || 'Không rõ'}</span>;
            },
        },
        {
            title: 'Nhà',
            render: (record: any) => {
                const found = roomOptions.find((f) => f._id === record.roomId);
                const buildingId = found?.buildingId || 'Không rõ';
                const foundBuilding = buildingOptions.find((d) => d._id === buildingId);
                return <span>{foundBuilding?.name || 'Không rõ'}</span>;
            },
        },
        {
            title: 'Từ ngày',
            render: (record: any) => dayjs(record.fromDate).format('DD/MM/YYYY'),
        },
        {
            title: 'Đến ngày',
            render: (record: any) => dayjs(record.toDate).format('DD/MM/YYYY'),
        },
        {
            title: 'Giá nước',
            dataIndex: 'waterPrice',
            render: formatCurrency
        },
        {
            title: 'Số nước',
            dataIndex: 'amount',
        },
        {
            title: 'Thành tiền',
            dataIndex: 'payment',
            render: formatCurrency
        },
        {
            title: 'Thanh toán',
            render: (record: any) => {
                if (record?.status === '3') {
                    return <Popconfirm
                        placement="leftTop"
                        title={"Hết hạn thanh toán"}
                        description={"Bạn có chắc chắn muốn xác nhận người thuê này đã hết hạn thanh toán ?"}
                        onConfirm={async () => await handleConfirmWaterBillNotDate(record._id, '1')}
                        okText="Xác nhận"
                        cancelText="Hủy"
                    >
                        <Tooltip title="Hết hạn thanh toán">
                            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium cursor-pointer"><CheckOutlined /></span>
                        </Tooltip>
                    </Popconfirm>
                }
                else if (record?.status === '2') return <Popconfirm
                    placement="leftTop"
                    title={"Xác nhận thanh toán"}
                    description={"Bạn có chắc chắn muốn xác nhận người thuê này đã thanh toán ?"}
                    onConfirm={async () => await handleConfirmWaterBillNotDate(record._id, '3')}
                    okText="Xác nhận"
                    cancelText="Hủy"
                >
                    <Tooltip title="Xác nhận đã nhận thanh toán">
                        <span className="px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 cursor-pointer"><SwapOutlined /></span>
                    </Tooltip>
                </Popconfirm>

                else if (record?.status === '1') return <Popconfirm
                    placement="leftTop"
                    title={"Xác nhận đã thanh toán"}
                    description={"Bạn có chắc chắn muốn xác nhận người thuê này đã thanh toán ?"}
                    onConfirm={async () => await handleConfirmWaterBillNotDate(record._id, '2')}
                    okText="Xác nhận"
                    cancelText="Hủy"
                >
                    <Tooltip title="Xác nhận đã thanh toán">
                        <span className="px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800 cursor-pointer"><CloseOutlined /></span>
                    </Tooltip>
                </Popconfirm>
            },
        },
        {
            title: 'Actions',
            render: (text: any, record: any) => {
                return (
                    <>
                        <Tooltip title="Sửa thông tin">
                            <EditTwoTone
                                twoToneColor="#f57800"
                                className="cursor-pointer mx-[5px]"
                                onClick={() => {
                                    setIsUpdateModalOpen(true);
                                    setDataUpdate(record);
                                }}
                            />
                        </Tooltip>
                    </>
                );
            },
        },
    ];

    const onChange = (pagination: any) => {
        const params = new URLSearchParams(searchParams);
        if (pagination && pagination.current) {
            params.set('current', pagination.current);
        }
        if (pagination?.pageSize) {
            params.set('pageSize', pagination.pageSize.toString());
        }
        replace(`${pathname}?${params.toString()}`);
    };
    // Hàm cập nhật params chung
    const updateParams = (newParams: Record<string, any>) => {
        const params = new URLSearchParams(searchParams);

        // set hoặc xóa các params filter
        Object.entries(newParams).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== "") {
                params.set(key, value.toString());
            } else {
                params.delete(key);
            }
        });

        replace(`${pathname}?${params.toString()}`);
    };

    return (
        <>
            <div className="flex justify-between items-center mb-5">
                <span>Danh sách phòng</span>
                <div className="flex gap-4 mb-5">
                    <Select
                        allowClear
                        placeholder="Trạng thái thanh toán"
                        style={{ width: 200 }}
                        value={searchStatus}
                        onChange={(value) => {
                            setSearchStatus(value);
                            updateParams({ status: value });
                        }}
                    >
                        <Option value="true">Đã thanh toán</Option>
                        <Option value="false">Chưa thanh toán</Option>
                    </Select>
                    <Select
                        allowClear
                        placeholder="Chọn nhà"
                        style={{ width: 200 }}
                        value={searchBuilding}
                        onChange={(value) => {
                            setSearchBuilding(value);
                            updateParams({ buildingId: value });
                        }}
                    >
                        {buildingOptions.map((building) => (
                            <Option key={building._id} value={building._id}>
                                {building.name}
                            </Option>
                        ))}
                    </Select>
                    <Input
                        allowClear
                        placeholder="Nhập mã phòng"
                        style={{ width: 200 }}
                        value={searchRoom}
                        onChange={(e) => {
                            setSearchRoom(e.target.value);
                            updateParams({ roomCode: e.target.value });
                        }}
                    />
                </div>
            </div>
            <div className="bg-white shadow rounded p-4 overflow-x-auto h-[calc(100vh-234px)]">
                <Table
                    bordered
                    dataSource={waterBills}
                    columns={columns}
                    rowKey="_id"
                    pagination={{
                        current: meta.current,
                        pageSize: meta.pageSize,
                        showSizeChanger: true,
                        total: meta.total,
                        pageSizeOptions: ['10', '20', '50', '99'],
                        showTotal: (total, range) => (
                            <div>
                                {range[0]}-{range[1]} trên {total} rows
                            </div>
                        ),
                    }}
                    onChange={onChange}
                />
            </div>

            {/* 🛠 Modal cập nhật */}
            <WasterBillUpdate
                isUpdateModalOpen={isUpdateModalOpen}
                setIsUpdateModalOpen={setIsUpdateModalOpen}
                dataUpdate={dataUpdate}
                setDataUpdate={setDataUpdate}
            />
        </>
    );
};

export default WasterBillTable; 
