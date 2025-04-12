import React from "react";

const FormatPrice = ({ price }: { price: number }) => {
  return (
    <>
      {Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 2,
      }).format(price)}
    </>
  );
};

export default FormatPrice;
