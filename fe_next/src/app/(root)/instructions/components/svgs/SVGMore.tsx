import { ISVG } from "@/types/svg";


const SVGMore = (ISVG: ISVG) => {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`w-7 h-7 lg:w-10 lg:h-10 ${ISVG.className}`}
    >
      <g id="Group 238434">
        <circle
          id="Ellipse 1395"
          cx="20"
          cy="20"
          r="19"
          fill="white"
          stroke="#313A5A"
          strokeWidth="2"
        />
        <path
          id="+"
          d="M18.7841 28.9915V11.0085H21.2131V28.9915H18.7841ZM11 21.2074V18.7926H28.9972V21.2074H11Z"
          fill={ISVG.fill || "#313A5A"}
        />
      </g>
    </svg>
  );
};

export default SVGMore;
