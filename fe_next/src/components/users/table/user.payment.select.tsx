'use client';

import { Modal, Row, Col, Spin, Table, Button, Space, Popconfirm, Tooltip } from 'antd';
import { useEffect, useState } from 'react';
import {
    handleBuilfingUser,
    handleConfirmPaymenElectricityBillUser,
    handleConfirmPaymenRoomUser,
    handleConfirmPaymenWaterBillUser,
    handleConfirmVehicle,
    handleConfirmVehicleNotDay,
    handleElectricityBill,
    handleRoom,
    handleVehicle,
    handleWaterBill
} from '../requests/user.requests';
import dayjs from 'dayjs';
import { CheckOutlined, CloseOutlined, DeleteTwoTone, LikeOutlined, SwapOutlined } from '@ant-design/icons';
import { handleDeleteVehicle } from '@/components/vehicles/requests/vehicles.requests';
import VehicleCreate from '@/components/vehicles/table/vehicles.create';
import { handleConfirmRoom, handleUpdateRoom, handleUser } from '@/components/rooms/requests/room.requests';
import moment from "moment";
import { handleAllBuilding, handleBuilding } from '@/components/water_bills/requests/waterBill.requests';
interface IProps {
    isSelectModalOpen: boolean;
    setIsSelectModalOpen: (v: boolean) => void;
    dataSelect: any;
    session: any;
}

const UserPaymentSelect = ({ isSelectModalOpen, setIsSelectModalOpen, dataSelect, session }: IProps) => {
    const [loading, setLoading] = useState(false);
    const [UserPaymentData, setUserPaymentData] = useState<any>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
    const [roomoptions, setRoomoptions] = useState<any[]>([]);
    const [waterBilloptions, setWaterBilloptions] = useState<any[]>([]);
    const [electricityBilloptions, setElectricityBilloptions] = useState<any[]>([]);
    const [vehiclesoptions, setVehiclesoptions] = useState<any[]>([]);
    const [buildingOptions, setBuildingOptions] = useState<any[]>([]);
    const [adminOptions, setAdminOptions] = useState<any[]>([]);
    const [isExtending, setIsExtending] = useState(false);
    const [extendMonths, setExtendMonths] = useState<number>(0);

    useEffect(() => {
        if (isSelectModalOpen && dataSelect) {
            setUserPaymentData(dataSelect);
            fetchAllData();
        }
    }, [isSelectModalOpen, dataSelect]);

    const fetchAllData = async () => {
        setLoading(true);
        try {
            const [
                ,
                resRoom,
                resWaterBill,
                resElectricityBill,
                resVehicle,
                resBuilding,
                resAdmin,
            ] = await Promise.all([
                handleBuilfingUser(),
                handleRoom(),
                handleWaterBill(),
                handleElectricityBill(),
                handleVehicle(),
                handleAllBuilding(),
                handleUser()
            ]);

            setRoomoptions(resRoom?.data?.results ?? []);
            setWaterBilloptions(resWaterBill?.data?.results ?? []);
            setElectricityBilloptions(resElectricityBill?.data?.results ?? []);
            setVehiclesoptions(resVehicle?.data?.results ?? []);
            setBuildingOptions(resBuilding?.data?.results ?? [])
            setAdminOptions(resAdmin?.data?.results ?? [])
        } catch (error) {
            console.error('Lỗi khi fetch dữ liệu:', error);
        } finally {
            setLoading(false);
        }
    };

    const selectedRoom = roomoptions.find(r => r.userId === UserPaymentData?._id);
    const selectedVehicles = vehiclesoptions.filter(v => v.roomId === selectedRoom?._id && v.userId === session?.data?.results?.[0]._id);
    const selectedBuilding = buildingOptions.filter(bd => bd._id === selectedRoom?.buildingId);
    const building = selectedBuilding[0];
    const selectedAdmin = adminOptions.filter(a => a._id === building?.userId);
    const admin = selectedAdmin[0]
    const selectedWaterBills = waterBilloptions.filter(wb => wb.roomId === selectedRoom?._id);
    const selectedElectricBills = electricityBilloptions.filter(eb => eb.roomId === selectedRoom?._id);

    const formatCurrency = (value: string | number) =>
        `${Number(value).toLocaleString()} VNĐ`;

    const dateFormat = (date: string) => dayjs(date).format('DD/MM/YYYY');

    const vehicleColumns = [
        { title: 'Loại xe', dataIndex: 'type', key: 'type' },
        { title: 'Giá tiền', dataIndex: 'price', key: 'price', render: formatCurrency },
        { title: 'Từ ngày', dataIndex: 'fromDate', key: 'fromDate', render: dateFormat },
        { title: 'Đến ngày', dataIndex: 'toDate', key: 'toDate', render: (d: string) => d ? dateFormat(d) : '-' },
        { title: 'Giá gửi xe', dataIndex: 'shippingPrice', key: 'shippingPrice', render: formatCurrency },
        {
            title: 'Thanh toán',
            render: (record: any) => {

                if (record?.status === '3') return <Tooltip title="Đã xác nhận thanh toán">
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium "><CheckOutlined /></span>
                </Tooltip>
                else if (record?.status === '2') return <Tooltip title="Đã thanh toán đang chờ chủ trọ xác nhận">
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800"><SwapOutlined /></span>
                </Tooltip>
                else if (record?.status === '1') return <Popconfirm
                    placement="leftTop"
                    title={"Xác nhận đã thanh toán"}
                    description={"Bạn có chắc chắn là đã thanh toán?"}
                    onConfirm={async () => {
                        const res = await handleConfirmVehicleNotDay(record?._id, '2');
                        if (res?.statusCode === 200) {
                            console.log("Thanh toán thành công");
                            fetchAllData();
                        }
                    }}
                    okText="Xác nhận"
                    cancelText="Hủy"
                >
                    <Tooltip title="Xác nhận thanh toán">
                        <span className="px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800 cursor-pointer"><CloseOutlined /></span>
                    </Tooltip>
                </Popconfirm>
            }
        },
        {
            title: 'Hành động', key: 'action', render: (_: any, record: any) => (
                <>
                    <Tooltip title="Bạn muốn xóa phương tiện này">
                        <Popconfirm
                            className="cursor-pointer mx-[5px]"
                            placement="leftTop"
                            title={"Xác nhận xóa phương tiện"}
                            description={"Bạn có chắc chắn muốn xóa phương tiện này ?"}
                            onConfirm={async () => {
                                const res = await handleDeleteVehicle(record?._id);
                                if (res?.statusCode === 200) {
                                    console.log("Xóa phương tiện thành công");
                                    fetchAllData();
                                }
                            }}
                            okText="Xác nhận"
                            cancelText="Hủy"
                        >
                            <span style={{ cursor: "pointer" }}>
                                <DeleteTwoTone twoToneColor="#ff4d4f" />
                            </span>
                        </Popconfirm>
                    </Tooltip>
                    {!record.status && (
                        <Popconfirm
                            placement="leftTop"
                            title={"Xác nhận đã thanh toán"}
                            description={"Bạn có chắc chắn là đã thanh toán?"}
                            onConfirm={async () => {
                                const res = await handleConfirmVehicle(record?._id, '2');
                                if (res?.statusCode === 200) {
                                    console.log("Thanh toán thành công");
                                    fetchAllData();
                                }
                            }}
                            okText="Xác nhận"
                            cancelText="Hủy"
                        >
                            <Tooltip title="Xác nhận thanh toán">
                                <span style={{ cursor: "pointer" }}>
                                    <LikeOutlined twoToneColor="#1890ff" />
                                </span>
                            </Tooltip>
                        </Popconfirm>
                    )}
                </>
            )
        }
    ];

    const waterBillColumns = [
        { title: 'Số nươc', dataIndex: 'amount', key: 'amount' },
        { title: 'Giá nước', dataIndex: 'waterPrice', key: 'waterPrice', render: formatCurrency },
        { title: 'Từ ngày', dataIndex: 'fromDate', key: 'fromDate', render: dateFormat },
        { title: 'Đến ngày', dataIndex: 'toDate', key: 'toDate', render: dateFormat },
        { title: 'Thành tiền', dataIndex: 'payment', key: 'payment', render: formatCurrency },
        {
            title: 'Thanh toán',
            render: (record: any) => {

                if (record?.status === "3") return <Tooltip title="Đã xác nhận thanh toán">
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium "><CheckOutlined /></span>
                </Tooltip>
                else if (record?.status === '2') return <Tooltip title="Đã thanh toán đang chờ chủ trọ xác nhận">
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800"><SwapOutlined /></span>
                </Tooltip>
                else if (record?.status === '1') return <Popconfirm
                    placement="leftTop"
                    title={"Xác nhận đã thanh toán"}
                    description={"Bạn có chắc chắn là đã thanh toán?"}
                    onConfirm={async () => {
                        const res = await handleConfirmPaymenWaterBillUser(record?._id, '2');
                        if (res?.statusCode === 200) {
                            console.log("Thanh toán thành công");
                            fetchAllData();
                        }
                    }}
                    okText="Xác nhận"
                    cancelText="Hủy"
                >
                    <Tooltip title="Xác nhận thanh toán">
                        <span className="px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800 cursor-pointer"><CloseOutlined /></span>
                    </Tooltip>
                </Popconfirm>
            }
        },
    ];

    // Columns cho Electricity Bill
    const electricityBillColumns = [
        { title: 'Số nước', dataIndex: 'amount', key: 'amount' },
        { title: 'Giá điện', dataIndex: 'eletricPrice', key: 'eletricPrice', render: formatCurrency },
        { title: 'Từ ngày', dataIndex: 'fromDate', key: 'fromDate', render: dateFormat },
        { title: 'Đến ngày', dataIndex: 'toDate', key: 'toDate', render: dateFormat },
        { title: 'Thành tiền', dataIndex: 'payment', key: 'payment', render: formatCurrency },
        {
            title: 'Thanh toán',
            render: (record: any) => {


                if (record?.status === "3") return <Tooltip title="Đã xác nhận thanh toán">
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium "><CheckOutlined /></span>
                </Tooltip>
                else if (record?.status === '2') return <Tooltip title="Đã thanh toán đang chờ chủ trọ xác nhận">
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800"><SwapOutlined /></span>
                </Tooltip>
                else if (record?.status === '1') return <Popconfirm
                    placement="leftTop"
                    title={"Xác nhận đã thanh toán"}
                    description={"Bạn có chắc chắn là đã thanh toán?"}
                    onConfirm={async () => {
                        const res = await handleConfirmPaymenElectricityBillUser(record?._id, '2');
                        if (res?.statusCode === 200) {
                            console.log("Thanh toán thành công");
                            fetchAllData();
                        }
                    }}
                    okText="Xác nhận"
                    cancelText="Hủy"
                >
                    <Tooltip title="Xác nhận thanh toán">
                        <span className="px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800 cursor-pointer"><CloseOutlined /></span>
                    </Tooltip>
                </Popconfirm>
            }
        },
    ];

    const handleCloseSelectModal = () => {
        setUserPaymentData(null);
        setIsSelectModalOpen(false);
    };

    return (
        <Modal
            title="Thông tin chi tiết về các khoản mà người dùng cần đóng"
            open={isSelectModalOpen}
            onOk={handleCloseSelectModal}
            onCancel={handleCloseSelectModal}
            okText="Đóng"
            cancelButtonProps={{ style: { display: 'none' } }}
            maskClosable={false}
            width={900}
        >
            {loading ? (
                <Spin tip="Đang tải dữ liệu..." />
            ) : (
                UserPaymentData && (
                    <>
                        <Row gutter={[15, 15]}>
                            <Col span={24}><strong>Tên người dùng:</strong> {UserPaymentData.name}</Col>
                            <Col span={24}><strong>Email:</strong> {UserPaymentData.email}</Col>
                            <Col span={24}><strong>Số điện thoại:</strong> {UserPaymentData.phone}</Col>
                            {(selectedRoom && (selectedRoom?.statusPayment === '3' || selectedRoom.status === true)) && (<Col span={24} md={12}><strong>Nhà trọ đang thuê:</strong> {building?.name || 'Không xác định'}</Col>)}
                            {(selectedRoom && (selectedRoom?.statusPayment === '3' || selectedRoom.status === true)) && (
                                <Col span={24} md={12}><strong>Địa chỉ:</strong> {building?.address || 'Không xác định'}</Col>)}
                            <Col span={24} md={8}><strong>Phòng đang thuê:</strong> {selectedRoom?.code || 'Không xác định'}</Col>
                            <Col span={24} md={8}><strong>Giá phòng:</strong> {formatCurrency(selectedRoom?.price) || 'Không xác định'}</Col>

                            {(selectedRoom && (selectedRoom?.statusPayment === '3' || selectedRoom.status === true)) && (
                                <Col span={24} md={8}>
                                    <strong>Đã cọc:</strong>{" "}{formatCurrency(selectedRoom?.payment) || '0'}</Col>
                            )}

                            {(selectedRoom && (selectedRoom?.statusPayment === '3' && selectedRoom.status === true)) && (
                                <Col span={24} md={8}>
                                    <strong>Thanh toán:</strong>{" "}Đã xác nhận thanh toán</Col>
                            )}
                            {(selectedRoom && (selectedRoom?.statusPayment === '2' && selectedRoom.status === true)) && (
                                <Col span={24} md={8}>
                                    <strong>Thanh toán:</strong>{" "}Đang chờ xác nhận thanh toán</Col>
                            )}
                            {(selectedRoom && (selectedRoom?.statusPayment === '1' && selectedRoom.status === true)) && (
                                <Col span={24} md={8}>
                                    <strong>Thanh toán:</strong>{" "}Chưa thanh toán</Col>
                            )}
                            {(selectedRoom && (selectedRoom?.statusPayment === '1' && selectedRoom.status === true)) && (
                                <Col span={24} md={8}>
                                    <div className="flex items-center gap-2">
                                        <strong>Xác nhận thanh toán tiền trọ:</strong>
                                        <Button
                                            type="primary"
                                            onClick={async () => {
                                                const res = await handleConfirmPaymenRoomUser(
                                                    selectedRoom._id,
                                                    '2',
                                                    selectedRoom.buildingId
                                                );
                                                if (res?.statusCode === 200) {
                                                    console.log("Thanh toán tiền trọ thành công");
                                                    fetchAllData();
                                                }
                                            }}
                                        >
                                            Xác nhận
                                        </Button>
                                    </div>
                                </Col>
                            )}
                            {(selectedRoom && (selectedRoom?.statusPayment === '3' && selectedRoom.status === true)) && (
                                <Col span={24} md={8}>
                                    <strong>Từ ngày:</strong> {moment(selectedRoom.fromDate).format('DD/MM/YYYY')}
                                </Col>
                            )}
                            {(selectedRoom && (selectedRoom?.statusPayment === '3' && selectedRoom.status === true)) && (

                                <Col span={24} md={8}>
                                    <strong>Đến ngày:</strong> {moment(selectedRoom.toDate).format('DD/MM/YYYY')}
                                </Col>
                            )}
                            {(selectedRoom && (selectedRoom?.statusPayment === '3' && selectedRoom.status === true)) && (

                                <Col span={24}>
                                    {!isExtending ? (
                                        <Button type="primary" onClick={() => setIsExtending(true)}>Gia hạn</Button>
                                    ) : (
                                        <div className="flex gap-2">
                                            <input
                                                type="number"
                                                min={1}
                                                value={extendMonths}
                                                onChange={(e) => setExtendMonths(Number(e.target.value))}
                                                placeholder="Số tháng"
                                                style={{ width: '100px' }}
                                            />
                                            <Button
                                                type="primary"
                                                onClick={async () => {
                                                    if (!extendMonths || extendMonths <= 0) return;
                                                    const res = await handleUpdateRoom({
                                                        _id: selectedRoom._id,
                                                        buildingId: selectedRoom.buildingId,
                                                        totalMonth: (Number(selectedRoom.totalMonth) || 0) + extendMonths,
                                                        toDate: moment(selectedRoom.toDate).add(extendMonths, 'months').toISOString(),
                                                    });
                                                    if (res?.statusCode === 200) {
                                                        fetchAllData(); // load lại dữ liệu
                                                        setIsExtending(false);
                                                        setExtendMonths(0);
                                                    }
                                                }}
                                            >
                                                Xác nhận
                                            </Button>
                                            <Button onClick={() => setIsExtending(false)}>Hủy</Button>
                                        </div>
                                    )}
                                </Col>
                            )}
                        </Row>
                        {(selectedRoom && (selectedRoom.status === true)) && (
                            <>
                                <h3 className='mt-5 font-bold my-1'>Hóa đơn nước:</h3>
                                <Table
                                    dataSource={selectedWaterBills}
                                    columns={waterBillColumns}
                                    rowKey="_id"
                                    pagination={false}
                                />

                                <h3 className='mt-5 font-bold my-1'>Hóa đơn điện:</h3>
                                <Table
                                    dataSource={selectedElectricBills}
                                    columns={electricityBillColumns}
                                    rowKey="_id"
                                    pagination={false}
                                />
                                <div className='flex justify-between items-center my-1'>
                                    <h3 className='mt-5 font-bold'>Danh sách phương tiện</h3>
                                    <Button onClick={() => setIsCreateModalOpen(true)}>Thêm phương tiện</Button>
                                </div>
                                <Table
                                    dataSource={selectedVehicles}
                                    columns={vehicleColumns}
                                    rowKey="_id"
                                    pagination={false}
                                />
                                <VehicleCreate
                                    isCreateModalOpen={isCreateModalOpen}
                                    setIsCreateModalOpen={setIsCreateModalOpen}
                                    onSuccess={fetchAllData}
                                />
                            </>
                        )}
                        {(selectedRoom && (selectedRoom?.statusPayment === '3' && selectedRoom.status === true)) && (
                            <>
                                <p>Thanh toán bằng cách chuyển khoản cho chủ trọ là <span className='font-bold'>{admin.name}</span> có số tài khoản là: <span className='font-bold'>{admin.bankAccount}</span> ngân hàng: <span className='font-bold'>{admin.bank} </span> </p>
                                <p>với nội dung là: thanh toán tiền ...  với số tiền là ... tháng ...</p>
                                <p>VD thanh toán tiền phòng thì chuyển khoản với nội dung: thanh toán tiền trọ với số tiền là 200000VND tháng 8</p>
                            </>
                        )}
                    </>
                )
            )}
        </Modal>
    );
};

export default UserPaymentSelect;
