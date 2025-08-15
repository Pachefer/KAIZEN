import * as React from 'react';

export const CopySvg: React.FC = () => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width={24}
      height={25}
      fill='none'
    >
      <path
        stroke='#7D849A'
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={1.5}
        d='M20 9.5h-9a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2v-9a2 2 0 0 0-2-2Z'
      />
      <path
        stroke='#7D849A'
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={1.5}
        d='M5 15.5H4a2 2 0 0 1-2-2v-9a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1'
      />
    </svg>
  );
};
