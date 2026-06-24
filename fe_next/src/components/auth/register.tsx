'use client'
import React from 'react';
import { Button, Divider, Form, Input, notification } from 'antd';
import { ArrowLeftOutlined, MailOutlined, LockOutlined, UserOutlined, PhoneOutlined, HomeOutlined } from '@ant-design/icons';
import Image from 'next/image';
import Link from 'next/link';
import { sendRequest } from '@/utils/api';
import { useRouter } from 'next/navigation';

const Register = () => {
    const router = useRouter()

    const onFinish = async (values: any) => {
        const { email, password, name, phone, address } = values;
        const res = await sendRequest<IBackendRes<any>>({
            method: "POST",
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/register`,
            body: {
                email, password, name, phone, address
            }
        })
        if (res?.data) {
            router.push(`/verify/${res?.data?._id}`)
        }
        else {
            notification.error({
                message: 'Register Error',
                description: res?.message
            })
        }
    };

    return (
        <div className="min-h-screen w-full grid lg:grid-cols-[65fr_35fr] bg-surface-muted">
            {/* Brand panel — chiếm 65% */}
            <div className="relative hidden lg:flex flex-col justify-between overflow-hidden bg-gradient-to-br from-brand-600 via-brand-600 to-[#047857] p-14 text-white">
                <div className="absolute -top-24 -right-24 h-80 w-80 rounded-full bg-white/10 blur-2xl" />
                <div className="absolute -bottom-32 -left-16 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
                <Link href="/">
                    <Image
                        src="/images/header/header-logo.png"
                        width={160}
                        height={32}
                        alt="RoomHub"
                        className="w-[150px]"
                    />
                </Link>
                <div className="relative z-10 max-w-xl">
                    <h2 className="font-playfair text-5xl font-bold leading-[1.15]">
                        Tham gia cùng RoomHub ngay hôm nay
                    </h2>
                    <p className="mt-6 max-w-lg text-lg leading-relaxed text-white/85">
                        Tạo tài khoản để quản lý nhà trọ, theo dõi hóa đơn và kết nối
                        với người thuê — tất cả trong một nền tảng duy nhất.
                    </p>
                </div>
                <p className="relative z-10 text-sm text-white/70">
                    © {new Date().getFullYear()} RoomHub. All rights reserved.
                </p>
            </div>

            {/* Form panel — chiếm 35% */}
            <div className="flex items-center justify-center px-5 py-12 sm:px-8">
                <div className="w-full max-w-[440px] rounded-[16px] bg-white p-8 shadow-card sm:p-10 animate-fade-in-up">
                    <div className="mb-7 flex justify-center lg:hidden">
                        <Link href="/" className="inline-flex items-center gap-2">
                            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 text-white font-bold">R</span>
                            <span className="text-xl font-bold text-ink">RoomHub</span>
                        </Link>
                    </div>
                    <h1 className="text-2xl font-bold text-ink">Đăng ký tài khoản</h1>
                    <p className="mt-1.5 mb-6 text-[15px] text-ink-soft">
                        Chỉ vài bước để bắt đầu sử dụng RoomHub.
                    </p>
                    <Form
                        name="register"
                        onFinish={onFinish}
                        autoComplete="off"
                        layout='vertical'
                        requiredMark={false}
                    >
                        <Form.Item
                            label="Email"
                            name="email"
                            rules={[{ required: true, message: 'Vui lòng nhập email!' }]}
                        >
                            <Input size="large" prefix={<MailOutlined className="text-ink-muted" />} placeholder="email@example.com" />
                        </Form.Item>

                        <Form.Item
                            label="Mật khẩu"
                            name="password"
                            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
                        >
                            <Input.Password size="large" prefix={<LockOutlined className="text-ink-muted" />} placeholder="••••••••" />
                        </Form.Item>

                        <Form.Item
                            label="Họ tên"
                            name="name"
                            rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
                        >
                            <Input size="large" prefix={<UserOutlined className="text-ink-muted" />} placeholder="Nguyễn Văn A" />
                        </Form.Item>

                        <Form.Item
                            label="Số điện thoại"
                            name="phone"
                            rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
                        >
                            <Input size="large" prefix={<PhoneOutlined className="text-ink-muted" />} placeholder="09xxxxxxxx" />
                        </Form.Item>

                        <Form.Item
                            label="Địa chỉ"
                            name="address"
                            rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
                        >
                            <Input size="large" prefix={<HomeOutlined className="text-ink-muted" />} placeholder="Số nhà, đường, phường…" />
                        </Form.Item>

                        <Form.Item className="!mb-0">
                            <Button type="primary" htmlType="submit" size="large" block>
                                Đăng ký
                            </Button>
                        </Form.Item>
                    </Form>
                    <Divider className="!my-4 text-ink-muted text-sm">hoặc</Divider>
                    <div className="text-center text-[15px] text-ink-soft">
                        Đã có tài khoản? <Link href={"/auth/login"} className="font-semibold text-brand hover:text-brand-700">Đăng nhập</Link>
                    </div>
                    <div className="mt-6 text-center">
                        <Link href={"/"} className="text-sm text-ink-soft hover:text-brand"><ArrowLeftOutlined /> Quay lại trang chủ</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Register;
