import * as React from 'react';

export const SuccessSvg: React.FC = () => {
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
        fill='#3EB290'
      />
      <path
        d='M70 35 42.5 62.5 30 50'
        stroke='#fff'
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={4}
      />
    </svg>
  );
};
