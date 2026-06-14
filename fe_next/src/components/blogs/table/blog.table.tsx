'use client'

import { DeleteTwoTone, EditTwoTone, FileDoneOutlined } from "@ant-design/icons";
import { Button, Input, Popconfirm, Table, Tooltip } from "antd"
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from "react";
import BlogsCreate from "./blog.create";
import blogsUpdate from "./blog.update";
import { handleBuilding, handleDeleteBlog, handleUser } from "../requests/blog.requests";
import BlogsUpdate from "./blog.update";
import BlogsSelect from "./blog.select";

interface IProps {
    blogs: any;
    meta: {
        current: number;
        pageSize: number;
        pages: number;
        total: number;
    }
}
const BlogsTable = (props: IProps) => {
    const { blogs, meta } = props;
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false);
    const [isSelectModalOpen, setIsSelectModalOpen] = useState<boolean>(false);
    const [dataUpdate, setDataUpdate] = useState<any>(null);
    const [dataSelect, setDataSelect] = useState<any>(null);
    const [buildingOptions, setBuildingOptions] = useState<any[]>([]);
    const [userOptions, setUserOptions] = useState<any[]>([]);
    useEffect(() => {
        const fetchUserOptions = async () => {
            const resUser = await handleUser();
            const resultsUser = resUser?.data?.results ?? [];
            setUserOptions(resultsUser);
        };
        fetchUserOptions();

        const fetchBuildingOptions = async () => {
            const resBuilding = await handleBuilding();
            const resultsBuilding = resBuilding?.data?.results ?? [];
            setBuildingOptions(resultsBuilding);
        };
        fetchBuildingOptions();
    }, []);
    const [filteredBlogss, setFilteredBlogss] = useState<any[]>(blogs);
    useEffect(() => {
        setFilteredBlogss(blogs);
    }, [blogs]);

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
            title: 'Tiêu đề ',
            dataIndex: 'title',
        },
        {
            title: 'Người viết',
            dataIndex: 'userId',
            render: (userId: string) => {
                const user = userOptions.find((u: any) => u._id === userId);
                return user ? user.name : userId;
            }
        },
        {
            title: 'Nhà được giới thiệu',
            dataIndex: 'buildingId',
            render: (buildingId: string) => {
                const building = buildingOptions.find((b: any) => b._id === buildingId);
                return building ? building.name : buildingId;
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
                        <Tooltip title="Sửa Bài viết">
                            <EditTwoTone
                                twoToneColor="#f57800" style={{ cursor: "pointer", margin: "0 20px" }}
                                onClick={() => {
                                    setIsUpdateModalOpen(true);
                                    setDataUpdate(record);
                                }}
                            />
                        </Tooltip>
                        <Tooltip title="Xóa Bài viết">

                            <Popconfirm
                                placement="leftTop"
                                title={"Xác nhận xóa bài viết"}
                                description={"Bạn có chắc chắn muốn xóa bài viết này ?"}
                                onConfirm={async () => await handleDeleteBlog(record?._id)}
                                okText="Xác nhận"
                                cancelText="Hủy"
                            >
                                <span style={{ cursor: "pointer" }}>
                                    <DeleteTwoTone twoToneColor="#ff4d4f" />
                                </span>
                            </Popconfirm>
                        </Tooltip>
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
                <span>Danh sách bài viết</span>


                <Button onClick={() => setIsCreateModalOpen(true)}>
                    Thêm bài viết
                </Button>
            </div>
            <div
                className="bg-white shadow rounded p-4 overflow-x-auto h-[calc(100vh-234px)]"
            >
                <Table
                    bordered
                    dataSource={filteredBlogss}
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
            <BlogsCreate
                isCreateModalOpen={isCreateModalOpen}
                setIsCreateModalOpen={setIsCreateModalOpen}
            />

            <BlogsUpdate
                isUpdateModalOpen={isUpdateModalOpen}
                setIsUpdateModalOpen={setIsUpdateModalOpen}
                dataUpdate={dataUpdate}
                setDataUpdate={setDataUpdate}
            />
            <BlogsSelect
                isSelectModalOpen={isSelectModalOpen}
                setIsSelectModalOpen={setIsSelectModalOpen}
                dataSelect={dataSelect}
            />
        </>
    )
}

export default BlogsTable;