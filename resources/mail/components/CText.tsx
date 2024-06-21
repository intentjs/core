import React from "react";
import { Text } from "@react-email/components";

interface TextProp {
  className: string;
  value: string;
}

export const CText = ({ className, value }: TextProp) => {
  return (
    <Text className={className ? className : "text-black text-md"}>
      {value}
    </Text>
  );
};
