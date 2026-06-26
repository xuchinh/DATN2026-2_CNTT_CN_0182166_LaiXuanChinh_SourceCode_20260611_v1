import {
    Modal, Input, Form, Row, Col, message,
    notification,
    Select, Upload, UploadFile
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { handleCreateRoom, handleBuilding } from '../requests/room.requests';


interface IProps {
    isCreateModalOpen: boolean;
    setIsCreateModalOpen: (v: boolean) => void;
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

const RoomCreate = (props: IProps) => {
    const { isCreateModalOpen, setIsCreateModalOpen } = props;
    const [form] = Form.useForm();
    const { data: session } = useSession();
    const [buildingOptions, setBuildingOptions] = useState<any[]>([]);
    const [imageFileList, setImageFileList] = useState<UploadFile[]>([]);

    useEffect(() => {
        if (isCreateModalOpen) {
            fetchBuildingOptions();
        }
        if (isCreateModalOpen && session?.user?._id) {
            form.setFieldsValue({ userId: session.user._id });
        }
    }, [isCreateModalOpen, session]);

    const fetchBuildingOptions = async () => {
        const res = await handleBuilding();
        const results = res?.data?.results ?? [];
        setBuildingOptions(results);
    };


    const handleCloseCreateModal = () => {
        form.resetFields();
        setImageFileList([]);
        setIsCreateModalOpen(false);
    };
    const onFinish = async (values: any) => {
        // Upload các ảnh đã chọn → mảng URL theo đúng thứ tự (ảnh đầu = ảnh bìa).
        const images: string[] = [];
        for (const f of imageFileList) {
            if (f.originFileObj) {
                const url = await handleUploadImage(f.originFileObj as File);
                if (url) images.push(url);
            } else if (f.url) {
                images.push(f.url);
            }
        }
        const res = await handleCreateRoom({ ...values, images });
        if (res?.data) {
            // Hóa đơn điện/nước KHÔNG sinh ở đây nữa — sẽ tự sinh khi chủ trọ xác nhận khách thuê
            handleCloseCreateModal();
            message.success("Create succeed!");
        } else {
            notification.error({
                message: "Create Room error",
                description: res?.message
            });
        }
    };

    return (
        <Modal
            title="Thêm mới phòng"
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
                        <Form.Item label="Mã phòng" name="code">
                            <Input />
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
                        <Form.Item label="Các nhà" name="buildingId">
                            <Select
                                placeholder="Chọn nhà"
                                allowClear
                            >
                                {buildingOptions.map((item) => (
                                    <Select.Option key={item._id} value={item._id}>
                                        {item.name}
                                    </Select.Option>
                                ))}
                            </Select>
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
                        <Form.Item label="Trạng thái" name="isActive">
                            <Select placeholder="Chọn trạng thái">
                                <Select.Option value={true}>Hoạt động</Select.Option>
                                <Select.Option value={false}>Không hoạt động</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col> */}
                </Row>
            </Form>
        </Modal>
    );
};

export default RoomCreate;
