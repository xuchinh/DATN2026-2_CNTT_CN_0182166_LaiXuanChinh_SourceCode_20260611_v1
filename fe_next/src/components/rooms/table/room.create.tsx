import {
    Modal, Input, Form, Row, Col, message,
    notification,
    Select
} from 'antd';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { handleCreateRoom, handleBuilding, handleCreateWaterBill, handleCreateElectricityBill } from '../requests/room.requests';


interface IProps {
    isCreateModalOpen: boolean;
    setIsCreateModalOpen: (v: boolean) => void;
}

const RoomCreate = (props: IProps) => {
    const { isCreateModalOpen, setIsCreateModalOpen } = props;
    const [form] = Form.useForm();
    const { data: session } = useSession();
    const [buildingOptions, setBuildingOptions] = useState<any[]>([]);

    useEffect(() => {
        if (isCreateModalOpen) {
            fetchBuildingOptions();
        }
        if (isCreateModalOpen && session?.user?._id) {
            form.setFieldsValue({ userId: session.user._id });
        }
    }, [isCreateModalOpen, session]);

    const fetchBuildingOptions = async () => {
        const res = await handleBuilding();
        const results = res?.data?.results ?? [];
        setBuildingOptions(results);
    };


    const handleCloseCreateModal = () => {
        form.resetFields();
        setIsCreateModalOpen(false);
    };
    const onFinish = async (values: any) => {
        const res = await handleCreateRoom(values);
        if (res?.data) {
            const roomId = res.data._id;

            await handleCreateWaterBill(roomId);
            await handleCreateElectricityBill(roomId);

            handleCloseCreateModal();
            message.success("Create succeed!");
        } else {
            notification.error({
                message: "Create Room error",
                description: res?.message
            });
        }
    };

    return (
        <Modal
            title="Thêm mới phòng"
            open={isCreateModalOpen}
            onOk={() => form.submit()}
            onCancel={handleCloseCreateModal}
            maskClosable={false}
        >
            <Form
                name="basic"
                onFinish={onFinish}
                layout="vertical"
                form={form}
            >
                <Row gutter={[15, 15]}>
                    <Col span={24} md={12}>
                        <Form.Item label="Mã phòng" name="code">
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={24} md={12}>
                        <Form.Item label="Diện tích " name="acreage">
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={24} md={12}>
                        <Form.Item label="Phòng bếp riêng" name="kitchen">
                            <Select placeholder="Chọn trạng thái">
                                <Select.Option value={true}>Có</Select.Option>
                                <Select.Option value={false}>Không có</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={24} md={12}>
                        <Form.Item label="Phòng vệ sinh riêng" name="toilet">
                            <Select placeholder="Chọn trạng thái">
                                <Select.Option value={true}>Có</Select.Option>
                                <Select.Option value={false}>Không có</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={24} md={12}>
                        <Form.Item label="Phòng giặt riêng" name="washroom">
                            <Select placeholder="Chọn trạng thái">
                                <Select.Option value={true}>Có</Select.Option>
                                <Select.Option value={false}>Không có</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={24} md={12}>
                        <Form.Item label="Số người tối đa" name="totalPeople">
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={24} md={12}>
                        <Form.Item label="Giá" name="price">
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={24} md={12}>
                        <Form.Item label="Tiền cọc" name="payment">
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item label="Các nhà" name="buildingId">
                            <Select
                                placeholder="Chọn nhà"
                                allowClear
                            >
                                {buildingOptions.map((item) => (
                                    <Select.Option key={item._id} value={item._id}>
                                        {item.name}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    {/* <Col span={24} md={12}>
                        <Form.Item label="Trạng thái" name="isActive">
                            <Select placeholder="Chọn trạng thái">
                                <Select.Option value={true}>Hoạt động</Select.Option>
                                <Select.Option value={false}>Không hoạt động</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col> */}
                </Row>
            </Form>
        </Modal>
    );
};

export default RoomCreate;
