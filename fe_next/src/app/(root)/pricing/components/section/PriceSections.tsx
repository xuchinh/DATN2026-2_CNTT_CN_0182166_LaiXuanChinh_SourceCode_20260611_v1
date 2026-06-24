import HomePageReview from "@/app/(root)/components/section/home-page-review/HomePageReview";


import PriceSectionsList from "./PriceSectionsList";
import PageBanner from "@/components/main-layout/sections/banner/PageBanner";

const PriceSections = () => {
  return (
    <div className="bg-[#f5f5f7] relative">
      <PageBanner />
      <PriceSectionsList
        bgImageItemBanner="/images/price-image/bg-Item-top.png"
        bgImageItem="/images/price-image/price-item-bg.png"
      ></PriceSectionsList>
      <HomePageReview />
    </div>
  );
};
export default PriceSections;
