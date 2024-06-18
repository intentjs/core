import React from 'react';
import { Heading } from '@react-email/components';

export const Greetings = ({ ...props }) => {
  return (
    <Heading
      className={
        props.className
          ? props.className
          : 'text-black text-[22px] p-0 mb-[20px] mx-0'
      }
    >
      Hello <strong>{props.value},</strong>
    </Heading>
  );
};
