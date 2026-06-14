import {
    Modal, Input, Form, Row, Col, message,
    notification,
    Select
} from 'antd';
import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { handleFeatureIsCode } from '@/components/packages/requests/package.requests';
import { handleCreaterVehicle } from '@/components/users/requests/user.requests';


interface IProps {
    isCreateModalOpen: boolean;
    setIsCreateModalOpen: (v: boolean) => void;
    onSuccess?: () => void;
}

const VehicleCreate = (props: IProps) => {
    const { isCreateModalOpen, setIsCreateModalOpen, onSuccess } = props;
    const [form] = Form.useForm();
    const { data: session } = useSession();

    // Set userID vào form khi modal mở
    useEffect(() => {
        if (isCreateModalOpen && session?.user?._id) {
            form.setFieldsValue({ userId: session.user._id });
        }
    }, [isCreateModalOpen, session]);

    const handleCloseCreateModal = () => {
        form.resetFields();
        setIsCreateModalOpen(false);
    };
    const onFinish = async (values: any) => {
        const res = await handleCreaterVehicle(values);
        if (res?.data) {
            handleCloseCreateModal();
            message.success("Create succeed!");
            if (onSuccess) onSuccess();
        } else {
            notification.error({
                message: "Create Offer error",
                description: res?.message
            });
        }
    };

    return (
        <Modal
            title="Thêm phương tiện mới"
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

export default VehicleCreate;