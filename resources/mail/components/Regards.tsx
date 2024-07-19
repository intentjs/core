import * as React from "react";

import { Section, Text } from "@react-email/components";

export const Regards = ({ ...props }) => {
  return (
    <Section className="">
      <Text className={props.className ? props.className : "text-txt text-sm"}>
        Best,
        <br />
        {props.value}
      </Text>
    </Section>
  );
};
