
import {
    Modal, Input,
    Form, Row, Col, message,
    notification,
    Select
} from 'antd';
import { useEffect, useState } from 'react';
import { handleBuilding, handleUpdateRoom } from '../requests/room.requests';


interface IProps {
    isUpdateModalOpen: boolean;
    setIsUpdateModalOpen: (v: boolean) => void;
    dataUpdate: any;
    setDataUpdate: any;
}

const RoomUpdate = (props: IProps) => {

    const {
        isUpdateModalOpen, setIsUpdateModalOpen,
        dataUpdate, setDataUpdate
    } = props;

    const [form] = Form.useForm();
    const [featureOptions, setFeatureOptions] = useState<any[]>([]);

    // Lấy danh sách chức năng từ API
    const fetchFeatureOptions = async () => {
        const res = await handleBuilding();
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
                acreage: dataUpdate.acreage,
                kitchen: dataUpdate.kitchen,
                toilet: dataUpdate.toilet,
                washroom: dataUpdate.washroom,
                totalPeople: dataUpdate.totalPeople,
                price: dataUpdate.price,
                payment: dataUpdate.payment,
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
            const { code, acreage, kitchen, toilet, washroom, totalPeople, price, payment } = values;
            const res = await handleUpdateRoom({
                _id: dataUpdate._id, code, acreage, kitchen, toilet, washroom, totalPeople, price, payment
            })
            if (res?.data) {
                handleCloseUpdateModal();
                message.success("Update Room succeed")
            } else {
                notification.error({
                    message: "Update Room error",
                    description: res?.message
                })
            }

        }
    };

    return (
        <Modal
            title="Sửa phòng"
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
                        <Form.Item label="Mã phòng" name="code">
                            <Input disabled />
                        </Form.Item>
                    </Col>
                    <Col span={24} md={12}>
                        <Form.Item label="Diện tích " name="acreage">
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={24} md={12}>
                        <Form.Item label="Phòng bếp riêng" name="kitchen">
                            <Select placeholder="Chọn trạng thái">
                                <Select.Option value={true}>Có</Select.Option>
                                <Select.Option value={false}>Không có</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={24} md={12}>
                        <Form.Item label="Phòng vệ sinh riêng" name="toilet">
                            <Select placeholder="Chọn trạng thái">
                                <Select.Option value={true}>Có</Select.Option>
                                <Select.Option value={false}>Không có</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={24} md={12}>
                        <Form.Item label="Phòng giặt riêng" name="washroom">
                            <Select placeholder="Chọn trạng thái">
                                <Select.Option value={true}>Có</Select.Option>
                                <Select.Option value={false}>Không có</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={24} md={12}>
                        <Form.Item label="Số người tối đa" name="totalPeople">
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={24} md={12}>
                        <Form.Item label="Giá" name="price">
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={24} md={12}>
                        <Form.Item label="Tiền cọc" name="payment">
                            <Input />
                        </Form.Item>
                    </Col>
                    {/* <Col span={24} md={12}>
                        <Form.Item label="nhà" name="buildingId">
                            <Select
                                placeholder="Chọn nhà"
                                allowClear
                            >
                                {featureOptions.map((item) => (
                                    <Select.Option key={item._id} value={item._id}>
                                        {item.name}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col> */}
                </Row>
            </Form>
        </Modal>
    )
}

export default RoomUpdate;
