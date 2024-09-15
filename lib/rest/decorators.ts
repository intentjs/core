import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Request } from './foundation';

export { Req, Res } from '@nestjs/common';

export const Body = createParamDecorator(
  (data: any, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    if (request.dto()) return request.dto();

    const types = Reflect.getMetadata(
      'design:paramtypes',
      ctx.getClass().prototype,
      ctx.getHandler().name,
    );

    const paramIndex = Reflect.getMetadata(
      'intent::body_decorator_index',
      ctx.getHandler(),
    );

    const paramType = types[paramIndex];

    /**
     * Check the type of paramType,
     * if the value is `function`, then we will assume that it's a DTO.
     * otherwise if it is another data type, we will convert the value and then send it back.
     */
    const typeParamType = typeof paramType;

    if (typeParamType === 'function') {
      const dto = plainToInstance(paramType, request.all());
      request.setDto(dto);
      request.body();
    }

    return request.all();
  },
  [
    (target: any, propKey: string | symbol, index: number): void => {
      Reflect.defineMetadata(
        'intent::body_decorator_index',
        index,
        target[propKey],
      );
    },
  ],
);
