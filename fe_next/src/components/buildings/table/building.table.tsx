'use client'

import { DeleteTwoTone, EditTwoTone } from "@ant-design/icons";
import { Button, Input, Popconfirm, Table } from "antd"
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from "react";
import { handleDeleteBuilding } from "../requests/building.requests";
import BuildingCreate from "./building.create";
import BuildingUpdate from "./building.update";



interface IProps {
    buildings: any;
    meta: {
        current: number;
        pageSize: number;
        pages: number;
        total: number;
    }
}
const BuildingTable = (props: IProps) => {
    const { buildings, meta } = props;
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false);
    const [dataUpdate, setDataUpdate] = useState<any>(null);

    const [searchKeyword, setSearchKeyword] = useState<string>("");
    const [filteredBuildings, setFilteredBuildings] = useState<any[]>(buildings);
    useEffect(() => {
        setFilteredBuildings(buildings);
    }, [buildings]);

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
            title: 'Name',
            dataIndex: 'name',
        },
        {
            title: 'Địa chỉ',
            dataIndex: 'address',
        },
        {
            title: 'tổng phòng',
            dataIndex: 'totalRooms',
        },
        {
            title: 'Người/phòng',
            dataIndex: 'numberOfPeopleRoom',
        },
        {
            title: 'Phòng đã thuê',
            dataIndex: 'numberOfRoomsRented',
        },
        {
            title: 'Giá trần',
            dataIndex: 'priceOfRoom',
            render: formatCurrency,
        },
        {
            title: 'giá gửi xe',
            dataIndex: 'shippingPrice',
            render: formatCurrency,
        },
        {
            title: 'Tổng thu nhập',
            dataIndex: "income",
            render: formatCurrency,
            // render: (value: number) => {
            //     const income = typeof value === 'number' ? value : 0;
            //     return <>{income.toLocaleString('vi-VN')} đ</>;
            // }
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
                            title={"Xác nhận xóa nhà trọ"}
                            description={"Bạn có chắc chắn muốn xóa nhà trọ này ?"}
                            onConfirm={async () => await handleDeleteBuilding(record?._id)}
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
                <span>Danh sách nhà trọ</span>
                <div className="flex gap-4 items-center  mb-5">
                    <Input.Search
                        placeholder="Tìm theo tên hoặc địa chỉ"
                        allowClear
                        value={searchKeyword}
                        onChange={(e) => {
                            setSearchKeyword(e.target.value);
                            updateParams({ search: e.target.value });
                        }}
                        style={{ width: 300 }}
                    />
                    <Button onClick={() => setIsCreateModalOpen(true)}>
                        Thêm nhà trọ
                    </Button>
                </div>
            </div>
            <div
                className="bg-white shadow rounded p-4 overflow-x-auto h-[calc(100vh-234px)]"
            >
                <Table
                    bordered
                    dataSource={buildings}
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
            <BuildingCreate
                isCreateModalOpen={isCreateModalOpen}
                setIsCreateModalOpen={setIsCreateModalOpen}
            />

            <BuildingUpdate
                isUpdateModalOpen={isUpdateModalOpen}
                setIsUpdateModalOpen={setIsUpdateModalOpen}
                dataUpdate={dataUpdate}
                setDataUpdate={setDataUpdate}
            />
        </>
    )
}

export default BuildingTable;