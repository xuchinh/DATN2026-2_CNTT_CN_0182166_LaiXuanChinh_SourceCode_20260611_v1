// import { useEffect, useState } from "react";
// import { handleFeatureIsCode } from "../requests/package.requests";
// import { Col, Modal, Row, Tag } from "antd";
// import { CheckOutlined, CloseOutlined } from "@ant-design/icons";

// interface IProps {
//     isDetailModalOpen: boolean;
//     setIsDetailModalOpen: (v: boolean) => void;
//     dataDetail: any;
//     // setDataDetail: any;
// }
// const PackageSelect = (props: IProps) => {
//     const {
//         isDetailModalOpen,
//         setIsDetailModalOpen,
//         dataDetail,
//         // setDataDetail
//     } = props;

//     const [packageData, setPackageData] = useState<any>(null);
//     const [featureOptions, setFeatureOptions] = useState<any[]>([]);
//     useEffect(() => {
//         if (isDetailModalOpen && dataDetail) {
//             setPackageData(dataDetail);
//         }
//     }, [isDetailModalOpen, dataDetail]);
//     useEffect(() => {
//         const fetchFeatures = async () => {
//             const res = await handleFeatureIsCode();
//             const results = res?.data?.results ?? [];
//             setFeatureOptions(results);
//         };
//         fetchFeatures();
//     }, []);
//     const handleCloseModal = () => {
//         setPackageData(null);
//         setIsDetailModalOpen(false);
//         // setDataDetail(null);
//     };
//     const renderFeatureTags = () => {
//         if (!packageData?.features) return null;
//         return packageData.features.map((fid: string) => {
//             const found = featureOptions.find(f => f._id === fid);
//             const name = found?.displayName || found?.code || 'Không rõ';
//             return (
//                 <span key={fid} className="mr-2">
//                     {name}
//                 </span>
//             );
//         });
//     };
//     return (
//         <Modal
//             title="Chi tiết gói chức năng"
//             open={isDetailModalOpen}
//             onOk={handleCloseModal}
//             onCancel={handleCloseModal}
//             okText="Đóng"
//             cancelButtonProps={{ style: { display: 'none' } }}
//             maskClosable={false}
//         >
//             {packageData && (
//                 <Row gutter={[15, 15]}>
//                     <Col span={24} md={12}>
//                         <div><strong>Mã gói chức năng:</strong> {packageData.code}</div>
//                     </Col>
//                     <Col span={24} md={12}>
//                         <div><strong>Tên gói:</strong> {packageData.name}</div>
//                     </Col>
//                     <Col span={24}>
//                         <div><strong>Ghi chú:</strong> {packageData.description || 'Không có'}</div>
//                     </Col>
//                     <Col span={24} md={12}>
//                         <div><strong>Giá:</strong> {packageData.price?.toLocaleString()} VNĐ</div>
//                     </Col>
//                     <Col span={24} md={12}>
//                         <div><strong>Số nhà tối đang:</strong> {packageData.totalBuilding}</div>
//                     </Col>
//                     <Col span={24}>
//                         <div><strong>Các chức năng:</strong> <br />{renderFeatureTags()}</div>
//                     </Col>
//                     <Col span={24} md={12}>
//                         <div><strong>Trạng thái hoạt động:</strong> {packageData.isActive
//                             ? <Tag color="green"><CheckOutlined /> Đang hoạt động</Tag>
//                             : <Tag color="red"><CloseOutlined /> Không hoạt động</Tag>
//                         }</div>
//                     </Col>
//                 </Row>
//             )}
//         </Modal>
//     );
// }
// export default PackageSelect;


import { useEffect, useState } from "react";
import { handleFeatureIsCode } from "../requests/package.requests";
import { Col, Modal, Row, Tag } from "antd";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import UserUpdatePackage from "@/components/users/table/user.update.package";
import { handleUserLogin } from "@/components/users/requests/user.requests";

interface IProps {
    isDetailModalOpen: boolean;
    setIsDetailModalOpen: (v: boolean) => void;
    dataDetail: any;
    // setDataDetail: any;
}
const PackageSelect = (props: IProps) => {
    const {
        isDetailModalOpen,
        setIsDetailModalOpen,
        dataDetail,
        // setDataDetail
    } = props;

    const [packageData, setPackageData] = useState<any>(null);
    const [featureOptions, setFeatureOptions] = useState<any[]>([]);

    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [dataUpdate, setDataUpdate] = useState<any>(null);

    useEffect(() => {
        if (isDetailModalOpen && dataDetail) {
            setPackageData(dataDetail);
        }
    }, [isDetailModalOpen, dataDetail]);

    useEffect(() => {
        const fetchFeatures = async () => {
            const res = await handleFeatureIsCode();
            const results = res?.data?.results ?? [];
            setFeatureOptions(results);
        };
        fetchFeatures();
    }, []);

    const handleCloseModal = () => {
        setPackageData(null);
        setIsDetailModalOpen(false);
        // setDataDetail(null);
    };

    const renderFeatureTags = () => {
        if (!packageData?.features) return null;
        return (
            <div className="flex flex-col gap-2 mt-2">
                {packageData.features.map((fid: string) => {
                    const found = featureOptions.find(f => f._id === fid);
                    const name = found?.displayName || found?.code || 'Không rõ';
                    return (
                        <div key={fid} className="rounded px-3 py-0.5 w-fit">
                            {name}.
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <>
            <Modal
                // title="Chi tiết gói chức năng"
                // open={isDetailModalOpen}
                // onOk={handleCloseModal}
                // onCancel={handleCloseModal}
                // okText="Đóng"

                // cancelButtonProps={{ style: { display: 'none' } }}
                // maskClosable={false}
                title="Chi tiết gói chức năng"
                open={isDetailModalOpen}
                onCancel={handleCloseModal}
                footer={[
                    <button
                        key="extend"
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1 px-4 rounded mx-4"
                        onClick={async () => {
                            try {
                                const res = await handleUserLogin()
                                const user = res?.data?.results?.[0]
                                if (user) {
                                    setDataUpdate(user)
                                    setIsUpdateModalOpen(true)
                                    setIsDetailModalOpen(false);
                                }
                            } catch (err) {
                                console.error('Lỗi khi lấy thông tin người dùng:', err)
                            }
                        }}
                    >
                        Gia hạn
                    </button>,
                    <button
                        key="close"
                        onClick={handleCloseModal}
                        className="bg-gray-300 hover:bg-gray-400 text-black font-semibold py-1 px-4 rounded"
                    >
                        Đóng
                    </button>
                ]}
                maskClosable={false}
            >
                {packageData && (
                    <Row gutter={[15, 15]}>
                        <Col span={24} md={12}>
                            <div><strong>Mã gói chức năng:</strong> {packageData.code}</div>
                        </Col>
                        <Col span={24} md={12}>
                            <div><strong>Tên gói:</strong> {packageData.name}</div>
                        </Col>
                        <Col span={24}>
                            <div><strong>Ghi chú:</strong> {packageData.description || 'Không có'}</div>
                        </Col>
                        <Col span={24} md={12}>
                            <div><strong>Giá:</strong> {packageData.price?.toLocaleString()} VNĐ</div>
                        </Col>
                        <Col span={24} md={12}>
                            <div><strong>Số nhà tối đang:</strong> {packageData.totalBuilding}</div>
                        </Col>
                        <Col span={24}>
                            <div><strong>Các chức năng:</strong> {renderFeatureTags()}</div>
                        </Col>
                        <Col span={24} md={12}>
                            <div><strong>Trạng thái hoạt động:</strong> {packageData.isActive
                                ? <Tag color="green"><CheckOutlined /> Đang hoạt động</Tag>
                                : <Tag color="red"><CloseOutlined /> Không hoạt động</Tag>
                            }</div>
                        </Col>
                    </Row>
                )}
            </Modal>
            <UserUpdatePackage
                isUpdateModalOpen={isUpdateModalOpen}
                setIsUpdateModalOpen={setIsUpdateModalOpen}
                dataUpdate={dataUpdate}
                setDataUpdate={setDataUpdate}
            />
        </>
    );
}

export default PackageSelect;
