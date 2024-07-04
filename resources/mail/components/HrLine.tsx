import * as React from "react";
import { Hr } from "@react-email/components";

interface LineProp {
  className?: string;
}

export const HrLine = ({ className }: LineProp) => {
  return (
    <Hr
      className={
        className
          ? className
          : "border border-solid border-[#eaeaea] my-2 mx-0 w-full"
      }
    />
  );
};
