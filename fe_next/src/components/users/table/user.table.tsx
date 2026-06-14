'use client'

import {
    CheckOutlined,
    CloseOutlined,
    DeleteTwoTone,
    EditTwoTone,
    FileDoneOutlined,
    LikeOutlined
} from "@ant-design/icons";
import {
    Button,
    Input,
    Popconfirm,
    Select,
    Table,
    Tooltip
} from "antd"
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from "react";
import UserCreate from "./user.create";
import UserUpdate from "./user.update";
import {
    handleConfirmPackageUser,
    handleConfirmUpdateUserPayment,
    handleDeleteUserAction,
    handlePackageUser
} from "@/components/users/requests/user.requests";
import UserSelect from "./user.select";
import dayjs from "dayjs";

const { Option } = Select;

interface IProps {
    users: any;
    meta: {
        current: number;
        pageSize: number;
        pages: number;
        total: number;
    }
}

const UserTable = (props: IProps) => {
    const { users, meta } = props;
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();
    const newDate = new Date()
    const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false);
    const [dataUpdate, setDataUpdate] = useState<any>(null);
    const [isSelectModalOpen, setIsSelectModalOpen] = useState<boolean>(false);
    const [dataSelect, setDataSelect] = useState<any>(null);
    const [packageoptions, setPackageoptions] = useState<any[]>([]);
    const [searchEmail, setSearchEmail] = useState<string>('');
    const [searchPackageId, setSearchPackageId] = useState<string | undefined>();
    const [searchStatus, setSearchStatus] = useState<string | undefined>();

    useEffect(() => {
        const fetchPackageOptions = async () => {
            const resPackage = await handlePackageUser();
            const resultsPackage = resPackage?.data?.results ?? [];
            setPackageoptions(resultsPackage);
        };
        fetchPackageOptions();
    }, []);
    const formatCurrency = (value: string | number) =>
        `${Number(value).toLocaleString()} VNĐ`;
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
            title: 'Email',
            dataIndex: 'email',
        },
        {
            title: 'Gói đăng ký',
            render: (record: any) => {
                const found = packageoptions.find(f => f._id === record.packageId);
                const Code = found?.code || 'Không rõ';
                return <span>{Code}</span>;
            }
        },
        {
            title: 'Ngày hết hạn',
            render: (record: any) =>
                record.toDate ? dayjs(record.toDate).format('DD/MM/YYYY') : '',
        },
        {
            title: 'Gia hạn tháng',
            dataIndex: 'totalMonthUpdate',
        },
        {
            title: 'Tổng tiền thu',
            dataIndex: 'payment',
            render: formatCurrency,
        },
        {
            title: 'Hạn gói',
            render: (record: any) => {
                if (record?.status === true) {
                    return <> <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium "><CheckOutlined /></span>
                        {record?.toDate === newDate && (
                            <Popconfirm
                                placement="leftTop"
                                title={"Người thuê đã hết hạn hạn gói dịch vụ"}
                                description={"Bạn có chắc chắn muốn xác nhận người thuê đã hết hạn hạn gói dịch vụ?"}
                                onConfirm={async () => await handleConfirmPackageUser(record._id, false)}
                                okText="Xác nhận"
                                cancelText="Hủy"
                            >
                                <Tooltip title="Người thuê đã hết hạn hạn gói dịch vụ">
                                    <span style={{ cursor: "pointer" }}>
                                        <LikeOutlined twoToneColor="#1890ff" />
                                    </span>
                                </Tooltip>
                            </Popconfirm>
                        )}
                    </>
                }
                else return <span className="px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800"><CloseOutlined /></span>

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
                                    setDataSelect(record);
                                }}
                            />
                        </Tooltip>
                        {/* <EditTwoTone
                            twoToneColor="#f57800"
                            className="cursor-pointer mx-[5px]"
                            onClick={() => {
                                setIsUpdateModalOpen(true);
                                setDataUpdate(record);
                            }}
                        /> */}
                        <Popconfirm
                            placement="leftTop"
                            title={"Xác nhận xóa user"}
                            description={"Bạn có chắc chắn muốn xóa user này ?"}
                            onConfirm={async () => await handleDeleteUserAction(record?._id)}
                            okText="Xác nhận"
                            cancelText="Hủy"
                        >
                            <span className="cursor-pointer mx-[5px]">
                                <DeleteTwoTone twoToneColor="#ff4d4f" />
                            </span>
                        </Popconfirm>
                        {record.statusPaymentUpdate === true && (
                            <Popconfirm
                                placement="leftTop"
                                title={"Xác nhận người thuê đã gia hạn thành công"}
                                description={"Bạn có chắc chắn muốn xác nhận người thuê này đã gia hạn thành công ?"}
                                onConfirm={async () => await handleConfirmUpdateUserPayment(record._id)}
                                okText="Xác nhận"
                                cancelText="Hủy"
                            >
                                <Tooltip title="Xác nhận người thuê đã gia hạn thành công">
                                    <span style={{ cursor: "pointer" }}>
                                        <LikeOutlined twoToneColor="#1890ff" />
                                    </span>
                                </Tooltip>
                            </Popconfirm>
                        )}
                    </>
                )
            }
        }
    ];

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

    return (
        <>
            <div className="flex justify-between items-center mb-5">
                <span>Quản lý người dùng</span>
                <div className="flex gap-4 mb-4">
                    <Input
                        placeholder="Tìm theo email"
                        style={{ width: 200 }}
                        allowClear
                        value={searchEmail}
                        onChange={(e) => {
                            setSearchEmail(e.target.value);
                            updateParams({ search: e.target.value });
                        }}
                    />
                    <Select
                        placeholder="Chọn gói"
                        allowClear
                        style={{ width: 200 }}
                        value={searchPackageId}
                        onChange={(value) => {
                            setSearchPackageId(value);
                            updateParams({ packageId: value });
                        }}
                    >
                        {packageoptions.map((pkg) => (
                            <Option key={pkg._id} value={pkg._id}>{pkg.code}</Option>
                        ))}
                    </Select>
                    <Select
                        placeholder="Trạng thái hạn gói"
                        allowClear
                        style={{ width: 200 }}
                        value={searchStatus}
                        onChange={(value) => {
                            setSearchStatus(value);
                            updateParams({ status: value });
                        }}
                    >
                        <Option value="true">Còn hạn</Option>
                        <Option value="false">Hết hạn</Option>
                    </Select>
                    {/* <Button onClick={() => setIsCreateModalOpen(true)}>Create User</Button> */}
                </div>
            </div>
            <div className="bg-white shadow rounded p-4 overflow-x-auto h-[calc(100vh-234px)]">
                <Table
                    bordered
                    dataSource={users}
                    columns={columns}
                    rowKey={"_id"}
                    pagination={{
                        current: meta.current,
                        pageSize: meta.pageSize,
                        showSizeChanger: true,
                        total: meta.total,
                        pageSizeOptions: ['10', '20', '50', '99'],
                        showTotal: (total, range) => {
                            return (<div> {range[0]}-{range[1]} trên {total} rows</div>)
                        },
                    }}
                    onChange={onChange}
                />
            </div>

            <UserCreate
                isCreateModalOpen={isCreateModalOpen}
                setIsCreateModalOpen={setIsCreateModalOpen}
            />
            <UserUpdate
                isUpdateModalOpen={isUpdateModalOpen}
                setIsUpdateModalOpen={setIsUpdateModalOpen}
                dataUpdate={dataUpdate}
                setDataUpdate={setDataUpdate}
            />
            <UserSelect
                isSelectModalOpen={isSelectModalOpen}
                setIsSelectModalOpen={setIsSelectModalOpen}
                dataSelect={dataSelect}
            // setDataSelect={setDataSelect}
            />
        </>
    )
}

export default UserTable;
