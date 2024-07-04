import React from "react";
import { Link } from "@react-email/components";

interface LinkProp {
  className?: string;
  value: {
    link: string;
    title: string;
  };
}

export const CLink = ({ className, value }: LinkProp) => {
  return (
    <Link
      href={value.link}
      target="_blank"
      className={className ? className : "block underline"}
    >
      {value.title}
    </Link>
  );
};
