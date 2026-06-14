import ListQAInstructionsSection from "./ListQAInstructionsSection";
import QABanner from "./q-a-instruction-banner/QABanner";

const QAInstructions = () => {
  return (
    <section className="lg:max-w-[1240px] bg-white rounded-[20px] ">
      <QABanner />
      <ListQAInstructionsSection />
    </section>
  );
};
export default QAInstructions;
