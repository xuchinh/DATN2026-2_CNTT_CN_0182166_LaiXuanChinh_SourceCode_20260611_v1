import React from "react";

import FeatureCard from "./InterestCard";

const InterestList: React.FC = () => {
  const features = [
    {
      id: 1,
      icon: "⏱️",
      title: "Tiết kiệm thời gian",
      description:
        "Tự động hóa thay bạn làm việc thủ công, để bạn dành thời gian cho điều quan trọng hơn.",
    },
    {
      id: 2,
      icon: "💰",
      title: "Tối ưu lợi nhuận",
      description:
        "Quản lý chặt chẽ và chiến lược giá thuê hợp lý giúp nguồn thu của bạn tăng đều.",
    },
    {
      id: 3,
      icon: "✨",
      title: "Trải nghiệm mượt mà",
      description:
        "Giao diện thân thiện, dễ làm quen — bạn sử dụng thành thạo ngay từ lần đầu.",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {features.map((feature) => (
        <FeatureCard
          key={feature.id}
          icon={feature.icon}
          title={feature.title}
          description={feature.description}
        />
      ))}
    </div>
  );
};

export default InterestList;
