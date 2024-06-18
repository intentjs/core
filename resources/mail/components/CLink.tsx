import React from 'react';
import { Link, Text } from '@react-email/components';

export const CLink = ({ ...props }) => {
  return (
    <Link
      href={props.value.link}
      target="_blank"
      className={
        props.className ? props.className : 'block mb-[20px] underline'
      }
    >
      {props.value.title}
    </Link>
  );
};
