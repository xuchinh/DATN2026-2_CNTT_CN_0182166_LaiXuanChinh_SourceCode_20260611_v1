'use client'
import { Button, Divider, Form, Input, notification } from 'antd';
import { ArrowLeftOutlined, MailOutlined, LockOutlined } from '@ant-design/icons';
import Image from 'next/image';
import Link from 'next/link';
import { signIn } from "next-auth/react"
import { authenticate } from '@/utils/action';
import { useRouter } from 'next/navigation';
import ModalReactive from './modal.reactive';
import { useState } from 'react';
import ModalChangePassword from './modal.change.password';
const Login = () => {
    const router = useRouter()
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [userEmail, setUserEmail] = useState("")
    const [changePassword, setChangePassword] = useState(false);
    const onFinish = async (values: any) => {
        const { username, password } = values;
        setUserEmail("")
        const res = await authenticate(username, password);

        if (res?.error) {
            if (res?.code === 2) {
                setIsModalOpen(true);
                setUserEmail(username);
                return;
            }
            notification.error({
                message: "Error login",
                description: res?.error
            })

        } else {

            router.push('/');
        }

    };
    return (
        <>

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
                            Quản lý &amp; cho thuê phòng trọ thông minh
                        </h2>
                        <p className="mt-6 max-w-lg text-lg leading-relaxed text-white/85">
                            Nền tảng giúp chủ trọ và người thuê kết nối, quản lý hóa đơn,
                            hợp đồng và thanh toán một cách dễ dàng, minh bạch.
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
                        <h1 className="text-2xl font-bold text-ink">Đăng nhập</h1>
                        <p className="mt-1.5 mb-6 text-[15px] text-ink-soft">
                            Chào mừng trở lại! Vui lòng nhập thông tin của bạn.
                        </p>
                        <Form
                            name="basic"
                            onFinish={onFinish}
                            autoComplete="off"
                            layout='vertical'
                            requiredMark={false}
                        >
                            <Form.Item
                                label="Email"
                                name="username"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your email!',
                                    },
                                ]}
                            >
                                <Input size="large" prefix={<MailOutlined className="text-ink-muted" />} placeholder="email@example.com" />
                            </Form.Item>

                            <Form.Item
                                label="Mật khẩu"
                                name="password"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your password!',
                                    },
                                ]}
                            >
                                <Input.Password size="large" prefix={<LockOutlined className="text-ink-muted" />} placeholder="••••••••" />
                            </Form.Item>

                            <div className="mb-4 flex justify-end">
                                <Button type='link' className="px-0" onClick={() => setChangePassword(true)}>Quên mật khẩu ?</Button>
                            </div>

                            <Form.Item>
                                <Button type="primary" htmlType="submit" size="large" block>
                                    Đăng nhập
                                </Button>
                            </Form.Item>
                        </Form>
                        <Divider className="!my-4 text-ink-muted text-sm">hoặc</Divider>
                        <div className="text-center text-[15px] text-ink-soft">
                            Chưa có tài khoản? <Link href={"/auth/register"} className="font-semibold text-brand hover:text-brand-700">Đăng ký tại đây</Link>
                        </div>
                        <div className="mt-6 text-center">
                            <Link href={"/"} className="text-sm text-ink-soft hover:text-brand"><ArrowLeftOutlined /> Quay lại trang chủ</Link>
                        </div>
                    </div>
                </div>
            </div>
            <ModalReactive isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} userEmail={userEmail} />
            <ModalChangePassword
                title="Quên mật khẩu"
                isModalOpen={changePassword}
                setIsModalOpen={setChangePassword}
                repline="Tài khoản của bạn đã được thay đổi mật khẩu thành công. Vui lòng đăng nhập lại"
            />
        </>
    )
}

export default Login;