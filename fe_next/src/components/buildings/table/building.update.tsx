
import {
    Modal, Input,
    Form, Row, Col, message,
    notification
} from 'antd';
import { useEffect } from 'react';
import { handleUpdateBuilding } from '../requests/building.requests';

interface IProps {
    isUpdateModalOpen: boolean;
    setIsUpdateModalOpen: (v: boolean) => void;
    dataUpdate: any;
    setDataUpdate: any;
}

const BuildingUpdate = (props: IProps) => {

    const {
        isUpdateModalOpen, setIsUpdateModalOpen,
        dataUpdate, setDataUpdate
    } = props;

    const [form] = Form.useForm();

    useEffect(() => {
        if (dataUpdate) {
            //code
            form.setFieldsValue({
                name: dataUpdate.name,
                address: dataUpdate.address,
                totalRooms: dataUpdate.totalRooms,
                numberOfPeopleRoom: dataUpdate.numberOfPeopleRoom,
                numberOfRoomsRented: dataUpdate.numberOfRoomsRented,
                priceOfRoom: dataUpdate.priceOfRoom,
                shippingPrice: dataUpdate.shippingPrice,
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
            const { name, address, totalRooms, numberOfPeopleRoom, numberOfRoomsRented, priceOfRoom, shippingPrice } = values;
            const res = await handleUpdateBuilding({
                _id: dataUpdate._id, name, address, totalRooms, numberOfPeopleRoom, numberOfRoomsRented, priceOfRoom, shippingPrice
            })
            if (res?.data) {
                handleCloseUpdateModal();
                message.success("Update user succeed")
            } else {
                notification.error({
                    message: "Update Building error",
                    description: res?.message
                })
            }

        }
    };

    return (
        <Modal
            title="Sửa nhà trọ"
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
                        <Form.Item label="Tên nhà trọ" name="name">
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={24} md={12}>
                        <Form.Item label="Địa chỉ" name="address">
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={24} md={12}>
                        <Form.Item label="tổng số phòng" name="totalRooms">
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={24} md={12}>
                        <Form.Item label="Trung bình số người tối đa/phòng" name="numberOfPeopleRoom">
                            <Input />
                        </Form.Item>
                    </Col>
                    {/* <Col span={24} md={12}>
                        <Form.Item label="Number Of Rooms Rented" name="numberOfRoomsRented">
                            <Input />
                        </Form.Item>
                    </Col> */}
                    <Col span={24} md={12}>
                        <Form.Item label="Giá trung bình mỗi phòng" name="priceOfRoom">
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={24} md={12}>
                        <Form.Item label="Giá gửi xe" name="shippingPrice">
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    )
}

export default BuildingUpdate;
