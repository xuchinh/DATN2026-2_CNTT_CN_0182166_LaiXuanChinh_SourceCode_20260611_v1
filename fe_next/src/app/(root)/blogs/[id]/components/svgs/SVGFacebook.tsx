import { ISVG } from "@/types/svg";


const SVGFacebook = (ISVG: ISVG) => {
  return (
    <svg
      viewBox="0 0 30 31"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={ISVG.className}
    >
      <ellipse
        cx="15.017"
        cy="15.3534"
        rx="12.6796"
        ry="12.9331"
        fill="url(#paint0_linear_116_2628)"
      />
      <path
        d="M19.739 19.3087L20.3022 15.6583H16.7788V13.2906C16.7788 12.2917 17.27 11.3174 18.8482 11.3174H20.4511V8.20972C20.4511 8.20972 18.997 7.96307 17.6075 7.96307C14.7044 7.96307 12.8086 9.71175 12.8086 12.8762V15.6583H9.58289V19.3087H12.8086V28.1336C13.4562 28.2347 14.1188 28.2865 14.7937 28.2865C15.4686 28.2865 16.1311 28.2347 16.7788 28.1336V19.3087H19.739Z"
        fill="white"
      />
      <defs>
        <linearGradient
          id="paint0_linear_116_2628"
          x1="15.017"
          y1="2.42035"
          x2="15.017"
          y2="28.2098"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#18ACFE" />
          <stop offset="1" stopColor="#0163E0" />
        </linearGradient>
      </defs>
    </svg>
  );
};
export default SVGFacebook;
