import * as React from "react";
import { Img } from "@react-email/components";

interface ImgProp {
  className?: string;
  value: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
}

export const Image = ({ className, value }: ImgProp) => {
  return (
    <Img
      src={value.src}
      alt={value.alt}
      width={value.width}
      height={value.height}
      className={className ? className : ""}
    />
  );
};
