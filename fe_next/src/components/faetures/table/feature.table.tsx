'use client'

import { DeleteTwoTone, EditTwoTone } from "@ant-design/icons";
import { Button, Input, Popconfirm, Table } from "antd"
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState } from "react";
import { handleDeleteFeature } from "../requests/feature.requests";
import FeatureCreate from "./feature.create";
import FeatureUpdate from "./feature.update";



interface IProps {
    features: any;
    meta: {
        current: number;
        pageSize: number;
        pages: number;
        total: number;
    }
}
const FeatureTable = (props: IProps) => {
    const { features, meta } = props;
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false);
    const [dataUpdate, setDataUpdate] = useState<any>(null);
    const [searchCode, setSearchCode] = useState<string>('');
    const [searchDisplayName, setSearchDisplayName] = useState<string>('');
    const filteredFeatures = features.filter((feature: any) => {
        const matchCode = !searchCode || feature.code?.toLowerCase().includes(searchCode.toLowerCase());
        const matchDisplayName = !searchDisplayName || feature.displayName?.toLowerCase().includes(searchDisplayName.toLowerCase());

        return matchCode && matchDisplayName;
    });
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
            title: 'Tên chức năng',
            dataIndex: 'name',
        },
        {
            title: 'Tên hiễn thị',
            dataIndex: 'displayName',
        },
        {
            title: 'Ghi chú',
            dataIndex: 'description',
        },
        {
            title: 'vai trò được dùng',
            dataIndex: 'systemRoles',
        },
        {
            title: 'đường dẫn',
            dataIndex: 'path',
        },
        {
            title: 'STT trong sidebar',
            dataIndex: 'menuCode',
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
                            title={"Xác nhận xóa chức năng"}
                            description={"Bạn có chắc chắn muốn xóa chức năng này ?"}
                            onConfirm={async () => await handleDeleteFeature(record?._id)}
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


    return (
        <>
            <div
                className="flex justify-between items-center mb-5"
            >
                <span>Danh sách chức năng</span>
                <div className="flex gap-4 mb-5">
                    <Input
                        placeholder="Tìm theo mã chức năng"
                        value={searchCode}
                        onChange={(e) => setSearchCode(e.target.value)}
                        allowClear
                        style={{ width: 200 }}
                    />
                    <Input
                        placeholder="Tìm theo tên hiển thị"
                        value={searchDisplayName}
                        onChange={(e) => setSearchDisplayName(e.target.value)}
                        allowClear
                        style={{ width: 200 }}
                    />
                    <Button onClick={() => setIsCreateModalOpen(true)}>
                        Thêm chức năng
                    </Button>
                </div>
            </div>
            <div
                className="bg-white shadow rounded p-4 overflow-x-auto h-[calc(100vh-234px)]"
            >
                <Table
                    bordered
                    dataSource={filteredFeatures}
                    columns={columns}
                    rowKey={"_id"}
                    pagination={
                        {
                            current: meta.current,
                            pageSize: meta.pageSize,
                            showSizeChanger: true,
                            total: filteredFeatures.total,
                            pageSizeOptions: ['10', '20', '50', '99'],
                            showTotal: (total, range) => { return (<div> {range[0]}-{range[1]} trên {total} rows</div>) }
                        }
                    }
                    onChange={onChange}
                />
            </div>
            <FeatureCreate
                isCreateModalOpen={isCreateModalOpen}
                setIsCreateModalOpen={setIsCreateModalOpen}
            />

            <FeatureUpdate
                isUpdateModalOpen={isUpdateModalOpen}
                setIsUpdateModalOpen={setIsUpdateModalOpen}
                dataUpdate={dataUpdate}
                setDataUpdate={setDataUpdate}
            />
        </>
    )
}

export default FeatureTable;