import InstructionsSectionList from "./InstructionsSecsionsList";
import PageBanner from "@/components/main-layout/sections/banner/PageBanner";

const InstructionsSections = () => {
  return (
    <div className="bg-[#f5f5f7]">
      <PageBanner />
      <InstructionsSectionList />
    </div>
  );
};
export default InstructionsSections;
