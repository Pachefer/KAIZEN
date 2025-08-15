import * as React from 'react';

type Props = {
  color?: string;
};

export const SearchSvg: React.FC<Props> = ({color = '#7D849A'}) => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width={24}
      height={24}
      fill='none'
    >
      <path
        fill={color}
        fillRule='evenodd'
        d='M11 3.75a7.25 7.25 0 1 0 0 14.5 7.25 7.25 0 0 0 0-14.5ZM2.25 11a8.75 8.75 0 1 1 17.5 0 8.75 8.75 0 0 1-17.5 0Z'
        clipRule='evenodd'
      />
      <path
        fill={color}
        fillRule='evenodd'
        d='M15.943 15.943a1 1 0 0 1 1.414 0l4.35 4.35a1 1 0 1 1-1.414 1.414l-4.35-4.35a1 1 0 0 1 0-1.414Z'
        clipRule='evenodd'
      />
    </svg>
  );
};
