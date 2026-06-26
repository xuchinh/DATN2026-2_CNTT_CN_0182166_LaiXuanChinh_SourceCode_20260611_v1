
import {
    Modal, Input,
    Form, Row, Col, message,
    notification,
    Select, Upload, UploadFile
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { handleBuilding, handleUpdateRoom } from '../requests/room.requests';


interface IProps {
    isUpdateModalOpen: boolean;
    setIsUpdateModalOpen: (v: boolean) => void;
    dataUpdate: any;
    setDataUpdate: any;
}

// Upload 1 ảnh lên /api/upload → trả về URL public (/uploads/...).
const handleUploadImage = async (file: File): Promise<string | null> => {
    const formData = new FormData();
    formData.append("file", file);
    try {
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        const data = await res.json();
        return data.url ?? null;
    } catch (error) {
        console.error("Upload error:", error);
        message.error("Tải ảnh thất bại");
        return null;
    }
};

const onPreviewImage = async (file: UploadFile) => {
    let src = file.url as string;
    if (!src && file.originFileObj) {
        src = URL.createObjectURL(file.originFileObj as Blob);
    }
    if (src) window.open(src);
};

const RoomUpdate = (props: IProps) => {

    const {
        isUpdateModalOpen, setIsUpdateModalOpen,
        dataUpdate, setDataUpdate
    } = props;

    const [form] = Form.useForm();
    const [featureOptions, setFeatureOptions] = useState<any[]>([]);
    const [imageFileList, setImageFileList] = useState<UploadFile[]>([]);

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
            // Nạp sẵn ảnh hiện có để hiển thị / thêm / xóa.
            const existing = (dataUpdate.images ?? []).map((url: string, i: number) => ({
                uid: `existing-${i}`,
                name: url.split('/').pop() || `image-${i}`,
                status: 'done' as const,
                url,
            }));
            setImageFileList(existing);
        }
    }, [isUpdateModalOpen, dataUpdate])

    const handleCloseUpdateModal = () => {
        form.resetFields()
        setImageFileList([]);
        setIsUpdateModalOpen(false);
        setDataUpdate(null)
    }

    const onFinish = async (values: any) => {
        if (dataUpdate) {
            const { code, acreage, kitchen, toilet, washroom, totalPeople, price, payment } = values;
            // Ảnh giữ lại (url cũ) + ảnh mới upload → mảng URL theo thứ tự hiện tại.
            const images: string[] = [];
            for (const f of imageFileList) {
                if (f.originFileObj) {
                    const url = await handleUploadImage(f.originFileObj as File);
                    if (url) images.push(url);
                } else if (f.url) {
                    images.push(f.url);
                }
            }
            const res = await handleUpdateRoom({
                _id: dataUpdate._id, code, acreage, kitchen, toilet, washroom, totalPeople, price, payment, images
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
                    <Col span={24}>
                        <Form.Item label="Ảnh phòng (ảnh đầu tiên là ảnh bìa)">
                            <Upload
                                listType="picture-card"
                                multiple
                                accept="image/*"
                                fileList={imageFileList}
                                beforeUpload={() => false}
                                onChange={({ fileList }) => setImageFileList(fileList)}
                                onPreview={onPreviewImage}
                            >
                                {imageFileList.length >= 12 ? null : (
                                    <div>
                                        <PlusOutlined />
                                        <div style={{ marginTop: 8 }}>Tải ảnh</div>
                                    </div>
                                )}
                            </Upload>
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
