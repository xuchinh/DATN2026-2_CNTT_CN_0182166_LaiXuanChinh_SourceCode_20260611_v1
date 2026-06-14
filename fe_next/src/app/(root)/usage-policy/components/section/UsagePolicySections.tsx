
import BannerImage from "@/components/main-layout/sections/banner/BannerImage";
import UsagePolicySectionList from "./UsagePolicySectionList";
import BannerContents from "@/components/main-layout/sections/banner/BannerContent";

const UsagePolicySections = () => {
  return (
    <div className="bg-[#f5f5f7] relative">
      <BannerImage />
      <BannerContents
        heading="Chính Sách Sử Dụng"
        description="Chúng tôi cung cấp nhiều gói dịch vụ với mức giá linh hoạt, phù hợp với nhu cầu và quy mô kinh doanh của bạn. Hãy chọn gói phù hợp nhất và bắt đầu trải nghiệm sự tiện lợi và hiệu quả từ phần mềm của chúng tôi."
      />
      <UsagePolicySectionList />
    </div>
  );
};
export default UsagePolicySections;
