import * as React from 'react';

export const BarChartSvg: React.FC = () => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={50}
    height={50}
    fill='none'
  >
    <rect
      width={50}
      height={50}
      fill='#55ACEE'
      rx={25}
    />
    <path
      stroke='#fff'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={2}
      d='M30 31.667v-8.334M25 31.667V18.333M20 31.667v-5'
    />
  </svg>
);
