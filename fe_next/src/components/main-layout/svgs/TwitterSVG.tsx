import React from "react";

type TwitterSVGProps = {
  className?: string;
};

const TwitterSVG: React.FC<TwitterSVGProps> = ({ className }) => {
  return (
    <svg
      width="24"
      height="25"
      viewBox="0 0 24 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={` ${className}`}
    >
      <path
        d="M23 3.20317C22.0424 3.87865 20.9821 4.39528 19.86 4.73317C19.2577 4.04068 18.4573 3.54986 17.567 3.3271C16.6767 3.10433 15.7395 3.16037 14.8821 3.48762C14.0247 3.81488 13.2884 4.39757 12.773 5.15689C12.2575 5.9162 11.9877 6.81551 12 7.73317V8.73317C10.2426 8.77874 8.50127 8.38898 6.93101 7.59862C5.36074 6.80825 4.01032 5.64181 3 4.20317C3 4.20317 -1 13.2032 8 17.2032C5.94053 18.6011 3.48716 19.3021 1 19.2032C10 24.2032 21 19.2032 21 7.70317C20.9991 7.42462 20.9723 7.14677 20.92 6.87317C21.9406 5.86666 22.6608 4.59588 23 3.20317V3.20317Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default TwitterSVG;
