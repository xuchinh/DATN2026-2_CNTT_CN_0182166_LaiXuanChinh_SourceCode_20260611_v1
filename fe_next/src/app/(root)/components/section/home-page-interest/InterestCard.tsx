import Image from "next/image";
import React from "react";

type InterestCardProps = {
  title: string;
  description: string;
  imageUrl: string;
  textCustomClassName?: string;
};

const InterestCard: React.FC<InterestCardProps> = ({
  title,
  description,
  imageUrl,
  textCustomClassName,
}) => {
  return (
    <div className="text-left p-6">
      <div className="mb-10 ">
        <Image
          src={imageUrl}
          alt={title}
          width={150}
          height={64}
          className="min-h-[152px]"
        />
      </div>
      <h3 className="text-[25px] font-playfair text-[#4C1D95] font-medium">
        {title}
      </h3>
      <hr className="w-[60px] h-[4px] bg-[#7C3AED] my-[20px]" />
      <p
        className={`text-[#4C1D95] font-sans text-base font-normal leadding-[200%] ${textCustomClassName} `}
      >
        {description}
      </p>
    </div>
  );
};

export default InterestCard;
