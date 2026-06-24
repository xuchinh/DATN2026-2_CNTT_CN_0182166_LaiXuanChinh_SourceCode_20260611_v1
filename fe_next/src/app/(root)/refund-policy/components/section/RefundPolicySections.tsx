
import RefundPolicySectionList from "./RefundPolicySectionList";
import PageBanner from "@/components/main-layout/sections/banner/PageBanner";

const RefundPolicySections = () => {
  return (
    <div className="bg-[#f5f5f7] relative">
      <PageBanner />
      <RefundPolicySectionList />
    </div>
  );
};
export default RefundPolicySections;
