import ListInstructions from "./ListInstructions";
import QAInstructions from "./questions-answer-instructions/QAInstructionsSection";
import VideoInstructionsSections from "./video-instructions/VideoInstructionsSections";

const InstructionsSectionList = () => {
  return (
    <section className="relative z-10 mx-auto -mt-20 w-11/12 max-w-[1280px] pb-16">
      <div className="md:max-w-[740px] lg:max-w-[1240px] relative max-w-[360px] mx-auto">
        <VideoInstructionsSections />
        <ListInstructions />
        <QAInstructions />
      </div>
    </section>
  );
};
export default InstructionsSectionList;
