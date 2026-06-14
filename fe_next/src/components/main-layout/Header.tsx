"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";

import ActionButtonHeader from "../shared/ActionButtonHeader";
import useScrollBackground from "./hooks/useScrollBackground";
import { AdminContext } from "@/library/admin.context";
import { handleUserLoginv2 } from "../users/requests/user.requests";
import { signOut } from "next-auth/react";
import { Dropdown, MenuProps, Space } from "antd";
import { DownOutlined } from "@ant-design/icons";
import ModalChangePassword from "../auth/modal.change.password";
import UserSelect from "../users/table/user.select";
import UserUpdate from "../users/table/user.update";
import { label } from "framer-motion/client";
import UserPaymentSelect from "../users/table/user.payment.select";
const navList = [
  { label: "Home", slug: "/" },
  { label: "Tìm trọ", slug: '/accommodation' },
  { label: "Bảng giá", slug: "/pricing" },
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
      className={`fixed top-0 w-full py-[3px] lg:px-[10px] xl:px-[80px] flex justify-between items-center z-[100] right-0  ${isScrolled ? "bg-[#1E0A3C]" : "bg-transparent"
        }`}
    >
      <div className="">
        <div>
          <Link href="/">
            <Image
              src="/images/header/header-logo.png"
              width={250}
              height={49.32}
              alt="logo RoomHub"
              className="w-[140px] cursor-pointer"
            />
          </Link>
        </div>
      </div>

      {/* Navigation Links Desktop */}
      <nav className="flex lg:space-x-5 2xl:space-x-[72px] text-white font-sans lg:text-[16px] xl:text-[18px] font-normal ">
        {navList.map((item, index) => (
          <Link
            key={index}
            href={item.slug}
            className={`hover:text-[#F97316] transition-colors duration-500 ${pathname === item.slug ? "text-[#F97316]" : ""}`}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Action Buttons Desktop */}
      {!session && (
        <div className="flex space-x-4 ">
          {/* <ModalSignUp /> */}
          {actionButtons.map((button, index) => (
            <ActionButtonHeader
              key={index}
              href={button.slug}
              className="px-[31px] py-[13px] transition-all duration-500 hover:drop-shadow-custom hover:bg-[#F97316] hover:border-[#F97316]"
            >
              {button.label}
            </ActionButtonHeader>
          ))}
        </div>
      )}
      {session && (
        <div className="flex gap-8 items-center">
          {(dataSelect.role === 'ADMIN' || dataSelect.role === 'SUPER ADMIN') && (
            <ActionButtonHeader
              key={3}
              href={'/dashboard'}
              className="px-[31px] py-[13px] transition-all duration-500 hover:drop-shadow-custom hover:bg-[#F97316] hover:border-[#F97316]"
            >
              Trang Admin
            </ActionButtonHeader>
          )}
          <div className="flex space-x-4 ">
            <Dropdown menu={{ items }}>
              <a
                onClick={(e) => e.preventDefault()}
                className="cursor-pointer text-white text-[18px]"
              >
                <Space>
                  {session?.data?.results?.[0].name ?? ""}
                  <DownOutlined />
                </Space>
              </a>
            </Dropdown>

          </div>
        </div>

      )}
      <ModalChangePassword
        email={session?.data?.results?.[0].email}
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
    </header>
  );
};

export default Header;
