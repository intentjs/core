import { Response } from '../response';
import { RouteArgType, RouteParamtypes } from '../param-decorators';
import { Request } from '../request';

export class HttpExecutionContext {
  constructor(
    private readonly request: Request,
    private readonly response: Response,
  ) {}

  getRequest(): Request {
    return this.request;
  }

  getResponse(): Response {
    return this.response;
  }

  getInjectableValueFromArgType(routeArg: RouteArgType): any {
    const { type, data } = routeArg;
    switch (type) {
      case RouteParamtypes.REQUEST:
        return this.getRequest();

      case RouteParamtypes.RESPONSE:
        return this.getResponse();

      case RouteParamtypes.QUERY:
        if (data) {
          return this.request.query[data as string];
        }
        return this.request.query;

      case RouteParamtypes.ACCEPTS:
        return this.request.accepts();

      case RouteParamtypes.NEXT:

      case RouteParamtypes.BODY:
        if (data) {
          return this.request.body[data as string];
        }
        return { ...this.request.body };

      case RouteParamtypes.PARAM:
        if (data) {
          return this.request.params[data as string];
        }

        return { ...this.request.params };

      case RouteParamtypes.SESSION:

      case RouteParamtypes.FILE:

      case RouteParamtypes.FILES:

      case RouteParamtypes.IP:
        return this.request.ip;

      case RouteParamtypes.RAW_BODY:
        return this.request.raw;

      case RouteParamtypes.USER_AGENT:
        return this.request.headers['user-agent'];

      case RouteParamtypes.HOST:
        return this.request.url;

      case RouteParamtypes.HEADERS:
        if (data) {
          return this.request.headers[data as string];
        }

        return { ...(this.request.headers || {}) };
    }
  }
}
