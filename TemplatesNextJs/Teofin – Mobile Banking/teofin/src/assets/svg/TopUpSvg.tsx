import * as React from 'react';

export const TopUpSvg: React.FC = () => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width={60}
      height={60}
      fill='none'
    >
      <rect
        width={60}
        height={60}
        fill='#3EB290'
        rx={30}
      />
      <path
        stroke='#fff'
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={1.5}
        d='M33 22h6a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H21a2 2 0 0 1-2-2V24a2 2 0 0 1 2-2h6M19 28h8m14 0h-8'
      />
      <path
        fill='#fff'
        d='M30.75 19.5a.75.75 0 0 0-1.5 0h1.5Zm-1.28 17.03a.75.75 0 0 0 1.06 0l4.773-4.773a.75.75 0 0 0-1.06-1.06L30 34.939l-4.243-4.242a.75.75 0 0 0-1.06 1.06l4.773 4.773ZM30 19.5h-.75V36h1.5V19.5H30Z'
      />
    </svg>
  );
};
