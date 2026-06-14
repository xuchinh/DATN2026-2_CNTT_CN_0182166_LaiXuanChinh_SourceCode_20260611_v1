import React from "react";

type FlySVGProps = {
  className?: string;
};

const FlySVG: React.FC<FlySVGProps> = ({ className }) => {
  return (
    <svg
      width="24"
      height="25"
      viewBox="0 0 24 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className}`}
    >
      <path
        d="M22 2.20312L11 13.2031"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M22 2.20312L15 22.2031L11 13.2031L2 9.20312L22 2.20312Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default FlySVG;
