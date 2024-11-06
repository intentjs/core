import * as React from "react";
import { Img } from "@react-email/components";

export const Image = (props) => {
  return (
    <Img
      className="my-2 rounded-md overflow-hidden"
      src={props.value.url}
      alt={props.value.alt}
      width={props.value.width}
      height={props.value.height}
    />
  );
};
