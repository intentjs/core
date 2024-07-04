import React from "react";
import { Text } from "@react-email/components";

interface RegardPorp {
  className?: string;
  value: string;
}

export const Regards = ({ className, value }: RegardPorp) => {
  return (
    <Text className={className ? className : "text-md"}>
      Best,
      <br />
      {value}
    </Text>
  );
};
