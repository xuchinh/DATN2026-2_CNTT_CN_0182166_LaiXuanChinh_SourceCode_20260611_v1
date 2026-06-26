'use client'

import { CheckOutlined, CloseOutlined, DeleteTwoTone, DislikeOutlined, EditTwoTone, FileDoneOutlined, FileSearchOutlined, LikeOutlined, SwapOutlined } from "@ant-design/icons";
import { Button, Input, Popconfirm, Select, Table, Tooltip } from "antd"
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { handleBuilding, handleConfirmVehicle, handleDeleteVehicle, handleRoom } from "../requests/vehicles.requests";
import VehicleUpdate from "./vehicles.update";
import { Option } from "antd/es/mentions";
import { handleConfirmVehicleNotDay } from "@/components/users/requests/user.requests";
import { handleUser } from "@/components/rooms/requests/room.requests";
import UserSelect from "@/components/rooms/table/room.user.select";





interface IProps {
    vehicles: any;
    meta: {
        current: number;
        pageSize: number;
        pages: number;
        total: number;
    }
}
const VehicleTable = (props: IProps) => {
    const { vehicles, meta } = props;
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false);
    const [dataUpdate, setDataUpdate] = useState<any>(null);
    const [buildingOptions, setBuildingOptions] = useState<any[]>([]);
    const [roomOptions, setRoomOptions] = useState<any[]>([]);
    const [userOptions, setUserOptions] = useState<any[]>([]);

    const [isSelectUsersModalOpen, setIsSelectUsersModalOpen] = useState<boolean>(false);
    const [dataSelectUser, setDataSelectUser] = useState<any>(null);

    const [searchRoom, setSearchRoom] = useState<string | undefined>(undefined);
    const [searchBuilding, setSearchBuilding] = useState<string | undefined>(undefined);
    const [searchStatus, setSearchStatus] = useState<string | undefined>(undefined);
    const [searchLicensePlate, setSearchLicensePlate] = useState<string | undefined>(undefined);



    useEffect(() => {
        const fetchbuildingOptions = async () => {
            const resRoom = await handleRoom()
            const resBuilding = await handleBuilding();
            const resUser = await handleUser();
            const resultsBuilding = resBuilding?.data?.results ?? [];
            const resultsRoom = resRoom?.data.results ?? [];
            setBuildingOptions(resultsBuilding);
            setRoomOptions(resultsRoom)
            setUserOptions(resUser?.data?.results ?? [])
        };
        fetchbuildingOptions();
    }, []);

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
    const formatCurrency = (value: string | number) => {
        const num = Number(value);
        return `${(Number.isFinite(num) ? num : 0).toLocaleString('vi-VN')} VNĐ`;
    };
    const columns = [
        {
            title: "STT",
            render: (_: any, record: any, index: any) => {
                return (
                    <>{(index + 1) + (meta.current - 1) * (meta.pageSize)}</>
                )
            }
        },
        {
            title: 'Phòng',
            render: (record: any) => {
                const found = roomOptions.find(f => f._id === record.roomId);
                const Code = found?.code || 'Không rõ';

                return <span>{Code}</span>;
            }
        },
        {
            title: 'Nhà',
            render: (record: any) => {
                const found = roomOptions.find(f => f._id === record.roomId);
                const buildingId = found?.buildingId || 'Không rõ';
                const foundBuilding = buildingOptions.find(d => d._id === buildingId)
                const name = foundBuilding?.name || 'không rõ';
                return <span>{name}</span>;
            }
        },
        {
            title: 'Chủ xe',
            render: (record: any) => {
                const room = roomOptions.find(f => f._id === record.roomId);
                const owner = userOptions.find(u => u._id === room?.userId);
                const name = owner?.name || 'Chưa rõ';
                return (
                    <div className="flex items-center">
                        <span>{name}</span>
                        {owner && (
                            <Tooltip title="Xem thông tin chủ xe">
                                <FileSearchOutlined
                                    className="cursor-pointer ml-2"
                                    onClick={() => {
                                        setDataSelectUser(owner);
                                        setIsSelectUsersModalOpen(true);
                                    }}
                                />
                            </Tooltip>
                        )}
                    </div>
                );
            }
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
            title: 'Loại xe',
            dataIndex: 'type',
        },
        {
            title: 'Giá xe',
            dataIndex: 'price',
            render: formatCurrency
        },
        {
            title: 'Biển số xe',
            dataIndex: 'licensePlate',
        },
        {
            title: 'giá gửi xe',
            dataIndex: 'shippingPrice',
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
                        onConfirm={async () => await handleConfirmVehicle(record._id, '1')}
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
                    onConfirm={async () => await handleConfirmVehicleNotDay(record._id, '3')}
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
                    onConfirm={async () => await handleConfirmVehicleNotDay(record._id, '2')}
                    okText="Xác nhận"
                    cancelText="Hủy"
                >
                    <Tooltip title="Xác nhận đã thanh toán">
                        <span className="px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800 cursor-pointer"><CloseOutlined /></span>
                    </Tooltip>
                </Popconfirm>
            }
        },
        {
            title: 'Actions',
            render: (text: any, record: any, index: any) => {
                return (
                    <>
                        <Tooltip title="Sửa thông tin">
                            <EditTwoTone
                                twoToneColor="#f57800" className="cursor-pointer mx-[5px]"
                                onClick={() => {
                                    setIsUpdateModalOpen(true);
                                    setDataUpdate(record);
                                }}
                            />
                        </Tooltip>
                        <Popconfirm
                            className="cursor-pointer mx-[5px]"
                            placement="leftTop"
                            title={"Xác nhận xóa phương tiện"}
                            description={"Bạn có chắc chắn muốn xóa phương tiện này ?"}
                            onConfirm={async () => await handleDeleteVehicle(record?._id)}
                            okText="Xác nhận"
                            cancelText="Hủy"
                        >
                            <span style={{ cursor: "pointer" }}>
                                <DeleteTwoTone twoToneColor="#ff4d4f" />
                            </span>
                        </Popconfirm>
                        {/* {!record.status && (
                            <Popconfirm
                                placement="leftTop"
                                title={"Xác nhận đã thanh toán"}
                                description={"Bạn có chắc chắn muốn xác nhận người thuê này đã thanh toán?"}
                                onConfirm={async () => await handleConfirmVehicle(record._id, true)}
                                okText="Xác nhận"
                                cancelText="Hủy"
                            >
                                <Tooltip title="Xác nhận thanh toán">
                                    <span style={{ cursor: "pointer" }}>
                                        <LikeOutlined twoToneColor="#1890ff" />
                                    </span>
                                </Tooltip>
                            </Popconfirm>
                        )} */}
                        {/* {record.status && (
                            <Popconfirm
                                placement="leftTop"
                                title={"Hết hạn thanh toán"}
                                description={"Bạn có chắc chắn muốn xác nhận người thuê này đã hết hạn thanh toán ?"}
                                onConfirm={async () => await handleConfirmVehicle(record._id, '1')}
                                okText="Xác nhận"
                                cancelText="Hủy"
                            >
                                <Tooltip title="Hết hạn thanh toán">
                                    <span style={{ cursor: "pointer" }}>
                                        <DislikeOutlined twoToneColor="#1890ff" />
                                    </span>
                                </Tooltip>
                            </Popconfirm>
                        )} */}
                    </>
                )
            }
        }
    ];

    const onChange = (pagination: any, filters: any, sorter: any, extra: any) => {
        const params = new URLSearchParams(searchParams);
        if (pagination && pagination.current) {
            params.set('current', pagination.current);
        }
        if (pagination?.pageSize) {
            params.set('pageSize', pagination.pageSize.toString());
        }
        replace(`${pathname}?${params.toString()}`);
    };

    // const filteredData = vehicles.filter((vehicle: any) => {
    //     const room = roomOptions.find((room) => room._id === vehicle.roomId);

    //     const buildingMatch = searchBuilding ? room?.buildingId === searchBuilding : true;
    //     const roomMatch = searchRoom
    //         ? room?.code?.toLowerCase().includes(searchRoom.toLowerCase())
    //         : true;

    //     const statusMatch = searchStatus !== undefined
    //         ? vehicle.status === (searchStatus === 'true')
    //         : true;

    //     const licensePlateMatch = !searchLicensePlate || vehicle.licensePlate?.toLowerCase().includes(searchLicensePlate.toLowerCase());
    //     return buildingMatch && roomMatch && statusMatch && licensePlateMatch;
    // });
    return (
        <>
            <div
                className="flex flex-col gap-3 mb-5"
            >
                <span>Danh sách phương tiện</span>
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
                        <Option value="1">Chưa thanh toán</Option>
                        <Option value='2'>Đang chờ xác nhận</Option>
                        <Option value='3'>Đã thanh toán</Option>
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
                    <Input
                        allowClear
                        placeholder="Nhập mã biển số xe"
                        style={{ width: 200 }}
                        value={searchLicensePlate}
                        onChange={(e) => {
                            setSearchLicensePlate(e.target.value);
                            updateParams({ search: e.target.value });
                        }}
                    />
                </div>
            </div>
            <div
                className="bg-white shadow rounded p-4 overflow-x-auto h-[calc(100vh-234px)] "
            >
                <Table
                    bordered
                    dataSource={vehicles}
                    columns={columns}
                    rowKey={"_id"}
                    scroll={{ x: 'max-content' }}
                    pagination={
                        {
                            current: meta.current,
                            pageSize: meta.pageSize,
                            showSizeChanger: true,
                            total: meta.total,
                            pageSizeOptions: ['10', '20', '50', '99'],
                            showTotal: (total, range) => { return (<div> {range[0]}-{range[1]} trên {total} rows</div>) }
                        }
                    }
                    onChange={onChange}
                />
            </div>

            <VehicleUpdate
                isUpdateModalOpen={isUpdateModalOpen}
                setIsUpdateModalOpen={setIsUpdateModalOpen}
                dataUpdate={dataUpdate}
                setDataUpdate={setDataUpdate}
            />

            <UserSelect
                isSelectModalOpen={isSelectUsersModalOpen}
                setIsSelectModalOpen={setIsSelectUsersModalOpen}
                dataSelect={dataSelectUser}
                setDataSelect={setDataSelectUser}
            />
        </>
    )
}

export default VehicleTable;