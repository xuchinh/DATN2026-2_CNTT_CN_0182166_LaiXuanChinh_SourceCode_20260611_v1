import React from "react";

import ArrowRightSVG from "../../svgs/ArrowRightSVG";
import Card from "./StepCard";

const CardList: React.FC = () => {
  const steps = [
    {
      id: 1,
      title: "1. Đăng Ký Tài Khoản",
      description:
        "Đăng ký tài khoản nhanh chóng và dễ dàng chỉ trong vài phút.",
      imageUrl: "/images/home-page/step-1.png",
      imgClassName: "w-[220px] h-[116px]",
    },
    {
      id: 2,
      title: "2. Thiết Lập Thông Tin",
      description:
        "Nhập thông tin chi tiết về phòng trọ, khách thuê và các hợp đồng thuê hiện tại.",
      imageUrl: "/images/home-page/step-2.png",
      imgClassName: "w-[188px] h-[139px]",
    },
    {
      id: 3,
      title: "3. Bắt Đầu Quản Lý",
      description:
        "Sử dụng phần mềm để quản lý toàn bộ quá trình cho thuê, từ quảng bá phòng trọ đến thu tiền và bảo trì.",
      imageUrl: "/images/home-page/step-3.png",
      imgClassName: "w-[216px] h-[120px]",
    },
  ];

  return (
    <div className="flex items-center justify-between w-4/5  mx-auto py-[76px] px-[56px] bg-[linear-gradient(104deg,#1A0533_3.69%,#4C1D95_99.62%)] rounded-[20px] ">
      {steps.map((step, index) => (
        <React.Fragment key={step.id}>
          <Card
            title={step.title}
            description={step.description}
            imageUrl={step.imageUrl}
            className="bg-[#5B21B6] w-1/3 h-[394px]"
          />
          {index < steps.length - 1 && (
            <ArrowRightSVG className="mx-4 " />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default CardList;
