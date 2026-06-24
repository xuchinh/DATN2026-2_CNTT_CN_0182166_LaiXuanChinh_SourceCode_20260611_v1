import React from "react";

type InterestCardProps = {
  title: string;
  description: string;
  icon: string;
};

const InterestCard: React.FC<InterestCardProps> = ({ title, description, icon }) => {
  return (
    <div className="rounded-[20px] border border-[#E2EFE8] bg-white p-8 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(5,150,105,0.12)]">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#059669] to-[#10B981] text-4xl shadow-lg">
        {icon}
      </div>
      <h3 className="mt-6 font-playfair text-[22px] font-bold text-[#064E3B]">{title}</h3>
      <div className="mx-auto my-4 h-[3px] w-12 rounded-full bg-[#10B981]" />
      <p className="text-[15px] leading-relaxed text-[#3F5C50]">{description}</p>
    </div>
  );
};

export default InterestCard;
