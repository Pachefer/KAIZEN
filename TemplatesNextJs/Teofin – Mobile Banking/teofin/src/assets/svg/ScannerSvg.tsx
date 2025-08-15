import * as React from 'react';

export const ScannerSvg: React.FC = () => {
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
        fill='#EC5'
        rx={25}
      />
      <path
        stroke='#fff'
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={2}
        d='M21.667 17.5h-2.5a1.666 1.666 0 0 0-1.667 1.667v2.5m15 0v-2.5a1.666 1.666 0 0 0-1.667-1.667h-2.5m0 15h2.5a1.666 1.666 0 0 0 1.667-1.667v-2.5m-15 0v2.5a1.666 1.666 0 0 0 1.667 1.667h2.5'
      />
    </svg>
  );
};
