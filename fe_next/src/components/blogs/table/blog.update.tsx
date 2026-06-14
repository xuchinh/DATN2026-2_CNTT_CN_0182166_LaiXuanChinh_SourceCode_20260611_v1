import {
    Modal, Input, Form, Row, Col, message, notification, Upload, UploadFile, Button
} from 'antd';
import { useEffect, useState } from 'react';
import { handleUpdateBlogs } from '../requests/blog.requests';
import { UploadOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';

interface IProps {
    isUpdateModalOpen: boolean;
    setIsUpdateModalOpen: (v: boolean) => void;
    dataUpdate: any;
    setDataUpdate: any;
}

interface BlogContent {
    index?: string;
    Content1?: string;
    image?: string;
    Content2?: string;
}

const BlogsUpdate = ({ isUpdateModalOpen, setIsUpdateModalOpen, dataUpdate, setDataUpdate }: IProps) => {
    const [form] = Form.useForm();
    const [contents, setContents] = useState<BlogContent[]>([]);
    const [fileLists, setFileLists] = useState<Record<string, UploadFile[]>>({
        mainImage: []
    });
    // Upload ảnh
    const uploadImage = async (fileList: UploadFile[], oldUrl: string) => {
        if (fileList.length > 0 && fileList[0].originFileObj) {
            const formData = new FormData();
            formData.append("file", fileList[0].originFileObj as File);
            try {
                const uploadRes = await fetch("/api/upload", { method: "POST", body: formData });
                const uploadData = await uploadRes.json();
                if (uploadRes.ok && uploadData?.url) return uploadData.url;
                throw new Error("Upload failed");
            } catch (err) {
                message.error("Tải ảnh thất bại");
                return oldUrl;
            }
        }
        return oldUrl;
    };

    useEffect(() => {
        if (dataUpdate) {
            // Set form fields
            form.setFieldsValue({
                title: dataUpdate.title,
                introduce: dataUpdate.introduce,
                conclusion: dataUpdate.conclusion,
            });

            // Main image
            const mainImgList: UploadFile[] = dataUpdate.mainImage
                ? [{ uid: "-1", name: "mainImage.jpg", status: "done", url: dataUpdate.mainImage }]
                : [];
            const initFileLists: Record<string, UploadFile[]> = { mainImage: mainImgList };

            // Content images
            (dataUpdate.Content || []).forEach((c: BlogContent, idx: number) => {
                initFileLists[`content_image_${idx}`] = c.image
                    ? [{ uid: `-${idx}`, name: `content_${idx}.jpg`, status: "done", url: c.image }]
                    : [];
            });

            setContents(dataUpdate.Content || []);
            setFileLists(initFileLists);
        }
    }, [dataUpdate, form]);
    const handleClose = () => {
        setIsUpdateModalOpen(false);
        setDataUpdate(null);
        setContents([]);
        setFileLists({ mainImage: [] });
        form.resetFields();
    };
    const handleContentChange = (i: number, key: keyof BlogContent, value: any) => {
        const newList = [...contents];
        newList[i][key] = value;
        setContents(newList);
    };

    const addContent = () => {
        const idx = contents.length;
        setContents([...contents, { index: '', Content1: '', image: '', Content2: '' }]);
        setFileLists(prev => ({ ...prev, [`content_image_${idx}`]: [] }));
    };

    const removeContent = (i: number) => {
        const newList = [...contents];
        newList.splice(i, 1);
        setContents(newList);
    };

    const onFinish = async (values: any) => {
        if (!dataUpdate) return;

        // Upload ảnh chính
        const mainImageUrl = await uploadImage(fileLists.mainImage || [], dataUpdate.mainImage);

        // Upload ảnh trong từng mục
        const updatedContents = await Promise.all(
            contents.map(async (item, idx) => {
                const url = await uploadImage(fileLists[`content_image_${idx}`] || [], item.image || '');
                return { ...item, image: url };
            })
        );

        const payload = {
            _id: dataUpdate._id,
            ...values,
            mainImage: mainImageUrl,
            Content: updatedContents
        };

        const res = await handleUpdateBlogs(payload);
        if (res?.data) {
            message.success("Cập nhật blog thành công");
            handleClose();
        } else {
            notification.error({ message: "Lỗi khi cập nhật", description: res?.message });
        }
    };

    const renderUpload = (field: string) => (
        <Upload
            accept="image/*"
            maxCount={1}
            fileList={fileLists[field] || []}
            listType="picture"
            beforeUpload={() => false}
            onChange={({ fileList }) => setFileLists(prev => ({ ...prev, [field]: fileList }))}
        >
            <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
        </Upload>
    );

    return (
        <Modal
            title="Cập nhật Blog"
            open={isUpdateModalOpen}
            onOk={() => form.submit()}
            onCancel={handleClose}
            maskClosable={false}
            width={900}
        >
            <Form form={form} layout="vertical" onFinish={onFinish}>
                <Row gutter={[15, 15]}>
                    <Col span={24}>
                        <Form.Item label="Ảnh nền" name="mainImage">
                            {renderUpload("mainImage")}
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item label="Tiêu đề" name="title" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item label="Giới thiệu" name="introduce">
                            <Input.TextArea />
                        </Form.Item>
                    </Col>

                    <Col span={24}><h3>Nội dung bài viết</h3></Col>
                    {contents.map((content, idx) => (
                        <Col span={24} key={idx} style={{ border: '1px solid #eee', padding: 10, borderRadius: 8, marginBottom: 10 }}>
                            <Form.Item label="Tiêu đề mục">
                                <Input
                                    value={content.index}
                                    onChange={e => handleContentChange(idx, 'index', e.target.value)}
                                />
                            </Form.Item>
                            <Form.Item label="Nội dung 1">
                                <Input.TextArea
                                    value={content.Content1}
                                    onChange={e => handleContentChange(idx, 'Content1', e.target.value)}
                                />
                            </Form.Item>
                            <Form.Item label="Ảnh">
                                {renderUpload(`content_image_${idx}`)}
                            </Form.Item>
                            <Form.Item label="Nội dung 2">
                                <Input.TextArea
                                    value={content.Content2}
                                    onChange={e => handleContentChange(idx, 'Content2', e.target.value)}
                                />
                            </Form.Item>
                            <Button danger icon={<DeleteOutlined />} onClick={() => removeContent(idx)}>
                                Xóa mục này
                            </Button>
                        </Col>
                    ))}

                    <Col span={24}>
                        <Button type="dashed" icon={<PlusOutlined />} onClick={addContent} block>
                            Thêm nội dung
                        </Button>
                    </Col>

                    <Col span={24}>
                        <Form.Item label="Tổng kết" name="conclusion">
                            <Input.TextArea />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
};

export default BlogsUpdate;
