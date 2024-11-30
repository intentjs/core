import { createParamDecorator, ExecutionContext } from '@intentjs/core';

export const CustomParam = createParamDecorator(
  (data: any, ctx: ExecutionContext) => {
    return 'data from custom decorator param';
  },
);
