
import {
    Modal, Input,
    Form, Row, Col, message,
    notification,
    Select
} from 'antd';
import { useEffect, useState } from 'react';
import { handleFeatureIsCode, handleUpdatePackage } from '../requests/package.requests';


interface IProps {
    isUpdateModalOpen: boolean;
    setIsUpdateModalOpen: (v: boolean) => void;
    dataUpdate: any;
    setDataUpdate: any;
}

const PackageUpdate = (props: IProps) => {

    const {
        isUpdateModalOpen, setIsUpdateModalOpen,
        dataUpdate, setDataUpdate
    } = props;

    const [form] = Form.useForm();
    const [featureOptions, setFeatureOptions] = useState<any[]>([]);

    // Lấy danh sách chức năng từ API
    const fetchFeatureOptions = async () => {
        const res = await handleFeatureIsCode();
        const results = res?.data?.results ?? [];
        setFeatureOptions(results);
    };

    useEffect(() => {
        if (isUpdateModalOpen) {
            fetchFeatureOptions();
        }
        if (dataUpdate) {
            //code
            form.setFieldsValue({
                code: dataUpdate.code,
                name: dataUpdate.name,
                description: dataUpdate.description,
                price: dataUpdate.price,
                features: dataUpdate.features,
                isActive: dataUpdate.isActive,
                totalBuilding: dataUpdate.totalBuilding,
            })
        }
    }, [isUpdateModalOpen, dataUpdate])

    const handleCloseUpdateModal = () => {
        form.resetFields()
        setIsUpdateModalOpen(false);
        setDataUpdate(null)
    }

    const onFinish = async (values: any) => {
        if (dataUpdate) {
            const { name, description, price, isActive, features, totalBuilding } = values;
            const res = await handleUpdatePackage({
                _id: dataUpdate._id, name, description, price, isActive, features, totalBuilding
            })
            if (res?.data) {
                handleCloseUpdateModal();
                message.success("Update Package succeed")
            } else {
                notification.error({
                    message: "Update Package error",
                    description: res?.message
                })
            }

        }
    };

    return (
        <Modal
            title="Sửa gói chức năng"
            open={isUpdateModalOpen}
            onOk={() => form.submit()}
            onCancel={() => handleCloseUpdateModal()}
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
                            <Input disabled />
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
    )
}

export default PackageUpdate;
