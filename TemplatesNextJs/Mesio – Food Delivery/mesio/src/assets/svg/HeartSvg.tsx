import * as React from 'react';

type Props = {
  color?: string;
};

export const HeartSvg: React.FC<Props> = ({color}) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none">
      <path
        fill={color || 'currentColor'}
        fillRule="evenodd"
        d="M14.759 2.476a6.25 6.25 0 0 1 6.813 10.196l-8.84 8.84a.75.75 0 0 1-1.061 0l-8.84-8.84a6.252 6.252 0 0 1 8.84-8.84l.53.53.53-.53a6.25 6.25 0 0 1 2.028-1.356ZM17.15 3.5a4.75 4.75 0 0 0-3.36 1.392l-1.06 1.06a.75.75 0 0 1-1.06 0l-1.06-1.06a4.751 4.751 0 0 0-6.72 6.72l8.31 8.31 8.31-8.31a4.75 4.75 0 0 0-3.36-8.112Z"
        clipRule="evenodd"
      />
    </svg>
  );
};
