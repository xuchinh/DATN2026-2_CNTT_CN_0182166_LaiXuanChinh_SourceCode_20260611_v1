import {
    Modal, Input, Form, Row, Col, message,
    notification
} from 'antd';
import { useEffect, useState } from 'react';
import { handleCreateBuilding, handleBuildingAdmin } from '../requests/building.requests';
import { handlePackageUserLogin } from '@/components/users/requests/user.requests';

interface IProps {
    isCreateModalOpen: boolean;
    setIsCreateModalOpen: (v: boolean) => void;
}

const BuildingCreate = (props: IProps) => {
    const { isCreateModalOpen, setIsCreateModalOpen } = props;
    const [form] = Form.useForm();
    const [isCreating, setIsCreating] = useState(false);
    const [buildingCount, setBuildingCount] = useState(0);
    const [maxBuildingAllowed, setMaxBuildingAllowed] = useState(Infinity);

    // Khi modal mở, lấy số lượng nhà và giới hạn theo gói
    useEffect(() => {
        const fetchInfo = async () => {
            if (!isCreateModalOpen) return;

            const [buildingRes, packageRes] = await Promise.all([
                handleBuildingAdmin({ current: 1, pageSize: 9999 }),
                handlePackageUserLogin()
            ]);

            const buildings = buildingRes?.data?.results ?? [];
            setBuildingCount(buildings.length);

            const packageData = packageRes?.data?.results?.[0];
            const maxBuilding = packageData?.maxNumberOfBuildings ?? Infinity;
            setMaxBuildingAllowed(maxBuilding);
        };

        fetchInfo();
    }, [isCreateModalOpen]);

    const handleCloseCreateModal = () => {
        form.resetFields();
        setIsCreateModalOpen(false);
    };

    const onFinish = async (values: any) => {
        if (buildingCount >= maxBuildingAllowed) {
            return notification.error({
                message: "Vượt giới hạn gói",
                description: `Bạn chỉ được phép tạo tối đa ${maxBuildingAllowed} nhà trọ theo gói hiện tại.`
            });
        }

        setIsCreating(true);
        const res = await handleCreateBuilding(values);
        setIsCreating(false);

        if (res?.data) {
            handleCloseCreateModal();
            message.success("Tạo nhà trọ thành công!");
        } else {
            notification.error({
                message: "Lỗi tạo nhà",
                description: res?.message || "Đã có lỗi xảy ra."
            });
        }
    };
    return (
        <Modal
            title="Thêm mới nhà trọ"
            open={isCreateModalOpen}
            onOk={() => form.submit()}
            onCancel={handleCloseCreateModal}
            maskClosable={false}
            confirmLoading={isCreating}
        >
            <Form
                name="basic"
                onFinish={onFinish}
                layout="vertical"
                form={form}
            >
                <Row gutter={[15, 15]}>
                    <Col span={24} md={12}>
                        <Form.Item label="Tên nhà trọ" name="name" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={24} md={12}>
                        <Form.Item label="Địa chỉ" name="address" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={24} md={12}>
                        <Form.Item label="Tổng số phòng" name="totalRooms">
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={24} md={12}>
                        <Form.Item label="Trung bình số người tối đa/phòng" name="numberOfPeopleRoom">
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={24} md={12}>
                        <Form.Item label="Giá trung bình mỗi phòng" name="priceOfRoom">
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={24} md={12}>
                        <Form.Item label="Giá gửi xe" name="shippingPrice">
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
};

export default BuildingCreate;
