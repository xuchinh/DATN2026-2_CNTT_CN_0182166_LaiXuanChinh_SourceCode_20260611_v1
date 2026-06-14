import React from "react";

import FeatureCard from "./InterestCard";

const InterestList: React.FC = () => {
  const features = [
    {
      id: 1,
      title: "Tiết Kiệm Thời Gian",
      description:
        "Phần mềm tự động hóa giúp bạn giảm bớt khối lượng công việc thủ công, dành nhiều thời gian hơn cho các hoạt động kinh doanh khác.",
      imageUrl: "/images/home-page/time.png",
      textCustomClassName: "max-w-[300px]",
    },
    {
      id: 2,
      title: "Tối Ưu Hóa Lợi Nhuận",
      description:
        "Quản lý hiệu quả và các chiến lược giá thuê giúp tối đa hóa lợi nhuận từ hoạt động cho thuê.",
      imageUrl: "/images/home-page/money.png",
      textCustomClassName: "max-w-[300px]",
    },
    {
      id: 3,
      title: "Trải Nghiệm Người Dùng Tuyệt Vời",
      description:
        "Giao diện thân thiện và dễ sử dụng giúp bạn nhanh chóng làm quen và sử dụng hệ thống mà không gặp khó khăn.",
      imageUrl: "/images/home-page/rating.png",
      textCustomClassName: "max-w-[365px]",
    },
  ];

  return (
    <div className="flex justify-between">
      {features.map((feature) => (
        <FeatureCard
          key={feature.id}
          title={feature.title}
          description={feature.description}
          imageUrl={feature.imageUrl}
          textCustomClassName={feature.textCustomClassName}
        />
      ))}
    </div>
  );
};

export default InterestList;
