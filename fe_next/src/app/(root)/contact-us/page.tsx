import type { Metadata } from "next";

import InfoCard from "@/app/(root)/contact-us/components/section/infor-card/InfoCard";

export const metadata: Metadata = {
  title: "Liên hệ",
  description:
    "Liên hệ với chúng tôi để được tư vấn và hỗ trợ. Đội ngũ chăm sóc khách hàng luôn sẵn sàng giải đáp mọi thắc mắc của bạn.",
  keywords:
    "Liên hệ phần mềm quản lý nhà trọ, Tư vấn phần mềm quản lý nhà trọ, Hỗ trợ khách hàng nhà trọ, Đội ngũ chăm sóc khách hàng.",
  alternates: {
    canonical: `http://localhost:3000/contact-us`,
  },
};

const ContactUsPage = () => {
  return (
    <div className="bg-[url('/images/shared/background-heading.png')] h-[1253px] bg-no-repeat bg-[#F5F5F7] pb-[32px]">
      {/* content */}
      <div className=" mx-auto w-10/12">
        <div className="pt-[184px]">
          {/* heading */}
          <div className="flex flex-col items-center justify-center mb-[73px] px-4 md:px-0">
            <h1 className="text-white text-center font-playfair text-[36px] md:text-[48px] lg:text-[64px] font-bold leadding-[120%] mb-7">
              Liên Hệ
            </h1>
            <p className="max-w-[694px] text-white text-center font-inter text-lg font-normal leadding-[160%]">
              Chúng tôi cung cấp nhiều gói dịch vụ với mức giá linh hoạt, phù
              hợp với nhu cầu và quy mô kinh doanh của bạn. Hãy chọn gói phù hợp
              nhất và bắt đầu trải nghiệm sự tiện lợi và hiệu quả từ phần mềm
              của chúng tôi.
            </p>
          </div>
          {/* company info */}
          <InfoCard />
        </div>
      </div>
    </div>
  );
};

export default ContactUsPage;
