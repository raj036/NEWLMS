import React from "react";

const shapes = {
  square: "rounded-[0px]",
  circle: "rounded-[50%]",
  round: "rounded-[10px]",
} as const;
const variants = {
  outline: {
    deep_orange_500:
      "border-deep_orange-500 border border-solid text-deep_orange-500",
    white_A700: "border-white-A700 border border-solid text-white-A700",
  },
  fill: {
    teal_900: "bg-teal-900 text-white-A700",
    red_50: "bg-red-50",
    deep_orange_500: "bg-deep_orange-500 text-white-A700",
  },
} as const;
const sizes = {
  xl: "h-14 px-[35px] text-2xl",
  md: "h-[47px] px-[35px] text-xl",
  sm: "h-[43px] px-[35px] text-xl",
  "2xl": "h-[57px] px-[35px] text-xl",
  lg: "h-[47px] px-[35px] text-[15px]",
  "3xl": "h-[72px] px-[18px]",
  xs: "h-[38px] px-[35px] text-sm",
} as const;

type ButtonProps = Omit<
  React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >,
  "onClick"
> &
  Partial<{
    className: string;
    leftIcon: React.ReactNode;
    rightIcon: React.ReactNode;
    onClick: () => void;
    shape: keyof typeof shapes;
    variant: keyof typeof variants;
    size: keyof typeof sizes;
    color: string;
  }>;
const Button: React.FC<React.PropsWithChildren<ButtonProps>> = ({
  children,
  className = "",
  leftIcon,
  rightIcon,
  shape = "round",
  variant = "fill",
  size = "xs",
  color = "deep_orange_500",
  ...restProps
}) => {
  return (
    <button
      className={`${className} flex items-center justify-center text-center cursor-pointer transition ${
        (shape && shapes[shape]) || ""
      } ${(size && sizes[size]) || ""} ${
        (variant &&
          variants[variant]?.[
            color as keyof (typeof variants)[typeof variant]
          ]) ||
        ""
      }`}
      {...restProps}
    >
      {!!leftIcon && leftIcon}
      {children}
      {!!rightIcon && rightIcon}
    </button>
  );
};

export { Button };
