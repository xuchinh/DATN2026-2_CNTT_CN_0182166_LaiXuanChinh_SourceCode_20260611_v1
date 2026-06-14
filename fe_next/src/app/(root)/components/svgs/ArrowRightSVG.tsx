import React from "react";

type ArrowRightSVGProps = {
  className?: string;
};

const ArrowRightSVG: React.FC<ArrowRightSVGProps> = ({ className }) => {
  return (
    <svg
      width="30"
      height="15"
      viewBox="0 0 30 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M29 7.48707H1"
        stroke="#EEB537"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M24 1.49854L29 7.48698L24 13.4754"
        stroke="#EEB537"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default ArrowRightSVG;
