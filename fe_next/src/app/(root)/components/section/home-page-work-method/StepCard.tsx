import React from "react";

type StepCardProps = {
  id: number;
  title: string;
  description: string;
};

const StepCard: React.FC<StepCardProps> = ({ id, title, description }) => {
  return (
    <div className="rounded-[20px] border border-white/10 bg-white/5 p-8 backdrop-blur transition-all duration-300 hover:bg-white/10">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#10B981] to-[#34D399] font-playfair text-2xl font-bold text-white">
        {String(id).padStart(2, "0")}
      </div>
      <h3 className="mt-5 font-playfair text-xl font-bold text-white">{title}</h3>
      <p className="mt-2 text-[15px] leading-relaxed text-white/75">{description}</p>
    </div>
  );
};

export default StepCard;
