import { handlePackageUser, handleUpdateUserAction, handleUserLoginId, handleUserLoginv1 } from '@/components/users/requests/user.requests';
import {
    Modal, Input,
    Form, Row, Col, message,
    notification, DatePicker, Select
} from 'antd';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { handleOffer } from '@/app/(root)/pricing/requests/offers.request';

interface IProps {
    isUpdateModalOpen: boolean;
    setIsUpdateModalOpen: (v: boolean) => void;
    dataUpdate: any;
    setDataUpdate: any;
}

const UserUpdatePackage = (props: IProps) => {
    const {
        isUpdateModalOpen, setIsUpdateModalOpen,
        dataUpdate, setDataUpdate
    } = props;

    const [form] = Form.useForm();
    const [packageOptions, setPackageOptions] = useState<any[]>([]);
    const [price, setPrice] = useState(0);
    const [basePayment, setBasePayment] = useState(0); // tiền gốc chưa giảm
    const [calculatedPayment, setCalculatedPayment] = useState(0); // tiền sau giảm
    const [calculatedToDate, setCalculatedToDate] = useState<any>(null);
    const [offers, setOffers] = useState<any[]>([]);
    const [supperAdmin, setSuperAdmin] = useState<any>(null);
    useEffect(() => {
        if (isUpdateModalOpen) {
            fetchPackageOptions();
        }

        if (dataUpdate) {
            const selectedPackage = packageOptions.find(p => p._id === dataUpdate.packageId);
            const pkgPrice = selectedPackage?.price || dataUpdate.price || 0;
            setPrice(pkgPrice);

            form.setFieldsValue({
                packageId: dataUpdate.packageId,
                totalMonthUpdate: null,
                paymentUpdate: 0,
                toDateUpdate: null,
                offerId: null
            });
        }
    }, [isUpdateModalOpen, dataUpdate]);

    const handleCloseUpdateModal = () => {
        form.resetFields();
        setIsUpdateModalOpen(false);
        setDataUpdate(null);
        setCalculatedPayment(0);
        setCalculatedToDate(null);
        setOffers([]);
    };
    const fetchSuperAdmin = async () => {
        const res = await handleUserLoginv1("SUPER ADMIN");
        console.log('Response from handleUserLoginv1:', res);  // Log toàn bộ response để xem chi tiết
        if (res?.data?.results && res.data.results.length > 0) {
            setSuperAdmin(res.data.results[0]); // Giả sử bạn chỉ muốn lấy người đầu tiên
        } else {
            setSuperAdmin(null);
        }
    };
    useEffect(() => {
        if (isUpdateModalOpen) {
            fetchSuperAdmin()
        }
    }, [isUpdateModalOpen]);
    const handleValuesChange = async (changed: any, all: any) => {
        if (changed.totalMonthUpdate !== undefined) {
            const months = Number(all.totalMonthUpdate);
            if (!isNaN(months) && months > 0 && dataUpdate?.toDate) {
                const selectedPackage = packageOptions.find(p => p._id === all.packageId) || {};
                const pkgPrice = selectedPackage?.price || 0;
                const newPayment = months * pkgPrice;
                const newToDate = dayjs(dataUpdate.toDate).add(months, 'month');

                setPrice(pkgPrice);
                setBasePayment(newPayment);
                setCalculatedPayment(newPayment);
                setCalculatedToDate(newToDate);

                // lấy offer hợp lệ
                try {
                    const res = await handleOffer();
                    const validOffers = res?.data?.results?.filter(
                        (offer: any) => Number(offer.condition) <= months && offer.isActive
                    ) || [];
                    setOffers(validOffers);
                } catch (error) {
                    console.error("Lỗi khi lấy offer:", error);
                    setOffers([]);
                }

                form.setFieldsValue({
                    paymentUpdate: newPayment,
                    toDateUpdate: newToDate,
                    offerId: null
                });
            }
        }
    };

    const handleSelectOffer = (offerId: string) => {
        const offer = offers.find(o => o._id === offerId);
        let finalPayment = basePayment;

        if (offer) {
            const discountPercent = Number(offer.discountPercentage) || 0;
            const discountCurrency = Number(offer.discountCurrency) || 0;

            if (discountPercent > 0) {
                finalPayment = finalPayment * (1 - discountPercent / 100);
            } else if (discountCurrency > 0) {
                finalPayment = finalPayment - discountCurrency;
            }

            if (finalPayment < 0) finalPayment = 0;
        }

        setCalculatedPayment(finalPayment);

        form.setFieldsValue({
            paymentUpdate: finalPayment,
            offerId
        });
    };

    const fetchPackageOptions = async () => {
        const res = await handlePackageUser();
        const results = res?.data?.results ?? [];
        setPackageOptions(results);
    };

    const onFinish = async (values: any) => {
        if (dataUpdate) {
            const { packageId, totalMonthUpdate, paymentUpdate, toDateUpdate } = values;
            const toDateUpdateStr = toDateUpdate?.format("YYYY-MM-DD");
            const res = await handleUpdateUserAction({
                _id: dataUpdate._id,
                packageId,
                totalMonthUpdate: totalMonthUpdate,
                paymentUpdate: paymentUpdate,
                toDateUpdate: toDateUpdateStr,
                statusPayment: false,
                statusPaymentUpdate: true
                // offerId: offerId || null
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
            title="Gia hạn gói chức năng"
            open={isUpdateModalOpen}
            onOk={() => form.submit()}
            onCancel={handleCloseUpdateModal}
            maskClosable={false}
        >
            <Form
                layout="vertical"
                form={form}
                onFinish={onFinish}
                onValuesChange={handleValuesChange}
            >
                <Row gutter={[15, 15]}>
                    <Col span={24} md={12}>
                        <Form.Item label="Tên gói chức năng" name="packageId">
                            <Select placeholder="Chọn gói chức năng" disabled>
                                {packageOptions.map((item) => (
                                    <Select.Option key={item._id} value={item._id}>
                                        {item.name}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>

                    <Col span={24} md={12}>
                        <Form.Item label="Nhập số tháng muốn gia hạn" name="totalMonthUpdate">
                            <Input type="number" min={1} />
                        </Form.Item>
                    </Col>

                    {offers.length > 0 && (
                        <Col span={24}>
                            <Form.Item label="Chọn mã giảm giá" name="offerId">
                                <Select
                                    placeholder="Chọn offer"
                                    onChange={handleSelectOffer}
                                    allowClear
                                >
                                    {offers.map((offer) => (
                                        <Select.Option key={offer._id} value={offer._id}>
                                            {offer.code} -
                                            {Number(offer.discountPercentage) > 0
                                                ? `${offer.discountPercentage}%`
                                                : `${Number(offer.discountCurrency).toLocaleString()} VNĐ`}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                    )}

                    <Col span={24} md={12}>
                        <Form.Item label="Số tiền cần trả (VNĐ)" name="paymentUpdate">
                            <Input disabled value={calculatedPayment?.toLocaleString()} />
                        </Form.Item>
                    </Col>

                    <Col span={24} md={12}>
                        <Form.Item label="Ngày hết hạn mới" name="toDateUpdate">
                            <DatePicker
                                format="DD/MM/YYYY"
                                disabled
                                value={calculatedToDate}
                            />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
            <p>
                <strong>Thanh toán bằng cash, chuyển tiền vào tài khoản: </strong>
                {supperAdmin?.bankAccount ? (
                    <>
                        <strong >{supperAdmin.bankAccount}</strong> <strong>{supperAdmin.bank}</strong><br />
                        <span>
                            theo nội dung: "Thanh toán gia hạn gói <strong>{dataUpdate?.name}</strong>  số tiền là: <strong>{calculatedPayment?.toLocaleString()}</strong> " để quản trị viên có thể các nhận
                        </span>
                    </>
                ) : (
                    "Thông tin tài khoản không có sẵn"
                )}
            </p>
        </Modal>
    );
};

export default UserUpdatePackage;
