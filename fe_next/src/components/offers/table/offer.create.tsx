import {
    Modal, Input, Form, Row, Col, message,
    notification,
    Select
} from 'antd';
import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { handleCreateOffer } from '../requests/offer.requests';
import { handleFeatureIsCode } from '@/components/packages/requests/package.requests';


interface IProps {
    isCreateModalOpen: boolean;
    setIsCreateModalOpen: (v: boolean) => void;
}

const OfferCreate = (props: IProps) => {
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
        const res = await handleCreateOffer(values);
        if (res?.data) {
            handleCloseCreateModal();
            message.success("Create succeed!");
        } else {
            notification.error({
                message: "Create Offer error",
                description: res?.message
            });
        }
    };

    return (
        <Modal
            title="Thêm mới khuyến mãi"
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
                        <Form.Item label="Mã khuyến mãi" name="code">
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={24} md={12}>
                        <Form.Item label="Tên khuyến mãi" name="name">
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={24} md={12}>
                        <Form.Item label="Ghi chú" name="description">
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={24} md={12}>
                        <Form.Item label="Giảm giá theo %" name="discountPercentage">
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={24} md={12}>
                        <Form.Item label="Giảm giá theo tiền mặt" name="discountCurrency">
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={24} md={12}>
                        <Form.Item label="Điều kiện kích hoạt theo số tháng" name="condition">
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={24} md={12}>
                        <Form.Item label="Trạng thái" name="isActive">
                            <Select placeholder="Chọn trạng thái">
                                <Select.Option value={true}>Hoạt động</Select.Option>
                                <Select.Option value={false}>Không hoạt động</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
};

export default OfferCreate;