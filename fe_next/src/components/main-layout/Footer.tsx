"use client";

import Image from "next/image";
import Link from "next/link";
import FooterLink from "@/components/main-layout/FooterLink";
import FacebookSVG from "@/components/main-layout/svgs/FacebookSVG";
import FlySVG from "@/components/main-layout/svgs/FlySVG";
import InstagramSVG from "@/components/main-layout/svgs/InstagramSVG";
import TwitterSVG from "@/components/main-layout/svgs/TwitterSVG";

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
      {/* background elipse */}
      <div className="bg-[url('/images/footer/footer-background.png')] absolute bottom-0 left-0 w-full h-4/5  bg-no-repeat bg-cover bg-center -z-10"></div>
      {/* form */}
      <div className="w-10/12 rounded-[1.25rem] border-4 border-[#7C3AED] mx-auto  py-10 px-16 bg-white flex ">
        <div className="w-1/2 pr-[70px]">
          <h1 className="text-[#4C1D95] font-serif text-[3.125rem] font-medium mb-1.5">
            Liên Hệ Với Chúng Tôi
          </h1>
          <p className="text-[#4C1D95] font-sans text-xl font-normal leading-[30px] mb-2">
            Nếu bạn có bất kỳ câu hỏi hoặc cần hỗ trợ, hãy liên hệ với chúng tôi
            qua:
          </p>
          <Image
            src="/images/footer/question-picture.png"
            width={335}
            height={294}
            alt="Picture of the author"
          />
        </div>
        <div className="flex flex-col gap-[42px]">
          {/* <h1 className="max-w-[550px] text-[#4C1D95] font-playfair text-2xl md:text-5xl font-normal leading-[100%] hidden md:block">
            {contactInfo.discorverUs.label}
          </h1> */}
          {/* <h1 className="max-w-[225px] text-[#4C1D95] font-playfair text-4xl md:text-5xl font-normal leading-[130%] block md:hidden">
            {contactInfo.discorverUs.label}
          </h1> */}
          <p className="max-w-[531px] text-[#4C1D95] font-inter text-[22px] font-normal leading-[159%]">
            {contactInfo.discorverUs.description}
          </p>
          <div>
            <h3 className="max-w-[350px] text-[#4C1D95] text-[30px] font-normal leadding-[93.33%]">
              {contactInfo.visitUs.label}
            </h3>
            <a
              href="https://maps.app.goo.gl/Z7i5WZ6G1RwkNQbz9"
              target="_blank"
              className="max-w-[401px] text-[#4C1D95] font-inter text-xl font-normal leading-[175%] underline transition-all duration-500 inline-block"
            >
              <span className="max-w-[401px] text-[#4C1D95] text-xl font-normal leading-[175%] underline transition-all duration-500 inline-block">
                {contactInfo.visitUs.description}
              </span>
            </a>
          </div>
          <div>
            <h3 className="text-[#4C1D95] font-inter  text-[30px] font-normal leadding-[106.667%%] mb-[7px]">
              {contactInfo.email.label}
            </h3>
            <div className="flex flex-col gap-2">
              <span className="text-[#7C3AED] font-inter text-[22px] font-normal leading-[159%]  transition-all duration-500">
                {contactInfo.email.description}
              </span>
            </div>
          </div>
          <div>
            <h3 className="text-[#4C1D95] font-inter text-[30px] font-normal leading-[106.667%%] mb-[18px]">
              {contactInfo.phoneNumbers.label}
            </h3>
            <div className="flex flex-col gap-2">
              <span className="text-[#7C3AED] font-inter text-[22px] font-normal leading-[124%] underline  transition-all duration-500">
                {contactInfo.phoneNumbers.description}
              </span>
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
                <span className="font-sans text-base font-normal text-white ">
                  ©{new Date().getFullYear()} by Xuân Chinh
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
