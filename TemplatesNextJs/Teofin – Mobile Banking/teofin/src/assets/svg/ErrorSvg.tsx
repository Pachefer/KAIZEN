import * as React from 'react';

export const ErrorSvg: React.FC = () => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width={15}
      height={13}
      fill='none'
    >
      <path
        stroke='#E30000'
        strokeLinecap='round'
        strokeLinejoin='round'
        d='m11.573 8.5 2-.5.5 2'
      />
      <path
        stroke='#E30000'
        strokeLinecap='round'
        strokeLinejoin='round'
        d='M13.573 8a6.6 6.6 0 0 1-6 4.5 6 6 0 0 1-5.64-3.95M3.573 4.5l-2 .5-.5-2'
      />
      <path
        stroke='#E30000'
        strokeLinecap='round'
        strokeLinejoin='round'
        d='M1.573 5a6.79 6.79 0 0 1 6-4.5 6 6 0 0 1 5.64 4M7.573 3v4M7.573 9.75a.25.25 0 1 1 0-.5M7.573 9.75a.25.25 0 1 0 0-.5'
      />
    </svg>
  );
};
