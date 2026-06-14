import { ISVG } from "@/types/svg";


const SVGReduce = (ISVG: ISVG) => {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`w-7 h-7 lg:w-10 lg:h-10 ${ISVG.className}`}
    >
      <g id="Group 238435">
        <circle
          id="Ellipse 1395"
          cx="20"
          cy="20"
          r="19"
          fill="white"
          stroke="#EEB537"
          strokeWidth="2"
        />
        <path
          id="-"
          d="M26.051 18.8069V21.1932H13.9487V18.8069H26.051Z"
          fill={ISVG.fill || "#EEB537"}
        />
      </g>
    </svg>
  );
};

export default SVGReduce;
