import React from 'react';
import { Button } from '@react-email/components';

export const ActionButton = ({ ...props }) => {
  return (
    <Button
      className={
        props.className
          ? props.className
          : 'bg-[#000000] rounded text-white text-[12px] font-semibold no-underline text-center px-5 py-3 cursor-pointer mb-[10px]'
      }
      href={props.value.link}
    >
      {props.value.title}
    </Button>
  );
};
