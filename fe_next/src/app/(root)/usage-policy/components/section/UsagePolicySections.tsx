
import UsagePolicySectionList from "./UsagePolicySectionList";
import PageBanner from "@/components/main-layout/sections/banner/PageBanner";

const UsagePolicySections = () => {
  return (
    <div className="bg-[#f5f5f7] relative">
      <PageBanner />
      <UsagePolicySectionList />
    </div>
  );
};
export default UsagePolicySections;
