import * as React from 'react';
import { Img } from '@react-email/components';

export const Image = ({ ...props }) => {
  return (
    <Img
      src={props.value.src}
      alt={props.value.alt}
      width={props.value.width}
      height={props.value.height}
    />
  );
};
