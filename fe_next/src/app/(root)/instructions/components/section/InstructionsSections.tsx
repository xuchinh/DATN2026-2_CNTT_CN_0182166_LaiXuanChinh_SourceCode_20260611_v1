import BannerImage from "@/components/main-layout/sections/banner/BannerImage";
import InstructionsSectionList from "./InstructionsSecsionsList";
import BannerContents from "@/components/main-layout/sections/banner/BannerContent";

const InstructionsSections = () => {
  return (
    <div className="bg-[#f5f5f7]">
      <BannerImage />

      <BannerContents
        heading="Hướng Dẫn Sử Dụng"
        description="Phần mềm quản lý nhà trọ được thiết kế để giúp bạn dễ dàng theo dõi và quản lý các hoạt động của nhà trọ một cách hiệu quả. Dưới đây là hướng dẫn cơ bản để sử dụng phần mềm:"
      />
      <InstructionsSectionList />
    </div>
  );
};
export default InstructionsSections;
