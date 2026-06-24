import React from "react";

import Card from "./StepCard";

const CardList: React.FC = () => {
  const steps = [
    {
      id: 1,
      title: "Đăng ký tài khoản",
      description: "Tạo tài khoản nhanh chóng, chỉ trong vài phút.",
    },
    {
      id: 2,
      title: "Thiết lập thông tin",
      description:
        "Nhập thông tin phòng trọ, khách thuê và các hợp đồng đang có.",
    },
    {
      id: 3,
      title: "Bắt đầu quản lý",
      description:
        "Vận hành toàn bộ quy trình cho thuê: đăng tin, thu tiền, bảo trì.",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {steps.map((step) => (
        <Card
          key={step.id}
          id={step.id}
          title={step.title}
          description={step.description}
        />
      ))}
    </div>
  );
};

export default CardList;
