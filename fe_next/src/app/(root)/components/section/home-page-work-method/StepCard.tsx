import Image from "next/image";
import React from "react";

type StepCardProps = {
  title: string;
  description: string;
  imageUrl: string;
  className?: string;
  imgClassName?: string;
};

const StepCard: React.FC<StepCardProps> = ({
  title,
  description,
  imageUrl,
  imgClassName,
  className,
}) => {
  return (
    <div
      className={`w-[270px] h-[394px] pt-[10px] px-[20px] rounded-[10px] text-white ${className}`}
    >
      <div className="flex justify-center h-[165px] items-center">
        <Image
          src={imageUrl}
          alt={title}
          width={220}
          height={140}
          className={imgClassName}
        />
      </div>
      <h3 className="text-[#F97316] font-playfair text-xl font-bold leading-[150%] pt-[40px] pb-[20px]">
        {title}
      </h3>
      <p className="text-white font-sans text-center text-base font-medium leading-[150%]">
        {description}
      </p>
    </div>
  );
};

export default StepCard;
