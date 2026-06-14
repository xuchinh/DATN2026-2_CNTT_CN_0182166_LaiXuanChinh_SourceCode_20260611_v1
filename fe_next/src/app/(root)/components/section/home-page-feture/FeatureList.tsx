import Image from "next/image";
import React from "react";

type FeatureListProps = {
  className?: string;
};

const FeatureList: React.FC<FeatureListProps> = ({ className }) => {
  const features = [
    {
      id: 1,
      title: "Quản Lý Phòng Trọ Đa Nền Tảng",
      description:
        "Quản lý phòng trọ của bạn từ bất kỳ thiết bị nào, bất kể bạn đang ở đâu. Phần mềm của chúng tôi tương thích với máy tính, máy tính bảng và điện thoại di động.",
    },
    {
      id: 2,
      title: "Quản Lý Khách Thuê",
      description:
        "Theo dõi và quản lý thông tin khách thuê, lịch sử thanh toán và các hợp đồng thuê một cách chi tiết và dễ dàng.",
    },
    {
      id: 3,
      title: "Tự Động Hóa Quy Trình",
      description:
        "Tự động gửi thông báo nhắc nhở thanh toán, thông báo hết hạn hợp đồng, và quản lý các yêu cầu bảo trì từ khách thuê.",
    },
    {
      id: 4,
      title: "Báo Cáo Tài Chính Chi Tiết",
      description:
        "Cung cấp báo cáo tài chính chi tiết giúp bạn theo dõi doanh thu, chi phí và lợi nhuận một cách minh bạch và chính xác.",
    },
    {
      id: 5,
      title: "Bảo Mật Cao",
      description:
        "Thông tin của bạn được bảo vệ bởi hệ thống bảo mật tiên tiến, đảm bảo an toàn tuyệt đối cho dữ liệu của bạn.",
    },
  ];

  return (
    <div className={`${className}`}>
      <div className="w-full mt-[80px] lg:pl-[10%] ">
        <div className="max-w-[485px]">
          {/* center dots */}
          <div className="absolute top-[5%] left-[-12%]">
            <Image
              src="/images/home-page/dot-center-feture.png"
              width={167}
              height={281}
              alt="dot center"
              className="object-cover"
            />
          </div>
          {/* feture content */}
          <div className="relative">
            {features.map((feature) => (
              <div
                key={feature.id}
                className="flex items-start mb-12 "
              >
                <div className="text-center leading-[50px] text-white font-playfair text-[50px] font-medium w-[60px] h-[60px] bg-[#F97316] rounded-full mr-8">
                  {feature.id}
                </div>

                <div>
                  <h3 className="text-[#F97316] font-playfair text-[25px] font-medium">
                    {feature.title}
                  </h3>
                  <p className="max-w-[322px] text-white font-sans text-base font-normal leading-[24px]">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
          {/* right dots */}
          <div className="absolute bottom-[9%] right-[2%]">
            <Image
              src="/images/home-page/dot-right-feture.png"
              width={240}
              height={196}
              alt="right dots"
              className="bg-no-repeat object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeatureList;
