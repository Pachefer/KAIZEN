import * as React from 'react';

type Props = {
  color?: string;
};

export const WishlistAddSvg: React.FC<Props> = ({color}) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={15} height={15} fill="none">
      <path
        fill={color || 'currentColor'}
        d="m7.5 14.761-1.088-.986C2.55 10.269 0 7.955 0 5.125A4.08 4.08 0 0 1 4.125 1 4.5 4.5 0 0 1 7.5 2.564 4.5 4.5 0 0 1 10.876 1 4.08 4.08 0 0 1 15 5.124c0 2.828-2.554 5.145-6.412 8.65l-1.088.987Z"
      />
    </svg>
  );
};
