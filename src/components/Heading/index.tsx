import React from "react";

const sizes = {
  "3xl": "text-[25px] font-semibold leading-[33px]",
  "2xl": "text-2xl font-bold leading-[31px]",
  xl: "text-xl font-bold leading-[25px]",
  "5xl": "text-4xl font-bold leading-[44px]",
  "4xl": "text-[32px] font-bold",
  "7xl": "text-5xl font-bold",
  s: "text-[15px] font-semibold",
  md: "text-base font-bold leading-[21px]",
  "6xl": "text-[40px] font-bold",
  "8xl": "text-[64px] font-bold",
  xs: "text-sm font-bold leading-[18px]",
  lg: "text-lg font-bold leading-[23px]",
};

export type HeadingProps = Partial<{
  className: string;
  as: any;
  size: keyof typeof sizes;
}> &
  React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>;

const Heading: React.FC<React.PropsWithChildren<HeadingProps>> = ({
  children,
  className = "",
  size = "4xl",
  as,
  ...restProps
}) => {
  const Component = as || "h6";

  return (
    <Component className={`text-white-A700 font-plusjakartasans ${className} ${sizes[size]}`} {...restProps}>
      {children}
    </Component>
  );
};

export { Heading };
