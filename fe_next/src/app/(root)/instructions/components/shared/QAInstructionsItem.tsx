"use client";

import { useState } from "react";


import type { TypeQAInstructionsProp } from "../../types/q-a-instructions";
import SVGMore from "../svgs/SVGMore";
import SVGReduce from "../svgs/SVGReduce";

type QAInstructionsItemProps = {
  qaInstructionsItemProp: TypeQAInstructionsProp;
};

const QAInstructionsItem = ({
  qaInstructionsItemProp,
}: QAInstructionsItemProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="lg:ml-[44.5px] lg:mr-[58.5px] lg:pb-[34px] ml-6 mr-[26px] pb-[20px] border-b border-[#DEDBEC] ">
      <div
        className={`ml-[12.5px] mr-[14.5px] flex items-center justify-between py-[5px] ${isExpanded ? "mb-4" : ""
          } `}
      >
        <p
          className={`text-[#313A5A] text-[18px] lg:text-[20px] font-medium lending-[20px] lg:leading-[45px] ${isExpanded ? "text-primary" : ""
            }`}
        >
          {qaInstructionsItemProp.questionsTitle}
        </p>
        <p
          onClick={toggleExpand}
          className="cursor-pointer w-[40px] h-[40px] flex items-center justify-end"
        >
          {isExpanded ? <SVGReduce /> : <SVGMore />}
        </p>
      </div>
      {isExpanded && (
        <div className="bg-[rgba(238,181,55,0.10)] rounded-[5px] pt-5 lg:pt-6 pb-[24px] lg:pb-[30px]">
          {qaInstructionsItemProp.answer &&
            qaInstructionsItemProp.answer.map((answers, index) => (
              <p
                key={index}
                className="text-[#313A5A] lg:text-[16px] text-[14px] font-normal leading-[20px] lg:leading-[40px] pl-[18.5px] pr-[21.25px] lg:pl-[37px] lg:pr-[52.5px] "
              >
                {answers.answerTitle?.split(" ").map((word, i) => {
                  // if (word.includes(AppConfig.email)) {
                  //   return (
                  //     <a
                  //       key={i}
                  //       href={`mailto:${AppConfig.email.replace(/"/g, "")}`}
                  //       className="text-link font-normal leading-[159%] hover:text-primary transition-all duration-500 normal-case"
                  //     >
                  //       {AppConfig.email.replace(/"/g, "")}
                  //     </a>
                  //   );
                  // }
                  return word + " ";
                })}
              </p>
            ))}
        </div>
      )}
    </div>
  );
};

export default QAInstructionsItem;
