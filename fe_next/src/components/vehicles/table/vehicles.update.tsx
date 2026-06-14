import {
    Modal, Input,
    Form, Row, Col, message,
    notification,
    Select,
    DatePicker
} from 'antd';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { handleRoom, handleUpdateVehicle } from '../requests/vehicles.requests';



interface IProps {
    isUpdateModalOpen: boolean;
    setIsUpdateModalOpen: (v: boolean) => void;
    dataUpdate: any;
    setDataUpdate: any;
}

const VehicleUpdate = (props: IProps) => {

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
                shippingPrice: dataUpdate.shippingPrice,
                fromDate: dataUpdate.fromDate ? dayjs(dataUpdate.fromDate, 'DD/MM/YYYY') : null,
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
            const { shippingPrice, fromDate } = values;
            const res = await handleUpdateVehicle({
                _id: dataUpdate._id, shippingPrice, fromDate, status: '1'
            })
            if (res?.data) {
                handleCloseUpdateModal();
                message.success("Update Vehicle succeed")
            } else {
                notification.error({
                    message: "Update Vehicle error",
                    description: res?.message
                })
            }

        }
    };

    return (
        <Modal
            title="Cập nhật phiếu giứ xe"
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
                        <Form.Item label="Giá giữ xe" name="shippingPrice">
                            <Input type="number" />
                        </Form.Item>
                    </Col>
                    <Col span={24} md={12}>
                        <Form.Item label="Từ ngày" name="fromDate">
                            <DatePicker format="DD/MM/YYYY" />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    )
}

export default VehicleUpdate;

