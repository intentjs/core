import { ArgumentsHost, HttpException, Type } from "@nestjs/common";
import { BaseExceptionFilter } from "@nestjs/core";
import { ValidationFailed } from "./validationfailed";
import { Package } from "../utils";
import { IntentConfig } from "../config/service";

export class IntentExceptionFilter extends BaseExceptionFilter {
  doNotReport(): Array<Type<HttpException>> {
    return [];
  }

  report(): Array<Type<HttpException>> | string {
    return "*";
  }

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<any>();

    const sentryConfig = IntentConfig.get("errors.sentry");
    sentryConfig?.dsn && this.reportToSentry(exception);

    if (exception instanceof ValidationFailed) {
      return response.status(exception.getStatus()).json({
        success: false,
        message: exception.message,
        errors: exception.getErrors(),
      });
    }

    let message =
      exception.message || "Something went wrong. Please try again later";

    const status = exception.status ? exception.status : 500;
    message = exception.status ? message : "Internal Server Error";

    return response.status(status).json({
      success: false,
      code: status,
      message,
    });
  }

  reportToSentry(exception: any): void {
    const exceptionConstructor = exception?.constructor;
    const sentry = Package.load("@sentry/node");
    if (
      exceptionConstructor &&
      !this.doNotReport().includes(exceptionConstructor)
    ) {
      sentry.captureException(exception);
    }
  }
}
