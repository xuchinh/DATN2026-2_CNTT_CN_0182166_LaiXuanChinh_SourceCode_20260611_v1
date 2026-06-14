import ListInstructions from "./ListInstructions";
import QAInstructions from "./questions-answer-instructions/QAInstructionsSection";
import VideoInstructionsSections from "./video-instructions/VideoInstructionsSections";

const InstructionsSectionList = () => {
  return (
    <section className="container mx-auto pb-12 pt-[25px] lg:pt-0 flex items-center justify-center bg-[#f5f5f7] ">
      <div className="rounded-[20px] md:max-w-[740px] lg:max-w-[1240px] relative max-w-[360px]">
        <VideoInstructionsSections />
        <ListInstructions />
        <QAInstructions />
      </div>
    </section>
  );
};
export default InstructionsSectionList;
