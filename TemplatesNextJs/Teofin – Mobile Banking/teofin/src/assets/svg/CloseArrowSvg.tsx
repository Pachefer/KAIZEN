import * as React from 'react';

export const CloseArrowSvg: React.FC = () => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width={40}
      height={24}
      fill='none'
    >
      <g>
        <path
          stroke='#4C4C60'
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth={1.5}
          d='m29.429 9.571 4.285 4.286L38 9.571'
        />
      </g>
      <defs>
        <clipPath id='a'>
          <path
            fill='#fff'
            d='M39 14.857V9.143H29v5.714z'
          />
        </clipPath>
      </defs>
    </svg>
  );
};
