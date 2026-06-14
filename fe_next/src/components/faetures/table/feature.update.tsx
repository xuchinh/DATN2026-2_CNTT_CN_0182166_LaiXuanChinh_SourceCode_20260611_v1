
import {
    Modal, Input,
    Form, Row, Col, message,
    notification,
    Select
} from 'antd';
import { useEffect } from 'react';
import { handleUpdateFeature } from '../requests/feature.requests';


interface IProps {
    isUpdateModalOpen: boolean;
    setIsUpdateModalOpen: (v: boolean) => void;
    dataUpdate: any;
    setDataUpdate: any;
}

const FeatureUpdate = (props: IProps) => {

    const {
        isUpdateModalOpen, setIsUpdateModalOpen,
        dataUpdate, setDataUpdate
    } = props;

    const [form] = Form.useForm();

    useEffect(() => {
        if (dataUpdate) {
            //code
            form.setFieldsValue({
                code: dataUpdate.code,
                name: dataUpdate.name,
                systemRoles: dataUpdate.systemRoles,
                path: dataUpdate.path,
                displayName: dataUpdate.displayName,
                description: dataUpdate.description,
                menuCode: dataUpdate.menuCode,

            })
        }
    }, [dataUpdate])
    const handleCloseUpdateModal = () => {
        form.resetFields()
        setIsUpdateModalOpen(false);
        setDataUpdate(null)
    }

    const onFinish = async (values: any) => {
        if (dataUpdate) {
            const { name, systemRoles, path, description, displayName, menuCode } = values;
            const res = await handleUpdateFeature({
                _id: dataUpdate._id, name, systemRoles, path, description, displayName, menuCode
            })
            if (res?.data) {
                handleCloseUpdateModal();
                message.success("Update Feature succeed")
            } else {
                notification.error({
                    message: "Update Feature error",
                    description: res?.message
                })
            }

        }
    };

    return (
        <Modal
            title="Sửa chức năng"
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
                        <Form.Item label="Mã chức năng" name="code">
                            <Input disabled />
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
                        <Form.Item label="Miêu tả" name="description">
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={24} md={12}>
                        <Form.Item label="Vai trò được dùng" name="systemRoles">
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={24} md={12}>
                        <Form.Item label="Đường dẫn" name="path">
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
    )
}

export default FeatureUpdate;
