import React from "react";
import { Img, Section, Text } from "@react-email/components";

interface HeaderProp {
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
  };
}

export const Header = ({ className, value }: HeaderProp) => {
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
            : "text-[#000000] text-2xl font-bold"
        }
      >
        {value?.title?.text}
      </Text>
    </Section>
  );
};
