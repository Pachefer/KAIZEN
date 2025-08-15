import * as React from 'react';

export const CounterPlusSvg: React.FC = () => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width={16}
      height={16}
      fill='none'
    >
      <path
        stroke='#7D849A'
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={1.5}
        d='M8 3.333v9.334M3.333 8h9.334'
      />
    </svg>
  );
};
