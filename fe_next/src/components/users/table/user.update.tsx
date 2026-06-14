import { handleUpdateUserAction } from '@/components/users/requests/user.requests';
import { UploadOutlined } from '@ant-design/icons';
import {
    Modal, Input,
    Form, Row, Col, message,
    notification,
    Upload,
    UploadFile
} from 'antd';
import { useEffect, useState } from 'react';

interface IProps {
    isUpdateModalOpen: boolean;
    setIsUpdateModalOpen: (v: boolean) => void;
    dataUpdate: any;
    setDataUpdate: any;
}
const UserUpdate = (props: IProps) => {
    const {
        isUpdateModalOpen, setIsUpdateModalOpen,
        dataUpdate, setDataUpdate
    } = props;

    const [form] = Form.useForm();
    const [fileList, setFileList] = useState<UploadFile[]>([]);

    useEffect(() => {
        if (dataUpdate) {
            form.setFieldsValue({
                name: dataUpdate.name,
                email: dataUpdate.email,
                phone: dataUpdate.phone,
                address: dataUpdate.address,
            });

            if (dataUpdate.avatar) {
                setFileList([{
                    uid: '-1',
                    name: 'avatar.png',
                    status: 'done',
                    url: dataUpdate.avatar, // preview ảnh đã có
                }]);
            } else {
                setFileList([]);
            }
        }
    }, [dataUpdate]);

    const handleCloseUpdateModal = () => {
        form.resetFields();
        setIsUpdateModalOpen(false);
        setDataUpdate(null);
        setFileList([]);
    };

    const onFinish = async (values: any) => {
        if (dataUpdate) {
            const { name, phone, address } = values;
            let avatar = dataUpdate?.avatar;

            // Nếu người dùng chọn ảnh mới
            if (fileList.length > 0 && fileList[0].originFileObj) {
                const formData = new FormData();
                formData.append('file', fileList[0].originFileObj as File);

                try {
                    const uploadRes = await fetch('/api/upload', {
                        method: 'POST',
                        body: formData,
                    });

                    const uploadData = await uploadRes.json();

                    if (uploadRes.ok && uploadData?.url) {
                        avatar = uploadData.url;
                    } else {
                        throw new Error('Upload failed');
                    }
                } catch (error) {
                    return notification.error({
                        message: 'Upload Error',
                        description: 'Không thể upload ảnh. Vui lòng thử lại.'
                    });
                }
            } else if (fileList.length === 0) {
                avatar = ''; // xóa ảnh
            }

            const res = await handleUpdateUserAction({
                _id: dataUpdate._id,
                name,
                phone,
                address,
                avatar
            });

            if (res?.data) {
                handleCloseUpdateModal();
                message.success("Cập nhật người dùng thành công");
            } else {
                notification.error({
                    message: "Lỗi khi cập nhật",
                    description: res?.message
                });
            }
        }
    };

    return (
        <Modal
            title="Update a user"
            open={isUpdateModalOpen}
            onOk={() => form.submit()}
            onCancel={handleCloseUpdateModal}
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
                        <Form.Item label="Email" name="email">
                            <Input type='email' disabled />
                        </Form.Item>
                    </Col>

                    <Col span={24} md={12}>
                        <Form.Item
                            label="Name"
                            name="name"
                            rules={[{ required: true, message: 'Please input your name!' }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>

                    <Col span={24} md={12}>
                        <Form.Item label="Phone" name="phone">
                            <Input />
                        </Form.Item>
                    </Col>

                    <Col span={24} md={12}>
                        <Form.Item label="Address" name="address">
                            <Input />
                        </Form.Item>
                    </Col>

                    <Col span={24} md={12}>
                        <Form.Item label="Avatar">
                            <Upload
                                accept="image/*"
                                maxCount={1}
                                fileList={fileList}
                                listType="picture"
                                beforeUpload={() => false}
                                onChange={({ fileList }) => setFileList(fileList)}
                            >
                                <UploadOutlined /> Chọn ảnh
                            </Upload>

                            {/* Hiển thị preview */}
                            {fileList.length > 0 && (
                                <img
                                    src={fileList[0].originFileObj
                                        ? URL.createObjectURL(fileList[0].originFileObj)
                                        : (fileList[0].url || '')
                                    }
                                    alt="Preview"
                                    className="w-24 h-24 object-cover rounded mt-2"
                                />
                            )}
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
};

export default UserUpdate;