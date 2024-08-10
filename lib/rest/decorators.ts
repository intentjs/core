import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const Req = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.intent.req();
  },
);

// export const Res = createParamDecorator(
//   (data: string, ctx: ExecutionContext) => {
//     const request = ctx.switchToHttp().getRequest();
//     return request.intent.res();
//   },
// );
