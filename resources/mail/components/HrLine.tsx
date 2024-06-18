import * as React from 'react';
import { Hr } from '@react-email/components';

export const HrLine = ({ ...props }) => {
  return (
    <Hr
      className={
        props.className
          ? props.className
          : 'border border-solid border-[#eaeaea] my-2 mx-0 w-full'
      }
    />
  );
};
