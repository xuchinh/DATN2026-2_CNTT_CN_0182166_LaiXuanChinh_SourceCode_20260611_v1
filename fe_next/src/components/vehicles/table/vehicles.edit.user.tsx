'use client';

import { Modal, Input, Form, Row, Col, message, notification } from 'antd';
import { useEffect } from 'react';
import { handleUpdateVehicle } from '@/components/vehicles/requests/vehicles.requests';

interface IProps {
    isEditModalOpen: boolean;
    setIsEditModalOpen: (v: boolean) => void;
    dataEdit: any;
    onSuccess?: () => void;
}

// Modal cho phép KHÁCH THUÊ tự chỉnh sửa thông tin phương tiện đã nhập
const VehicleEditUser = ({ isEditModalOpen, setIsEditModalOpen, dataEdit, onSuccess }: IProps) => {
    const [form] = Form.useForm();

    useEffect(() => {
        if (isEditModalOpen && dataEdit) {
            form.setFieldsValue({
                type: dataEdit.type,
                price: dataEdit.price,
                licensePlate: dataEdit.licensePlate,
            });
        }
    }, [isEditModalOpen, dataEdit]);

    const handleClose = () => {
        form.resetFields();
        setIsEditModalOpen(false);
    };

    const onFinish = async (values: any) => {
        const res = await handleUpdateVehicle({ _id: dataEdit._id, ...values });
        if (res?.statusCode === 200 || res?.data) {
            handleClose();
            message.success('Cập nhật phương tiện thành công!');
            if (onSuccess) onSuccess();
        } else {
            notification.error({
                message: 'Cập nhật phương tiện thất bại',
                description: res?.message,
            });
        }
    };

    return (
        <Modal
            title="Chỉnh sửa phương tiện"
            open={isEditModalOpen}
            onOk={() => form.submit()}
            onCancel={handleClose}
            maskClosable={false}
        >
            <Form name="vehicle-edit-user" onFinish={onFinish} layout="vertical" form={form}>
                <Row gutter={[15, 15]}>
                    <Col span={24} md={12}>
                        <Form.Item label="Loại" name="type">
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={24} md={12}>
                        <Form.Item label="Giá" name="price">
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={24} md={12}>
                        <Form.Item label="Biển số" name="licensePlate">
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
};

export default VehicleEditUser;
