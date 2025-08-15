import * as React from 'react';

export const FileTextSvg: React.FC = () => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width={50}
      height={50}
      fill='none'
    >
      <rect
        width={50}
        height={50}
        fill='#F1F5FD'
        rx={25}
      />
      <path
        stroke='#1B1D4D'
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={2}
        d='M26.667 16.667H20a1.667 1.667 0 0 0-1.667 1.666v13.334A1.666 1.666 0 0 0 20 33.333h10a1.666 1.666 0 0 0 1.667-1.666v-10l-5-5Z'
      />
      <path
        stroke='#1B1D4D'
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={2}
        d='M26.667 16.667v5h5M28.333 25.833h-6.666M28.333 29.167h-6.666M23.333 22.5h-1.666'
      />
    </svg>
  );
};
