interface IconProps extends React.SVGProps<SVGSVGElement> {
  children?: React.ReactNode;
  // viewBox?: string;
}

export const Icon: React.FC<IconProps> = ({
  children,
  width = 24,
  height = 24,
  fill = 'none',
  // viewBox = '0 0 24 24',
  xmlns = 'http://www.w3.org/2000/svg',
  ...rest
}) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={width}
    height={height}
    fill={fill}
    // viewBox={viewBox}
    {...rest}
  >
    {children}
  </svg>
);
