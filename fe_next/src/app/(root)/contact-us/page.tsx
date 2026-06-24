import type { Metadata } from "next";

import InfoCard from "@/app/(root)/contact-us/components/section/infor-card/InfoCard";
import PageBanner from "@/components/main-layout/sections/banner/PageBanner";

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
    <div className="bg-[#F5F5F7] pb-[32px]">
      <PageBanner />
      {/* content */}
      <div className="relative z-10 mx-auto -mt-20 w-11/12 max-w-[1280px] pb-12">
        <InfoCard />
      </div>
    </div>
  );
};

export default ContactUsPage;
