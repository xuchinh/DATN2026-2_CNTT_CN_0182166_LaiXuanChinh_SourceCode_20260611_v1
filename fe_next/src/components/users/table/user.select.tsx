
'use client'

import {
    Modal,
    Row,
    Col,
} from 'antd';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { handlePackageUser } from '../requests/user.requests';

interface IProps {
    isSelectModalOpen: boolean;
    setIsSelectModalOpen: (v: boolean) => void;
    dataSelect: any;
    // setDataSelect: any;
}

const UserSelect = (props: IProps) => {
    const {
        isSelectModalOpen,
        setIsSelectModalOpen,
        dataSelect,
        // setDataSelect
    } = props;

    const [UserData, setUserData] = useState<any>(null);
    const [packageoptions, setPackageoptions] = useState<any[]>([]);

    // Khi mở modal, lấy dữ liệu người dùng truyền vào
    useEffect(() => {
        if (isSelectModalOpen && dataSelect) {
            setUserData(dataSelect);
        }
    }, [isSelectModalOpen, dataSelect]);

    // Lấy danh sách các gói từ server
    useEffect(() => {
        const fetchPackageOptions = async () => {
            const resPackage = await handlePackageUser();
            const resultsPackage = resPackage?.data?.results ?? [];
            setPackageoptions(resultsPackage);
        };
        fetchPackageOptions();
    }, []);

    const handleCloseSelectModal = () => {
        setUserData(null);
        setIsSelectModalOpen(false);
        // setDataSelect(null);
    };

    const selectedPackage = packageoptions.find(pkg => pkg._id === UserData?.packageId);
    const packageCode = selectedPackage?.code || 'Không xác định';

    return (
        <Modal
            title="Thông tin chi tiết người dùng"
            open={isSelectModalOpen}
            onOk={handleCloseSelectModal}
            onCancel={handleCloseSelectModal}
            okText="Đóng"
            cancelButtonProps={{ style: { display: 'none' } }}
            maskClosable={false}
        >
            {UserData && (
                <Row gutter={[15, 15]}>
                    {/* Avatar preview */}
                    <Col span={24} md={12}>
                        <div>
                            <strong>Avatar:</strong><br />
                            {UserData.avatar ? (
                                <img
                                    src={UserData.avatar}
                                    alt="Avatar"
                                    className="w-24 h-24 object-cover rounded-md mt-2 border border-gray-200"
                                />
                            ) : (
                                <div className="text-gray-400">Không có ảnh</div>
                            )}
                        </div>
                    </Col>

                    {/* Các thông tin khác */}
                    <Col span={24} md={12}>
                        <div><strong>Tên người dùng:</strong> {UserData.name}</div>
                    </Col>
                    <Col span={24} md={12}>
                        <div><strong>Gmail:</strong> {UserData.email}</div>
                    </Col>
                    <Col span={24} md={12}>
                        <div><strong>Số điện thoại:</strong> {UserData.phone}</div>
                    </Col>
                    <Col span={24} md={12}>
                        <div><strong>Địa chỉ:</strong> {UserData.address}</div>
                    </Col>
                    <Col span={24} md={12}>
                        <div><strong>Quyền:</strong> {UserData.role}</div>
                    </Col>
                    {UserData.status && (
                        <Col span={24} md={12}>
                            <div><strong>Số nhà đang sở hữu:</strong> {UserData.totalHouse}</div>
                        </Col>
                    )}
                    {UserData.status && (
                        <Col span={24} md={12}>
                            <div><strong>Gói đã đăng ký:</strong> {packageCode}</div>
                        </Col>
                    )}
                    {UserData.status && (
                        <Col span={24} md={12}>
                            <div><strong>Ngày thuê:</strong> {dayjs(UserData.fromDate).format('DD/MM/YYYY')}</div>
                        </Col>
                    )}
                    {UserData.status && (
                        <Col span={24} md={12}>
                            <div><strong>Ngày hết hạn:</strong> {dayjs(UserData.toDate).format('DD/MM/YYYY')}</div>
                        </Col>
                    )}
                    {UserData.status && (
                        <Col span={24} md={12}>
                            <div><strong>Hạn sử dụng:</strong> {UserData.status ? 'Còn' : 'Không còn'}</div>
                        </Col>
                    )}
                    {UserData.status && (
                        <Col span={24} md={12}>
                            <div><strong>Số tài khoản:</strong> {UserData.bankAccount}</div>
                        </Col>
                    )}
                    {UserData.status && (
                        <Col span={24} md={12}>
                            <div><strong>Ngân hàng:</strong> {UserData.bank}</div>
                        </Col>
                    )}
                </Row>
            )}
        </Modal>
    );
};

export default UserSelect;

