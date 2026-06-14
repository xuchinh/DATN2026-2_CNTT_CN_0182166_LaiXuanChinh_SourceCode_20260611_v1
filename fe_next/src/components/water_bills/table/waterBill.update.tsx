import {
    Modal, Input,
    Form, Row, Col, message,
    notification,
    Select,
    DatePicker
} from 'antd';
import { useEffect, useState } from 'react';
import { handleRoom, handleUpdateWaterBill } from '../requests/waterBill.requests';
import dayjs from 'dayjs';



interface IProps {
    isUpdateModalOpen: boolean;
    setIsUpdateModalOpen: (v: boolean) => void;
    dataUpdate: any;
    setDataUpdate: any;
}

const WaterBillUpdate = (props: IProps) => {

    const {
        isUpdateModalOpen, setIsUpdateModalOpen,
        dataUpdate, setDataUpdate
    } = props;

    const [form] = Form.useForm();
    const [roomOptions, setRoomOptions] = useState<any[]>([]);

    // Lấy danh sách chức năng từ API
    const fetchRoomOptions = async () => {
        const res = await handleRoom();
        const results = res?.data?.results ?? [];
        setRoomOptions(results);
    };

    useEffect(() => {
        if (isUpdateModalOpen) {
            fetchRoomOptions();
        }
        if (dataUpdate) {
            //code
            form.setFieldsValue({
                waterPrice: dataUpdate.waterPrice,
                // amount: dataUpdate.amount,
                status: '1',
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
            const { waterPrice, amount } = values;
            const toDate = new Date();
            const res = await handleUpdateWaterBill({
                _id: dataUpdate._id, waterPrice, amount, toDate, status: '1', fromDate: dataUpdate.toDate,
            })
            if (res?.data) {
                handleCloseUpdateModal();
                message.success("Update WaterBill succeed")
            } else {
                notification.error({
                    message: "Update WaterBill error",
                    description: res?.message
                })
            }

        }
    };

    return (
        <Modal
            title="Cập nhật tiền nước"
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
                        <Form.Item label="Số nước" name="amount" rules={[{ required: true, message: 'Nhập số nước' }]}>
                            <Input type="number" />
                        </Form.Item>
                    </Col>
                    <Col span={24} md={12}>
                        <Form.Item label="Giá nước" name="waterPrice">
                            <Input type="number" />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    )
}

export default WaterBillUpdate;

