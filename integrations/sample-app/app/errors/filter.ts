import {
  ConfigService,
  ExecutionContext,
  HttpException,
  IntentExceptionFilter,
  Type,
} from '@intentjs/core';

export class ApplicationExceptionFilter extends IntentExceptionFilter {
  constructor(private config: ConfigService) {
    super();
  }

  doNotReport(): Array<Type<HttpException>> {
    return [];
  }

  report(): Array<Type<HttpException>> | string {
    return '*';
  }

  handleHttp(context: ExecutionContext, exception: any) {
    return super.handleHttp(context, exception);
  }
}
