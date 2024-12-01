import { createParamDecorator, ExecutionContext } from '@intentjs/core';

export const CustomParam = createParamDecorator(
  (data: any, ctx: ExecutionContext, argIndex: number) => {
    return 'data from custom decorator param';
  },
);
