import React from "react";

type FeatureListProps = {
  className?: string;
};

const FeatureList: React.FC<FeatureListProps> = ({ className }) => {
  const features = [
    {
      id: 1,
      icon: "🏠",
      title: "Quản lý đa nền tảng",
      description:
        "Theo dõi phòng trọ mọi lúc, mọi nơi — trên máy tính, máy tính bảng hay điện thoại.",
    },
    {
      id: 2,
      icon: "👥",
      title: "Quản lý khách thuê",
      description:
        "Thông tin khách, lịch sử thanh toán và hợp đồng — gọn gàng, dễ tra cứu.",
    },
    {
      id: 3,
      icon: "⚡",
      title: "Tự động hóa quy trình",
      description:
        "Nhắc thanh toán, cảnh báo hết hạn hợp đồng và tiếp nhận yêu cầu bảo trì.",
    },
    {
      id: 4,
      icon: "📊",
      title: "Báo cáo tài chính",
      description:
        "Doanh thu, chi phí và lợi nhuận hiện rõ qua biểu đồ trực quan.",
    },
    {
      id: 5,
      icon: "🔒",
      title: "Bảo mật dữ liệu",
      description:
        "Mật khẩu mã hóa, phân quyền rõ ràng — dữ liệu của bạn luôn an toàn.",
    },
    {
      id: 6,
      icon: "🧾",
      title: "Hóa đơn điện nước",
      description:
        "Ghi chỉ số, tính tiền theo tháng cho từng phòng chỉ trong vài giây.",
    },
  ];

  return (
    <div className={`grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 ${className ?? ""}`}>
      {features.map((feature) => (
        <div
          key={feature.id}
          className="group rounded-[18px] border border-[#E2EFE8] bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:border-[#A7F3D0] hover:shadow-[0_18px_40px_rgba(5,150,105,0.12)]"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#ECFDF5] to-[#D1FAE5] text-2xl">
            {feature.icon}
          </div>
          <h3 className="mt-5 font-playfair text-xl font-bold text-[#064E3B]">
            {feature.title}
          </h3>
          <p className="mt-2 text-[15px] leading-relaxed text-[#3F5C50]">
            {feature.description}
          </p>
        </div>
      ))}
    </div>
  );
};

export default FeatureList;
