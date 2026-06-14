import type { TypeInstructionsProp } from "../../types/instructions";

type InstructionsItemProps = {
  instructionsItemProp: TypeInstructionsProp;
};

const InstructionsContentsItem = ({
  instructionsItemProp,
}: InstructionsItemProps) => {
  return (
    <div className="lg:max-w-[1090px]">
      <h2 className="text-left font-playfair font-bold text-[22px] lg:text-[25px] lg:leading-[45px] leading-[35px]">
        <span className="text-left font-playfair font-bold text-[22px] lg:text-[25px] lg:leading-[45px] leading-[35px]">
          {instructionsItemProp.id}
        </span>
        {". "}
        {instructionsItemProp.instructionsTitle}
      </h2>
      {instructionsItemProp.mainContents.map((contentItem, index) => (
        <ul
          key={index}
          className="text-left text-base lg:text-[18px] lg:leading-[45px] font-normal leading-[35px] list-disc pl-6"
        >
          <li>{contentItem.mainContent}</li>
        </ul>
      ))}
    </div>
  );
};
export default InstructionsContentsItem;
