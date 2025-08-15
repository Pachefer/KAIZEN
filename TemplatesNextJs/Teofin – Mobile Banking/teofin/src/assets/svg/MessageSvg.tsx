import * as React from 'react';

export const MessageSvg: React.FC = () => {
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
        fill='#3EB290'
        rx={25}
      />
      <path
        stroke='#fff'
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={2}
        d='M32.5 27.5a1.666 1.666 0 0 1-1.667 1.667h-10L17.5 32.5V19.167a1.666 1.666 0 0 1 1.667-1.667h11.666a1.666 1.666 0 0 1 1.667 1.667V27.5Z'
      />
    </svg>
  );
};
