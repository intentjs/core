import React from 'react';
import { Text } from '@react-email/components';

export const CText = ({ ...props }) => {
  return (
    <Text
      className={
        props.className ? props.className : 'text-black text-md mb-[20px]'
      }
    >
      {props.value}
    </Text>
  );
};
