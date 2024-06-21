import React from "react";
import { Button } from "@react-email/components";

interface ButtonProp {
  className?: string;
  value: {
    link: string;
    title: string;
  };
}

export const ActionButton = ({ className, value }: ButtonProp) => {
  return (
    <Button
      className={
        className
          ? className
          : "bg-[#000000] rounded text-white text-sm font-semibold no-underline text-center px-5 py-3 cursor-pointer"
      }
      href={value.link}
    >
      {value.title}
    </Button>
  );
};
