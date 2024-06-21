import React from "react";
import { Img, Section, Text } from "@react-email/components";

interface FooterProp {
  className?: string;
  value?: {
    logo?: {
      src: string;
      alt: string;
      width: number;
      height: number;
    };
    title?: {
      text: string;
      className?: string;
    };
    content?: string;
  };
}

export const Footer = ({ className, value }: FooterProp) => {
  return (
    <Section className={className ? className : "flex flex-col"}>
      <Img
        src={value?.logo?.src}
        alt={value?.logo?.alt}
        width={value?.logo?.width}
        height={value?.logo?.height}
      />
      <Text
        className={
          value?.title?.className
            ? value.title.className
            : "text-[#666666] text-md"
        }
      >
        {value?.title?.text}
        <br />
        {value?.content}
      </Text>
    </Section>
  );
};
