import * as React from 'react';

export const PromotionSvg: React.FC = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={50} height={50} fill="none">
      <circle cx={25} cy={25} r={25} fill="url(#a)" opacity={0.1} />
      <rect width={30} height={30} x={10} y={10} fill="#6DDDD3" rx={15} />
      <path
        stroke="#fff"
        strokeMiterlimit={10}
        strokeWidth={1.5}
        d="M25 34a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z"
      />
      <path
        stroke="#fff"
        strokeMiterlimit={10}
        strokeWidth={1.5}
        d="M22 27.25c0 1.243 1.343 2.25 3 2.25s3-1.007 3-2.25S26.657 25 25 25s-3-1.007-3-2.25 1.343-2.25 3-2.25 3 1.007 3 2.25M25 20.5v-2.25M25 31.75V29.5"
      />
      <defs>
        <linearGradient
          id="a"
          x1={0}
          x2={0}
          y1={0}
          y2={50}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#23D2C3" stopOpacity={0.6} />
          <stop offset={1} stopColor="#01BCAD" />
        </linearGradient>
      </defs>
    </svg>
  );
};
