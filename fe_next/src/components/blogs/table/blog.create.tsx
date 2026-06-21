import {
    Modal, Input, Form, Row, Col, message, notification, Select, Upload, UploadFile, Button
} from 'antd';
import { useEffect, useState } from 'react';
import { WarningOutlined } from '@ant-design/icons';
import { handleBuilding, handleCreateBlogs } from '../requests/blog.requests';
import { UploadOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';

interface IProps {
    isCreateModalOpen: boolean;
    setIsCreateModalOpen: (v: boolean) => void;
}

interface BlogContent {
    index?: string;
    Content1?: string;
    image?: string;
    Content2?: string;
}

const BlogCreate = (props: IProps) => {
    const { isCreateModalOpen, setIsCreateModalOpen } = props;
    const [form] = Form.useForm();
    const [buildingOptions, setBuildingOptions] = useState<any[]>([]);
    const [titleLength, setTitleLength] = useState(0);

    // mảng nội dung động
    const [contents, setContents] = useState<BlogContent[]>([{ index: '', Content1: '', image: '', Content2: '' }]);

    // upload ảnh cho từng phần
    const [fileList, setFileList] = useState<{ [key: string]: UploadFile[] }>({
        mainImage: []
    })


    const fetchBuildingOptions = async () => {
        const res = await handleBuilding();
        const results = res?.data?.results ?? [];
        setBuildingOptions(results);
    };

    useEffect(() => {
        if (isCreateModalOpen) {
            fetchBuildingOptions();
        }
    }, [isCreateModalOpen]);

    const handleCloseCreateModal = () => {
        form.resetFields();
        setContents([{ index: '', Content1: '', image: '', Content2: '' }]);
        setFileList({ mainImage: [] }); // reset về array rỗng
        setIsCreateModalOpen(false);
    };

    const handleUploadImage = async (file: File): Promise<string | null> => {
        const formData = new FormData();
        formData.append("file", file);
        try {
            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });
            const data = await res.json();
            return data.url;
        } catch (error) {
            console.error("Upload error:", error);
            message.error("Tải ảnh thất bại");
            return null;
        }
    };
    // Thêm mục mới
    const addContent = () => {
        const idx = contents.length;
        setContents([...contents, { index: '', Content1: '', image: '', Content2: '' }]);
        setFileList((prev) => ({ ...prev, [`content_image_${idx}`]: [] }));
    }

    // Xóa mục
    const removeContent = (i: number) => {
        const newList = [...contents];
        newList.splice(i, 1);
        setContents(newList);
    };

    // Cập nhật dữ liệu mục
    const handleContentChange = (i: number, key: keyof BlogContent, value: any) => {
        const newList = [...contents];
        newList[i][key] = value;
        setContents(newList);
    };

    const onFinish = async (values: any) => {
        // upload ảnh trong từng mục
        const updatedContents = await Promise.all(contents.map(async (item, idx) => {
            const fileKey = `content_image_${idx}`;
            if (fileList[fileKey]?.[0]?.originFileObj) {
                const url = await handleUploadImage(fileList[fileKey][0].originFileObj as File);
                return { ...item, image: url || '' };
            }
            return item;
        }));

        // upload ảnh chính
        if (fileList.mainImage?.[0]?.originFileObj) {
            values.mainImage = await handleUploadImage(fileList.mainImage[0].originFileObj as File) || '';
        } else {
            values.mainImage = '';
        }

        const payload = {
            ...values,
            Content: updatedContents
        };

        const res = await handleCreateBlogs(payload);
        if (res?.data) {
            handleCloseCreateModal();
            message.success("Tạo Blog thành công!");
        } else {
            notification.error({
                message: "Lỗi tạo Blog",
                description: res?.message
            });
        }
    };
    ;
    const renderUpload = (field: string) => (
        <Upload
            accept="image/*"
            maxCount={1}
            fileList={fileList[field] || []} // luôn là array
            listType="picture"
            beforeUpload={() => false}
            onChange={({ fileList: newFileList }) =>
                setFileList((prev) => ({ ...prev, [field]: newFileList }))
            }
        >
            <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
        </Upload>
    );

    return (
        <Modal
            title="Thêm mới blog"
            open={isCreateModalOpen}
            onOk={() => form.submit()}
            onCancel={handleCloseCreateModal}
            width={900}
            maskClosable={false}
        >
            <Form layout="vertical" form={form} onFinish={onFinish}>
                <Row gutter={[15, 15]}>
                    <Col span={24}>
                        <Form.Item label="Ảnh nền" name="mainImage">
                            {renderUpload("mainImage")}
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item label="Tiêu đề" name="title" rules={[{ required: true, message: 'Nhập tiêu đề' }]}>
                            <Input
                                maxLength={133}
                                showCount
                                onChange={(e) => setTitleLength(e.target.value.length)}
                            />
                        </Form.Item>
                        {titleLength >= 133 && (
                            <p style={{ color: '#faad14', fontSize: 12, marginTop: -16, marginBottom: 8 }}>
                                <WarningOutlined style={{ marginRight: 4 }} />
                                Bạn đã đạt tới giới hạn 133 ký tự
                            </p>
                        )}
                    </Col>
                    <Col span={24}>
                        <Form.Item label="Giới thiệu" name="introduce">
                            <Input.TextArea placeholder="Nhập giới thiệu..." />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item label="Chọn nhà" name="buildingId">
                            <Select placeholder="Chọn nhà" allowClear>
                                {buildingOptions.map((item) => (
                                    <Select.Option key={item._id} value={item._id}>
                                        {item.name}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>

                    {/* Nội dung động */}
                    <Col span={24}>
                        <h3>Nội dung bài viết</h3>
                    </Col>
                    {contents.map((content, index) => (
                        <Col span={24} key={index} style={{ border: '1px solid #eee', padding: 10, borderRadius: 8, marginBottom: 10 }}>
                            <Form.Item label="Tiêu đề mục">
                                <Input
                                    placeholder="Tiêu đề mục"
                                    value={content.index}
                                    onChange={(e) => handleContentChange(index, 'index', e.target.value)}
                                    style={{ marginBottom: 8 }}
                                />
                            </Form.Item>
                            <Form.Item label="Nội dung 1">
                                <Input.TextArea
                                    value={content.Content1}
                                    onChange={(val) => handleContentChange(index, 'Content1', val.target.value)}
                                    placeholder="Nhập nội dung..."
                                    style={{ marginBottom: 8 }}
                                />
                            </Form.Item>
                            <Form.Item label="Ảnh giới thiệu">
                                {renderUpload(`content_image_${index}`)}
                            </Form.Item>
                            <Form.Item label="Nội dung 2">
                                <Input.TextArea
                                    value={content.Content2}
                                    onChange={(val) => handleContentChange(index, 'Content2', val.target.value)}
                                    placeholder="Nhập nội dung..."
                                    style={{ marginBottom: 8 }}
                                />
                            </Form.Item>
                            <Button
                                danger
                                icon={<DeleteOutlined />}
                                onClick={() => removeContent(index)}
                                style={{ marginTop: 8 }}
                            >
                                Xóa mục này
                            </Button>
                        </Col>
                    ))}

                    <Col span={24}>
                        <Button
                            type="dashed"
                            icon={<PlusOutlined />}
                            onClick={addContent}
                            block
                        >
                            Thêm nội dung
                        </Button>
                    </Col>

                    <Col span={24}>
                        <Form.Item label="Tổng kết" name="conclusion">
                            <Input.TextArea placeholder="Nhập kết luận..." />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
};

export default BlogCreate;

