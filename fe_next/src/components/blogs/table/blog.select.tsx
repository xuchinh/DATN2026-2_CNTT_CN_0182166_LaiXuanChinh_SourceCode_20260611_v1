import { Modal } from 'antd';
import { useEffect, useState } from 'react';
import { handleBuilding, handleUser } from '../requests/blog.requests';

interface IProps {
    isSelectModalOpen: boolean;
    setIsSelectModalOpen: (v: boolean) => void;
    dataSelect: any;
}

interface BlogContent {
    index?: string;
    Content1?: string;
    image?: string;
    Content2?: string;
}

const BlogsSelect = ({ isSelectModalOpen, setIsSelectModalOpen, dataSelect }: IProps) => {
    const [blogData, setBlogData] = useState<any>(null);
    const [buildingOptions, setBuildingOptions] = useState<any[]>([]);
    const [userOptions, setUserOptions] = useState<any[]>([]);

    useEffect(() => {
        const fetchUserOptions = async () => {
            const resUser = await handleUser();
            setUserOptions(resUser?.data?.results ?? []);
        };
        const fetchBuildingOptions = async () => {
            const resBuilding = await handleBuilding();
            setBuildingOptions(resBuilding?.data?.results ?? []);
        };
        fetchUserOptions();
        fetchBuildingOptions();
    }, []);

    useEffect(() => {
        if (dataSelect) {
            setBlogData(dataSelect);
        }
    }, [dataSelect]);

    const handleClose = () => {
        setIsSelectModalOpen(false);
        setBlogData(null);
    };

    const selectedUser = userOptions.find(us => us._id === blogData?.userId);
    const userName = selectedUser?.name || 'Không xác định';
    const selectedBuilding = buildingOptions.find(bd => bd._id === blogData?.buildingId);
    const buildingName = selectedBuilding?.name || 'Không xác định';
    const buildingAddress = selectedBuilding?.address || 'Không xác định';
    const priceOfRoom = selectedBuilding?.priceOfRoom || 'Không xác định';
    const totalRooms = selectedBuilding?.totalRooms || 'Không xác định';

    return (
        <Modal
            open={isSelectModalOpen}
            onCancel={handleClose}
            footer={null}
            maskClosable={false}
            width={900}
        >
            {blogData ? (
                <div className="flex flex-col items-center gap-5 leading-relaxed">
                    {/* Tiêu đề */}
                    {blogData.title && (
                        <h2 className="w-[80%] text-justify text-2xl font-bold">
                            {blogData.title}
                        </h2>
                    )}
                    {/* Ảnh chính */}
                    {blogData.mainImage && (
                        <img
                            src={blogData.mainImage}
                            alt="Ảnh tiêu đề"
                            className="w-[80%] max-h-[300px] object-cover rounded-lg shadow-md mx-auto"
                        />
                    )}
                    {/* Giới thiệu */}
                    {blogData.introduce && (
                        <p className="w-[80%] text-justify text-base">
                            {blogData.introduce}
                        </p>
                    )}

                    {/* Thông tin tòa nhà */}
                    {blogData.buildingId && (
                        <div className="w-[80%] flex-col items-center gap-2">
                            <p className='text-justify text-base'>
                                Tên nhà: <span>{buildingName}</span>
                            </p>
                            <p className="text-justify text-base">
                                Địa chỉ: <span>{buildingAddress}</span>
                            </p>
                            <p className="text-justify text-base">
                                Tổng số phòng: <span>{totalRooms}</span> phòng
                            </p>
                            <p className="text-justify text-base">
                                Giá trung bình mỗi phòng: <span>{priceOfRoom}</span> VND/phòng
                            </p>
                        </div>
                    )}

                    {/* Nội dung động */}
                    {(blogData.Content || []).map((section: BlogContent, idx: number) => (
                        <div key={idx} className="w-[80%] flex flex-col gap-2 my-4">
                            {section.index && (
                                <p className="text-lg font-bold">{section.index}</p>
                            )}
                            {section.Content1 && (
                                <p className="text-base">{section.Content1}</p>
                            )}
                            {section.image && (
                                <img
                                    src={section.image}
                                    alt={`Ảnh ${idx + 1}`}
                                    className="w-[60%] max-h-[300px] object-cover rounded-lg shadow-md mx-auto"
                                />
                            )}
                            {section.Content2 && (
                                <p className="text-base">{section.Content2}</p>
                            )}
                        </div>
                    ))}

                    {/* Tổng kết */}
                    {blogData.conclusion && (
                        <p className="w-[80%] text-justify text-base">
                            {blogData.conclusion}
                        </p>
                    )}

                    {/* Thông tin tác giả */}
                    {blogData.userId && (
                        <p className="w-[90%] text-right text-sm text-gray-600 italic">
                            bài viết của{" "}
                            <span className="font-semibold text-blue-600 bg-blue-100 px-2 py-0.5 rounded">
                                {userName}
                            </span>
                            , cập nhật ngày:{" "}
                            <span className="text-gray-800 font-medium">
                                {new Date(blogData.updatedAt).toLocaleDateString("vi-VN", {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric"
                                })}
                            </span>
                        </p>
                    )}
                </div>
            ) : (
                <p className="text-center text-gray-500">Không có dữ liệu blog</p>
            )}
        </Modal>
    );
};

export default BlogsSelect;
