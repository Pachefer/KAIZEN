import * as React from 'react';

export const FailedSvg: React.FC = () => {
  return (
    <svg
      width={100}
      height={100}
      fill='none'
      viewBox='0 0 100 100'
      xmlns='http://www.w3.org/2000/svg'
    >
      <circle
        cx={50}
        cy={50}
        r={50}
        fill='#FF5887'
      />
      <path
        d='M65 35 35 65M35 35l30 30'
        stroke='#fff'
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={4}
      />
    </svg>
  );
};
