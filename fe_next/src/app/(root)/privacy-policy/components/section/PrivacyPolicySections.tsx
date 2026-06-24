import PrivacyPolicySectionList from "./PrivacyPolicySectionList";
import PageBanner from "@/components/main-layout/sections/banner/PageBanner";

const PrivacyPolicySections = () => {
  return (
    <div className="bg-[#f5f5f7] relative">
      <PageBanner />
      <PrivacyPolicySectionList />
    </div>
  );
};
export default PrivacyPolicySections;
