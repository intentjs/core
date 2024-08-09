import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  StreamableFile,
  ClassSerializerContextOptions,
  PlainLiteralObject,
} from '@nestjs/common';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { Observable, map } from 'rxjs';
import { Obj } from '../../utils';
import { IntentResponse } from '../response';

@Injectable()
export class ResponseSerializerInterceptor implements NestInterceptor {
  constructor() {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(map(data => this.serialize(data)));
  }

  serialize(response: any): any {
    if (!Obj.isObj(response) || response instanceof StreamableFile) {
      return response;
    }

    if (response instanceof IntentResponse) {
      return response.data();
    }

    // return Array.isArray(response)
    //   ? response.map((item) => this.transformToPlain(item, options))
    //   : this.transformToPlain(response, options);
  }

  // transformToPlain(
  //   plainOrClass: any,
  //   options: ClassSerializerContextOptions,
  // ): PlainLiteralObject {
  //   if (!plainOrClass) {
  //     return plainOrClass;
  //   }
  //   if (!options.type) {
  //     return instanceToPlain(plainOrClass, options);
  //   }
  //   if (plainOrClass instanceof options.type) {
  //     return instanceToPlain(plainOrClass, options);
  //   }
  //   const instance = plainToInstance(options.type, plainOrClass);
  //   return instanceToPlain(instance, options);
  // }
}
