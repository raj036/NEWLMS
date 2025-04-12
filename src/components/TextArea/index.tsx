import React from "react";
import PropTypes from "prop-types";

const shapes = {
  round: "rounded-[20px]",
} as const;
const variants = {
  tarOutlineGray400: "border-gray-400 border border-solid",
} as const;
const sizes = {
  xs: "h-[140px] p-[20px] text-[22px]",
  s: "h-[140px] p-[20px] text-[15px]",
} as const;

type TextAreaProps = Omit<
  React.DetailedHTMLProps<
    React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    HTMLTextAreaElement
  >,
  "size" | "prefix" | "type" | "onChange"
> &
  Partial<{
    className: string;
    name: string;
    placeholder: string;
    onChange: Function;
    shape: keyof typeof shapes;
    variant: keyof typeof variants;
    size: keyof typeof sizes;
  }>;

const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    {
      className = "",
      name = "",
      placeholder = "",
      shape = "round",
      size = "xs",
      variant = "tarOutlineGray400",
      onChange,
      ...restProps
    },
    ref
  ) => {
    const handleChange: React.ChangeEventHandler<HTMLTextAreaElement> = (e) => {
      if (onChange) onChange(e?.target?.value);
    };

    return (
      <textarea
        ref={ref}
        className={`${className} ${shapes[shape] || ""} ${sizes[size] || ""} ${
          variants[variant] || ""
        }`}
        name={name}
        onChange={handleChange}
        placeholder={placeholder}
        {...restProps}
      />
    );
  }
);

export { TextArea };
