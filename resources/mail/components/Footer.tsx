import React from 'react';
import { Img, Section, Text } from '@react-email/components';

export const Footer = ({ ...props }) => {
  return (
    <Section className={props?.className ? props.className : 'flex flex-col'}>
      <Img
        src={props?.logo?.src}
        alt={props?.logo?.alt}
        width={props?.logo?.width}
        height={props?.logo?.height}
      />
      <Text
        className={
          props?.title?.className
            ? props.title.className
            : 'text-[#666666] text-md'
        }
      >
        {props?.title?.text}
        <br />
        {props?.content?.text}
      </Text>
    </Section>
  );
};
