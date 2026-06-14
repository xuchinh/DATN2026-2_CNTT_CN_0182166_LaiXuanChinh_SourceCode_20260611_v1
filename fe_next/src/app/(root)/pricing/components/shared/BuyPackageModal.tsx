"use client";

import { Modal, Input, Form, Row, Col, message, notification, DatePicker, Select } from "antd";
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import { handleUpdateUserAction, handleUserLoginv1, handleUserLoginv2 } from "@/components/users/requests/user.requests";
import { TypePriceItemProp } from "../../types/price-item";
import { handleOffer } from "../../requests/offers.request";
import ModalAccommodation from "@/app/(root)/accommodation/components/shared/modalAccommodation";

interface BuyPackageModalProps {
    open: boolean;
    onClose: () => void;
    packageData: TypePriceItemProp | null;
}

const BuyPackageModal = ({ open, onClose, packageData }: BuyPackageModalProps) => {
    const [form] = Form.useForm();
    const [user, setUser] = useState<any>(null);
    const [offers, setOffers] = useState<any[]>([]);
    const [basePayment, setBasePayment] = useState(0);
    const [monthPay, setMonthPay] = useState(0);

    const [calculatedPayment, setCalculatedPayment] = useState(0);
    const [calculatedToDate, setCalculatedToDate] = useState<any>(null);
    const [supperAdmin, setSuperAdmin] = useState<any>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalConfig, setModalConfig] = useState({
        type: "error" as "error" | "confirm" | "success",
        title: "",
        message: "",
        onConfirm: undefined as (() => void) | undefined
    });

    useEffect(() => {
        if (open) {
            fetchUser();
            form.resetFields();
            setOffers([]);
            setBasePayment(0);
            setCalculatedPayment(0);
            setCalculatedToDate(null);
            fetchSuperAdmin()
        }
    }, [open]);

    const fetchUser = async () => {
        const res = await handleUserLoginv2();
        if (res?.data?.results) {
            setUser(res.data.results);
        } else {
            setUser(null);
        }
    };


    const fetchSuperAdmin = async () => {
        const res = await handleUserLoginv1("SUPER ADMIN");
        if (res?.data?.results && res.data.results.length > 0) {
            setSuperAdmin(res.data.results[0]);
        } else {
            setSuperAdmin(null);
        }
    };


    const handleValuesChange = async (changedValues: any, allValues: any) => {
        if (changedValues.totalMonth !== undefined) {
            const months = Number(allValues.totalMonth);
            if (!isNaN(months) && months > 0 && packageData?.price) {
                const newBasePayment = months * Number(packageData.price);
                const newToDate = dayjs().add(months, "month");
                setMonthPay(months)
                setBasePayment(newBasePayment);
                setCalculatedToDate(newToDate);
                setCalculatedPayment(newBasePayment); // reset giảm giá

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
                    payment: newBasePayment,
                    toDate: newToDate,
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
            payment: finalPayment,
            offerId
        });
    };
    console.log("check user", user);


    // Submit mua gói

    const handleRent = (values: any) => {
        if (!user) {
            setModalConfig({
                type: "error",
                title: "Bạn chưa đăng nhập",
                message: "Vui lòng đăng nhập để tiếp tục thuê gói chức năng.",
                onConfirm: undefined
            });
            setModalOpen(true);
            return;
        }
        else if (user[0].status === true) {
            setModalConfig({
                type: "error",
                title: "Bạn đã mua gói chức năng rồi",
                message: "Vui lòng vào trang ADMIN để gia hạn gói chức năng.",
                onConfirm: undefined
            });
            setModalOpen(true);
            return;
        }
        setModalConfig({
            type: "confirm",
            title: "Xác nhận thuê gói chức năng",
            message: `Bạn có chắc muốn thuê gói chức năng "${packageData?.name}" trong "${values.totalMonth}" tháng?`,
            onConfirm: async () => {
                try {
                    const updateData = {
                        _id: user[0]?._id,
                        packageId: packageData?._id,
                        totalMonth: values.totalMonth,
                        payment: values.payment,
                        bankAccount: values.bankAccount,
                        bank: values.bank,
                        fromDate: new Date(),
                        status: true,
                        toDate: values.toDate?.format("YYYY-MM-DD"),
                        statusPayment: false,
                        role: "ADMIN",
                    }

                    const res = await handleUpdateUserAction(updateData);

                    if (res?.statusCode === 200) {
                        window.location.reload();
                        setModalConfig({
                            type: "success",
                            title: "Thuê gói chức năng thành công",
                            message: `Bạn đã thuê gói chức năng ${values.code} thành công!`,
                            onConfirm: undefined
                        });
                        setModalOpen(true);
                    } else {
                        setModalConfig({
                            type: "error",
                            title: "Lỗi khi thuê gói chức năng",
                            message:
                                res?.message || "Không thể thuê gói chức năng, vui lòng thử lại.",
                            onConfirm: undefined
                        });
                        setModalOpen(true);
                    }
                } catch (err) {
                    setModalConfig({
                        type: "error",
                        title: "Lỗi khi thuê gói chức năng",
                        message: "Có lỗi xảy ra trong quá trình thuê gói chức năng.",
                        onConfirm: undefined
                    });
                    setModalOpen(true);
                }
            }
        });
        setModalOpen(true);
    };

    return (
        <Modal
            title="Mua gói chức năng"
            open={open}
            onOk={() => form.submit()}
            onCancel={onClose}
            maskClosable={false}
        >
            {packageData ? (
                <>
                    <p><strong>Tên gói:</strong> {packageData.name}</p>
                    <p><strong>Giá:</strong> {packageData.price?.toLocaleString()} VNĐ / tháng</p>

                    <Form
                        layout="vertical"
                        form={form}
                        onFinish={handleRent}
                        onValuesChange={handleValuesChange}
                    >
                        <Row gutter={[15, 15]}>
                            <Col span={24}>
                                <Form.Item label="Số tài khoản nhận tiền" name="bankAccount" rules={[{ required: true }]}>
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item label="Ngân hàng" name="bank" rules={[{ required: true }]}>
                                    <Input />
                                </Form.Item>
                            </Col>
                            {/* Nhập số tháng */}
                            <Col span={24}>
                                <Form.Item label="Số tháng muốn mua" name="totalMonth" rules={[{ required: true }]}>
                                    <Input type="number" min={1} />
                                </Form.Item>
                            </Col>

                            {/* Chọn offer */}
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

                            {/* Tiền cần trả */}
                            <Col span={24}>
                                <Form.Item label="Số tiền cần trả (VNĐ)" name="payment">
                                    <Input disabled value={calculatedPayment?.toLocaleString()} />
                                </Form.Item>
                            </Col>

                            {/* Ngày hết hạn */}
                            <Col span={24}>
                                <Form.Item label="Ngày hết hạn" name="toDate">
                                    <DatePicker format="DD/MM/YYYY" disabled value={calculatedToDate} />
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
                                    theo nội dung: "Thanh toán gói <strong>{packageData.name}</strong> số tháng: <strong>{monthPay}</strong> số tiền là: <strong>{calculatedPayment?.toLocaleString()}</strong> " để quản trị viên có thể các nhận
                                </span>
                            </>
                        ) : (
                            "Thông tin tài khoản không có sẵn"
                        )}
                    </p>

                </>
            ) : (
                <p>Không có dữ liệu gói</p>
            )}
            <ModalAccommodation
                isOpen={modalOpen}
                type={modalConfig.type}
                title={modalConfig.title}
                message={modalConfig.message}
                onClose={() => setModalOpen(false)}
                onConfirm={modalConfig.onConfirm}
            />
        </Modal>
    );
};

export default BuyPackageModal;
