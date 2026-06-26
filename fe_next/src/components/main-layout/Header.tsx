"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";

import useScrollBackground from "./hooks/useScrollBackground";
import { AdminContext } from "@/library/admin.context";
import { handleUserLoginv2 } from "../users/requests/user.requests";
import { signOut } from "next-auth/react";
import { Avatar, Dropdown, MenuProps, Space } from "antd";
import { DownOutlined, MenuOutlined, CloseOutlined, UserOutlined } from "@ant-design/icons";
import ModalChangePassword from "../auth/modal.change.password";
import UserSelect from "../users/table/user.select";
import UserUpdate from "../users/table/user.update";
import { label } from "framer-motion/client";
import UserPaymentSelect from "../users/table/user.payment.select";
import MyRentalRequests from "../rooms/myRentalRequests";
const navList = [
  { label: "Home", slug: "/" },
  { label: "Tìm trọ", slug: '/accommodation' },
  { label: "Gói đăng ký", slug: "/pricing" },
  { label: "Hướng dẫn sử dụng", slug: "/instructions" },
  { label: "Blog", slug: "/blogs" },
  { label: "Liên hệ", slug: "/contact-us" },
];

const actionButtons = [
  { label: "Đăng Nhập", slug: "/auth/login" },
  { label: "Đăng ký", slug: "/auth/register" },
];

const Header = (props: any) => {
  const { session } = props;
  const [changePassword, setChangePassword] = useState(false);
  const [isSelectPaymentModalOpen, setIsSelectPaymentModalOpen] = useState<boolean>(false);
  const [isSelectModalOpen, setIsSelectModalOpen] = useState<boolean>(false);
  const [dataSelect, setDataSelect] = useState<any>(session?.data?.results?.[0] ?? null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [dataUpdate, setDataUpdate] = useState<any>(null);
  const [isRequestsModalOpen, setIsRequestsModalOpen] = useState(false);
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  const handleUserInfoClick = async () => {
    try {
      const res = await handleUserLoginv2()
      const user = res?.data?.results?.[0]
      if (user) {
        setDataSelect(user)
        setIsSelectModalOpen(true)
      }
    } catch (error) {
      console.error('Lỗi khi lấy thông tin người dùng:', error)
    }
  }

  const handleUserPaymentClick = async () => {
    try {
      const res = await handleUserLoginv2()
      const user = res?.data?.results?.[0]
      if (user) {
        setDataSelect(user)
        setIsSelectPaymentModalOpen(true)
      }
    } catch (error) {
      console.error('Lỗi khi lấy thông tin người dùng:', error)
    }
  }


  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [menuOpen]);
  const isScrolled = useScrollBackground(50);

  // Tài khoản đang đăng nhập đã bị xóa: vẫn còn phiên nhưng không lấy được dữ liệu user
  // → tự đăng xuất, đưa về trang đăng nhập (tránh dùng phiên của tài khoản không còn tồn tại)
  useEffect(() => {
    if (session && !session?.data?.results?.[0]) {
      signOut({ callbackUrl: "/auth/login" });
    }
  }, [session]);

  const items: MenuProps['items'] = [
    {
      key: '1',
      label:
        (
          dataSelect?.role === 'USERS' ? (
            <span onClick={handleUserPaymentClick}>
              Các khoản thanh toán
            </span>
          ) : null
        ),
    },
    {
      key: '1b',
      label:
        (
          dataSelect?.role === 'USERS' ? (
            <span onClick={() => setIsRequestsModalOpen(true)}>
              Các yêu cầu đã gửi
            </span>
          ) : null
        ),
    },
    {
      key: '2',
      label:
        <span onClick={handleUserInfoClick}>
          Thông tin cá nhân
        </span>
    },
    {
      key: '3',
      label: (
        <span onClick={async () => {
          try {
            const res = await handleUserLoginv2()
            const user = res?.data?.results?.[0]
            if (user) {
              setDataUpdate(user)
              setIsUpdateModalOpen(true)
            }
          } catch (err) {
            console.error('Lỗi khi lấy thông tin người dùng:', err)
          }
        }}>
          Sửa thông tin cá nhân
        </span>
      )
    },
    {
      key: '4',
      label:
        <span onClick={() => setChangePassword(true)}>
          Đổi mật khẩu
        </span>
      ,
    },
    {
      key: '5',
      danger: true,
      label: <span onClick={() => signOut()}> Đăng xuất</span >,
    },
  ];

  return (
    <header
      className={`fixed top-0 right-0 w-full z-[100] transition-all duration-300 ease-smooth ${isScrolled
        ? "bg-[#064E3B]/95 backdrop-blur-md shadow-[0_4px_24px_rgba(15,23,42,0.25)] py-2"
        : "bg-gradient-to-b from-black/40 to-transparent py-3"
        }`}
    >
      <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between px-4 lg:px-8 xl:px-[80px]">
        {/* Logo */}
        <Link href="/" className="shrink-0">
          <Image
            src="/images/header/header-logo.png"
            width={250}
            height={49.32}
            alt="logo RoomHub"
            className="w-[132px] cursor-pointer"
            priority
          />
        </Link>

        {/* Navigation Links Desktop */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2 font-sans">
          {navList.map((item, index) => {
            const active = pathname === item.slug;
            return (
              <Link
                key={index}
                href={item.slug}
                className={`relative px-3 py-2 rounded-lg text-[15px] xl:text-[16px] font-medium transition-all duration-200 ${active ? "text-white" : "text-white/80 hover:text-white hover:bg-white/10"
                  }`}
              >
                {item.label}
                <span
                  className={`absolute left-3 right-3 -bottom-0.5 h-[2px] rounded-full bg-brand-400 transition-opacity duration-300 ${active ? "opacity-100" : "opacity-0"
                    }`}
                />
              </Link>
            );
          })}
        </nav>

        {/* Action Buttons Desktop */}
        {!session && (
          <div className="hidden lg:flex items-center gap-3">
            <Link
              href="/auth/login"
              className="rounded-full border border-white/30 px-5 py-2.5 text-[15px] font-semibold text-white transition-all duration-200 hover:bg-white/10"
            >
              Đăng Nhập
            </Link>
            <Link
              href="/auth/register"
              className="rounded-full bg-gradient-to-r from-brand-500 to-brand-600 px-5 py-2.5 text-[15px] font-semibold text-white shadow-[0_4px_14px_rgba(5,150,105,0.4)] transition-all duration-200 hover:scale-[1.03] hover:shadow-[0_6px_20px_rgba(5,150,105,0.5)]"
            >
              Đăng ký
            </Link>
          </div>
        )}
        {session && (
          <div className="hidden lg:flex gap-4 items-center">
            {(dataSelect?.role === 'ADMIN' || dataSelect?.role === 'SUPER ADMIN') && (
              <Link
                href={'/dashboard'}
                className="rounded-full bg-gradient-to-r from-brand-500 to-brand-600 px-5 py-2.5 text-[15px] font-semibold text-white shadow-[0_4px_14px_rgba(5,150,105,0.4)] transition-all duration-200 hover:scale-[1.03] hover:shadow-[0_6px_20px_rgba(5,150,105,0.5)]"
              >
                Trang Admin
              </Link>
            )}
            <Dropdown menu={{ items }}>
              <a
                onClick={(e) => e.preventDefault()}
                className="flex items-center gap-2 cursor-pointer rounded-full border border-white/25 px-4 py-2 text-white text-[15px] font-medium transition-all duration-200 hover:bg-white/10"
              >
                <Avatar
                  size={28}
                  src={session?.data?.results?.[0]?.avatar || undefined}
                  icon={<UserOutlined />}
                  className="bg-white/15"
                />
                <Space>
                  {session?.data?.results?.[0]?.name ?? ""}
                  <DownOutlined />
                </Space>
              </a>
            </Dropdown>
          </div>
        )}

        {/* Mobile hamburger */}
        <button
          aria-label="Mở menu"
          onClick={toggleMenu}
          className="lg:hidden flex h-10 w-10 items-center justify-center rounded-xl text-white text-xl transition-colors hover:bg-white/10"
        >
          {menuOpen ? <CloseOutlined /> : <MenuOutlined />}
        </button>
      </div>

      {/* Mobile menu panel */}
      {menuOpen && (
        <div className="lg:hidden animate-fade-in border-t border-white/10 bg-[#064E3B]/98 backdrop-blur-md">
          <nav className="flex flex-col px-4 py-3">
            {navList.map((item, index) => {
              const active = pathname === item.slug;
              return (
                <Link
                  key={index}
                  href={item.slug}
                  onClick={() => setMenuOpen(false)}
                  className={`rounded-lg px-4 py-3 text-[16px] font-medium transition-colors ${active ? "bg-white/10 text-brand-400" : "text-white/85 hover:bg-white/10"
                    }`}
                >
                  {item.label}
                </Link>
              );
            })}
            <div className="mt-2 flex flex-col gap-2 border-t border-white/10 pt-3">
              {!session && (
                <>
                  <Link
                    href="/auth/login"
                    onClick={() => setMenuOpen(false)}
                    className="rounded-full border border-white/30 px-5 py-3 text-center text-[15px] font-semibold text-white"
                  >
                    Đăng Nhập
                  </Link>
                  <Link
                    href="/auth/register"
                    onClick={() => setMenuOpen(false)}
                    className="rounded-full bg-gradient-to-r from-brand-500 to-brand-600 px-5 py-3 text-center text-[15px] font-semibold text-white"
                  >
                    Đăng ký
                  </Link>
                </>
              )}
              {session && (dataSelect?.role === 'ADMIN' || dataSelect?.role === 'SUPER ADMIN') && (
                <Link
                  href={'/dashboard'}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-full bg-gradient-to-r from-brand-500 to-brand-600 px-5 py-3 text-center text-[15px] font-semibold text-white"
                >
                  Trang Admin
                </Link>
              )}
              {session && (
                <button
                  onClick={() => { setMenuOpen(false); signOut(); }}
                  className="rounded-full border border-white/30 px-5 py-3 text-center text-[15px] font-semibold text-white"
                >
                  Đăng xuất
                </button>
              )}
            </div>
          </nav>
        </div>
      )}
      <ModalChangePassword
        email={session?.data?.results?.[0]?.email}
        title="Đổi mật khẩu"
        isModalOpen={changePassword}
        setIsModalOpen={setChangePassword}
        repline="Tải khoản của bạn đã được thay đổi mật khẩu thành công."
      />
      <UserSelect
        isSelectModalOpen={isSelectModalOpen}
        setIsSelectModalOpen={setIsSelectModalOpen}
        dataSelect={dataSelect}
      // setDataSelect={setDataSelect}
      />
      <UserPaymentSelect
        isSelectModalOpen={isSelectPaymentModalOpen}
        setIsSelectModalOpen={setIsSelectPaymentModalOpen}
        dataSelect={dataSelect}
        session={session}
      // setDataSelect={setDataSelect}
      />
      <UserUpdate
        isUpdateModalOpen={isUpdateModalOpen}
        setIsUpdateModalOpen={setIsUpdateModalOpen}
        dataUpdate={dataUpdate}
        setDataUpdate={setDataUpdate}
      />
      <MyRentalRequests
        isOpen={isRequestsModalOpen}
        onClose={() => setIsRequestsModalOpen(false)}
        userId={session?.data?.results?.[0]?._id}
      />
    </header>
  );
};

export default Header;
