'use client'

import { CheckOutlined, CloseOutlined, DeleteTwoTone, EditTwoTone } from "@ant-design/icons";
import { Button, Input, Popconfirm, Select, Table } from "antd"
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from "react";
import { handleDeletePackage, handleFeatureIsCode } from "../requests/package.requests";
import PackageCreate from "./package.create";
import PackageUpdate from "./package.update";



interface IProps {
    packages: any;
    meta: {
        current: number;
        pageSize: number;
        pages: number;
        total: number;
    }
}
const PackageTable = (props: IProps) => {
    const { packages, meta } = props;
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false);
    const [dataUpdate, setDataUpdate] = useState<any>(null);
    const [featureOptions, setFeatureOptions] = useState<any[]>([]);
    const [searchCode, setSearchCode] = useState<string>('');
    const [searchName, setSearchName] = useState<string>('');
    const [searchStatus, setSearchStatus] = useState<string | undefined>(undefined);
    useEffect(() => {
        const fetchFeatureOptions = async () => {
            const res = await handleFeatureIsCode();
            const results = res?.data?.results ?? [];
            setFeatureOptions(results); // chứa danh sách chức năng như bạn đưa
        };

        fetchFeatureOptions();
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
            title: 'Mã chức năng',
            dataIndex: 'code',
        },
        {
            title: 'Tên gói chức năng',
            dataIndex: 'name',
        },
        {
            title: 'Ghi chú',
            dataIndex: 'description',
        },
        {
            title: 'Giá',
            dataIndex: 'price',
        },
        {
            title: 'Số nhà',
            dataIndex: 'totalBuilding',
        },
        {
            title: 'Các chức năng',
            render: (record: any) => {
                const featureTags = record.features?.map((fid: string) => {
                    const found = featureOptions.find(f => f._id === fid);
                    const name = found?.displayName || found?.code || 'Không rõ';
                    let colorClass = 'bg-gray-100 text-gray-800';
                    if (found?.systemRoles === 'ADMIN') colorClass = 'bg-blue-100 text-blue-800';
                    else if (found?.systemRoles === 'SUPER ADMIN') colorClass = 'bg-purple-100 text-purple-800';
                    else if (found?.systemRoles === 'USER') colorClass = 'bg-green-100 text-green-800';

                    return (
                        <span
                            key={fid}
                            className={`inline-block px-3 py-1 text-xs font-medium rounded-full mr-2 mb-1 ${colorClass}`}
                        >
                            {name}
                        </span>
                    );
                }) ?? [];

                return <div className="flex flex-wrap">{featureTags}</div>;
            }
        },
        {
            title: 'Trạng thái hoạt động',
            render: (record: any) => {

                if (record?.isActive === true) {
                    return <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium "><CheckOutlined /></span>
                }
                else return <span className="px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800"><CloseOutlined /></span>
            }
        },
        {
            title: 'Actions',
            render: (text: any, record: any, index: any) => {
                return (
                    <>
                        <EditTwoTone
                            twoToneColor="#f57800" style={{ cursor: "pointer", margin: "0 20px" }}
                            onClick={() => {
                                setIsUpdateModalOpen(true);
                                setDataUpdate(record);
                            }}
                        />

                        <Popconfirm
                            placement="leftTop"
                            title={"Xác nhận xóa gói chức năng"}
                            description={"Bạn có chắc chắn muốn xóa gói chức năng này ?"}
                            onConfirm={async () => await handleDeletePackage(record?._id)}
                            okText="Xác nhận"
                            cancelText="Hủy"
                        >
                            <span style={{ cursor: "pointer" }}>
                                <DeleteTwoTone twoToneColor="#ff4d4f" />
                            </span>
                        </Popconfirm>
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
            <div
                className="flex justify-between items-center mb-5"
            >
                <span>Danh sách gói chức năng</span>
                <div className="flex gap-3">
                    <Input
                        placeholder="Tìm theo tên hoặc mã gói chức năng"
                        value={searchCode}
                        onChange={(e) => {
                            setSearchCode(e.target.value)
                            updateParams({ search: e.target.value });
                        }}
                        allowClear
                        style={{ width: 200 }}
                    />
                    <Select
                        allowClear
                        placeholder="Trạng thái hoạt động"
                        style={{ width: 200 }}
                        value={searchStatus}
                        onChange={(value) => {
                            setSearchStatus(value);
                            updateParams({ isActive: value });
                        }}
                    >
                        <Select.Option value="true">Đang hoạt động</Select.Option>
                        <Select.Option value="false">Không hoạt động</Select.Option>
                    </Select>
                    <Button onClick={() => setIsCreateModalOpen(true)}>Thêm gói chức năng</Button>
                </div>

            </div>
            <div
                className="bg-white shadow rounded p-4 overflow-x-auto h-[calc(100vh-234px)]"
            >
                <Table
                    bordered
                    dataSource={packages}
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
            <PackageCreate
                isCreateModalOpen={isCreateModalOpen}
                setIsCreateModalOpen={setIsCreateModalOpen}
            />

            <PackageUpdate
                isUpdateModalOpen={isUpdateModalOpen}
                setIsUpdateModalOpen={setIsUpdateModalOpen}
                dataUpdate={dataUpdate}
                setDataUpdate={setDataUpdate}
            />
        </>
    )
}

export default PackageTable;