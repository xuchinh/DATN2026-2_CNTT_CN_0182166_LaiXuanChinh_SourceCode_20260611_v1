'use client'

import { CheckOutlined, CloseOutlined, DeleteTwoTone, DislikeOutlined, EditTwoTone, FileDoneOutlined, FileSearchOutlined, LikeOutlined, SwapOutlined } from "@ant-design/icons";
import { Button, Input, Popconfirm, Select, Table, Tooltip } from "antd"
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from "react";
import { handleBuilding, handleConfirmPaymen, handleConfirmPaymenNoupdateIncome, handleConfirmRoom, handleDeleteRoom, handleUpdateRoom, handleUser } from "../requests/room.requests";
import RoomCreate from "./room.create";
import RoomUpdate from "./room.update";
import dayjs from "dayjs";
import { tree } from "next/dist/build/templates/app-page";
import RoomSelect from "./room.select";
import { Option } from "antd/es/mentions";
import { handleUserById } from "@/components/users/requests/user.requests";
import UserSelect from "./room.user.select";




interface IProps {
    rooms: any;
    meta: {
        current: number;
        pageSize: number;
        pages: number;
        total: number;
    }
}
const RoomTable = (props: IProps) => {
    const { rooms, meta } = props;
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false);
    const [dataUpdate, setDataUpdate] = useState<any>(null);
    const [buildingOptions, setBuildingOptions] = useState<any[]>([]);
    const [userOptions, setUserOptions] = useState<any[]>([]);

    const [isSelectModalOpen, setIsSelectModalOpen] = useState<boolean>(false);
    const [dataSelect, setDataSelect] = useState<any>(null);

    const [searchRoom, setSearchRoom] = useState<string | undefined>(undefined);
    const [searchBuilding, setSearchBuilding] = useState<string | undefined>(undefined);
    const [searchStatus, setSearchStatus] = useState<string | undefined>(undefined);
    const [searchStatusPayment, setSearchStatusPayment] = useState<string | undefined>(undefined);

    const [isSelectUsersModalOpen, setIsSelectUsersModalOpen] = useState<boolean>(false);
    const [dataSelectUser, setDataSelectUser] = useState<any>(null);
    const formatCurrency = (value: string | number) =>
        `${Number(value).toLocaleString()} VNĐ`;
    useEffect(() => {
        const fetchbuildingOptions = async () => {
            const resUser = await handleUser()
            const resBuilding = await handleBuilding();
            const resultsBuilding = resBuilding?.data?.results ?? [];
            const resultsUser = resUser?.data.results ?? [];

            setBuildingOptions(resultsBuilding);
            setUserOptions(resultsUser)
        };
        fetchbuildingOptions();

        const checkAndUpdateExpiredRooms = async () => {
            const today = dayjs(); // Ngày hiện tại

            for (const room of rooms) {
                const toDate = dayjs(room.toDate); // Chuyển toDate của phòng về kiểu ngày
                const paymentsDate = dayjs(room.paymentsDate);
                // Nếu ngày hết hạn nhỏ hơn hôm nay => đã hết hạn
                if (toDate.isBefore(today, 'day')) {
                    //Nếu trạng thái phòng chưa đúng thì mới gọi cập nhật
                    if (
                        room.status !== false ||
                        room.statusPayment !== false ||
                        room.totalMonth !== 0
                    ) {
                        // Gọi API cập nhật vào backend
                        await handleUpdateRoom({
                            _id: room._id, // ID phòng cần cập nhật
                            status: false, // Trạng thái: Không còn thuê
                            statusPayment: false, // Chưa thanh toán
                            totalMonth: 0, // Số tháng thuê = 0
                        });
                    }
                }
            }
        };

        checkAndUpdateExpiredRooms();
    }, []);
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
            title: 'Mã phòng',
            dataIndex: 'code',
        },
        {
            title: 'Giá',
            dataIndex: 'price',
            render: formatCurrency,
        },
        {
            title: 'Nhà',
            render: (record: any) => {
                const found = buildingOptions.find(f => f._id === record.buildingId);
                const name = found?.name || 'Không rõ';

                return <span>{name}</span>;
            }
        },
        {
            title: 'Người  thuê',
            render: (record: any) => {
                const found = userOptions.find(f => f._id === record.userId);
                const name = found?.name || 'Chưa thuê';

                return <span>{name}</span>;
            }
        },
        {
            title: 'Ngày thuê',
            render: (record: any) =>
                record.fromDate ? dayjs(record.fromDate).format('DD/MM/YYYY') : '',
        },
        {
            title: 'Ngày hết hạn',
            render: (record: any) =>
                record.toDate ? dayjs(record.toDate).format('DD/MM/YYYY') : '',
        },
        {
            title: 'Số tháng',
            dataIndex: 'totalMonth',
        },
        {
            title: 'Tiền cọc',
            dataIndex: 'payment',
            render: formatCurrency,

        },
        {
            title: 'Ngày nộp tiền trọ',
            render: (record: any) =>
                record.toDate ? dayjs(record.paymentsDate).format('DD/MM/YYYY') : "",
        },
        {
            title: 'Người thuê',
            render: (record: any) => {
                const found = userOptions.find(f => f._id === record.userId);
                const name = found?.name || 'Chưa thuê';

                return (
                    <div className="flex items-center">
                        <span>{name}</span>
                        {found?.name && (
                            <Tooltip title="Xem thông tin người thuê">
                                <FileSearchOutlined
                                    className="cursor-pointer ml-2"
                                    onClick={async () => {
                                        const user = await handleUserById(record.userId);
                                        setDataSelectUser(user?.data?.results[0]);
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
            title: 'Thanh toán',
            render: (record: any) => {
                if (record?.statusPayment === '3') {
                    return <Popconfirm
                        placement="leftTop"
                        title={"Hết hạn thanh toán"}
                        description={"Bạn có chắc chắn muốn xác nhận người thuê này đã hết hạn thanh toán ?"}
                        onConfirm={async () => await handleConfirmPaymenNoupdateIncome(record._id, '1')}
                        okText="Xác nhận"
                        cancelText="Hủy"
                    >
                        <Tooltip title="Hết hạn thanh toán">
                            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium cursor-pointer"><CheckOutlined /></span>
                        </Tooltip>
                    </Popconfirm>
                }
                else if (record?.statusPayment === '2') {
                    return <Popconfirm
                        placement="leftTop"
                        title={"Xác nhận thanh toán"}
                        description={"Bạn có chắc chắn muốn xác nhận người thuê này đã thanh toán ?"}
                        onConfirm={async () => await handleConfirmPaymen(record._id, '3', record.buildingId)}
                        okText="Xác nhận"
                        cancelText="Hủy"
                    >
                        <Tooltip title="Xác nhận đã nhận thanh toán">
                            <span className="px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 cursor-pointer"><SwapOutlined /></span>
                        </Tooltip>
                    </Popconfirm>
                }
                else if (record?.statusPayment === '1') {
                    return <Popconfirm
                        placement="leftTop"
                        title={"Xác nhận đã thanh toán"}
                        description={"Bạn có chắc chắn muốn xác nhận người thuê này đã thanh toán ?"}
                        onConfirm={async () => await handleConfirmPaymenNoupdateIncome(record._id, '2')}
                        okText="Xác nhận"
                        cancelText="Hủy"
                    >
                        <Tooltip title="Xác nhận đã thanh toán">
                            <span className="px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800 cursor-pointer"><CloseOutlined /></span>
                        </Tooltip>
                    </Popconfirm>
                }
                // if (record?.statusPayment === true) {
                //     return <>
                //         <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium "><CheckOutlined /></span>
                //         <Popconfirm
                //             className="ml-[5px]"
                //             placement="leftTop"
                //             title={"Xác nhận chưa thanh toán"}
                //             description={"Bạn có chắc chắn muốn xác nhận người thuê này chưa thanh toán ?"}
                //             onConfirm={async () => await handleConfirmPaymen(record._id, false, record.buildingId)}
                //             okText="Xác nhận"
                //             cancelText="Hủy"
                //         >
                //             <Tooltip title="Xác nhận chưa thanh toán thuê">
                //                 <span style={{ cursor: "pointer" }}>
                //                     <DislikeOutlined twoToneColor="#1890ff" />
                //                 </span>
                //             </Tooltip>
                //         </Popconfirm>
                //     </>
                // }
                // else return <><span className="px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800"><CloseOutlined /></span>
                // </>
            }
        },
        {
            title: 'Đang thuê',
            render: (record: any) => {

                if (record?.status === true) {
                    return <Popconfirm
                        placement="leftTop"
                        title={"Xác nhận hết hạn thuê"}
                        description={"Bạn có chắc chắn muốn xác nhận người thuê này đã hết hạn ?"}
                        onConfirm={async () => await handleConfirmRoom(record._id, false, record.buildingId)}
                        okText="Xác nhận"
                        cancelText="Hủy"
                    >
                        <Tooltip title="Xác nhận hết hạn thuê">
                            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium cursor-pointer "><CheckOutlined /></span>
                        </Tooltip>
                    </Popconfirm>

                }
                else return <Popconfirm
                    placement="leftTop"
                    title={"Xác nhận người thuê này"}
                    description={"Bạn có chắc chắn muốn xác nhận người thuê này ?"}
                    onConfirm={async () => await handleConfirmRoom(record._id, true, record.buildingId)}
                    okText="Xác nhận"
                    cancelText="Hủy"
                >
                    <Tooltip title="Xác nhận người thuê">
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
                        <Tooltip title="Xem thông tin chi tiết">
                            <FileDoneOutlined
                                className="cursor-pointer mx-[5px]"
                                onClick={() => {
                                    setIsSelectModalOpen(true);
                                    setDataSelect(record); // Truyền dữ liệu phòng vào
                                }}
                            />
                        </Tooltip>
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
                            title="Xác nhận xóa phòng"
                            description="Bạn có chắc chắn muốn xóa phòng này?"
                            onConfirm={async () => await handleDeleteRoom(record?._id, record.buildingId)}
                            okText="Xác nhận"
                            cancelText="Hủy"
                        >
                            <Tooltip title="Xóa phòng">
                                <span style={{ cursor: "pointer" }}>
                                    <DeleteTwoTone twoToneColor="#ff4d4f" />
                                </span>
                            </Tooltip>
                        </Popconfirm>
                        {/* {!record.status && (
                            <Popconfirm
                                placement="leftTop"
                                title={"Xác nhận người thuê này"}
                                description={"Bạn có chắc chắn muốn xác nhận người thuê này ?"}
                                onConfirm={async () => await handleConfirmRoom(record._id, true, record.buildingId)}
                                okText="Xác nhận"
                                cancelText="Hủy"
                            >
                                <Tooltip title="Xác nhận người thuê">
                                    <span style={{ cursor: "pointer" }}>
                                        <LikeOutlined twoToneColor="#1890ff" />
                                    </span>
                                </Tooltip>
                            </Popconfirm>
                        )}
                        {record.status && (
                            <Popconfirm
                                placement="leftTop"
                                title={"Xác nhận hết hạn thuê"}
                                description={"Bạn có chắc chắn muốn xác nhận người thuê này đã hết hạn ?"}
                                onConfirm={async () => await handleConfirmRoom(record._id, false, record.buildingId)}
                                okText="Xác nhận"
                                cancelText="Hủy"
                            >
                                <Tooltip title="Xác nhận hết hạn thuê">
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
            <div
                className="flex justify-between items-center mb-5"
            >
                <span>Danh sách phòng</span>
                <div className="flex gap-4 mb-5">
                    <Select
                        allowClear
                        placeholder="Trạng thái phòng"
                        style={{ width: 200 }}
                        value={searchStatus}
                        onChange={(value) => {
                            setSearchStatus(value);
                            updateParams({ status: value });
                        }}
                    >
                        <Option value="true">Đã thuê</Option>
                        <Option value="false">Chưa thuê</Option>
                    </Select>

                    <Select
                        allowClear
                        placeholder="Trạng thái thanh toán phòng"
                        style={{ width: 200 }}
                        value={searchStatusPayment}
                        onChange={(value) => {
                            setSearchStatusPayment(value);
                            updateParams({ statusPayment: value });
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
                            updateParams({ search: e.target.value });
                        }}
                    />
                    <Button onClick={() => setIsCreateModalOpen(true)}>Thêm phòng</Button>
                </div>

            </div>
            <div
                className="bg-white shadow rounded p-4 overflow-x-auto h-[calc(100vh-234px)] "
            >
                <Table
                    bordered
                    dataSource={rooms}
                    columns={columns}
                    rowKey={"_id"}
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
            <RoomCreate
                isCreateModalOpen={isCreateModalOpen}
                setIsCreateModalOpen={setIsCreateModalOpen}
            />

            <RoomUpdate
                isUpdateModalOpen={isUpdateModalOpen}
                setIsUpdateModalOpen={setIsUpdateModalOpen}
                dataUpdate={dataUpdate}
                setDataUpdate={setDataUpdate}
            />
            <RoomSelect
                isSelectModalOpen={isSelectModalOpen}
                setIsSelectModalOpen={setIsSelectModalOpen}
                dataSelect={dataSelect}
                setDataSelect={setDataSelect}
            />
            <UserSelect
                isSelectModalOpen={isSelectUsersModalOpen}
                setIsSelectModalOpen={setIsSelectUsersModalOpen}
                dataSelect={dataSelectUser} // Truyền dữ liệu người thuê vào
                setDataSelect={setDataSelectUser}
            />
        </>
    )
}

export default RoomTable;