import React from "react";

const sizes = {
  xs: "text-xs font-medium leading-[15px]",
  lg: "text-base font-normal",
  s: "text-sm font-medium leading-10",
  "2xl": "text-2xl font-medium",
  "3xl": "text-[140px] font-medium",
  xl: "text-xl font-normal",
  md: "text-[15px] font-medium",
};

export type TextProps = Partial<{
  className: string;
  as: any;
  size: keyof typeof sizes;
}> &
  React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>;

const Text: React.FC<React.PropsWithChildren<TextProps>> = ({
  children,
  className = "",
  as,
  size = "s",
  ...restProps
}) => {
  const Component = as || "p";

  return (
    <Component className={`text-white-A700 font-plusjakartasans ${className} ${sizes[size]}`} {...restProps}>
      {children}
    </Component>
  );
};

export { Text };
