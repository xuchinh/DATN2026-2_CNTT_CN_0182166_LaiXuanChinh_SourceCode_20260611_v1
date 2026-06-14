
import {
    Modal, Input,
    Form, Row, Col, message,
    notification,
    Select
} from 'antd';
import { useEffect } from 'react';
import { handleUpdateOffer } from '../requests/offer.requests';


interface IProps {
    isUpdateModalOpen: boolean;
    setIsUpdateModalOpen: (v: boolean) => void;
    dataUpdate: any;
    setDataUpdate: any;
}

const OfferUpdate = (props: IProps) => {

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
                description: dataUpdate.description,
                discountCurrency: dataUpdate.discountCurrency,
                discountPercentage: dataUpdate.discountPercentage,
                isActive: dataUpdate.isActive,
                condition: dataUpdate.condition,

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
            const { name, description, discountCurrency, discountPercentage, isActive, condition } = values;
            const res = await handleUpdateOffer({
                _id: dataUpdate._id, name, description, discountCurrency, discountPercentage, isActive, condition
            })
            if (res?.data) {
                handleCloseUpdateModal();
                message.success("Update offer succeed")
            } else {
                notification.error({
                    message: "Update Offer error",
                    description: res?.message
                })
            }

        }
    };

    return (
        <Modal
            title="Sửa khuyến mãi"
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
                        <Form.Item label="Mã khuyến mãi" name="code">
                            <Input disabled />
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
    )
}

export default OfferUpdate;
