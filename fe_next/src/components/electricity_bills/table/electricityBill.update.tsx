import {
    Modal, Input,
    Form, Row, Col, message,
    notification,
    Select,
    DatePicker
} from 'antd';
import { useEffect, useState } from 'react';
import { handleRoom, handleUpdateElectricityBill } from '../requests/electricityBill.requests';
import dayjs from 'dayjs';



interface IProps {
    isUpdateModalOpen: boolean;
    setIsUpdateModalOpen: (v: boolean) => void;
    dataUpdate: any;
    setDataUpdate: any;
}

const ElectricityBillUpdate = (props: IProps) => {

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
                eletricPrice: dataUpdate.eletricPrice,
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
            const { eletricPrice, amount } = values;

            const toDate = new Date();
            const res = await handleUpdateElectricityBill({
                _id: dataUpdate._id, eletricPrice, amount, toDate, status: '1', fromDate: dataUpdate.toDate
            })
            if (res?.data) {
                handleCloseUpdateModal();
                message.success("Update ElectricityBill succeed")
            } else {
                notification.error({
                    message: "Update ElectricityBill error",
                    description: res?.message
                })
            }

        }
    };

    return (
        <Modal
            title="Cập nhật tiền điện"
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
                        <Form.Item label="Số điện" name="amount" rules={[{ required: true, message: 'Nhập số nước' }]}>
                            <Input type="number" />
                        </Form.Item>
                    </Col>
                    <Col span={24} md={12}>
                        <Form.Item label="Giá điện" name="eletricPrice">
                            <Input type="number" />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    )
}

export default ElectricityBillUpdate;

