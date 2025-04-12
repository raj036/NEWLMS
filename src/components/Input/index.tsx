import React from "react";

const shapes = {
  round: "rounded-[20px]",
} as const;
const variants = {
  fill: {
    teal_900: "bg-teal-900 text-white-A700",
  },
  outline: {
    gray_400: "border-gray-400 border border-solid text-gray-700",
  },
} as const;
const sizes = {
  xs: "h-[47px] pl-[23px] pr-[35px] text-[15px]",
  sm: "h-[68px] pl-[21px] pr-[35px] text-[22px]",
} as const;

type InputProps = Omit<
  React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >,
  "size" | "prefix" | "type" | "onChange"
> &
  Partial<{
    className: string;
    name: string;
    placeholder: string;
    type: string;
    label: string;
    prefix: React.ReactNode;
    suffix: React.ReactNode;
    onChange: Function;
    shape: keyof typeof shapes;
    variant: keyof typeof variants;
    size: keyof typeof sizes;
    color: string;
  }>;
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className = "",
      name = "",
      placeholder = "",
      type = "text",
      children,
      label = "",
      prefix,
      suffix,
      onChange,
      shape = "round",
      variant = "outline",
      size = "sm",
      color = "gray_400",
      ...restProps
    },
    ref
  ) => {
    const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
      if (onChange) onChange(e?.target?.value);
    };

    return (
      <>
        <div
          className={`${className} flex items-center justify-center font-medium ${
            shapes[shape] || ""
          } ${
            variants[variant]?.[
              color as keyof (typeof variants)[typeof variant]
            ] ||
            variants[variant] ||
            ""
          } ${sizes[size] || ""}`}
        >
          {!!label && label}
          {!!prefix && prefix}
          <input
            ref={ref}
            type={type}
            name={name}
            onChange={handleChange}
            placeholder={placeholder}
            {...restProps}
          />
          {!!suffix && suffix}
        </div>
      </>
    );
  }
);

export { Input };
