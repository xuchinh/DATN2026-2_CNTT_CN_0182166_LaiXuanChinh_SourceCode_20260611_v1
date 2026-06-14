import HomePageReview from "@/app/(root)/components/section/home-page-review/HomePageReview";


import PriceSectionsList from "./PriceSectionsList";
import BannerImage from "@/components/main-layout/sections/banner/BannerImage";
import BannerContents from "@/components/main-layout/sections/banner/BannerContent";

const PriceSections = () => {
  return (
    <div className="bg-[#f5f5f7] relative">
      <BannerImage />
      <BannerContents
        heading="Gói Dịch Vụ Linh Hoạt Và"
        supHeading="Phù Hợp Với Mọi Nhu Cầu"
        description="Chúng tôi cung cấp nhiều gói dịch vụ với mức giá linh hoạt, phù hợp với nhu cầu và quy mô kinh doanh của bạn. Hãy chọn gói phù hợp nhất và bắt đầu trải nghiệm sự tiện lợi và hiệu quả từ phần mềm của chúng tôi."
      />
      <PriceSectionsList
        bgImageItemBanner="/images/price-image/bg-Item-top.png"
        bgImageItem="/images/price-image/price-item-bg.png"
      ></PriceSectionsList>
      <HomePageReview />
    </div>
  );
};
export default PriceSections;
