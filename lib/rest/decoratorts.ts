import { ExecutionContext, createParamDecorator } from "@nestjs/common";

export const IReq = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request["$intent"]["req"];
  }
);

export const IRes = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request["$intent"]["res"];
  }
);
