import {
    Modal, Input, Form, Row, Col, message,
    notification,
    Select
} from 'antd';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { handleCreatePackage, handleFeatureIsCode } from '../requests/package.requests';


interface IProps {
    isCreateModalOpen: boolean;
    setIsCreateModalOpen: (v: boolean) => void;
}

const PackageCreate = (props: IProps) => {
    const { isCreateModalOpen, setIsCreateModalOpen } = props;
    const [form] = Form.useForm();
    const { data: session } = useSession();
    const [featureOptions, setFeatureOptions] = useState<any[]>([]);

    // Set userID vào form khi modal mở
    useEffect(() => {
        if (isCreateModalOpen) {
            fetchFeatureOptions();
        }
        if (isCreateModalOpen && session?.user?._id) {
            form.setFieldsValue({ userId: session.user._id });
        }
    }, [isCreateModalOpen, session]);

    const fetchFeatureOptions = async () => {
        const res = await handleFeatureIsCode();
        const results = res?.data?.results ?? [];
        setFeatureOptions(results); // cập nhật danh sách chức năng
    };


    const handleCloseCreateModal = () => {
        form.resetFields();
        setIsCreateModalOpen(false);
    };
    const onFinish = async (values: any) => {
        const res = await handleCreatePackage(values);
        if (res?.data) {
            handleCloseCreateModal();
            message.success("Create succeed!");
        } else {
            notification.error({
                message: "Create Package error",
                description: res?.message
            });
        }
    };

    return (
        <Modal
            title="Thêm mới gói chức năng"
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
                        <Form.Item label="Mã gói chức năng" name="code">
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={24} md={12}>
                        <Form.Item label="Tên gói chức năng" name="name">
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={24} md={12}>
                        <Form.Item label="Ghi chú" name="description">
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={24} md={12}>
                        <Form.Item label="Giá" name="price">
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={24} md={12}>
                        <Form.Item label="Tổng số nhà" name="totalBuilding">
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={24} md={12}>
                        <Form.Item label="Các chức năng" name="features">
                            <Select
                                placeholder="Chọn chức năng"
                                mode="multiple" // nếu chọn nhiều chức năng
                                allowClear
                            >
                                {featureOptions.map((item) => (
                                    <Select.Option key={item._id} value={item._id}>
                                        {item.displayName}
                                    </Select.Option>
                                ))}
                            </Select>
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

export default PackageCreate;