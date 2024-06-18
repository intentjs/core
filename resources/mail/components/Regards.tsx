import React from 'react';
import { Section, Text } from '@react-email/components';

export const Regards = ({ ...props }) => {
  return (
    <Section className="mb-[20px]">
      <Text className={props.className ? props.className : 'text-md'}>
        Best,
        <br />
        {props.value}
      </Text>
    </Section>
  );
};
