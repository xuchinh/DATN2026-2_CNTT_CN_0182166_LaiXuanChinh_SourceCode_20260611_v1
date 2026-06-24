"use client";

import Image from "next/image";
import Link from "next/link";
import FooterLink from "@/components/main-layout/FooterLink";
import FacebookSVG from "@/components/main-layout/svgs/FacebookSVG";
import FlySVG from "@/components/main-layout/svgs/FlySVG";
import InstagramSVG from "@/components/main-layout/svgs/InstagramSVG";
import TwitterSVG from "@/components/main-layout/svgs/TwitterSVG";
import {
  EnvironmentOutlined,
  MailOutlined,
  PhoneOutlined,
  MessageFilled,
} from "@ant-design/icons";

const Footer = () => {

  const navTopLinks = [
    { href: "/", label: "Home" },
    { href: "/pricing", label: "Bảng giá" },
    {
      href: "/instructions",
      label: "Hướng dẫn sử dụng",
    },
    { href: "/blogs", label: "Blog" },
    { href: "/contact-us", label: "Liên hệ" },
  ];
  const navBotLinks = [
    { href: "/privacy-policy", label: "Chính Sách Bảo Mật" },
    { href: "/usage-policy", label: "Chính Sách Sử Dụng" },
    {
      href: "/refund-policy",
      label: "Chính Sách Hoàn Tiền",
    },
  ];

  const socialSVSClass = "text-white";

  const socialLinks = [
    {
      href: "https://www.facebook.com/",
      icon: <FacebookSVG className={socialSVSClass} />,
    },
    {
      href: "https://twitter.com/",
      icon: <TwitterSVG className={socialSVSClass} />,
    },
    {
      href: "https://www.fly.com/",
      icon: <FlySVG className={socialSVSClass} />,
    },
    {
      href: "https://www.instagram.com/",
      icon: <InstagramSVG className={socialSVSClass} />,
    },
  ];
  const contactInfo = {
    discorverUs: {
      label: "KHÁM PHÁ CHÚNG TÔI",
      description:
        "Các chuyên gia của chúng tôi sẵn sàng trả lời bất kỳ câu hỏi nào bạn có thể có. Hãy liên hệ với chúng tôi qua các kênh của chúng tôi:",
    },
    visitUs: {
      label: "ĐỊA CHỈ",
      description: "Phúc Thắng, Rạng Đông, Ninh Bình"
    },
    email: {
      label: "EMAIL",
      description: "laixuanchinh@gmail.com"
    },
    phoneNumbers: {
      label: "ĐIỆN THOẠI",
      description: "0916602763"
    },
  };

  return (
    <footer className={`relative pb-12`}>
      <div
        className={"absolute top-0 left-0 w-full h-full -z-10 bg-[#F5F5F7]"}
      ></div>
      {/* nền xanh đậm đồng bộ với header */}
      <div className="absolute bottom-0 left-0 w-full h-4/5 bg-[#064E3B] -z-10"></div>
      {/* card liên hệ */}
      <div className="w-10/12 mx-auto overflow-hidden rounded-[20px] border border-[#A7F3D0] bg-white shadow-[0_8px_40px_rgba(5,150,105,0.12)]">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px]">
          {/* ─── Nội dung ─── */}
          <div className="flex flex-col gap-6 px-10 py-10 lg:px-14">
            {/* Badge */}
            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-[#ECFDF5] px-3 py-1 text-[12px] font-bold uppercase tracking-widest text-[#059669]">
              <MessageFilled />
              Hỗ trợ 24/7
            </span>

            <h2 className="font-playfair text-[2rem] font-bold leading-tight text-[#064E3B] lg:text-[2.4rem]">
              Liên Hệ Với<br />
              <span className="text-[#059669]">Chúng Tôi</span>
            </h2>

            <p className="max-w-[420px] text-[15px] leading-relaxed text-[#4B5563]">
              {contactInfo.discorverUs.description}
            </p>

            {/* Items */}
            <div className="flex flex-col gap-3">
              <a
                href="https://maps.app.goo.gl/Z7i5WZ6G1RwkNQbz9"
                target="_blank"
                className="group flex items-center gap-3 text-[15px] text-[#374151] transition-colors hover:text-[#059669]"
              >
                <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[#ECFDF5] text-[#059669] transition-colors group-hover:bg-[#059669] group-hover:text-white">
                  <EnvironmentOutlined />
                </span>
                {contactInfo.visitUs.description}
              </a>
              <a
                href="mailto:laixuanchinh@gmail.com"
                className="group flex items-center gap-3 text-[15px] text-[#374151] transition-colors hover:text-[#059669]"
              >
                <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[#ECFDF5] text-[#059669] transition-colors group-hover:bg-[#059669] group-hover:text-white">
                  <MailOutlined />
                </span>
                {contactInfo.email.description}
              </a>
              <a
                href="tel:0916602763"
                className="group flex items-center gap-3 text-[15px] text-[#374151] transition-colors hover:text-[#059669]"
              >
                <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[#ECFDF5] text-[#059669] transition-colors group-hover:bg-[#059669] group-hover:text-white">
                  <PhoneOutlined />
                </span>
                {contactInfo.phoneNumbers.description}
              </a>
            </div>
          </div>

          {/* ─── Art panel phải ─── */}
          <div className="relative hidden items-center justify-center overflow-hidden bg-gradient-to-br from-[#059669] to-[#047857] lg:flex">
            <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-white/10" />
            <div className="absolute -bottom-6 -left-6 h-24 w-24 rounded-full bg-white/10" />
            <div className="relative z-10 flex flex-col items-center gap-4 text-center">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white/20">
                <MessageFilled className="text-[48px] text-white" />
              </div>
              <p className="px-6 text-[13px] font-medium leading-relaxed text-white/80">
                Phản hồi trong<br />
                <span className="text-[20px] font-bold text-white">24 giờ</span>
              </p>
              <div className="flex gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15">
                  <MailOutlined className="text-white" />
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15">
                  <PhoneOutlined className="text-white" />
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15">
                  <EnvironmentOutlined className="text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* footer links */}
      <div className="w-11/12 mx-auto mt-28">
        <div className="flex justify-between items-center">
          {/* image logo */}
          <div>
            <Link href="/">
              <Image
                src="/images/footer/footer-logo.png"
                width={335}
                height={294}
                alt="Picture of the author"
              />
            </Link>
          </div>
          {/* right nav */}
          <div className="w-4/6 flex-row justify-between items-center">
            {/* top nav */}
            <div className="flex justify-between pb-8 ">
              {/* nav */}
              <nav className="flex space-x-10">
                {navTopLinks.map((link, index) => (
                  <FooterLink
                    key={index}
                    href={link.href}
                    label={link.label}
                    className="text-lg"
                  />
                ))}
              </nav>
              {/* social icons */}
              <div className="flex space-x-5 ">
                {socialLinks.map((link, index) => (
                  <a key={index} className="!cursor-default">
                    {link.icon}
                  </a>
                ))}
              </div>
            </div>
            {/*  */}
            <hr className="block " />
            {/*  */}
            {/* bot nav*/}
            <div className="flex justify-between ">
              {/* nav */}
              <nav className="flex space-x-10 mt-4 ">
                {navBotLinks.map((link, index) => (
                  <FooterLink
                    key={index}
                    href={link.href}
                    label={link.label}
                    className="text-base"
                  />
                ))}
              </nav>

              {/* credit */}
              <div className="flex space-x-5 items-end">
                <span className="font-sans text-base font-normal text-[#A7F3D0] ">
                  ©{new Date().getFullYear()} by Xuân Chính
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
