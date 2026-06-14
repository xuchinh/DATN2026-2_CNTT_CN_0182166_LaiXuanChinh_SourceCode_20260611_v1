'use client'

import { CheckOutlined, CloseOutlined, DeleteTwoTone, EditTwoTone } from "@ant-design/icons";
import { Button, Input, Popconfirm, Select, Table } from "antd"
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState } from "react";
import { handleDeleteOffer } from "../requests/offer.requests";
import OfferCreate from "./offer.create";
import OfferUpdate from "./offer.update";



interface IProps {
    offers: any;
    meta: {
        current: number;
        pageSize: number;
        pages: number;
        total: number;
    }
}
const OfferTable = (props: IProps) => {
    const { offers, meta } = props;
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false);
    const [dataUpdate, setDataUpdate] = useState<any>(null);

    const [searchCode, setSearchCode] = useState<string>('');
    const [searchName, setSearchName] = useState<string>('');
    const [searchStatus, setSearchStatus] = useState<string>('');
    const filteredOffers = offers.filter((offer: any) => {
        const matchCode = !searchCode || offer.code?.toLowerCase().includes(searchCode.toLowerCase());
        const matchName = !searchName || offer.name?.toLowerCase().includes(searchName.toLowerCase());
        const matchStatus =
            !searchStatus ||
            (searchStatus === 'active' && offer.isActive === true) ||
            (searchStatus === 'inactive' && offer.isActive === false);

        return matchCode && matchName && matchStatus;
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
            title: 'Mã khuyễn mãi',
            dataIndex: 'code',
        },
        {
            title: 'Tên khuyến mãi',
            dataIndex: 'name',
        },
        {
            title: 'Ghi chú',
            dataIndex: 'description',
        },
        {
            title: 'Giảm giá theo %',
            dataIndex: 'discountPercentage',
        },
        {
            title: 'Giảm giá theo tiền mặt',
            dataIndex: 'discountCurrency',
        },
        {
            title: 'Điều kiện ',
            dataIndex: 'condition',
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
                            title={"Xác nhận xóa khuyến mãi"}
                            description={"Bạn có chắc chắn muốn xóa khuyến mãi này ?"}
                            onConfirm={async () => await handleDeleteOffer(record?._id)}
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
                // style={{
                //     display: "flex", justifyContent: "space-between",
                //     alignItems: "center",
                //     marginBottom: 20
                // }}
                className="flex justify-between items-center mb-5"
            >
                <span>Danh sách khuyến mãi</span>
                <div className="flex gap-3">
                    <Input
                        placeholder="Tìm theo mã"
                        value={searchCode}
                        onChange={(e) => setSearchCode(e.target.value)}
                        allowClear
                        style={{ width: 180 }}
                    />
                    <Input
                        placeholder="Tìm theo tên"
                        value={searchName}
                        onChange={(e) => setSearchName(e.target.value)}
                        allowClear
                        style={{ width: 180 }}
                    />
                    <Select
                        placeholder="Trạng thái"
                        allowClear
                        value={searchStatus || undefined}
                        onChange={(value) => setSearchStatus(value || '')}
                        style={{ width: 150 }}
                        options={[
                            { label: 'Hoạt động', value: 'active' },
                            { label: 'Không hoạt động', value: 'inactive' },
                        ]}
                    />
                    <Button onClick={() => setIsCreateModalOpen(true)}>
                        Thêm khuyến mãi
                    </Button>
                </div>
            </div>
            <div
                className="bg-white shadow rounded p-4 overflow-x-auto h-[calc(100vh-234px)]"
            >
                <Table
                    bordered
                    dataSource={filteredOffers}
                    columns={columns}
                    rowKey={"_id"}
                    pagination={
                        {
                            current: meta.current,
                            pageSize: meta.pageSize,
                            showSizeChanger: true,
                            total: filteredOffers.total,
                            pageSizeOptions: ['10', '20', '50', '99'],
                            showTotal: (total, range) => { return (<div> {range[0]}-{range[1]} trên {total} rows</div>) }
                        }
                    }
                    onChange={onChange}
                />
            </div>
            <OfferCreate
                isCreateModalOpen={isCreateModalOpen}
                setIsCreateModalOpen={setIsCreateModalOpen}
            />

            <OfferUpdate
                isUpdateModalOpen={isUpdateModalOpen}
                setIsUpdateModalOpen={setIsUpdateModalOpen}
                dataUpdate={dataUpdate}
                setDataUpdate={setDataUpdate}
            />
        </>
    )
}

export default OfferTable;