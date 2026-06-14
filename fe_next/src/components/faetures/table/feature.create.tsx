import {
    Modal, Input, Form, Row, Col, message,
    notification,
    Select
} from 'antd';
import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { handleCreateFeature } from '../requests/feature.requests';


interface IProps {
    isCreateModalOpen: boolean;
    setIsCreateModalOpen: (v: boolean) => void;
}

const FeatureCreate = (props: IProps) => {
    const { isCreateModalOpen, setIsCreateModalOpen } = props;
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
        const res = await handleCreateFeature(values);
        if (res?.data) {
            handleCloseCreateModal();
            message.success("Create succeed!");
        } else {
            notification.error({
                message: "Create Feature error",
                description: res?.message
            });
        }
    };

    return (
        <Modal
            title="Thêm mới chức năng"
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
                        <Form.Item label="Mã chức năng" name="code">
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={24} md={12}>
                        <Form.Item label="Tên chức năng" name="name">
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={24} md={12}>
                        <Form.Item label="Tên hiễn thị" name="displayName">
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={24} md={12}>
                        <Form.Item label="Ghi chú" name="description">
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={24} md={12}>
                        <Form.Item label="vai trò được dùng" name="systemRoles">
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={24} md={12}>
                        <Form.Item label="đường dẫn" name="path">
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={24} md={12}>
                        <Form.Item label="STT trong sidebar" name="menuCode">
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
};

export default FeatureCreate;