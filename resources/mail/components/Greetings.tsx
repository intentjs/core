import React from "react";
import { Heading } from "@react-email/components";

interface GreetingsProp {
  className?: string;
  value: string;
}

export const Greetings = ({ className, value }: GreetingsProp) => {
  return (
    <Heading className={className ? className : "text-black text-xl p-0 mx-0"}>
      Hello <strong>{value},</strong>
    </Heading>
  );
};
